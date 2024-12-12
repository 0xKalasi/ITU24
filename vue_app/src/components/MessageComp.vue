<!-- Martin Jabůre, xjabur02 -->

<script setup>
import { computed } from "vue";

import { useRouter } from 'vue-router';
const router = useRouter();

import { useUserStore } from "../stores/userStore";
const currentUser = useUserStore();


const props = defineProps({
  message: Object
});

const GoToRecipe = async () => {
  if (props.message.recipe_id != null) {
    router.push(`/recipe/public/${props.message.recipe_id}`)
  }
}

const WhoPosted = computed(() => {
  return (props.message.person_posted == currentUser.id) ? "sent-by-me" : "sent-by-other";
});

</script>

<template>
  <Card :class="WhoPosted" @click="GoToRecipe">
    <template #title>
      <div v-if="message.recipe_id != null">
        <Divider style="margin-bottom: 10px;"></Divider>
        {{ message.Recipe.name }}
        <Divider style="margin-top: 10px;"></Divider>
      </div>
    </template>

    <template #subtitle>
      <!-- Show name only for others massages and do so only in groupchats -->
      <div v-if="(message.person_posted != currentUser.id) && (message.groupchat_id != null)">
        {{ message.User.name }}
      </div>
    </template>

    <template #content>
      {{ message.content }}
    </template>
  </Card>

</template>

<style scoped>
.sent-by-me {
  margin-bottom: 10px;
  margin-top: 10px;
  width: 250px;
  margin-left: auto;
}

.sent-by-other {
  margin-bottom: 10px;
  margin-top: 10px;
  width: 250px;
}

</style>
