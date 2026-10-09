import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Test, TestAttempt, TestQuestion } from '../types';

interface TestState {
  tests: Record<string, Test>;
  questions: Record<string, TestQuestion>;
  testAttempts: TestAttempt[];
  addTest: (test: Test) => void;
  addQuestion: (question: TestQuestion) => void;
  getTest: (testId: string) => Test | undefined;
  getQuestion: (questionId: string) => TestQuestion | undefined;
  submitTestAttempt: (attempt: TestAttempt) => void;
  getUserTestAttempts: (userId: string) => TestAttempt[];
  getTestAttempt: (attemptId: string) => TestAttempt | undefined;
}

export const useTestStore = create<TestState>()(persist(
  (set, get) => ({
    tests: {},
    questions: {},
    testAttempts: [],

    addTest: (test: Test) => {
      set((state) => ({ tests: { ...state.tests, [test.id]: test } }));
    },

    addQuestion: (question: TestQuestion) => {
      set((state) => ({
        questions: { ...state.questions, [question.id]: question },
      }));
    },

    getTest: (testId: string) => {
      return get().tests[testId];
    },

    getQuestion: (questionId: string) => {
      return get().questions[questionId];
    },

    submitTestAttempt: (attempt: TestAttempt) => {
      set((state) => ({ testAttempts: [...state.testAttempts, attempt] }));
    },

    getUserTestAttempts: (userId: string) => {
      return get().testAttempts.filter((a) => a.userId === userId);
    },

    getTestAttempt: (attemptId: string) => {
      return get().testAttempts.find((a) => a.id === attemptId);
    },
  }),
  {
    name: '202f-test-store',
  }
));
