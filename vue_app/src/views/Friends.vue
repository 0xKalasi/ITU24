<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import {
  readUsersFriends,
  readUsersRequests,
  readUsersBlocked,
  acceptFriendRequest,
  blockUser,
  unblockUser
} from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";


const friends = ref([]);
const friendRequests = ref([]);
const blockedUsers = ref([]);

let friendListChanges;
let friendRequestChanges;
let blockedUsersChanges;
onMounted(async () => {
  friends.value = await readUsersFriends(currentUser.id);
  friendRequests.value = await readUsersRequests(currentUser.id);
  blockedUsers.value = await readUsersBlocked(currentUser.id);

  // Update every time the relation changes
  friendListChanges = await createSubscription("UPDATE", "FriendStatus", async () => {
    friends.value = await readUsersFriends(currentUser.id);
    friendRequests.value = await readUsersRequests(currentUser.id);
    blockedUsers.value = await readUsersBlocked(currentUser.id);
  });
});
onUnmounted(async () => {
  await removeSubscription(friendListChanges);
  await removeSubscription(friendRequestChanges);
  await removeSubscription(blockedUsersChanges);
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

const GoToProfile = async (id) => {
  router.push(`/profile/${id}`);
}

const GoToChat = async (id) => {
  router.push(`/chats/${id}`);
}

const AcceptRequest = async (id) => {
  await acceptFriendRequest(currentUser.id, id);
}

const Block = async (id) => {
  await blockUser(currentUser.id, id);
}

const UnBlock = async (id) => {
  await unblockUser(currentUser.id, id);
}

const selected = ref("Chaty");

const ChangeListed = (which) => {
  selected.value = which;
}

const SetHighlight = computed(() => (which) => {
  return (selected.value == which) ? "primary" : "secondary";
});

const PendingCount = computed(() => {
  return (friendRequests.value.length == 0) ? "" : String(friendRequests.value.length);
});

const GetBadgeSeverity = computed(() => (which) => {
  return (selected.value == which) ? "secondary" : "contrast";
});

</script>

<template>
  <BasicPageHeader text="Konverzace"></BasicPageHeader>

  <div v-if="IsLoggedOut">
    Pro zobrazení chatů se přihlaste.
  </div>

  <div v-else>

    <ButtonGroup>
      <Button
        label="Příchozí"
        :badge="PendingCount"
        :badgeSeverity="GetBadgeSeverity('Příchozí')"
        :severity="SetHighlight('Příchozí')"
        @click="ChangeListed('Příchozí')">
      </Button>
      <Button
        label="Chaty"
        :severity="SetHighlight('Chaty')"
        @click="ChangeListed('Chaty')">
      </Button>
      <Button
        label="Zablokované"
        :severity="SetHighlight('Zablokované')"
        @click="ChangeListed('Zablokované')">
      </Button>
    </ButtonGroup>

    <Divider></Divider>

    <Button
      label="Groupchaty"
      icon="pi pi-comments"
      @click="GoToGroupchats">
    </Button>

    <Divider></Divider>

    <!-- PENDING REQUEST -->

    <div v-if="selected == 'Příchozí'">
      
      <div
        v-if="friendRequests.length == 0"
        style="margin-top: 20px;">
        Nemáte žádné žádosti o přátelství.
      </div>

      <div v-else>
        <div v-for="request in friendRequests">
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

    </div>

    <!-- MY FRIENDS -->

    <div v-if="selected == 'Chaty'">
      
      <div
        v-if="friends.length == 0"
        style="margin-top: 20px;">
        Seznam přátel je prázdný. Spojte se se svými známými nebo si vytvořte skupinu!
      </div>

      <div v-else>
        <div v-for="friend in friends">
          <Message
            severity="secondary"
            @click="GoToProfile(friend.id)">
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

    </div>

    <!-- BLOCKED USERS -->

    <div v-if="selected == 'Zablokované'">
      
      <div
        v-if="blockedUsers.length == 0"
        style="margin-top: 20px;">
        Seznam zablokovaných uživatelů je prázdný.
      </div>

      <div v-else>
        <div v-for="blocked in blockedUsers">
          <Message
            severity="secondary"
            @click="GoToProfile(blocked.id)">
            {{ blocked.name }}
          </Message>

          <Button
            label="Odblokovat"
            icon="pi pi-lock-open"
            @click="UnBlock(blocked.id)"
            style="margin-bottom: 5px;">
          </Button>
        </div>
      </div>

    </div>

  </div>

</template>
