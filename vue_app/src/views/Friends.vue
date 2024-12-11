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
import { readUsersGroupchats } from "../../utils/groupchat_api.js";

const friends = ref([]);
const friendRequests = ref([]);
const blockedUsers = ref([]);
const groupchats = ref([]);

let friendListChanges;
let friendRequestChanges;
let blockedUsersChanges;
let groupsChanges;
onMounted(async () => {
  friends.value = await readUsersFriends(currentUser.id);
  friendRequests.value = await readUsersRequests(currentUser.id);
  blockedUsers.value = await readUsersBlocked(currentUser.id);
  groupchats.value = await readUsersGroupchats(currentUser.id);

  await ConstructChatList();

  // Update every time the relation changes
  friendListChanges = await createSubscription("UPDATE", "FriendStatus", async () => {
    friends.value = await readUsersFriends(currentUser.id);
    friendRequests.value = await readUsersRequests(currentUser.id);
    blockedUsers.value = await readUsersBlocked(currentUser.id);

    await ConstructChatList();
  });

  // Update on group membership changes
  groupsChanges = await createSubscription("*", "GroupchatMembers", async () => {
    groupchats.value = await readUsersGroupchats(currentUser.id);

    await ConstructChatList();
  });
});
onUnmounted(async () => {
  await removeSubscription(friendListChanges);
  await removeSubscription(friendRequestChanges);
  await removeSubscription(blockedUsersChanges);
  await removeSubscription(groupsChanges);
});


const chats = ref([]);

// Friend and group chats are shown together as is customary
// Here they are put together, differentiated and sorted
const ConstructChatList = async () => {
  friends.value.forEach(friend => {
    friend.is_groupchat = false;
  });
  groupchats.value.forEach(groupchat => {
    groupchat.is_groupchat = true;
  });

  chats.value = [...friends.value, ...groupchats.value];
  chats.value.sort((x, y) => new Date(x.created_at) - new Date(y.created_at));
}


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

</script>

<template>
  <BasicPageHeader text="Konverzace"></BasicPageHeader>

  <ConvSelect
    v-model="selected"
    :requestCount="friendRequests.length">
  </ConvSelect>

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

  <!-- MY CHATS -->

  <div v-if="selected == 'Chaty'">
    
    <div v-if="chats.length == 0">
      Seznam konverzací je prázdný. Spojte se se svými známými nebo si vytvořte skupinu!
    </div>

    <div v-else>

      <div v-for="chat in chats">
        <ChatLink :chat="chat"></ChatLink>

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

</template>
