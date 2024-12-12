<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readUsersFriends, readUsersRequests, readUsersBlocked } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";
import { readUsersGroupchats, createGroupchat } from "../../utils/groupchat_api.js";

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


const CreateGroupchat = ref(false);
const newGroupName = ref("");


const ToggleGroupCreation = () => {
  CreateGroupchat.value = true;
}

const CreateNewGroupchat = async () => {
  await createGroupchat(newGroupName.value);
  CreateGroupchat.value = false;
  newGroupName.value = "";
}


const menu = ref();
const items = ref([
  {
    label: "Konverzace",
    items: [
      {
        label: "Vytvořit skupinu",
        icon: "pi pi-plus",
        command: ToggleGroupCreation
      }
    ]
  }
]);

const ToggleMenu = (event) => {
  menu.value.toggle(event);
}


const selected = ref("Chaty");

</script>

<template>
  <!-- Header -->
  <div>
    <div style="position: relative; display: flex; align-items: center; min-width: 320px;">
      <BasicPageHeader text="Konverzace"></BasicPageHeader>

      <div>
        <Button 
          type="button"
          icon="pi pi-plus"
          rounded
          @click="ToggleMenu"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          style="position: absolute; top: 50%; right: 0; transform: translate(0, -50%);">
        </Button>
        <Menu
          ref="menu"
          id="overlay_menu"
          :model="items"
          :popup="true">
        </Menu>
      </div>
    </div>

    <ConvSelect
      v-model="selected"
      :requestCount="friendRequests.length">
    </ConvSelect>

    <Divider></Divider>
  </div>

  <!-- PENDING REQUEST -->

  <div v-if="selected == 'Žádosti'">
    
    <div v-if="friendRequests.length == 0">
      Nemáte žádné žádosti o přátelství.
    </div>

    <div v-else>
      <div v-for="request in friendRequests">
        <FriendRequest :friend="request"></FriendRequest>
      </div>
    </div>

  </div>

  <!-- MY CHATS -->

  <div 
    v-if="selected == 'Chaty'">
    
    <div v-if="chats.length == 0">
      Seznam konverzací je prázdný. Spojte se se svými známými nebo si vytvořte skupinu!
    </div>

    <div v-else>
      <div v-for="chat in chats">
        <ChatLink :chat="chat"></ChatLink>
      </div>
    </div>

    <div
      v-if="CreateGroupchat"
      style="display: flex; width: 100%; align-items: center; gap: 10px;">

      <InputText
        v-model="newGroupName"
        style="width: 220px">
      </InputText> <!-- TODO ENTER PRESS -->

      <ButtonGroup style="display: flex;">
        <Button
          icon="pi pi-times"
          severity="warn"
          raised
          @click="CreateGroupchat = false"
          class="name-button">
        </Button>

        <Button
          icon="pi pi-check"
          raised
          @click="CreateNewGroupchat">
        </Button>

      </ButtonGroup>
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
        <UnblockEntry :blocked="blocked"></UnblockEntry>
      </div>
    </div>

  </div>

</template>
