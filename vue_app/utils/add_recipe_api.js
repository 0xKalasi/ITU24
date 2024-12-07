import { supabase } from "./supabase";

// set Array to null, if there isnt any
var recipeDataObj = {
    name: String,
    userId: Number,
    isPrivate: Boolean,
    portions: Number,
    timeToCook: Number,
    steps: Array,           // steps[{number, text, timers[], recipeId},{},{}] ... timers[{description, stepRecipeId, stepNumber, timeInSeconds}, {}, {}]
    ingredients: Array,     // ingredients[{name, notes, unit, quantity, recipeId},{},{}]
    utencils: Array,
    alergens: Array,        // alergens[1, 4, 7]
    categories: Array,      // categories[1, 6, 12]
};
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
  
  // Function to insert into Timer table
  async function insertTimers(recipeId, timers) {
    const { data, error } = await supabase
      .from('Timer')
      .insert(timers.map(timer => ({
        step_recipe: recipeId,
        step_number: timer.step_number,
        description: timer.description,
        time: timer.time
      })));
  
    if (error) {
      console.error('Error inserting timers:', error);
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
      if (!recipeId) return false; // If recipe insertion fails, stop
      var alergenInserted = true, categoriesInserted = true, stepsInserted = true, timersInserted = true, utencilsInserted = true, ingredientsInserted = true;
      // Insert related tables
      if(recipeData.alergens){
        alergenInserted = await insertRecipeAlergens(recipeId, recipeData.alergens);
      }
      if(recipeData.categories){
        categoriesInserted = await insertRecipeCategories(recipeId, recipeData.categories);
      }
      if(recipeData.steps){
        stepsInserted = await insertSteps(recipeId, recipeData.steps);
      }
      if(recipeData.timers){ 
        timersInserted = await insertTimers(recipeId, recipeData.timers);
      }
      if(recipeData.utencils){
        utencilsInserted = await insertUtencils(recipeId, recipeData.utencils);
      }
      if(recipeData.ingredients){
        ingredientsInserted = await insertIngredients(recipeId, recipeData.ingredients);
      }
  
      if (
        alergenInserted &&
        categoriesInserted &&
        stepsInserted &&
        timersInserted &&
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

  async function deleteRecipe(Recipe) {
    const {data, error}  = await supabase
    .from( "Recipe" )
    .delete()
    .eq( 'id', Recipe.id );
    if (error) {
      console.error("Error deleting recipe:", error);
    } else {
      console.log("Deleted everything aight");
    }
  }
  
  export {
    insertRecipe,
    insertRecipeAlergens,
    insertRecipeCategories,
    insertSteps,
    insertTimers,
    insertUtencils,
    insertIngredients,
    insertCompleteRecipe,
    deleteRecipe,
  };