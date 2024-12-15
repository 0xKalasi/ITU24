<!-- Tomáš Bordák, xborda01 -->

<script setup>
import { onBeforeMount, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import filters from "@/components/filters/filtersHomepage.vue"
import { readPublicRecipes, readPublicRecipesFilterName, readFilters, getRecipeImage } from "../../utils/api";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();
const searchValue = ref("");

const publicRecipes = ref();

// SEARCH FIELD - DYNAMIC PLACEHOLDER
const texts = [
    "Vyhledejte recept",
    "Podle ingrediencií",
    "Podle kategorií",
    "Zkuste něco nové",
    "Vyskoušejte filtry"
];
let textsIndex = 0;
const dynamicPlaceHolder = ref(texts[textsIndex]);

const isLoading = ref(false);

const search = async () => {
  isLoading.value = true;
  readPublicRecipesFilterName(searchValue.value)
  .then(async (result) => {
    publicRecipes.value = result;
    isLoading.value = !isLoading.value;
  })
}

const path = ref();

onBeforeMount(async () => {
  search();
  path.value = await getRecipeImage(1);
}) 

let interval;
onMounted(() => {
  interval = setInterval(() => {
    textsIndex = (textsIndex + 1) % texts.length; // loop trough texts
    dynamicPlaceHolder.value = texts[textsIndex];
  }, 3000);
})

onUnmounted(() => {
  clearInterval(interval);
})

</script>

<template>
  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>
    <div style="display: flex; justify-content: center;">
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText v-model="searchValue" size="large" @keyup.enter="search" :placeholder="dynamicPlaceHolder"/>
      </IconField>
    </div>
    
    <!-- at most 2 last used filters and all filters button -->
    <filters />

    <div v-for="(recipe, index) in publicRecipes" :key="recipe.id" @click="router.push(`/recipe/public/${recipe.id}`)"> 
      <div>
        {{ recipe.User.name }}
      </div>
      <div v-if="recipe.id == 1">
            <Image :src="path" alt="Image" width="250"/>
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
