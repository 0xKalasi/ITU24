<script setup>
import { useRouter } from "vue-router";
import { readUsersFriends } from "../../utils/users_api.js";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const friends = await readUsersFriends(currentUser.id);

</script>

<template>  
  <h2>Žádosti o přátelství</h2>

  <Button label="Přátelé" icon="pi pi-heart" @click="router.push('/chats')"></Button>
  <Button label="Zablokované" icon="pi pi-times" @click="router.push('/blocked')"></Button>
  <br/><br/>

  <div v-for="friend in friends">
    <div v-if="friend.state == 'pending'"> <!-- TODO render list of blocked users -->
      {{ friend.User.name }}
      <br/>
      <Button label="Přijmout" icon="pi pi-check" @click=""></Button>
      <Button label="Odmítnout" icon="pi pi-times" @click=""></Button>
      <br/>

    </div>
  </div>

</template>
