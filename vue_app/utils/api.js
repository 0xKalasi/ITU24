import { supabase } from "./supabase";

const readAllRecipes = async () => {
    const { data: recipes, error } = await supabase
    .from('Recipe')
    .select('*')
    /* .order('some_column', { ascending: true })  */

    if(!error)
        return recipes;
    else {
        console.log(error);
        return null;
    } 
}

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

const createTimer = async (data) => {
    const { res, error } = await supabase
    .from('Timer')
    .insert([
    { 
        description: data.description,
        step_recipe: data.stepRecipeId,
        step_number: data.stepNumber,
        time: data.timeInSeconds,
    },
    ])
    .select()

    console.log(res);

    if(!error)
        return 1;
      else
        return null;
}

const createStep = async (data) => {
    const { res, error } = await supabase
    .from('Step')
    .insert([
    { 
        number: data.number,
        recipe: data.recipeId,
        text: data.text,
    },
    ])
    .select()
  
    console.log(res);

    if(!error)
        return 1;
    else
        return null;

    if(data.timers){
        for(let timer = 0; timer < data.timers.length; timer++) {
            data.timers[timer].stepRecipeId = data.recipeId;

            if(createTimer(data.timers[timer])){}  

            else return 'error in creting timers'; 
        }
    }
}

const createIngredient = async (data) => {
    const { res, error } = await supabase
    .from('Ingredients')
    .insert([
    { 
        name: data.name,
        notes: data.notes, 
        unit: data.unit,
        quantity: data.quantity,
        recipe: data.recipeId,
    },
  ])
  .select()

  console.log(res);

    if(!error)
        return 1;
    else
    return null;

}

const createUtencil = async (data) => {
    const { res, error } = await supabase
    .from('Utencils')
    .insert([
    { 
        name: data.name,
        recipe: data.recipeId,
    },
  ])
  .select()

  console.log(res);

  if(!error)
    return 1;
  else
    return null;
}

const createRecipeAlergen = async (alergenId, recipeId) => {
    const { res, error } = await supabase
    .from('RecipeAlergens')
    .insert([
    { 
        recipe: recipeId,
        alergen: alergenId,
    },
  ])
  .select()
  console.log(res);

  if(!error)
    return 1;
  else
    return null;
}

// user needs to first create the category, so we have its categoryId
const createRecipeCategory = async (categoryId, recipeId) => {
    const { res, error } = await supabase
    .from('RecipeCategories')
    .insert([
    { 
        recipe: recipeId,
        category: categoryId,
    },
  ])
  .select()
  console.log(res);

  if(!error)
    return 1;
  else
    return null;
}

const createRecipe = async (data) => {
    const { res, error } = await supabase
    .from('Recipe')
    .insert([
    { 
        name: data.name, 
        creator: data.userId, 
        private: data.isPrivate,
        portions: data.portions,
        time_to_cook: data.timeToCook, 
    },
    ])
    .select() // here we will get back a created recipe

    if(!error){
        if(data.steps){
            for(let step = 0; step < data.steps.length; step++) {
                data.steps[step].recipeId = res.id;

                if(createStep(data.steps[step]))
                    console.log('Step ',data.steps[step].number, ' of recipe ',data.steps[step].recipeId, ' created.');    
    
                else return 'error in creating steps'; 
            }
        }
        
        if(data.utencils){
            for(let utencil = 0; utencil < data.utencils.length; utencil++){
                data.utencils[utencil].recipeId = res.id;
                if(createUtencil(data.utencils[utencil]))
                    console.log('Utencil ', data.utencils[utencil].name, ' of recipe ', res.id, ' created.');

                else return 'error in creating utencils';
            }
        }

        if(data.alergens){
            for(let alergen = 0; alergen < data.alergens.length; alergen++){
                if(createRecipeAlergen(data.alergens[alergen], res.id))
                    console.log('RecipeAlergen ', data.alergens[alergen], ' of recipe ', res.id, ' created.');

                else return 'error in creating recipeAlergen';
            }
        }

        // TODO: HOW TO CREATE RECIPES-CATEGORY?
        // create category
        // and then create recipe category
        /* if(data.categories){
            for(let category = 0; category < data.categories.length; category++){
                if(createRecipeCategory(data.categories[category], res.id))
                    console.log('RecipeAlergen ', data.alergens[alergen], ' of recipe ', res.id, ' created.');

                else return 'error in creating recipeAlergen';
            }
        } */
    }    
        
    else 
    return 'error creating a recipe';
}

export { 
    readAllRecipes,
    createRecipe
};
