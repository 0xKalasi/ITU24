<!-- Martin Jabůrek, xjabur02 -->
<!-- DEPRECATED - functionality in Friends.vue -->

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readUsersRequests, acceptFriendRequest, blockUser } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";

const friendRequests = ref([]);

let friendRequestChanges;
onMounted(async () => {
  friendRequests.value = await readUsersRequests(currentUser.id);

  friendRequestChanges = await createSubscription("UPDATE", "FriendStatus", async () => {
    friendRequests.value = await readUsersRequests(currentUser.id);
  });
});
onUnmounted(async () => {
  await removeSubscription(friendRequestChanges);
});

const GoToProfile = async (id) => {
  router.push(`/profile/${id}`);
}

const AcceptRequest = async (id) => {
  await acceptFriendRequest(currentUser.id, id);
} 

const Block = async (id) => {
  await blockUser(currentUser.id, id);
}

</script>

<template>  
  <BasicPageHeader text="Žádosti o přátelství"></BasicPageHeader>

  <div v-if="friendRequests.length == 0">
    Nemáte žádné žádosti o přátelství.
  </div>

  <div v-else>
    <div
      v-for="request in friendRequests"
      style="margin-bottom: 15px;">
      <Message
        severity="secondary"
        @click="GoToProfile(request.id)">
        {{ request.name }}
      </Message>

      <Button
        label="Přijmout"
        icon="pi pi-check"
        @click="AcceptRequest(request.id)"
        style="float: left; margin-top: 5px;">
      </Button>

      <Button 
        label="Odmítnout"
        icon="pi pi-times"
        @click="Block(request.id)"
        style="float: right; margin-top: 5px;">
      </Button>
      <br/><br/>
    </div>
  </div>

</template>
