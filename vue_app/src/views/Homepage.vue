<script setup>
import navigationButton from "../components/navigationButton.vue";
import { useRouter } from "vue-router";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

</script>

<template>
  <h2>Homepage</h2>

  <Button icon="pi pi-user" label="Uživatelé" @click="router.push('/users')"></button>
  <div v-if="currentUser.id == 0">
    <i>Nepřihlášený uživatel</i>
  </div>
  <div v-else>
    {{ currentUser.name }} <br/>
    {{ currentUser.bio }}
  </div>

  <navigationButton
    text="go to search"
    path="/search"
    :showOnlyBackBtn="false"
  />

</template>
