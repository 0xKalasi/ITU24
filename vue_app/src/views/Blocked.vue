<script setup>
import { useRouter } from "vue-router";
import { readUsersFriends } from "../../utils/users_api.js";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const friends = await readUsersFriends(currentUser.id);

</script>

<template>  
  <h2>Zablokovaní uživatelé</h2>

  <!--<Button label="Příchozí" icon="pi pi-clock" @click="router.push('/requests')"></Button>-->
  <!--<Button label="Přátelé" icon="pi pi-heart" @click="router.push('/chats')"></Button>-->

  <Button label="Zpět" icon="pi pi-arrow-left" @click="router.push('/chats')"></Button>
  <br/><br/>

  <div v-for="friend in friends">
    <div v-if="friend.state == 'blocked'" style="margin-bottom: 50px"> <!-- TODO render list of blocked users -->
      <Message @click="router.push(`/profile/${friend.User.id}`)" severity="secondary">
        {{ friend.User.name }}
      </Message>
      <Button label="Odblokovat" icon="pi pi-lock-open"
        @click="console.log('ODBLOKOVAT')"
        style="float: right">
      </Button>
    </div>
  </div>

</template>
