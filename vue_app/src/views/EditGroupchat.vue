<script setup>
import { useRouter } from "vue-router";

import { readGroupchat, updateGroupName, readGroupchatMembers, removeUserFromGroup } from "../../utils/groupchat_api";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";
import { ref, onMounted, onUnmounted, nextTick } from "vue";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);

const members = ref([]);

let memberChanges;
onMounted(async () => {
  members.value = await readGroupchatMembers(currentGroup.id);

  memberChanges = await createSubscription("*", "GroupchatMembers", async () => {
    members.value = await readGroupchatMembers(currentGroup.id);
  });
});
onUnmounted(() => {
  removeSubscription(memberChanges);
});

const isCreator = (currentUser.id == currentGroup.creator) ? true : false;

const groupName = ref(currentGroup.name);
const confirmDelHist = ref(false);
const confirmDelGroup = ref(false);
const confirmLeaveGroup = ref(false);

// Alert detection:
const nameChanged = ref(false);
const nameChangedKey = ref(0);
const emptyName = ref(false);
const emptyNameKey = ref(0);

const Rename = async () => {
  if (groupName.value.length == "") {
    emptyName.value = true;
    emptyNameKey.value++;
  } else {
    nameChanged.value = true;
    nameChangedKey.value++;
    updateGroupName(currentGroup.id, groupName.value)
  }
}

const LeaveGroup = async () => {
  removeUserFromGroup(currentUser.id, currentGroup.id)
    .then(async () => {
      router.push("/groupchats");
    });
}

</script>

<template>
  <Alert v-if="nameChanged"
    type="success" 
    text="Jméno skupiny změněno."
    :key="nameChangedKey"
  />
  <Alert v-if="emptyName"
    type="warn"
    text="Chybí jméno skupiny"
    :key="emptyNameKey"
  />

  <BasicPageHeader text="Spravovat skupinu"></BasicPageHeader>
  <div class="devider"></div>

  <div v-if="currentUser.id == 0" style="margin-top: 20px">
    Pro zobrazení správy skupiny musíte být přihlášeni.
  </div>

  <!-- CREATOR VIEW -->
  <div v-else-if="isCreator">
    <!-- Rename -->
    <div style="display: flex; align-items: center; margin-top: 20px; margin-bottom: 20px;">
      <input v-model="groupName"/>
      <Button
        label="Přejmenovat"
        icon="pi pi-pencil"
        @click="Rename()">
      </Button>
    </div>

    <div class="devider"></div>

    <!-- Delete features -->
    <div v-if="(confirmDelHist == false) && (confirmDelGroup == false)"
      style="margin-top: 20px; margin-bottom: 20px; display: flex; gap: 10px">

      <Button
        label="Smazat historii zpráv"
        icon="pi pi-history"
        severity="warn"
        @click="confirmDelHist = true">
      </Button>
      <Button
        label="Odstranit skupinu"
        icon="pi pi-exclamation-circle"
        severity="danger"
        @click="confirmDelGroup = true">
      </Button>

    </div>
    <div v-else-if="confirmDelHist == true">

      <div style="color: red; margin-top: 10px;">
        Tato akce je nevratná, skutečně chcete smazat historii zpráv?
      </div>
      <div style="margin-top: 20px; margin-bottom: 20px; display: flex; gap: 10px">
        <Button
          icon="pi pi-check"
          label="Ano, smazat historii"
          severity="danger"
          @click="console.log('DELETE GROUPCHAT HISTORY')">
        </Button>
        <Button
          icon="pi pi-times"
          label="Ne, ponechat historii"
          @click="confirmDelHist = false">
        </Button>
      </div>

    </div>
    <div v-else-if="confirmDelGroup == true">

      <div style="color: red; margin-top: 10px;">
        Skutečně chcete smazat skupinu? Tato akce je nevratná.
      </div>
      <div style="margin-top: 20px; margin-bottom: 20px; display: flex; gap: 10px">
        <Button
          icon="pi pi-check"
          label="Ano, smazat"
          severity="danger"
          @click="console.log('DELETE GROUPCHAT')">
        </Button>
        <Button
          icon="pi pi-times"
          label="Ne, nemazat"
          @click="confirmDelGroup = false">
        </Button>
      </div>

    </div>

    <div class="devider"></div>

    <!-- Member managment -->
    <h3>Členové</h3>

    <div v-for="member in members">
      <b>{{ member.name }}</b>
      <Button
        icon="pi pi-minus"
        style="margin-left: 10px;"
        @click="console.log('ODEBRAT UŽIVATELE')">
      </Button>
    </div>

    <br/>

    <Button
      label="Přidat člena"
      icon="pi pi-plus"
      @click="console.log('ADD MEMBER')">
    </Button>

  </div>

  <!-- MEMBER VIEW -->
  <div v-else>

    <!-- Leave group -->
    <div v-if="confirmLeaveGroup == false">

      <Button
        icon="pi pi-times"
        label="Opustit skupinu"
        severity="danger"
        @click="confirmLeaveGroup = true"
        style="margin-top: 10px; margin-bottom: 10px;">
      </Button>

    </div>
    <div v-else>

      <div style="color: red; margin-top: 10px;">
        Skutečně chcete opustit skupinu?
      </div>
      <div style="margin-top: 20px; margin-bottom: 20px; display: flex; gap: 10px">
        <Button
          icon="pi pi-check"
          label="Ano, opustit skupinu"
          severity="danger"
          @click="LeaveGroup()">
        </Button>
        <Button
          icon="pi pi-times"
          label="Ne, neopouštět"
          @click="confirmLeaveGroup = false">
        </Button>
      </div>

    </div>

    <div class="devider"></div>

    <!-- Member view and adding -->
    <h3>Členové</h3>

    <div v-for="member in members">
      <b>{{ member.name }}</b>
    </div>

    <br/>

    <Button
      label="Přidat člena"
      icon="pi pi-plus"
      @click="console.log('ADD MEMBER')">
    </Button>

  </div>

</template>

<style scoped>
.devider {
  background-color: aquamarine;
  width: 100%;
  height: 2px;
}
</style>
