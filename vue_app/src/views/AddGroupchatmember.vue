<script setup>
import { useRouter } from "vue-router";

import { readGroupchat, readGroupchatMembers, addUserToGroup } from "../../utils/groupchat_api";
import { readUsersFriends } from "../../utils/users_api";

import { ref } from "vue";

import { useUserStore } from '../stores/userStore';
const currentUser = useUserStore();

const router = useRouter();

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
  <Alert v-if="addedMember"
    type="success" 
    text="Nový člen přidán do skupiny"
    :key="addedMemberKey"
  />

  <BasicPageHeader text=""></BasicPageHeader>
  <h2>Přídat členy do skupiny {{ currentGroup.name }}</h2>
  <div class="devider" style="margin-bottom: 20px;"></div>

  <div v-for="friend in friends">
    {{ friend.name }}

      <Button
        v-if="isInGroup[friend.id]"
        label="Přidat"
        icon="pi pi-plus"
        @click="AddToGroup(friend.id)"
        style="margin-bottom: 10px;">
      </Button>

      <Button
        v-else
        label="Už je člen skupiny"
        severity="secondary"
        size="small"
        style="margin-bottom: 10px;">
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
