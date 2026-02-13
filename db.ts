
import { UserInfo, UserResponse, QuizResults } from './types';

export interface Peer {
  name: string;
  company: string;
  archetype: string;
}

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof json?.error === 'string' ? json.error : 'Request failed.';
    throw new Error(message);
  }
  return json as T;
}

export const db = {
  saveSubmission: async (info: UserInfo, responses: UserResponse[]): Promise<QuizResults> => {
    const payload = {
      userInfo: {
        name: info.name,
        email: info.email,
        company: info.company || 'Private',
      },
      responses,
      honeypot: info.website || '',
    };

    const data = await apiRequest<{ results: QuizResults }>('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data.results;
  },

  getSubmissionsCount: async (): Promise<number> => {
    try {
      const data = await apiRequest<{ totalSubmissions: number }>('/api/stats');
      return data.totalSubmissions;
    } catch {
      return 200;
    }
  },

  getPeersByArchetype: async (archetype: string): Promise<Peer[]> => {
    try {
      const encodedArchetype = encodeURIComponent(archetype);
      const data = await apiRequest<{ peers: Peer[] }>(`/api/peers?archetype=${encodedArchetype}`);
      return data.peers;
    } catch {
      return [];
    }
  }
};
