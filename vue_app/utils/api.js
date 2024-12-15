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

const readRecipe = async ( id ) => {

	const { data: recipes, error } = await supabase
		.from( 'Recipe' )
		.select(`
			*,
			Ingredients (*),
			Step (*, Timer(*), StepIngredients(*)),
			RecipeCategories(Categories (*)),
			Utencils (*),
			RecipeAlergens(Alergens( id, name))
		`)
		.eq( 'id', id )

	if ( error ) {
		console.log( error )
	}

	if ( recipes.length == 0 )
		return null;

	return recipes[ 0 ];
}

const readPublicRecipes = async () => {
    const { data: recipes, error } = await supabase
    .from('Recipe')
    .select(`
        *,
        User (id, name, bio)
    `)
    .eq('private', false)
    /* .order('some_column', { ascending: true })  */

    if(!error)
        return recipes;
    else {
        console.log(error);
        return null;
    }
}

const readPublicRecipesFilterName = async (filterName) => {
    // make a query first, add filter only if user filtered somehting
    let query = supabase
    .from('Recipe')
    .select(`
        *,
        User (id, name, bio)
    `)
    .eq('private', false)

    if(filterName)
        query = query.ilike('name', `%${filterName}%`)
    
    const { data: recipes, error } = await query
   
    if(!error)
        return recipes;
    else {
        console.log(error);
        return null;
    } 
}

const readPublicRecipe = async (id) => {
    const { data: recipes, error } = await supabase
    .from('Recipe')
    .select(`
        *,
        Ingredients (*),
        Step (*),
        Utencils (*),
        RecipeCategories(
        category: Categories(id, name)),
        RecipeAlergens(
        alergen: Alergens(id, name))
    `)
    .eq('id', id)

    if(!error)
        return recipes[0];
    else {
        console.log(error);
        return null;
    }
}

const readUsersPublicRecipe = async (uid) => {
    const { data: recipes, error } = await supabase
    .from('Recipe')
    .select('*')
    .eq('creator', uid);

    if (error) {
        console.log(error);
        return null;
    }

    return recipes;
}

const readAlergen = async (id) => {
    const { data: alergens, error } = await supabase
    .from('Alergens')
    .select('*')
    .eq('id', id)

    if(!error)
        return alergens[0];
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

}

const readAllAlergens = async() => {
    const { data: alergens, error } = await supabase
    .from('Alergens')
    .select('*')

    if(!error)
        return alergens;
    else {
        console.log(error);
        return null;
    } 
}

const readAllCategories = async () => {
    const { data: categories, error } = await supabase
    .from('Categories')
    .select('*')

    if(!error)
        return categories;
    else {
        console.log(error);
        return null;
    } 
} 

const saveRecipe = async (notes, user_id, recipe_id) => {
    const { data: recipe, error } = await supabase
    .from('SavedRecipes')
    .insert([
        { 
            notes: notes,
            user: user_id,
            recipe: recipe_id
        },
    ])
    .select()
    
    if(!error)
        return recipe;
    else {
        console.log(error);
        return null;
    } 
}

const getRecipeImage = async (recipe_id) => {
    /* /recipes/${recipe_id}/main.jpg */

    const pathToImage = `/recipes/${recipe_id}/main.jpg`;
    const { data: imgUrl, error } = supabase.storage.from('Images').getPublicUrl(pathToImage);
    return imgUrl.publicUrl;
}

const getSavedRecipes = async (user_id) => {
    const { data: recipes, error } = await supabase
    .from('SavedRecipes')
    .select(`
        *,
        Recipe(*)
        `)
    .eq('user', user_id)

    if(!error)
        return recipes;
    else {
        console.log(error);
        return null;
    } 
}

// function for mapping filter id with alergen id from alergen arrray
const createFilterAlergens = (id, alergenArr) => {
    return alergenArr.map(alergenId => ({
        filter: id,
        alergen: alergenId,
    }));
}

// function for mapping filter id with category id from category array
const createFilterCategories = (id, categoryArr) => {
    return categoryArr.map(catId => ({
        filter: id,
        category: catId,
    }));  
}

const createFilter = async (user_id, name, alergenArr, categoriesArr, keyword) => {
    try{
        const { data: filter } = await supabase
        .from('Filter')
        .insert([
          { 
            name: name,
            user: user_id,
            key_word: keyword
          }
        ]) 
        .select()
        .single(); // this is the same as filter[0] 

        // bulk inserts to FilterAlergens and FilterCategories
        const filterAlergens = createFilterAlergens(filter.id, alergenArr);
        await supabase.from('FilterAlergens').insert(filterAlergens);

        const filterCategories = createFilterCategories(filter.id, categoriesArr);
        await supabase.from('FilterCategories').insert(filterCategories);
    }
    catch(error){
        console.log(error);
        return false;
    }
}

const readFilters = async (id) => {
    const { data: filters, error } = await supabase
    .from('Filter')
    .select('*')
    .eq('user', id)

    if(!error){
        return filters;
    }
    else {
        console.log(error);
        return null;
    }
}

const deleteFilter = async (id) => {
    try{
        // this could be done by only setting cascading in database on foreign key filter in FilterAlergens and FilterCategories 
        // delete FilterAlergens rows where column filter is id
        await supabase
        .from('FilterAlergens')
        .delete()
        .eq('filter', id);

        // delete FilterCategories rows where column filter is id
        await supabase
        .from('FilterCategories')
        .delete()
        .eq('filter', id);
        
        // delete Filter after its foreign key rows have been deleted
        await supabase
        .from('Filter')
        .delete()
        .eq('id', id);

        return true;
    }
    catch(error) {
        // catch error from all 3 supa calls
        console.log(error);
        return false;
    }
}

const readFilterById = async (filterId) => {
    const { data: filter, error } = await supabase
    .from('Filter')
    .select('*')
    .eq('id', filterId)
    .single();

    if(!error){
        return filter;
    }
    else {
        console.log(error);
        return null;
    }
}

const readFilterAlergens = async (filterId) => {
    const { data: alergens, error } = await supabase
    .from('FilterAlergens')
    .select('*')
    .eq('filter', filterId);

    if(!error)
        return alergens;
    else {
        console.log(error);
        return null;
    } 
}

const readFilterCategories = async (filterId) => {
    const { data: categories, error } = await supabase
    .from('FilterCategories')
    .select('*')
    .eq('filter', filterId);

    if(!error)
        return categories;
    else {
        console.log(error);
        return null;
    } 
} 

const deleteAndInsertAlergens = async (filterId, filterAlergens) => {
    try{
        // delete filter's alergens
        await supabase
        .from('FilterAlergens')
        .delete()
        .eq('filter', filterId);

        // insert new 
        await supabase.from('FilterAlergens').insert(filterAlergens);
    }
    catch(error){
        console.log(error);
        return null;
    }
}

const deleteAndInsertCategories = async (filterId, filterCategories) => {
    try{
        // delete filter's categories
        await supabase
        .from('FilterCategories')
        .delete()
        .eq('filter', filterId);

        // insert new 
        await supabase.from('FilterCategories').insert(filterCategories);
    }
    catch(error){
        console.log(error);
        return null;
    }
}

const editFilter = async (filterId, name, alergenArr, categoriesArr, keyword) => {
    try{
        const { data: filter } = await supabase
        .from('Filter')
        .update([
          { 
            name: name,
            key_word: keyword
          }
        ]) 
        .eq('id', filterId)
        .select()
        .single(); // this is the same as filter[0] 

        // bulk delete and insert to FilterAlergens and FilterCategories
        const filterAlergens = createFilterAlergens(filter.id, alergenArr);
        await deleteAndInsertAlergens(filter.id, filterAlergens);

        const filterCategories = createFilterCategories(filter.id, categoriesArr);
        await deleteAndInsertCategories(filter.id, filterCategories);
    }
    catch(error){
        console.log(error);
        return false;
    }
}

const selectFilter = async (userId, filterId) => {
    const filters = await readFilters(userId);

    const lastUsed = filters.find((filter) => filter.last_used == 1);
    const secondLastUsed = filters.find((filter) => filter.last_used == 2);

    const newLastUsed = [];

    // if filter is not already last used, set it as last used
    // last_used == 1 -> last used
    // last_used == 2 -> second last used
    if(!lastUsed){
        newLastUsed.push({
            id: filterId,
            last_used: 1
        });
    } else {
        if(!(filterId == lastUsed.id)){
            newLastUsed.push({
                id: filterId,
                last_used: 1
            });

            // there is second last used already
            if(secondLastUsed){
                
                // new second last used is the previous last used
                newLastUsed.push({
                    id: lastUsed.id,
                    last_used: 2
                });
                
                // remove previous second last used from last_used flag
                newLastUsed.push({
                    id: secondLastUsed.id,
                    last_used: null
                });
            } else{
                // new second last used is the previous last used
                newLastUsed.push({
                    id: lastUsed.id,
                    last_used: 2
                });
            }
        }
    }

    try {
        // update 
        for(const one of newLastUsed){
            await supabase
            .from('Filter')
            .update({ last_used: one.last_used })
            .eq('id', one.id);
        }
    } catch(error){
        console.log(error);
        return false;
    }
}

const getLastUsedFilters = async (userId) => {
    const filters = await readFilters(userId);

    let lastUsed = filters.find((filter) => filter.last_used == 1);
    let secondLastUsed = filters.find((filter) => filter.last_used == 2);

    // user didnt use any filter yet and there is >= 2 filters, so show first two
    if(!lastUsed && filters.length >= 2){
        lastUsed = filters[0];
        secondLastUsed = filters[1];
    }

    // user didnt use any filter yet and there is only one, so show just the one
    if(!lastUsed && filters.length == 1){
        lastUsed = filters[0];
    }

    // there is lastUsed, but secondLastUsed is not set yet -> find some user's filter that isnt lastUsed
    if(!secondLastUsed){
        secondLastUsed = filters.find((filter => filter.id != lastUsed.id));
    }

    return { 
        first: lastUsed, 
        second: secondLastUsed 
    }
}

export { 
    readAllRecipes,
    readPublicRecipesFilterName,
    readPublicRecipes,
    readPublicRecipe,
    readAlergen,
	readRecipe,
    readUsersPublicRecipe,
    readAllAlergens,
    readAllCategories,
    saveRecipe,
    getRecipeImage,
    getSavedRecipes,
    createFilter,
    readFilters,
    deleteFilter,
    readFilterById,
    readFilterAlergens,
    readFilterCategories,
    editFilter,
    selectFilter,
    getLastUsedFilters
};
