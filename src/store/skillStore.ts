import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Skill, UserSkillProgress } from '../types';

interface SkillState {
  skills: Record<string, Skill>;
  userSkillProgress: Record<string, UserSkillProgress>;
  addSkill: (skill: Skill) => void;
  getSkill: (skillId: string) => Skill | undefined;
  updateSkillProgress: (progress: UserSkillProgress) => void;
  getUserSkillProgress: (userId: string) => UserSkillProgress[];
  getSkillProgress: (userId: string, skillId: string) => UserSkillProgress | undefined;
}

export const useSkillStore = create<SkillState>()(persist(
  (set, get) => ({
    skills: {},
    userSkillProgress: {},

    addSkill: (skill: Skill) => {
      set((state) => ({ skills: { ...state.skills, [skill.id]: skill } }));
    },

    getSkill: (skillId: string) => {
      return get().skills[skillId];
    },

    updateSkillProgress: (progress: UserSkillProgress) => {
      const key = `${progress.userId}-${progress.skillId}`;
      set((state) => ({
        userSkillProgress: { ...state.userSkillProgress, [key]: progress },
      }));
    },

    getUserSkillProgress: (userId: string) => {
      return Object.values(get().userSkillProgress).filter(
        (p) => p.userId === userId
      );
    },

    getSkillProgress: (userId: string, skillId: string) => {
      return get().userSkillProgress[`${userId}-${skillId}`];
    },
  }),
  {
    name: '202f-skill-store',
  }
));
