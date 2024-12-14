<!-- Martin Jabůrek, xjabur02 -->

<script setup>
import { computed } from 'vue';

import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserStore } from "../stores/userStore";
const currentUser = useUserStore();

import { acceptFriendRequest, blockUser } from "../../utils/users_api";


const props = defineProps({
  friend: Object
});


const truncateStr = computed(() => (str, max) => {
  if (str.length > max) {
    return str.substring(0, max - 3) + "...";
  } else {
    return str;
  }
});


const GoToProfile = async () => {
  router.push(`/profile/${props.friend.id}`);
}

const AcceptRequest = async () => {
  await acceptFriendRequest(currentUser.id, props.friend.id);
}

const Block = async () => {
  await blockUser(currentUser.id, props.friend.id);
}

</script>

<template>
  <ButtonGroup class="request">
    <Button
      :label="truncateStr(friend.name, 23)"
      icon="pi pi-user"
      severity="secondary"
      raised
      @click="GoToProfile"
      class="name-button">
    </Button>

    <Button
      icon="pi pi-check"
      raised
      size="large"
      @click="AcceptRequest"
      style="width: 50px">
    </Button>

    <Button
      icon="pi pi-times"
      raised
      @click="Block"
      style="width: 50px; background: crimson; border: 1px solid crimson;">
    </Button>

  </ButtonGroup>
</template>

<style scoped>
.request {
  width: 100%;
  display: flex;
  margin: 20px 0 20px 0;
}

.name-button {
  flex-grow: 1;
  justify-items: center;
}

</style>
