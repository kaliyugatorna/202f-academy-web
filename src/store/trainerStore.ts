import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TrainerMessage } from '../types';

interface TrainerState {
  messages: TrainerMessage[];
  currentMode: 'TRAINER' | 'GUEST' | 'EXAM';
  setMode: (mode: 'TRAINER' | 'GUEST' | 'EXAM') => void;
  addMessage: (message: TrainerMessage) => void;
  getUserMessages: (userId: string) => TrainerMessage[];
}

export const useTrainerStore = create<TrainerState>()(persist(
  (set, get) => ({
    messages: [],
    currentMode: 'TRAINER',

    setMode: (mode: 'TRAINER' | 'GUEST' | 'EXAM') => {
      set({ currentMode: mode });
    },

    addMessage: (message: TrainerMessage) => {
      set((state) => ({ messages: [...state.messages, message] }));
    },

    getUserMessages: (userId: string) => {
      return get().messages.filter((m) => m.userId === userId);
    },
  }),
  {
    name: '202f-trainer-store',
  }
));
