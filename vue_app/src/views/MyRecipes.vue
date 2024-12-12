<script setup>
  import { useUserStore } from '../stores/userStore';
  import NavigationButton from "../components/navigationButton.vue";
  import { useRouter } from "vue-router";
  import { getSavedRecipes, readUsersPublicRecipe } from '../../utils/api';
  
  
  const currentUser = useUserStore();
  const router = useRouter();

  const savedRecipes = await getSavedRecipes(currentUser.id);
  const usersRecipes = await readUsersPublicRecipe(currentUser.id);
  console.log(usersRecipes);
</script>

<template>
  <BasicPageHeader text="Kniha receptů"></BasicPageHeader>
  <div v-if="currentUser.id == 0">
    Pro zobrazení vašich receptů se přihlaste
  </div>
  <div v-else>
    <Button type="button" label="Přidat recept" @click="router.push('/addnewrecipe')"></Button>
    <h3 style="margin-top: 50px;">Vaše recepty</h3>

    <div v-for="recipe in usersRecipes" style="margin-top: 8px;">
      <Message severity="success" @click="router.push(`/recipe/public/${recipe.id}`)">
          {{ recipe.name }}
      </Message>
    </div>

    <h3 style="margin-top: 50px;">Uložené recepty</h3>

    <div v-for="recipe in savedRecipes" style="margin-top: 8px">
      <Message severity="success" @click="router.push(`/recipe/public/${recipe.Recipe.id}`)">
        {{ recipe.Recipe.name }}
      </Message>
    </div>

  </div>
  
  </template>