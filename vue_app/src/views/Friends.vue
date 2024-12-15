<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, computed, onMounted, onUnmounted, onBeforeMount, nextTick } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore, chatsSelectedStore, Options } from '../stores/userStore';
const currentUser = useUserStore();
const selected = chatsSelectedStore();


import { readUsersFriends, readUsersRequests, readUsersBlocked } from "../../utils/users_api.js";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";
import { readUsersGroupchats, createGroupchat } from "../../utils/groupchat_api.js";


const friends = ref([]);
const friendRequests = ref([]);
const blockedUsers = ref([]);
const groupchats = ref([]);

let friendListChanges;
let groupsChanges;
onMounted(async () => {
  // Update every time the relations change
  friendListChanges = await createSubscription("*", "FriendStatus", async () => {
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
  await removeSubscription(groupsChanges);
});


const chats = ref([]);

// Friend and group chats are shown together as is customary
// Here they are differentiated, put together, and sorted
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


const isLoading = ref(false);

const LoadAllData = async () => {
  friends.value = await readUsersFriends(currentUser.id);
  friendRequests.value = await readUsersRequests(currentUser.id);
  blockedUsers.value = await readUsersBlocked(currentUser.id);
  groupchats.value = await readUsersGroupchats(currentUser.id);

  await ConstructChatList();
}

const InitialLoad = async () => {
  isLoading.value = true;

  LoadAllData()
  .then(async (result) => {
    isLoading.value = false;
  });
}

onBeforeMount(async () => {
  await InitialLoad();
});


const CreateGroupchat = ref(false);
const newGroupName = ref("");

const ToggleGroupCreation = async () => {
  CreateGroupchat.value = true;
  await nextTick();
  document.getElementById("createGroupText").focus(); // When opening the creation, autofocus on it
}

const CreationButtonToggled = computed(() => {
  return (selected.option != Options.CHATS) ? "disable-creating p-button-secondary" : "";
});


const isInvalid = ref(false);

const CreateNewGroupchat = async () => {
  if (newGroupName.value != "") {
    await createGroupchat(newGroupName.value);
    CreateGroupchat.value = false;
    newGroupName.value = "";
  } else {
    isInvalid.value = true;
  }
}

const SetValid = () => {
  isInvalid.value = false;
}

const CancelCreatingGroupchat = () => {
  CreateGroupchat.value = false;
  isInvalid.value = false;
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


</script>



<template>
  <!-- Header -->
  <div>
    <div style="position: relative; display: flex; align-items: center; min-width: 320px;">

      <BasicPageHeader text="Konverzace" backArrow></BasicPageHeader>

      <div>
        <Button 
          type="button"
          icon="pi pi-plus"
          rounded
          @click="ToggleMenu"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          style="position: absolute; top: 50%; right: 0; transform: translate(0, -50%);"
          :class="CreationButtonToggled">
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
      v-model="selected.option"
      :requestCount="friendRequests.length">
    </ConvSelect>

    <Divider style="margin-top: 20px;"></Divider>
  </div>

  <!-- PENDING REQUEST -->

  <div
   v-if="selected.option == Options.REQUESTS"
   class="entries">
    
    <div v-if="isLoading">
      <div style="display: flex; justify-content: center;">
        <i class="pi pi-spin pi-th-large" style="font-size: 2rem; position: absolute; margin-top: 70%;"></i>
      </div>
    </div>

    <div v-else>
      <div
        v-if="friendRequests.length == 0"
        class="empty-notif">
        Nemáte žádné žádosti o přátelství.
      </div>

      <div v-else>
        <div v-for="request in friendRequests">
          <FriendRequest :friend="request"></FriendRequest>
        </div>
      </div>

    </div>

  </div>

  <!-- MY CHATS -->

  <div
    v-if="selected.option == Options.CHATS"
    class="entries">
    
    <div v-if="isLoading">
      <div style="display: flex; justify-content: center;">
        <i class="pi pi-spin pi-th-large" style="font-size: 2rem; position: absolute; margin-top: 70%;"></i>
      </div>
    </div>

    <div v-else>
      <div
        v-if="chats.length == 0"
        class="empty-notif">
        Seznam konverzací je prázdný. Spojte se se svými známými nebo si vytvořte skupinu!
      </div>

      <div v-else>
        <div
          v-if="CreateGroupchat"
          style="display: flex; gap: 10px; margin-top: 20px;">

          <!-- CREATING NEW GROUP -->
          
          <div>
            <InputText
              id="createGroupText"
              v-model="newGroupName"
              size="large"
              placeholder="Nová skupina"
              :invalid="isInvalid"
              @input="SetValid"
              @keydown.enter="CreateNewGroupchat"
              style="width: calc(320px - 100px - 10px)"> <!-- (width of entry) - (width of buttons) - (width of space in between) -->
            </InputText>
            <Message
              v-if="isInvalid"
              variant="simple"
              severity="error"
              size="small">
              Není zadáno žádné jméno
            </Message>
          </div>

          <ButtonGroup>
            <Button
              icon="pi pi-check"
              raised
              size="large"
              @click="CreateNewGroupchat"
              style="width: 50px">
            </Button>

            <Button
              icon="pi pi-times"
              raised
              size="large"
              @click="CancelCreatingGroupchat"
              severity="danger"
              style="width: 50px">
            </Button>

          </ButtonGroup>
        </div>

        <div v-for="chat in chats">
          <ChatLink :chatWith="chat"></ChatLink>
        </div>

      </div>

    </div>

  </div>

  <!-- BLOCKED USERS -->

  <div
    v-if="selected.option == Options.BLOCKED"
    class="entries">

    <div v-if="isLoading">
      <div style="display: flex; justify-content: center;">
        <i class="pi pi-spin pi-th-large" style="font-size: 2rem; position: absolute; margin-top: 70%;"></i>
      </div>
    </div>
    
    <div v-else>
      <div
        v-if="blockedUsers.length == 0"
        class="empty-notif">
        Seznam zablokovaných uživatelů je prázdný.
      </div>

      <div v-else>
        <div v-for="blocked in blockedUsers">
          <UnblockEntry :blocked="blocked"></UnblockEntry>
        </div>
      </div>

    </div>

  </div>

  <Divider position="absolute"></Divider>

</template>


<style scoped>
.entries {
  position: relative;
  overflow-y: auto;
  height: calc(100vh - 180px - 100px);
}

.empty-notif {
  width: 320px;
  margin-top: 10px;
}

.disable-creating {
  pointer-events: none;
}

</style>
