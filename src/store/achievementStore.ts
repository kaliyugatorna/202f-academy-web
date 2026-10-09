import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Achievement, UserAchievement } from '../types';

interface AchievementState {
  achievements: Record<string, Achievement>;
  userAchievements: UserAchievement[];
  addAchievement: (achievement: Achievement) => void;
  getAchievement: (id: string) => Achievement | undefined;
  unlockAchievement: (userId: string, achievementId: string) => void;
  getUserAchievements: (userId: string) => Achievement[];
}

export const useAchievementStore = create<AchievementState>()(persist(
  (set, get) => ({
    achievements: {},
    userAchievements: [],

    addAchievement: (achievement: Achievement) => {
      set((state) => ({
        achievements: { ...state.achievements, [achievement.id]: achievement },
      }));
    },

    getAchievement: (id: string) => {
      return get().achievements[id];
    },

    unlockAchievement: (userId: string, achievementId: string) => {
      const exists = get().userAchievements.some(
        (ua) => ua.userId === userId && ua.achievementId === achievementId
      );
      if (!exists) {
        set((state) => ({
          userAchievements: [
            ...state.userAchievements,
            { userId, achievementId, unlockedAt: new Date() },
          ],
        }));
      }
    },

    getUserAchievements: (userId: string) => {
      const { userAchievements, achievements } = get();
      return userAchievements
        .filter((ua) => ua.userId === userId)
        .map((ua) => achievements[ua.achievementId])
        .filter((a): a is Achievement => !!a);
    },
  }),
  {
    name: '202f-achievement-store',
  }
));
