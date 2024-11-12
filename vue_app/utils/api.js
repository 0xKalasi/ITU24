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

const getCookTimers = async ( cook_state_id ) => {
	const { data: timers, error } = await supabase
	.from( 'CookState' )
	.select(`
		*,
		CookTimer(*)
	`)
	.eq( 'id', cook_state_id )

	if ( error ) {
		console.log( error );
		return null;
	}

	const cookTimers = timers[ 0 ].CookTimer;

	console.log( cookTimers );

	return cookTimers;
}

const updateCookTimer = async ( timer_id, timer ) => {
	let { data: res, error } = await supabase
		.from( 'CookTimer' )
		.update( timer )
		.eq( 'id', timer_id );

	if ( error )
		console.log( error );
}

const getCookState = async ( user_id, recipe_id, step_number ) => {
	/* get existing cook state */
	let { data: res, error } = await supabase
		.from( 'CookState' )
		.select( '*' )
		.eq( 'user', user_id )
		.eq( 'recipe', recipe_id );

	console.log( res, error );

	if ( error ) {
		console.log( error );
		return null;
	}

	if ( !res || res.length == 0 ) {
		/* create new cook state */
		const { data: res, error } = await supabase
			.from( 'CookState' )
			.insert(
				{
					user: user_id,
					recipe: recipe_id,
					step_number: step_number,
					step_recipe: recipe_id
				}
			)
			.select();

		if ( error ) {
			console.log( error );
			return null;
		}

		console.log( res );

		return res;
	}

	console.log( res );

	res = res[ 0 ];

	console.log( res );

	/* update step number */
	if ( step_number && res.step_number != step_number ) {
		await supabase
			.from( "CookState" )
			.update( { 'step_number': step_number } )
			.eq( 'id', res.id );

		res.step_number = step_number;
	}

	return res;
}

const deleteCookState = async ( cook_state_id ) => {
	await supabase
	.from( "CookState" )
	.delete()
	.eq( 'id', cook_state_id );
}

const createCookTimer = async ( cook_state_id, timer ) => {
	const { data: res, error } = await supabase
		.from( 'CookTimer' )
		.insert([
		{
			cook_state_id: cook_state_id,
			timer_id: timer.timer_id,
			state: 1,
			start: ((new Date()).toISOString()).toLocaleString('zh-TW'),
			total_length: timer.length,
			rem_length: timer.length,
			name: timer.name,
		}
		])
		.select()

	console.log( res, error );

	if ( error ) {
		console.log( error );
		return 0;
	}

	console.log( res );

	return res[ 0 ].id;
}

const deleteCookTimer = async ( timer_id ) => {
	await supabase.from('CookTimer').delete().eq( 'id', timer_id )
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
    .eq('user', id)

    if(!error)
        return filters;
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
    console.log(imgUrl.publicUrl);
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

const createFilter = async (user_id, name, allergenIds) => {
    const { data: filter, error } = await supabase
    .from('Filter')
    .insert([
      { 
        name: name,
        user: user_id,
      }
    ])
    .select()
    .single(); /* this is the same as filter[0] */

  if (error) 
    return null;

  /* bulk insert */
  const filterAlergensData = allergenIds.map(alergenId => ({
    filter: filter.id, /* id from filter insert */
    alergen: alergenId,
  }));
  console.log(filterAlergensData);

  const { data: filterAlergens, filterAlergensErr } = await supabase
    .from('FilterAlergens')
    .insert(filterAlergensData);

  if (filterAlergensErr) 
    return null
   else 
    return 1;
}

export { 
    readAllRecipes,
    readPublicRecipesFilterName,
    readPublicRecipes,
    readPublicRecipe,
    readAlergen,
	readRecipe,
    readUsersPublicRecipe,
    readFilters,
    readAllAlergens,
	getCookTimers,
	createCookTimer,
	getCookState,
	deleteCookTimer,
	updateCookTimer,
	deleteCookState,
    readAllCategories,
    saveRecipe,
    getRecipeImage,
    getSavedRecipes,
    createFilter
};
