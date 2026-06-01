const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? 'API error');
  }
  return res.json();
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TranslateResponse {
  tokens: string[];
  mode: string;
  notes: string[];
  fingerspelled_count: number;
}

export interface Sign {
  id: number;
  key: string;
  label: string;
  description: string | null;
  category: string | null;
  keyframes: Keyframe[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Keyframe {
  d: number;
  rh?: [string, [number, number, number]]; // [landmark, [x,y,z]]
  lh?: [string, [number, number, number]];
  headX?: number;
  headY?: number;
}

export interface TranslationRecord {
  id: string;
  input_text: string;
  gloss_tokens: string[];
  mode: string | null;
  notes: string[] | null;
  fingerspelled_count: number;
  created_at: string;
}

// ── API functions ─────────────────────────────────────────────────────────────

export const api = {
  translate: (text: string) =>
    apiFetch<TranslateResponse>('/api/translate', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  getSigns: (params?: { category?: string; active_only?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.category) qs.set('category', params.category);
    if (params?.active_only !== undefined) qs.set('active_only', String(params.active_only));
    return apiFetch<Sign[]>(`/api/signs?${qs}`);
  },

  getSign: (key: string) => apiFetch<Sign>(`/api/signs/${key}`),

  getHistory: (limit = 50) =>
    apiFetch<TranslationRecord[]>(`/api/history?limit=${limit}`),

  health: () => apiFetch<{ status: string }>('/health'),
};
