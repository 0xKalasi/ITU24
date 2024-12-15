<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

// Needed for confirm dialog
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();

import { 
  readGroupchat,
  updateGroupName,
  readGroupchatMembers,
  removeUserFromGroup,
  deleteGroupchatMessages,
  deleteGroupchat
} from "../../utils/groupchat_api";
import { createSubscription, removeSubscription } from "../../utils/subscription_api.js";


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
onUnmounted(async () => {
  await removeSubscription(memberChanges);
});

const isCreator = (currentUser.id == currentGroup.creator) ? true : false;

const groupName = ref(currentGroup.name);


// Alert detection:
const nameChanged = ref(false);
const nameChangedKey = ref(0);
const userRemoved = ref(false);
const userRemovedKey = ref(0);


const isInvalid = ref(false);

const Rename = async () => {
  if (groupName.value != "") {
    await updateGroupName(currentGroup.id, groupName.value);
    isInvalid.value = false;

    nameChanged.value = true;
    nameChangedKey.value++;
  } else {
    isInvalid.value = true;
  }
}

const SetValid = () => {
  isInvalid.value = false;
}


const GoToAddMembers = async () => {
  router.push(`/groupchats/add/${currentGroup.id}`)
}

const RemoveUser = async (id) => {
  await removeUserFromGroup(id, currentGroup.id);

  userRemoved.value = true;
  userRemovedKey.value++;
}

// Reject is the deletion and accept is canceling, this is done to keep the same order between button pair everywhere
const ConfirmDelHist = async () => {
  confirm.require({
    message: "Skutečně chcete smazat historii zpráv? Tato operace je nevratná.",
    header: "Potvrďte akci",
    icon: "pi pi-exclamation-circle",
    rejectProps: {
      label: "Ano, smazat",
      severity: "danger"
    },
    acceptProps: {
      label: "Ne, nemazat"
    },
    accept: () => {},
    reject: await DeleteHistory
  });
}

const ConfirmDelGroup = async () => {
  confirm.require({
    message: "Skutečně chcete odstranit skupinu? Tato operace je nevratná.",
    header: "Potvrďte akci",
    icon: "pi pi-exclamation-circle",
    rejectProps: {
      label: "Ano, odstranit",
      severity: "danger"
    },
    acceptProps: {
      label: "Ne, ponechat"
    },
    accept: () => {},
    reject: await DeleteGroupchat
  });
}


const DeleteHistory = async () => {
  await deleteGroupchatMessages(currentGroup.id);
}

const DeleteGroupchat = async () => {
  await deleteGroupchat(currentGroup.id);
  router.push("/chats");
}

</script>

<template>
  <Alert
    v-if="nameChanged"
    type="success" 
    text="Jméno skupiny změněno."
    :key="nameChangedKey">
  </Alert>
  <Alert
    v-if="userRemoved"
    type="warn"
    text="Člen odebrán ze skupiny"
    :key="userRemovedKey">
  </Alert>

  <BasicPageHeader text="Spravovat skupinu" backArrow></BasicPageHeader>

  <div>

    <!-- CREATOR VIEW -->

    <div v-if="isCreator" style="position: relative; overflow-y: auto; height: calc(100vh - 220px);">
      <Divider></Divider>

      <!-- RENAME -->
      <div
        style="display: flex; align-items: center; margin-top: 20px; margin-bottom: 20px;">
        <div>
          <InputText
            v-model="groupName"
            size="small"
            placeholder="Nový název skupiny"
            :invalid="isInvalid"
            @input="SetValid"
            @keydown.enter="Rename">
          </InputText>
          <Message
            v-if="isInvalid"
            variant="simple"
            severity="error"
            size="small">
            Není zadáno žádné jméno
          </Message>
        </div>

        <Button
          icon="pi pi-pencil"
          @click="Rename"
          style="transform: translate(50%, 0);">
        </Button>
      </div>

      <!-- DELETE FEATURES -->

      <ConfirmDialog style="width: 300px"></ConfirmDialog>

      <div style="margin-bottom: 10px; display: flex; gap: 10px">
        <Button
          label="Smazat historii zpráv"
          icon="pi pi-history"
          severity="warn"
          @click="ConfirmDelHist">
        </Button>
        <Button
          label="Odstranit skupinu"
          icon="pi pi-exclamation-circle"
          @click="ConfirmDelGroup"
          style="background: crimson; border: 1px solid crimson;">
        </Button>

      </div>

      <!-- MEMBER MANAGMENT -->

      <div style="display: flex; align-items: center; gap: 20px;">
        <h3>Členové</h3>

        <div style="display: flex; flex: 1; justify-content: end;">
          <Button
            label="Přidat členy"
            icon="pi pi-plus"
            @click="GoToAddMembers">
          </Button>
        </div>
      </div>

      <Divider></Divider>

      <div
        v-for="member in members"
        style="margin-top: 10px">

        <div style="margin-bottom: 10px; display: flex; align-items: center;">
          -> {{ member.name }}

          <div style="display: flex; flex: 1; justify-content: end;">
            <Button
              v-if="member.id != currentUser.id"
              icon="pi pi-minus"
              style="background: crimson; border: 1px solid crimson;"
              @click="RemoveUser(member.id)">
            </Button>
            <Button
              v-else
              severity="secondary"
              label="Tvůrce"
              style="pointer-events: none;">
            </Button>
          </div>
        </div>

      </div>
      
      <Divider></Divider>

    </div>

      <!-- MEMBER VIEW -->

    <div v-else>
      <!-- THIS PART WAS REPLACED BY A SUBMENU FOR USERS OPTIONS -->
      <!-- It is left here for completeness and as a safeguard, a non-creator, cannot edit the group on this page -->

    </div>

  </div>

</template>
