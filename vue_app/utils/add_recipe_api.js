/*
    FILE:       add_recipe_api.js
    AUTHOR:     Tomáš Tomcsányi, xtomcs00 
    DATE:       15.12.2024
*/

import { supabase } from "./supabase";

// Function to insert into the Recipe table
async function insertRecipe(recipeData) {
    const { data, error } = await supabase
      .from('Recipe')
      .insert([
        {
          name: recipeData.name,
          like_count: recipeData.like_count,
          times_cooked: recipeData.times_cooked,
          creator: recipeData.creator,
          private: recipeData.private,
          portions: recipeData.portions,
          time_to_cook: recipeData.time_to_cook
        }
      ])
      .select()
      
    console.log(recipeData.time_to_cook);
    console.log(data);
    console.log(data[0].id);
    if (error) {
      console.error('Error inserting recipe:', error);
      return null;
    }
    return data[0].id; // Return the inserted recipe id
  }
  
  // Function to insert into RecipeAlergens table
  async function insertRecipeAlergens(recipeId, alergens) {
    const { data, error } = await supabase
      .from('RecipeAlergens')
      .insert(alergens.map(alergenId => ({
        recipe: recipeId,
        alergen: alergenId
      })));
  
    if (error) {
      console.error('Error inserting recipe alergens:', error);
      return false;
    }
    return true;
  }
  
  // Function to insert into RecipeCategories table
  async function insertRecipeCategories(recipeId, categories) {
    const { data, error } = await supabase
      .from('RecipeCategories')
      .insert(categories.map(categoryId => ({
        recipe: recipeId,
        category: categoryId
      })));
  
    if (error) {
      console.error('Error inserting recipe categories:', error);
      return false;
    }
    return true;
  }
  
  // Function to insert into Step table
  async function insertSteps(recipeId, steps) {
    const { data, error } = await supabase
      .from('Step')
      .insert(steps.map(step => ({
        recipe: recipeId,
        text: step.text,
        name: step.name,
        number: step.number
      })));
  
    if (error) {
      console.error('Error inserting steps:', error);
      return false;
    }
    return true;
  }
  
  // Function to insert into Utencils table
  async function insertUtencils(recipeId, utencils) {
    const { data, error } = await supabase
      .from('Utencils')
      .insert(utencils.map(utencil => ({
        name: utencil.name,
        recipe: recipeId
      })));
  
    if (error) {
      console.error('Error inserting utencils:', error);
      return false;
    }
    return true;
  }
  
  // Function to insert into Ingredients table
  async function insertIngredients(recipeId, ingredients) {
    const { data, error } = await supabase
      .from('Ingredients')
      .insert(ingredients.map(ingredient => ({
        name: ingredient.name,
        notes: ingredient.notes,
        unit: ingredient.unit,
        quantity: ingredient.quantity,
        recipe: recipeId
      })));
  
    if (error) {
      console.error('Error inserting ingredients:', error);
      return false;
    }
    return true;
  }
  
  // Main function to insert data into the Recipe table and other related tables
  async function insertCompleteRecipe(recipeData) {
    try {
      // Insert the recipe data and get the recipe ID
      const recipeId = await insertRecipe(recipeData);
      if (!recipeId) return false;

      var alergenInserted = true, 
        categoriesInserted = true, 
        stepsInserted = true, 
        utencilsInserted = true, 
        ingredientsInserted = true;

      // Insert related tables
      if(recipeData.RecipeAlergens){
        alergenInserted = await insertRecipeAlergens(recipeId, recipeData.RecipeAlergens);
      }
      if(recipeData.RecipeCategories){
        categoriesInserted = await insertRecipeCategories(recipeId, recipeData.RecipeCategories);
      }
      if(recipeData.Step){
        stepsInserted = await insertSteps(recipeId, recipeData.Step);
      }
      if(recipeData.Utencils){
        utencilsInserted = await insertUtencils(recipeId, recipeData.Utencils);
      }
      if(recipeData.Ingredients){
        ingredientsInserted = await insertIngredients(recipeId, recipeData.Ingredients);
      }
  
      if (
        alergenInserted &&
        categoriesInserted &&
        stepsInserted &&
        utencilsInserted &&
        ingredientsInserted
      ) {
        console.log('Recipe and related data inserted successfully');
        return true;
      } else {
        console.error('Error inserting some of the related data');
        return false;
      }
    } catch (error) {
      console.error('Error inserting complete recipe:', error);
      return false;
    }
  }

  async function deleteRecipe(RecipeID) {
    const {data, error}  = await supabase
    .from( "Recipe" )
    .delete()
    .eq( 'id', RecipeID );
    if (error) {
      console.error("Error deleting recipe:", error);
      return 0;
    } else {
      console.log("Deleted everything aight");
      return 1;
    }
  }
  
  export {
    insertRecipe,
    insertRecipeAlergens,
    insertRecipeCategories,
    insertSteps,
    insertUtencils,
    insertIngredients,
    insertCompleteRecipe,
    deleteRecipe,
  };