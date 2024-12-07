<script setup>
import { useRouter } from "vue-router";
import { readUsersFriends, blockUser } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";

import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const friends = ref([]);

let friendListChanges;
onMounted(async () => {
  friends.value = await readUsersFriends(currentUser.id);

  friendListChanges = await createSubscription("UPDATE", "FriendStatus", async () => {
    friends.value = await readUsersFriends(currentUser.id);
  });
});
onUnmounted(() => {
  removeSubscription(friendListChanges);
});

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

    <div v-if="friends.length == 0">
      Seznam přátel je prázdný.
    </div>

    <div v-for="friend in friends">
      <Message @click="router.push(`/profile/${friend.id}`)" severity="secondary">
        {{ friend.name }}
      </Message>

      <Button
        label="Zablokovat"
        icon="pi pi-lock"
        @click="blockUser(currentUser.id, friend.id)"
        style="float: left">
      </Button>

      <Button
        label="Chat"
        icon="pi pi-comment"
        @click="router.push(`/chats/${friend.id}`)"
        style="float: right">
      </Button>
      <br/><br/>
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
