<script setup>
import { ref } from "vue";
import countButton from "../components/countButton.vue";
import navigationButton from "../components/navigationButton.vue";
import { useRouter } from "vue-router";

const count = ref(0);
const router = useRouter();
</script>

<template>
  <h2>Homepage</h2>
  <countButton />
  <navigationButton
    text="go to search"
    path="/search"
    :showOnlyBackBtn="false"
  />

  <Button icon="pi pi-user" label="Uživatelé" @click="router.push('/users')"></button>

</template>
