import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe } from '../types';

interface RecipeState {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (recipe: Recipe) => void;
  getRecipe: (id: string) => Recipe | undefined;
  getRecipesByCategory: (category: string) => Recipe[];
  searchRecipes: (query: string) => Recipe[];
}

export const useRecipeStore = create<RecipeState>()(persist(
  (set, get) => ({
    recipes: [],

    addRecipe: (recipe: Recipe) => {
      set((state) => ({ recipes: [...state.recipes, recipe] }));
    },

    updateRecipe: (recipe: Recipe) => {
      set((state) => ({
        recipes: state.recipes.map((r) => (r.id === recipe.id ? recipe : r)),
      }));
    },

    getRecipe: (id: string) => {
      return get().recipes.find((r) => r.id === id);
    },

    getRecipesByCategory: (category: string) => {
      return get().recipes.filter((r) => r.category === category);
    },

    searchRecipes: (query: string) => {
      const q = query.toLowerCase();
      return get().recipes.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.notes?.toLowerCase().includes(q)
      );
    },
  }),
  {
    name: '202f-recipe-store',
  }
));
