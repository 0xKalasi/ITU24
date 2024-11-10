<script setup>
import { useRouter } from "vue-router";
import { readUsersFriends } from "../../utils/users_api.js";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const friends = await readUsersFriends(currentUser.id);

</script>

<template>  
  <h2>Přátelé</h2>

  <div v-if="currentUser.id == 0">
    Pro zobrazení chatů se přihlaste.
  </div>

  <div v-else>
    <Button label="Nevyřízené" icon="pi pi-clock"></Button>
    <Button label="Zablokované" icon="pi pi-times"></Button>
    <br/><br/>

    <div v-for="friend in friends">
      <div v-if="friend.state == 'accepted'"> <!-- TODO render list of blocked users -->
        {{ friend.User.name }}
        <Button label="Chat" icon="pi pi-comment" @click="router.push(`/chats/${friend.User.id}`)"></Button>

      </div>
    </div>
  </div>

</template>

<style scoped>
.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>