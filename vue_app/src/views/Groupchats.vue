<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '../stores/userStore';

import { readUsersGroupchats } from "../../utils/groupchat_api";

const currentUser = useUserStore();

const router = useRouter();

const groupchats = await readUsersGroupchats(currentUser.id);

</script>

<template>
  <BasicPageHeader text="Skupiny"></BasicPageHeader>

  <div v-if="currentUser.id == 0">
    Pro zobrazení skupin se přihlaste.
  </div>

  <div v-else>
    <Button
      label="Vytvořit skupinu"
      icon="pi pi-plus"
      @click="console.log('VYTVOŘIT SKUPINU')"
      style="float: right">
    </Button>

    <br/><br/>

    <div v-if="groupchats.length == 0">
      Nejste členem žádné skupiny.
    </div>

    <div v-else class="devider"></div>

    <div v-for="groupchat in groupchats">
      <div style="display: flex; align-items: center;">
        <h3>{{ groupchat.name }}</h3>
        
        <Button
          label="Otevřít"
          icon="pi pi-comments"
          @click="console.log(groupchat.id)"
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

