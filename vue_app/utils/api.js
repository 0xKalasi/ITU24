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

const createRecipe = () => {

}

export { 
    readAllRecipes,
    createRecipe
};
