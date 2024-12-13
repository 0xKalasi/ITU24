import { supabase } from "./supabase";

const likeRecipe = async (recipeId, userId) => {
  const { data, error } = await supabase
  .from('UserLikes')
  .insert([
    {
      user: userId,
      recipe: recipeId
    }
  ])
  .select()
     
  if (error) {
    console.log(error);
    return null;
  }

  return data;
}

const unLikeRecipe = async (recipeId, userId) => {
  const { error } = await supabase
  .from('UserLikes')
  .delete()
  .eq('recipe', recipeId)
  .eq('user', userId)

  if (error) {
    console.log(error);
  }
}

const getRecipeLikeCount = async (recipeId) => {
  const { data: recipeLikeCount, error } = await supabase
  .from('UserLikes')
  .select('count') // No source worked, but this did, somehow...
  .eq('recipe', recipeId)

  if (error) {
    console.log(error);
  }

  return recipeLikeCount[0].count;
}

export {
  likeRecipe,
  unLikeRecipe,
  getRecipeLikeCount
};
