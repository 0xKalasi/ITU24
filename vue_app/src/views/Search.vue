<script setup>
import navigationButton from "../components/navigationButton.vue";
</script>

<template>
  <h2>Search</h2>
  <navigationButton :showOnlyBackBtn="true" />
  <navigationButton text="go to user Martin" path="/users/Martin" />
</template>
