<script setup>
import { ref } from "vue";

import { readAllRecipes } from "../../utils/api.js";
</script>

<template>
	<p>{{ $route.params.recipe_id }}</p>
</template>
