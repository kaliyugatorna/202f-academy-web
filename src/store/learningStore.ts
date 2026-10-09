import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Course, Module, Lesson, UserLessonProgress } from '../types';

interface LearningState {
  courses: Course[];
  modules: Record<string, Module>;
  lessons: Record<string, Lesson>;
  userLessonProgress: Record<string, UserLessonProgress>;
  setCourses: (courses: Course[]) => void;
  addModule: (module: Module) => void;
  addLesson: (lesson: Lesson) => void;
  markLessonCompleted: (userId: string, lessonId: string) => void;
  updateLessonProgress: (progress: UserLessonProgress) => void;
  getLessonProgress: (userId: string, lessonId: string) => UserLessonProgress | undefined;
  getCourseProgress: (userId: string, courseId: string) => number;
}

export const useLearningStore = create<LearningState>()(persist(
  (set, get) => ({
    courses: [],
    modules: {},
    lessons: {},
    userLessonProgress: {},

    setCourses: (courses: Course[]) => set({ courses }),

    addModule: (module: Module) => {
      set((state) => ({ modules: { ...state.modules, [module.id]: module } }));
    },

    addLesson: (lesson: Lesson) => {
      set((state) => ({ lessons: { ...state.lessons, [lesson.id]: lesson } }));
    },

    markLessonCompleted: (userId: string, lessonId: string) => {
      const key = `${userId}-${lessonId}`;
      set((state) => {
        const existing = state.userLessonProgress[key] || {
          userId,
          lessonId,
          completed: false,
          startedAt: new Date(),
          timeSpent: 0,
        };
        return {
          userLessonProgress: {
            ...state.userLessonProgress,
            [key]: { ...existing, completed: true, completedAt: new Date() },
          },
        };
      });
    },

    updateLessonProgress: (progress: UserLessonProgress) => {
      const key = `${progress.userId}-${progress.lessonId}`;
      set((state) => ({
        userLessonProgress: { ...state.userLessonProgress, [key]: progress },
      }));
    },

    getLessonProgress: (userId: string, lessonId: string) => {
      return get().userLessonProgress[`${userId}-${lessonId}`];
    },

    getCourseProgress: (userId: string, courseId: string) => {
      const { courses, lessons, userLessonProgress } = get();
      const course = courses.find((c) => c.id === courseId);
      if (!course) return 0;

      const allLessons = Object.values(lessons);
      const courseLessons = course.moduleIds.flatMap((moduleId) =>
        allLessons.filter((l) => l.moduleId === moduleId)
      );

      if (courseLessons.length === 0) return 0;

      const completedCount = courseLessons.filter(
        (l) => userLessonProgress[`${userId}-${l.id}`]?.completed
      ).length;

      return Math.round((completedCount / courseLessons.length) * 100);
    },
  }),
  {
    name: '202f-learning-store',
  }
));
