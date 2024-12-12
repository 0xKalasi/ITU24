<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserStore } from "../stores/userStore";
const currentUser = useUserStore();

import { acceptFriendRequest, blockUser } from "../../utils/users_api";

const props = defineProps({
  friend: Object
});

const GoToProfile = async (id) => {
  router.push(`/profile/${id}`);
}

const AcceptRequest = async (id) => {
  await acceptFriendRequest(currentUser.id, id);
}

const Block = async (id) => {
  await blockUser(currentUser.id, id);
}

</script>

<template>
  <ButtonGroup class="request">
    <Button
      :label="friend.name"
      severity="secondary"
      raised
      @click="GoToProfile(friend.id)"
      class="name-button">
    </Button>

    <Button
      icon="pi pi-check"
      raised
      size="large"
      @click="AcceptRequest(friend.id)"
      style="width: 50px">
    </Button>

    <Button
      icon="pi pi-times"
      severity="warn"
      raised
      @click="Block(friend.id)"
      style="width: 50px">
    </Button>

  </ButtonGroup>
</template>

<style scoped>
.request {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
}

.name-button {
  flex-grow: 1;
}

</style>
