<script setup>
import { onMounted, ref } from "vue";
import { switchUser } from "../../utils/users_api.js";
import { useRouter } from "vue-router";
import { readPublicRecipes, readPublicRecipesFilterName, readFilters } from "../../utils/api";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();
const searchValue = ref("");

const publicRecipes = ref();
const filters = ref();

const isLoading = ref(false);

const search = async () => {
  isLoading.value = true;
  readPublicRecipesFilterName(searchValue.value)
  .then(async (result) => {
    publicRecipes.value = result;
    isLoading.value = !isLoading.value;
  })
}

onMounted(async () => {
  search();

  if(currentUser.id)
    filters.value = await readFilters(currentUser.id)
}) 
</script>

<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>
    <div style="display: flex; justify-content: center;">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="searchValue" size="large" @keyup.enter="search"/>
      </IconField>
    </div>
 
    <div class="filters" style="display: flex; justify-content: center">
      <Tag value="Filter 1"/>
      <Tag value="Filter 2"/>
      <Tag value="Filtry" severity="warn" icon="pi pi-search" @click="router.push('/filters')"/>
    </div>

    <div v-for="(recipe, index) in publicRecipes" :key="recipe.id" @click="router.push(`/recipe/public/${recipe.id}`)"> 
      <div>
        {{ recipe.User.name }}
      </div>
      <div class="recipe">
        <div>({{ recipe.id }}) {{ recipe.name }}</div>
        <div class="recipe-likes">{{ recipe.like_count }} likes {{ recipe.times_cooked }}x </div>
    </div>
    <div v-if="index != publicRecipes.length - 1" class="devider"></div>
  </div>
</div>

</template>

<style scoped>
.recipe-likes {
  margin-left: 10px;
}

.recipe {
  display: flex;
  align-items: baseline;
}
.filters {
  margin-top: 10px;
  margin-bottom: 30px;
  display: flex;
  gap: 5px;
}
.p-button {
  flex-grow: 1;
  padding: 4px 6px;
}
.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>
