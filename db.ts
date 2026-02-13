
import { UserInfo, UserResponse, QuizResults } from './types';

// Seeded "historical" data to represent the 200+ PMs
const SEEDED_PEERS = [
  { name: "Alex K.", company: "Stripe", archetype: "The Scale Realist" },
  { name: "Sarah M.", company: "Airbnb", archetype: "The User Empath" },
  { name: "Jordan T.", company: "Notion", archetype: "The Analytical Pragmatist" },
  { name: "Chen W.", company: "DoorDash", archetype: "The Growth Hacker" },
  { name: "Elena R.", company: "Revolut", archetype: "The Scale Realist" },
  { name: "Marcus L.", company: "Linear", archetype: "The Visionary Architect" },
];

export const db = {
  saveSubmission: async (info: UserInfo, responses: UserResponse[], results: QuizResults): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate latency

      const submission = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user: {
          name: info.name,
          email: info.email,
          company: info.company || 'Private'
        },
        responses,
        results
      };

      const existing = JSON.parse(localStorage.getItem('pm_gauntlet_submissions') || '[]');
      existing.push(submission);
      localStorage.setItem('pm_gauntlet_submissions', JSON.stringify(existing));
      
      console.log('Submission persisted locally:', submission);
    } catch (error) {
      console.error('Database Error:', error);
      throw error;
    }
  },

  getSubmissionsCount: async (): Promise<number> => {
    const existing = JSON.parse(localStorage.getItem('pm_gauntlet_submissions') || '[]');
    return 200 + existing.length;
  },

  getPeersByArchetype: async (archetype: string): Promise<any[]> => {
    // Combine seeded peers with any real submissions from localStorage
    const local = JSON.parse(localStorage.getItem('pm_gauntlet_submissions') || '[]');
    const localPeers = local
      .filter((s: any) => s.results.archetype === archetype)
      .map((s: any) => ({
        name: s.user.name.split(' ')[0] + ' ' + (s.user.name.split(' ')[1]?.[0] || '') + '.',
        company: s.user.company,
        archetype: s.results.archetype
      }));

    const seededMatches = SEEDED_PEERS.filter(p => p.archetype === archetype);
    
    // Return a mix, up to 4
    return [...localPeers, ...seededMatches].slice(0, 4);
  }
};
