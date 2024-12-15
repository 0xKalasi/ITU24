/*
    FILE:       update_recipe_api.js
    AUTHOR:     Tomáš Tomcsányi, xtomcs00 
    DATE:       15.12.2024
*/

import { supabase } from "./supabase";
import { insertIngredients, insertRecipeAlergens, insertRecipeCategories, insertSteps, insertUtencils } from "./add_recipe_api";

// Function to update the Recipe table
async function updateRecipe(recipeData) {
    const { data, error } = await supabase
      .from('Recipe')
      .update({
        name: recipeData.name,
        like_count: recipeData.like_count,
        times_cooked: recipeData.times_cooked,
        creator: recipeData.creator,
        private: recipeData.private,
        portions: recipeData.portions,
        time_to_cook: recipeData.time_to_cook,
      })
      .eq('id', recipeData.id);
  
    if (error) {
      console.error('Error updating recipe:', error);
      return false;
    }
    return true;
  }
  
  // Function to update RecipeAlergens table
  async function updateRecipeAlergens(recipeId, alergens) {
    // Clear existing alergens
    const { error: deleteError } = await supabase
      .from('RecipeAlergens')
      .delete()
      .eq('recipe', recipeId);
  
    if (deleteError) {
      console.error('Error deleting recipe alergens:', deleteError);
      return false;
    }
  
    // Insert new alergens
    return await insertRecipeAlergens(recipeId, alergens);
  }
  
  // Function to update RecipeCategories table
  async function updateRecipeCategories(recipeId, categories) {
    // Clear existing categories
    const { error: deleteError } = await supabase
      .from('RecipeCategories')
      .delete()
      .eq('recipe', recipeId);
  
    if (deleteError) {
      console.error('Error deleting recipe categories:', deleteError);
      return false;
    }
  
    // Insert new categories
    return await insertRecipeCategories(recipeId, categories);
  }
  
  // Function to update Steps table
  async function updateSteps(recipeId, steps) {
    // Clear existing steps
    const { error: deleteError } = await supabase
      .from('Step')
      .delete()
      .eq('recipe', recipeId);
  
    if (deleteError) {
      console.error('Error deleting steps:', deleteError);
      return false;
    }
  
    // Insert new steps
    return await insertSteps(recipeId, steps);
  }
  
  // Function to update Utencils table
  async function updateUtencils(recipeId, utencils) {
    // Clear existing utencils
    const { error: deleteError } = await supabase
      .from('Utencils')
      .delete()
      .eq('recipe', recipeId);
  
    if (deleteError) {
      console.error('Error deleting utencils:', deleteError);
      return false;
    }
  
    // Insert new utencils
    return await insertUtencils(recipeId, utencils);
  }
  
  // Function to update Ingredients table
  async function updateIngredients(recipeId, ingredients) {
    // Clear existing ingredients
    const { error: deleteError } = await supabase
      .from('Ingredients')
      .delete()
      .eq('recipe', recipeId);
  
    if (deleteError) {
      console.error('Error deleting ingredients:', deleteError);
      return false;
    }
  
    // Insert new ingredients
    return await insertIngredients(recipeId, ingredients);
  }
  
  // Main function to update the Recipe and related tables
  async function updateCompleteRecipe(recipeData) {
    try {
      // Update the main recipe data
      const recipeUpdated = await updateRecipe(recipeData);
      if (!recipeUpdated) return false; // If recipe update fails, stop
  
      let alergensUpdated = true,
        categoriesUpdated = true,
        stepsUpdated = true,
        utencilsUpdated = true,
        ingredientsUpdated = true;
  
      // Update related tables
      if (recipeData.RecipeAlergens) {
        alergensUpdated = await updateRecipeAlergens(recipeData.id, recipeData.RecipeAlergens);
      }
      if (recipeData.RecipeCategories) {
        categoriesUpdated = await updateRecipeCategories(recipeData.id, recipeData.RecipeCategories);
      }
      if (recipeData.Step) {
        stepsUpdated = await updateSteps(recipeData.id, recipeData.Step);
      }
      if (recipeData.Utencils) {
        utencilsUpdated = await updateUtencils(recipeData.id, recipeData.Utencils);
      }
      if (recipeData.Ingredients) {
        ingredientsUpdated = await updateIngredients(recipeData.id, recipeData.Ingredients);
      }
  
      if (
        alergensUpdated &&
        categoriesUpdated &&
        stepsUpdated &&
        utencilsUpdated &&
        ingredientsUpdated
      ) {
        console.log('Recipe and related data updated successfully');
        return true;
      } else {
        console.error('Error updating some of the related data');
        return false;
      }
    } catch (error) {
      console.error('Error updating complete recipe:', error);
      return false;
    }
  }
  

  export {
    updateCompleteRecipe
  };