<script setup>
import { useRouter } from "vue-router";
import { readUsersFriends } from "../../utils/users_api.js";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const friends = await readUsersFriends(currentUser.id);

</script>

<template> 
  <div style="display: flex; align-items: center">
    <h2>Přátelé</h2>

    <Button label="Groupchaty" icon="pi pi-comments"
      @click="console.log('GROUPCHATS')"
      style="margin-left: auto">
    </Button>
  </div>

  <div v-if="currentUser.id == 0">
    Pro zobrazení chatů se přihlaste.
  </div>

  <div v-else>
    <Button label="Příchozí" icon="pi pi-clock" @click="router.push('/requests')"></Button> <!-- TODO badge with req. cnt. -->
    <Button label="Zablokované" icon="pi pi-times" @click="router.push('/blocked')"></Button>
    <br/><br/>

    <div v-for="friend in friends">
      <div v-if="friend.state == 'accepted'" style="margin-bottom: 50px"> <!-- TODO render list of blocked users -->
        <Message @click="router.push(`/profile/${friend.User.id}`)" severity="secondary">
          {{ friend.User.name }}
        </Message>
        <Button label="Chat" icon="pi pi-comment"
          @click="router.push(`/chats/${friend.User.id}`)"
          style="float: right">
        </Button>
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
