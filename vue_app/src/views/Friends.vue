<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readUsersFriends, blockUser } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";


const friends = ref([]);

let friendListChanges;
onMounted(async () => {
  friends.value = await readUsersFriends(currentUser.id);

  // Update => I blocked someone
  friendListChanges = await createSubscription("UPDATE", "FriendStatus", async () => {
    friends.value = await readUsersFriends(currentUser.id);
  });
});
onUnmounted(async () => {
  await removeSubscription(friendListChanges);
});

const IsLoggedOut = computed (() => {
  return currentUser.id == 0;
});

const GoToGroupchats = async () => {
  router.push("/groupchats");
}

const GoToRequests = async () => {
  router.push("/requests");
}

const GoToBlocked = async () => {
  router.push("/blocked");
}

const GoToFriendProfile = async (id) => {
  router.push(`/profile/${id}`);
}

const GoToChat = async (id) => {
  router.push(`/chats/${id}`);
}

const Block = async (id) => {
  await blockUser(currentUser.id, id);
}

</script>

<template> 
  <BasicPageHeader text="Přátelé"></BasicPageHeader>

  <div v-if="IsLoggedOut">
    Pro zobrazení chatů se přihlaste.
  </div>

  <div v-else>
    <Button
      label="Groupchaty"
      icon="pi pi-comments"
      @click="GoToGroupchats"
      style="margin-bottom: 20px;">
    </Button>

    <Divider></Divider>

    <div style="margin-top: 20px; margin-bottom: 20px;">
      <Button
        label="Příchozí"
        icon="pi pi-clock"
        @click="GoToRequests">
      </Button> <!-- TODO badge with req. cnt. -->
      <Button
        label="Zablokované"
        icon="pi pi-times"
        @click="GoToBlocked"
        style="float: right;">
      </Button>
    </div>

    <Divider></Divider>

    <div
      v-if="friends.length == 0"
      style="margin-top: 20px;">
      Seznam přátel je prázdný.
    </div>

    <div
      v-for="friend in friends"
      style="margin-top: 20px;">
      <Message
        @click="GoToFriendProfile(friend.id)"
        severity="secondary">
        {{ friend.name }}
      </Message>

      <Button
        label="Zablokovat"
        icon="pi pi-lock"
        @click="Block(friend.id)"
        style="float: left; margin-top: 5px;">
      </Button>

      <Button
        label="Chat"
        icon="pi pi-comment"
        @click="GoToChat(friend.id)"
        style="float: right; margin-top: 5px;">
      </Button>
      <br/><br/>
    </div>
  </div>

</template>
