<script setup>
import { useRouter } from "vue-router";
import { readUsersRequests, acceptFriendRequest, blockUser } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";

import { ref, onMounted, onUnmounted } from "vue";
import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const friendRequests = ref([]);

let friendRequestChanges;
onMounted(async () => {
  friendRequests.value = await readUsersRequests(currentUser.id);

  friendRequestChanges = await createSubscription("UPDATE", "FriendStatus", async () => {
    friendRequests.value = await readUsersRequests(currentUser.id);
  });
});
onUnmounted(() => {
  removeSubscription(friendRequestChanges);
});

</script>

<template>  
  <h2>Žádosti o přátelství</h2>

  <Button label="Zpět" icon="pi pi-arrow-left" @click="router.push('/chats')"></Button>
  <br/><br/>

  <div v-if="friendRequests.length == 0">
    Nemáte žádné žádosti o přátelství.
  </div>

  <div v-else v-for="request in friendRequests">
    <Message @click="router.push(`/profile/${request.id}`)" severity="secondary">
      {{ request.name }}
    </Message>
    <Button style="float: left" label="Přijmout" icon="pi pi-check" @click="acceptFriendRequest(currentUser.id, request.id)"></Button>
    <Button style="float: right" label="Odmítnout" icon="pi pi-times" @click="blockUser(currentUser.id, request.id)"></Button>
    <br/><br/>
  </div>

</template>
