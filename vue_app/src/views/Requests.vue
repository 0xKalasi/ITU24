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

  <!--<Button label="Přátelé" icon="pi pi-heart" @click="router.push('/chats')"></Button>-->
  <!--<Button label="Zablokované" icon="pi pi-times" @click="router.push('/blocked')"></Button>-->

  <Button label="Zpět" icon="pi pi-arrow-left" @click="router.push('/chats')"></Button>
  <br/><br/>

  <div v-for="friend in friends">
    <div v-if="friend.state == 'pending'" style="margin-bottom: 50px"> <!-- TODO render list of blocked users -->
      <Message @click="router.push(`/profile/${friend.User.id}`)" severity="secondary">
        {{ friend.User.name }}
      </Message>
      <Button label="Přijmout" icon="pi pi-check" @click="console.log('PŘIJMOUT')"></Button>
      <Button label="Odmítnout" icon="pi pi-times" @click="console.log('ODMÍTNOUT')"></Button>
      <br/>

    </div>
  </div>

</template>
