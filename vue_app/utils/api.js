import { supabase } from "./supabase";

// TODO: add checks for recipes being public !!!

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

const readFilters = async (id) => {
    const { data: filters, error } = await supabase
    .from('Filter')
    .select('*')
    .eq('id', id)

    if(!error)
        return filters;
    else {
        console.log(error);
        return null;
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
    readFilters
};
