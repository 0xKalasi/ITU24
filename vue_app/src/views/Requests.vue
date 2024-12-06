<script setup>
import { useRouter } from "vue-router";
import { readUsersRequests } from "../../utils/users_api.js";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const friendRequests = await readUsersRequests(currentUser.id);

</script>

<template>  
  <h2>Žádosti o přátelství</h2>

  <!--<Button label="Přátelé" icon="pi pi-heart" @click="router.push('/chats')"></Button>-->
  <!--<Button label="Zablokované" icon="pi pi-times" @click="router.push('/blocked')"></Button>-->

  <Button label="Zpět" icon="pi pi-arrow-left" @click="router.push('/chats')"></Button>
  <br/><br/>

  <div v-for="request in friendRequests">
    <Message @click="router.push(`/profile/${request.id}`)" severity="secondary">
      {{ request.name }}
    </Message>
    <Button style="float: left" label="Přijmout" icon="pi pi-check" @click="console.log('PŘIJMOUT')"></Button>
    <Button style="float: right" label="Odmítnout" icon="pi pi-times" @click="console.log('ODMÍTNOUT')"></Button>
    <br/><br/>
  </div>

</template>
