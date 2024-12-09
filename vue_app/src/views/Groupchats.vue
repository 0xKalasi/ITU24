<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '../stores/userStore';

import { readUsersGroupchats, createGroupchat } from "../../utils/groupchat_api";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";

import { ref, onMounted, onUnmounted } from "vue";

const currentUser = useUserStore();

const router = useRouter();

const groupchats = ref([]);

let groupsChanges;
onMounted(async () => {
  groupchats.value = await readUsersGroupchats(currentUser.id);

  groupsChanges = await createSubscription("*", "GroupchatMembers", async () => {
    groupchats.value = await readUsersGroupchats(currentUser.id);
  });
});
onUnmounted(() => {
  removeSubscription(groupsChanges);
});

const createGroup = ref(true);
const newGroupName = ref("");

</script>

<template>
  <BasicPageHeader text="Skupiny"></BasicPageHeader>

  <div v-if="currentUser.id == 0">
    Pro zobrazení skupin se přihlaste.
  </div>

  <div v-else>

    <div v-if="createGroup == true"> <!-- Just show the group button -->
      <Button
        label="Přátelé"
        icon="pi pi-comment"
        @click="router.push(`/chats`)">
      </Button>
      <Button
        label="Vytvořit skupinu"
        icon="pi pi-plus"
        @click="createGroup = !createGroup"
        style="float: right">
      </Button>

      <br/><br/>
    </div>
    <div v-else>
      <Button
        label="Zrušit"
        icon="pi pi-times"
        @click="createGroup = !createGroup"
        style="float:right">
      </Button>
      <br/><br/>

      <div class="devider"></div>

      <div style="display: flex; align-items: center;">
        <input v-model="newGroupName" style="margin-top: 20px; margin-bottom: 20px;"/>

        <Button
          icon="pi pi-check"
          @click="createGroupchat(newGroupName); newGroupName = ''; createGroup = !createGroup; "
          style="margin-left: auto">
        </Button>
      </div>

      <div v-if="groupchats.length == 0"> <!-- Only when there are no groupchats, to make prettier -->
        <div class="devider"></div>
        <br/>
      </div>
    </div>

    <div v-if="groupchats.length == 0">
      Nejste členem žádné skupiny.
    </div>

    <div v-else class="devider"></div>

    <div v-for="groupchat in groupchats">
      <div style="display: flex; align-items: center;">
        <h3>{{ groupchat.name }}</h3>
        <!-- TODO MEMBER COUNT -->

        <Button
          label="Otevřít"
          icon="pi pi-comments"
          @click="router.push(`/groupchats/${groupchat.id}`)"
          style="margin-left: auto">
        </Button>
      </div>

      <div class="devider"></div>
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

