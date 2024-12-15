<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref, onBeforeMount } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();


import { readGroupchat, readGroupchatMembers, addUserToGroup } from "../../utils/groupchat_api";
import { readUsersFriends } from "../../utils/users_api";


const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);


let friends;
let members;
let isInGroup;

const GetGroupMembers = async () => {
  friends = await readUsersFriends(currentUser.id);
  members = await readGroupchatMembers(currentGroup.id);
  isInGroup = ref(
    friends.reduce((arr, friend) => {
      for (const member of members) {
        if (member.id == friend.id) {
          arr[friend.id] = false;
          return arr;
        }
      }

      arr[friend.id] = true;
      return arr;
    }, {})
  );
}

const isLoading = ref(false);

const LoadData = async () => {
  isLoading.value = true;
  GetGroupMembers()
  .then(async (result) => {
    isLoading.value = false;
  });
}

onBeforeMount(async () => {
  await LoadData();
});


// Alert:
const addedMember = ref(false);
const addedMemberKey = ref(0);

const AddToGroup = async (id) => {
  addedMember.value = true;
  addedMemberKey.value++;
  await addUserToGroup(id, currentGroup.id);
  isInGroup.value[id] = false;
}

</script>

<template>
  <Alert
    v-if="addedMember"
    type="success" 
    text="Nový člen přidán do skupiny."
    :key="addedMemberKey">
  </Alert>

  <LoadingScreen v-if="isLoading"></LoadingScreen>

  <div v-else>

    <BasicPageHeader text="" backArrow></BasicPageHeader> <!-- Only for the back button, the text itself will be lower -->

    <h2>
      Přídat členy do skupiny {{ currentGroup.name }}
    </h2>
    
    <Divider></Divider>

    <div style="position: relative; overflow-y: auto; height: calc(100vh - 300px);">
      <div
        v-for="friend in friends"
        style="margin-top: 10px;">

        <div style="margin-bottom: 10px; display: flex; align-items: center;">
          <b>
            -> {{ friend.name }}
          </b>

          <div style="display: flex; flex: 1; justify-content: end;">
            <Button
              v-if="isInGroup[friend.id]"
              label="Přidat"
              icon="pi pi-plus"
              @click="AddToGroup(friend.id)">
            </Button>

            <Button
              v-else
              label="Už je členem skupiny"
              severity="secondary"
              size="small"
              style="pointer-events: none;">
            </Button>
          </div>
        </div>
      </div>
    </div>

    <Divider></Divider>

  </div>

</template>
