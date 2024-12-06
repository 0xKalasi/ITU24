<script setup>
import { useRouter } from "vue-router";
import { readUsersBlocked } from "../../utils/users_api.js";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const blockedUsers = await readUsersBlocked(currentUser.id);

</script>

<template>  
  <h2>Zablokovaní uživatelé</h2>

  <!--<Button label="Příchozí" icon="pi pi-clock" @click="router.push('/requests')"></Button>-->
  <!--<Button label="Přátelé" icon="pi pi-heart" @click="router.push('/chats')"></Button>-->

  <Button label="Zpět" icon="pi pi-arrow-left" @click="router.push('/chats')"></Button>
  <br/><br/>

  <div v-for="blocked in blockedUsers">
    <Message @click="router.push(`/profile/${blocked.id}`)" severity="secondary">
      {{ blocked.name }}
    </Message>
    <Button
      label="Odblokovat"
      icon="pi pi-lock-open"
      @click="console.log('ODBLOKOVAT')"
      style="float: right">
    </Button>
    <br/><br/>
  </div>

</template>
