import { useEffect } from 'react';
import { seedData, demoSkillProgress } from '../data/seedData';
import { useSkillStore } from '../store/skillStore';
import { useRecipeStore } from '../store/recipeStore';
import { useAchievementStore } from '../store/achievementStore';

// Populates empty persisted stores with seed data on first launch.
export function useSeedData() {
  useEffect(() => {
    const skillStore = useSkillStore.getState();
    if (Object.keys(skillStore.skills).length === 0) {
      seedData.skills.forEach((skill) => skillStore.addSkill(skill));
      demoSkillProgress.forEach((progress) =>
        skillStore.updateSkillProgress(progress)
      );
    }

    const recipeStore = useRecipeStore.getState();
    if (recipeStore.recipes.length === 0) {
      seedData.recipes.forEach((recipe) => recipeStore.addRecipe(recipe));
    }

    const achievementStore = useAchievementStore.getState();
    if (Object.keys(achievementStore.achievements).length === 0) {
      seedData.achievements.forEach((achievement) =>
        achievementStore.addAchievement(achievement)
      );
    }
  }, []);
}
