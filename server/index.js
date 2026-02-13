import "dotenv/config";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { GoogleGenAI, Type } from "@google/genai";
import pg from "pg";

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseIntEnv(value, fallback) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const IS_PROD = process.env.NODE_ENV === "production";
const PORT = parseIntEnv(process.env.PORT, 8787);
const DATABASE_URL = process.env.DATABASE_URL;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HASH_SECRET = process.env.HASH_SECRET;
const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || HASH_SECRET;
const SEEDED_BASELINE = parseIntEnv(process.env.SEEDED_BASELINE, 200);
const MAX_AI_CONCURRENT = parseIntEnv(process.env.MAX_AI_CONCURRENT, 3);
const MAX_AI_PER_DAY = parseIntEnv(process.env.MAX_AI_PER_DAY, 1200);
const AI_TIMEOUT_MS = parseIntEnv(process.env.AI_TIMEOUT_MS, 12000);
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const TURNSTILE_VERIFY_URL =
  process.env.TURNSTILE_VERIFY_URL || "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const STATIC_DIR = path.resolve(__dirname, "../dist");
const TRUST_PROXY_HOPS = Number.parseInt(String(process.env.TRUST_PROXY_HOPS ?? "0"), 10);

if (!DATABASE_URL) {
  console.error("Missing DATABASE_URL. Set it before starting the API server.");
  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.error("Missing GEMINI_API_KEY. Set it before starting the API server.");
  process.exit(1);
}

if (!HASH_SECRET) {
  console.error("Missing HASH_SECRET. Set it before starting the API server.");
  process.exit(1);
}

if (!ENCRYPTION_SECRET) {
  console.error("Missing ENCRYPTION_SECRET (or HASH_SECRET fallback).");
  process.exit(1);
}

if (IS_PROD && HASH_SECRET.length < 32) {
  console.error("HASH_SECRET must be at least 32 characters in production.");
  process.exit(1);
}

if (IS_PROD && ENCRYPTION_SECRET.length < 32) {
  console.error("ENCRYPTION_SECRET must be at least 32 characters in production.");
  process.exit(1);
}

if (IS_PROD && !Number.isFinite(TRUST_PROXY_HOPS)) {
  console.error("TRUST_PROXY_HOPS must be a valid integer in production.");
  process.exit(1);
}

if (TURNSTILE_SECRET_KEY) {
  console.log("Turnstile verification is enabled.");
} else {
  console.warn("Turnstile verification is disabled. Set TURNSTILE_SECRET_KEY to enable bot verification.");
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.PGSSL === "disable" ? false : { rejectUnauthorized: false },
});

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const app = express();
app.disable("x-powered-by");
app.set("trust proxy", Number.isFinite(TRUST_PROXY_HOPS) && TRUST_PROXY_HOPS > 0 ? TRUST_PROXY_HOPS : false);

const cspScriptSrc = ["'self'", "https://cdn.tailwindcss.com", "https://challenges.cloudflare.com"];
const cspStyleSrc = ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"];
const cspFontSrc = ["'self'", "https://fonts.gstatic.com", "data:"];
const cspConnectSrc = ["'self'", "https://challenges.cloudflare.com"];

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: cspScriptSrc,
        styleSrc: cspStyleSrc,
        fontSrc: cspFontSrc,
        imgSrc: ["'self'", "data:"],
        connectSrc: cspConnectSrc,
        frameSrc: ["'self'", "https://challenges.cloudflare.com"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
  })
);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length > 0) {
  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) {
          cb(null, true);
          return;
        }
        cb(new Error("Origin not allowed"));
      },
    })
  );
}

app.use(express.json({ limit: "300kb" }));

const SEEDED_PEERS = [
  { name: "Alex K.", company: "Stripe", archetype: "The Scale Realist" },
  { name: "Sarah M.", company: "Airbnb", archetype: "The User Empath" },
  { name: "Jordan T.", company: "Notion", archetype: "The Analytical Pragmatist" },
  { name: "Chen W.", company: "DoorDash", archetype: "The Growth Hacker" },
  { name: "Elena R.", company: "Revolut", archetype: "The Scale Realist" },
  { name: "Marcus L.", company: "Linear", archetype: "The Visionary Architect" },
];

const QUESTION_BY_ID = {
  1: "What stands out as the BIGGEST issue?",
  2: "What's your strategic priority for next quarter?",
  3: "What does the rising churn trend signal?",
  4: "6-month growth strategy recommendation?",
  5: "How do you handle the Series B term sheet pressure?",
  6: "One sprint priority decision?",
  7: "Which growth path do you choose?",
  8: "How do you react to unrealistic fundraising math?",
  9: "Assessment of startup health from interview signals?",
  10: "Rank likely success outcomes.",
  11: "Worst product decision and ignored red flag.",
  12: "At Series A, which metric worries you most and why?",
};

const CHOICE_QUESTION_IDS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12]);
const OPTION_IDS = new Set(["a", "b", "c", "d", "e"]);
const TOTAL_QUESTIONS = 12;
const ENCRYPTION_KEY = crypto.createHash("sha256").update(ENCRYPTION_SECRET).digest();
let currentAiRequests = 0;

function cleanString(value, maxLen) {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

function hashValue(value) {
  return crypto.createHmac("sha256", HASH_SECRET).update(value).digest("hex");
}

function encryptValue(plainText) {
  const value = cleanString(plainText, 2000);
  if (!value) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

function decryptValue(value) {
  const input = cleanString(value, 5000);
  if (!input || !input.startsWith("v1:")) {
    return input;
  }

  const parts = input.split(":");
  if (parts.length !== 4) return "";

  try {
    const iv = Buffer.from(parts[1], "hex");
    const tag = Buffer.from(parts[2], "hex");
    const encrypted = Buffer.from(parts[3], "hex");
    const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return cleanString(decrypted.toString("utf8"), 2000);
  } catch {
    return "";
  }
}

function anonymizeName(name) {
  const decoded = decryptValue(name);
  const parts = cleanString(decoded, 80).split(" ").filter(Boolean);
  if (parts.length === 0) return "Anonymous";
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

function normalizeIp(ip) {
  const cleanIp = cleanString(String(ip || ""), 100);
  if (cleanIp.startsWith("::ffff:")) return cleanIp.slice(7);
  return cleanIp || "0.0.0.0";
}

function getRequestIp(req) {
  return normalizeIp(req.ip || req.socket?.remoteAddress || "0.0.0.0");
}

async function withTimeout(promise, timeoutMs, timeoutMessage) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function verifyTurnstileToken(token, ip) {
  if (!TURNSTILE_SECRET_KEY) return true;

  const turnstileToken = cleanString(token, 2000);
  if (!turnstileToken) return false;

  const payload = new URLSearchParams({
    secret: TURNSTILE_SECRET_KEY,
    response: turnstileToken,
    remoteip: ip,
  });

  try {
    const response = await withTimeout(
      fetch(TURNSTILE_VERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: payload.toString(),
      }),
      6000,
      "TURNSTILE_TIMEOUT"
    );

    if (!response.ok) return false;
    const data = await response.json();
    return Boolean(data?.success);
  } catch {
    return false;
  }
}

function validateSubmissionPayload(body) {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid payload." };
  }

  const userInfo = body.userInfo;
  const responses = body.responses;
  const honeypot = cleanString(body.honeypot || "", 300);
  const turnstileToken = cleanString(body.turnstileToken || "", 2000);

  if (honeypot.length > 0) {
    return { ok: false, error: "Suspicious submission blocked." };
  }

  if (!userInfo || typeof userInfo !== "object") {
    return { ok: false, error: "Missing user details." };
  }

  const name = cleanString(userInfo.name, 80);
  const email = cleanString(userInfo.email, 200).toLowerCase();
  const company = cleanString(userInfo.company || "Private", 120) || "Private";

  if (name.length < 2) {
    return { ok: false, error: "Name is too short." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Invalid email format." };
  }

  if (!Array.isArray(responses) || responses.length !== TOTAL_QUESTIONS) {
    return { ok: false, error: "All questions must be answered." };
  }

  const seenQuestionIds = new Set();
  const normalizedResponses = [];

  for (const raw of responses) {
    if (!raw || typeof raw !== "object") {
      return { ok: false, error: "Malformed response item." };
    }

    const questionId = Number(raw.questionId);
    const selectedOptionId = cleanString(raw.selectedOptionId || "", 2).toLowerCase();
    const textValue = cleanString(raw.textValue || "", 700);
    const followUpValue = cleanString(raw.followUpValue || "", 320);

    if (!Number.isInteger(questionId) || questionId < 1 || questionId > TOTAL_QUESTIONS) {
      return { ok: false, error: "Invalid question id in responses." };
    }

    if (seenQuestionIds.has(questionId)) {
      return { ok: false, error: "Duplicate question answers are not allowed." };
    }
    seenQuestionIds.add(questionId);

    if (CHOICE_QUESTION_IDS.has(questionId) && !OPTION_IDS.has(selectedOptionId)) {
      return { ok: false, error: `Question ${questionId} is missing a valid choice.` };
    }

    if (questionId === 11 && textValue.length < 6) {
      return { ok: false, error: "Question 11 requires a short written answer." };
    }

    normalizedResponses.push({
      questionId,
      ...(selectedOptionId ? { selectedOptionId } : {}),
      ...(textValue ? { textValue } : {}),
      ...(followUpValue ? { followUpValue } : {}),
    });
  }

  if (seenQuestionIds.size !== TOTAL_QUESTIONS) {
    return { ok: false, error: "All 12 questions are required." };
  }

  normalizedResponses.sort((a, b) => a.questionId - b.questionId);

  return {
    ok: true,
    data: {
      userInfo: { name, email, company },
      responses: normalizedResponses,
      turnstileToken,
    },
  };
}

function normalizeResults(raw) {
  const riskTolerance = ["Low", "Medium", "High"].includes(raw?.stats?.riskTolerance)
    ? raw.stats.riskTolerance
    : "Medium";

  const traits = Array.isArray(raw?.traits)
    ? raw.traits.map((trait) => cleanString(String(trait), 120)).filter(Boolean).slice(0, 3)
    : [];

  return {
    archetype: cleanString(raw?.archetype || "The Practical Operator", 120),
    description: cleanString(raw?.description || "Execution-focused and reality-driven.", 280),
    traits: traits.length === 3 ? traits : ["Pragmatic", "Execution-minded", "Outcome-oriented"],
    contextWhyItMatters: cleanString(
      raw?.contextWhyItMatters || "This profile performs well in high-ambiguity environments.",
      1000
    ),
    stats: {
      growthFocus: Math.max(0, Math.min(100, Number(raw?.stats?.growthFocus) || 50)),
      riskTolerance,
      dataDrivenScore: Math.max(1, Math.min(10, Number(raw?.stats?.dataDrivenScore) || 7)),
    },
    similarityPercentage: Math.max(10, Math.min(40, Number(raw?.similarityPercentage) || 25)),
  };
}

async function analyzePMInstincts(responses, userName) {
  const responseSummary = responses
    .map((res) => {
      const question = QUESTION_BY_ID[res.questionId] || "Unknown question";
      const parts = [`Q${res.questionId}: ${question}`];
      if (res.selectedOptionId) parts.push(`Choice=${res.selectedOptionId.toUpperCase()}`);
      if (res.textValue) parts.push(`Text="${res.textValue}"`);
      if (res.followUpValue) parts.push(`FollowUp="${res.followUpValue}"`);
      return parts.join(" | ");
    })
    .join("\n");

  const prompt = `
Analyze the following 12 responses from a Product Manager named ${userName || "Anonymous"} going through "The PM Instincts Gauntlet".
This is a professional but fun assessment of intuition, pattern recognition, and risk appetite.

User Responses:
${responseSummary}

Return only valid JSON with this exact structure:
{
  "archetype": "string",
  "description": "string",
  "traits": ["string", "string", "string"],
  "contextWhyItMatters": "string",
  "stats": {
    "growthFocus": 0-100 number,
    "riskTolerance": "Low" | "Medium" | "High",
    "dataDrivenScore": 1.0-10.0 number
  },
  "similarityPercentage": 10-40 number
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          archetype: { type: Type.STRING },
          description: { type: Type.STRING },
          traits: { type: Type.ARRAY, items: { type: Type.STRING } },
          contextWhyItMatters: { type: Type.STRING },
          stats: {
            type: Type.OBJECT,
            properties: {
              growthFocus: { type: Type.NUMBER },
              riskTolerance: { type: Type.STRING },
              dataDrivenScore: { type: Type.NUMBER },
            },
          },
          similarityPercentage: { type: Type.NUMBER },
        },
        required: [
          "archetype",
          "description",
          "traits",
          "contextWhyItMatters",
          "stats",
          "similarityPercentage",
        ],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("Empty Gemini response.");

  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return normalizeResults(parsed);
}

async function ensureDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS quiz_submissions (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      email_hash TEXT NOT NULL,
      company TEXT NOT NULL DEFAULT 'Private',
      archetype TEXT NOT NULL,
      responses JSONB NOT NULL,
      results JSONB NOT NULL,
      ip_hash TEXT NOT NULL,
      user_agent TEXT NOT NULL DEFAULT ''
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS submission_attempts (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      ip_hash TEXT NOT NULL,
      email_hash TEXT,
      outcome TEXT NOT NULL
    );
  `);

  await pool.query(
    "CREATE INDEX IF NOT EXISTS idx_quiz_submissions_created_at ON quiz_submissions(created_at DESC);"
  );
  await pool.query(
    "CREATE INDEX IF NOT EXISTS idx_quiz_submissions_archetype ON quiz_submissions(archetype);"
  );
  await pool.query(
    "CREATE INDEX IF NOT EXISTS idx_quiz_submissions_email_hash ON quiz_submissions(email_hash);"
  );
  await pool.query(
    "CREATE INDEX IF NOT EXISTS idx_quiz_submissions_ip_hash ON quiz_submissions(ip_hash);"
  );
  await pool.query(
    "CREATE INDEX IF NOT EXISTS idx_submission_attempts_ip_hash_created_at ON submission_attempts(ip_hash, created_at DESC);"
  );
  await pool.query(
    "CREATE INDEX IF NOT EXISTS idx_submission_attempts_email_hash_created_at ON submission_attempts(email_hash, created_at DESC);"
  );
}

async function recordAttempt(ipHash, emailHash, outcome) {
  try {
    await pool.query(
      `
      INSERT INTO submission_attempts (ip_hash, email_hash, outcome)
      VALUES ($1, $2, $3);
      `,
      [ipHash, emailHash || null, cleanString(outcome, 80)]
    );
  } catch (error) {
    console.error("Failed to record attempt:", error);
  }
}

async function runAnalysisWithGuards(responses, userName) {
  if (currentAiRequests >= MAX_AI_CONCURRENT) {
    const error = new Error("AI_CONCURRENCY_LIMIT");
    error.code = "AI_CONCURRENCY_LIMIT";
    throw error;
  }

  currentAiRequests += 1;
  const analysisPromise = analyzePMInstincts(responses, userName);
  let releaseInFinally = true;

  try {
    return await withTimeout(analysisPromise, AI_TIMEOUT_MS, "AI_TIMEOUT");
  } catch (error) {
    if (error instanceof Error && error.message === "AI_TIMEOUT") {
      releaseInFinally = false;
      analysisPromise
        .finally(() => {
          currentAiRequests = Math.max(0, currentAiRequests - 1);
        })
        .catch(() => {});
    }
    throw error;
  } finally {
    if (releaseInFinally) {
      currentAiRequests = Math.max(0, currentAiRequests - 1);
    }
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/stats", async (_req, res) => {
  try {
    const countResult = await pool.query("SELECT COUNT(*)::int AS total FROM quiz_submissions;");
    const total = countResult.rows[0]?.total || 0;
    res.json({ totalSubmissions: SEEDED_BASELINE + total });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
});

app.get("/api/peers", async (req, res) => {
  try {
    const archetype = cleanString(String(req.query.archetype || ""), 120);
    if (!archetype) {
      res.status(400).json({ error: "Missing archetype query param." });
      return;
    }

    const result = await pool.query(
      `
      SELECT name, company, archetype
      FROM quiz_submissions
      WHERE archetype = $1
      ORDER BY created_at DESC
      LIMIT 8;
      `,
      [archetype]
    );

    const dbPeers = result.rows.map((row) => ({
      name: anonymizeName(row.name),
      company: cleanString(decryptValue(row.company), 120) || "Private",
      archetype: cleanString(row.archetype, 120),
    }));

    const seeded = SEEDED_PEERS.filter((peer) => peer.archetype === archetype);
    res.json({ peers: [...dbPeers, ...seeded].slice(0, 4) });
  } catch (error) {
    console.error("Failed to fetch peers:", error);
    res.status(500).json({ error: "Failed to fetch peers." });
  }
});

app.post("/api/submissions", async (req, res) => {
  try {
    const clientIp = getRequestIp(req);
    const userAgent = cleanString(req.headers["user-agent"] || "", 256);
    const ipHash = hashValue(clientIp);

    const recentIpAttempts = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM submission_attempts
      WHERE ip_hash = $1
      AND created_at > NOW() - INTERVAL '10 minutes';
      `,
      [ipHash]
    );

    if ((recentIpAttempts.rows[0]?.count || 0) >= 30) {
      await recordAttempt(ipHash, null, "blocked_ip_attempt_burst");
      res.status(429).json({ error: "Too many attempts from this network. Try again later." });
      return;
    }

    const validation = validateSubmissionPayload(req.body);
    if (!validation.ok) {
      await recordAttempt(ipHash, null, "invalid_payload");
      res.status(400).json({ error: validation.error });
      return;
    }

    const { userInfo, responses, turnstileToken } = validation.data;
    const emailHash = hashValue(userInfo.email);

    const recentEmailAttempts = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM submission_attempts
      WHERE email_hash = $1
      AND created_at > NOW() - INTERVAL '60 minutes';
      `,
      [emailHash]
    );

    if ((recentEmailAttempts.rows[0]?.count || 0) >= 6) {
      await recordAttempt(ipHash, emailHash, "blocked_email_attempt_burst");
      res.status(429).json({ error: "Too many attempts for this email. Try again later." });
      return;
    }

    if (TURNSTILE_SECRET_KEY) {
      const isHuman = await verifyTurnstileToken(turnstileToken, clientIp);
      if (!isHuman) {
        await recordAttempt(ipHash, emailHash, "blocked_turnstile");
        res.status(403).json({ error: "Security verification failed. Please retry." });
        return;
      }
    }

    const duplicateCheck = await pool.query(
      `
      SELECT 1
      FROM quiz_submissions
      WHERE email_hash = $1
      AND created_at > NOW() - INTERVAL '12 hours'
      LIMIT 1;
      `,
      [emailHash]
    );

    if (duplicateCheck.rowCount > 0) {
      await recordAttempt(ipHash, emailHash, "blocked_duplicate_email");
      res.status(429).json({ error: "A recent submission already exists for this email." });
      return;
    }

    const recentIpSubmissions = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM quiz_submissions
      WHERE ip_hash = $1
      AND created_at > NOW() - INTERVAL '24 hours';
      `,
      [ipHash]
    );

    if ((recentIpSubmissions.rows[0]?.count || 0) >= 20) {
      await recordAttempt(ipHash, emailHash, "blocked_ip_daily_submission_limit");
      res.status(429).json({ error: "Daily submission limit reached from this network." });
      return;
    }

    const dailyAiCountResult = await pool.query(
      `
      SELECT COUNT(*)::int AS count
      FROM quiz_submissions
      WHERE created_at > NOW() - INTERVAL '24 hours';
      `
    );

    if ((dailyAiCountResult.rows[0]?.count || 0) >= MAX_AI_PER_DAY) {
      await recordAttempt(ipHash, emailHash, "blocked_ai_daily_budget");
      res.status(503).json({ error: "Submission capacity reached for today. Please try tomorrow." });
      return;
    }

    let analysis;
    try {
      analysis = await runAnalysisWithGuards(responses, userInfo.name);
    } catch (error) {
      if (error instanceof Error && error.message === "AI_TIMEOUT") {
        await recordAttempt(ipHash, emailHash, "ai_timeout");
        res.status(504).json({ error: "Analysis timed out. Please retry shortly." });
        return;
      }
      if (error?.code === "AI_CONCURRENCY_LIMIT") {
        await recordAttempt(ipHash, emailHash, "ai_concurrency_limit");
        res.status(503).json({ error: "Service is busy. Please retry in a moment." });
        return;
      }
      throw error;
    }

    await pool.query(
      `
      INSERT INTO quiz_submissions (
        name, email, email_hash, company, archetype, responses, results, ip_hash, user_agent
      ) VALUES (
        $1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, $9
      );
      `,
      [
        encryptValue(userInfo.name),
        encryptValue(userInfo.email),
        emailHash,
        encryptValue(userInfo.company),
        analysis.archetype,
        JSON.stringify(responses),
        JSON.stringify(analysis),
        ipHash,
        userAgent,
      ]
    );

    await recordAttempt(ipHash, emailHash, "accepted");
    res.status(201).json({ results: analysis });
  } catch (error) {
    console.error("Failed to process submission:", error);
    res.status(500).json({ error: "Failed to process submission." });
  }
});

if (fs.existsSync(STATIC_DIR)) {
  app.use(express.static(STATIC_DIR));

  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
      next();
      return;
    }
    res.sendFile(path.join(STATIC_DIR, "index.html"));
  });
}

ensureDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API server ready on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Server startup failed:", error);
    process.exit(1);
  });
