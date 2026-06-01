import { create } from 'zustand';
import type { Sign } from '@/lib/api';

export type PlayerStatus = 'idle' | 'translating' | 'signing' | 'error';

interface TranslatorState {
  // Input
  inputText: string;
  setInputText: (text: string) => void;

  // Translation result
  tokens: string[];
  mode: string;
  notes: string[];
  fingerspelledCount: number;
  setTranslation: (tokens: string[], mode: string, notes: string[], fs: number) => void;

  // Playback
  status: PlayerStatus;
  setStatus: (status: PlayerStatus) => void;
  activeTokenIndex: number;
  setActiveTokenIndex: (i: number) => void;

  // Settings
  speed: number;
  setSpeed: (speed: number) => void;

  // Sign library (loaded from API)
  signs: Sign[];
  setSigns: (signs: Sign[]) => void;

  // Avatar ready
  avatarReady: boolean;
  setAvatarReady: (ready: boolean) => void;

  // Reset
  reset: () => void;
}

export const useTranslatorStore = create<TranslatorState>((set) => ({
  inputText: '',
  setInputText: (inputText) => set({ inputText }),

  tokens: [],
  mode: '',
  notes: [],
  fingerspelledCount: 0,
  setTranslation: (tokens, mode, notes, fingerspelledCount) =>
    set({ tokens, mode, notes, fingerspelledCount, activeTokenIndex: -1 }),

  status: 'idle',
  setStatus: (status) => set({ status }),

  activeTokenIndex: -1,
  setActiveTokenIndex: (activeTokenIndex) => set({ activeTokenIndex }),

  speed: 1.0,
  setSpeed: (speed) => set({ speed }),

  signs: [],
  setSigns: (signs) => set({ signs }),

  avatarReady: false,
  setAvatarReady: (avatarReady) => set({ avatarReady }),

  reset: () =>
    set({
      tokens: [],
      mode: '',
      notes: [],
      fingerspelledCount: 0,
      status: 'idle',
      activeTokenIndex: -1,
    }),
}));
