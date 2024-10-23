<script setup>
import { ref } from "vue";
import countButton from "../components/countButton.vue";
import navigationButton from "../components/navigationButton.vue";

const count = ref(0);
</script>

<template>
  <h2>Homepage</h2>
  <countButton />
  <navigationButton
    text="go to search"
    path="/search"
    :showOnlyBackBtn="false"
  />
</template>
