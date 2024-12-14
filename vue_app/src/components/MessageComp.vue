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

// Show name only for massages of others and do so only in groupchats
const ShowName = computed(() => {
  return (props.message.person_posted != currentUser.id) && (props.message.groupchat_id != null);
});

</script>

<template>
  <Card
    :class="WhoPosted"
    @click="GoToRecipe">
    <template #title> <!-- only set when there is a recipe associated with the message -->
      <div v-if="message.recipe_id != null">
        <Divider style="margin-bottom: 10px;"></Divider>
        {{ message.Recipe.name }}
        <Divider style="margin-top: 10px;"></Divider>

      </div>
    </template>

    <template #subtitle>
      <div v-if="ShowName">
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
  background: linear-gradient(to top, aquamarine, rgb(47, 131, 96));
  color: black;
}

.sent-by-other {
  margin-bottom: 10px;
  margin-top: 10px;
  width: 250px;
  background: linear-gradient(to top, rgb(20, 20, 20), black);
}

</style>
