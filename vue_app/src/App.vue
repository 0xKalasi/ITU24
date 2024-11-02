<script setup>
import { readAllRecipes } from '../utils/api';

const recipes = await readAllRecipes();
console.log('from app.vue: ', recipes[0]);
console.log('resipi name:', recipes[0].name);
</script>

<template>
  <Suspense>
    <h1>/ vue app /</h1>
    <routerView></routerView>
  </Suspense>
</template>
