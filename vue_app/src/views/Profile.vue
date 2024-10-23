<script setup>
import { useRouter } from "vue-router";
import navigationButton from "../components/navigationButton.vue";

const router = useRouter();
const currentRoute = router.currentRoute.value;
const username = currentRoute.params.username;
console.log(currentRoute);
</script>

<template>
  <h2>Profile</h2>
  <h3>{{ username }}</h3>
  <navigationButton />

  <navigationButton
    :text="`show ${username}'s recipes`"
    :path="`/users/${username}/recipes`"
  />
</template>
