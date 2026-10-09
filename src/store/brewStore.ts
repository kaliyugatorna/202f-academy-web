import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BrewLog } from '../types';

// Dates come back from localStorage as ISO strings — always coerce before use.
const toTime = (date: Date | string): number => new Date(date).getTime();

interface BrewState {
  brewLogs: BrewLog[];
  addBrewLog: (log: BrewLog) => void;
  updateBrewLog: (log: BrewLog) => void;
  deleteBrewLog: (id: string) => void;
  getUserBrewLogs: (userId: string) => BrewLog[];
  getBrewLog: (id: string) => BrewLog | undefined;
  getBrewStats: (userId: string) => {
    totalBrews: number;
    averageRating: number;
    favoriteMethod: string | null;
    averageTDS: number | null;
    averageEY: number | null;
  };
}

export const useBrewStore = create<BrewState>()(persist(
  (set, get) => ({
    brewLogs: [],

    addBrewLog: (log: BrewLog) => {
      set((state) => ({ brewLogs: [...state.brewLogs, log] }));
    },

    updateBrewLog: (log: BrewLog) => {
      set((state) => ({
        brewLogs: state.brewLogs.map((b) => (b.id === log.id ? log : b)),
      }));
    },

    deleteBrewLog: (id: string) => {
      set((state) => ({ brewLogs: state.brewLogs.filter((b) => b.id !== id) }));
    },

    getUserBrewLogs: (userId: string) => {
      return get()
        .brewLogs.filter((b) => b.userId === userId)
        .sort((a, b) => toTime(b.date) - toTime(a.date));
    },

    getBrewLog: (id: string) => {
      return get().brewLogs.find((b) => b.id === id);
    },

    getBrewStats: (userId: string) => {
      const userLogs = get().brewLogs.filter((b) => b.userId === userId);

      if (userLogs.length === 0) {
        return {
          totalBrews: 0,
          averageRating: 0,
          favoriteMethod: null,
          averageTDS: null,
          averageEY: null,
        };
      }

      const averageRating =
        userLogs.reduce((sum, b) => sum + b.rating, 0) / userLogs.length;

      const methodCounts = userLogs.reduce(
        (acc, b) => {
          acc[b.brewMethod] = (acc[b.brewMethod] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const favoriteMethod =
        Object.entries(methodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        null;

      const logsWithTDS = userLogs.filter((b) => b.tds !== undefined);
      const averageTDS =
        logsWithTDS.length > 0
          ? logsWithTDS.reduce((sum, b) => sum + (b.tds || 0), 0) /
            logsWithTDS.length
          : null;

      const logsWithEY = userLogs.filter((b) => b.extractionYield !== undefined);
      const averageEY =
        logsWithEY.length > 0
          ? logsWithEY.reduce((sum, b) => sum + (b.extractionYield || 0), 0) /
            logsWithEY.length
          : null;

      return {
        totalBrews: userLogs.length,
        averageRating,
        favoriteMethod,
        averageTDS,
        averageEY,
      };
    },
  }),
  {
    name: '202f-brew-store',
  }
));
