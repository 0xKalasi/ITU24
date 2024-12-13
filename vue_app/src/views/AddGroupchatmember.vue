<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { ref } from "vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

import { readGroupchat, readGroupchatMembers, addUserToGroup } from "../../utils/groupchat_api";
import { readUsersFriends } from "../../utils/users_api";


const currentGroupId = router.currentRoute.value.params.groupchat_id;
const currentGroup = await readGroupchat(currentGroupId);

const friends = await readUsersFriends(currentUser.id);
const members = await readGroupchatMembers(currentGroup.id);
const isInGroup = ref(
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

  <BasicPageHeader text=""></BasicPageHeader>
  <h2>
    Přídat členy do skupiny {{ currentGroup.name }}
  </h2>
  
  <Divider></Divider>

  <div style="position: relative; overflow-y: auto; height: calc(100vh - 300px);">
    <div
      v-for="friend in friends"
      style="margin-top: 10px;">

      <div style="margin-bottom: 10px; display: flex; align-items: center;">
        ->
        <b style="margin-left:10px;">
          {{ friend.name }}
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

</template>
