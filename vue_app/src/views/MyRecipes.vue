<script setup>
    import { useUserStore } from '../stores/userStore';
    import NavigationButton from "../components/navigationButton.vue";
    import { useRouter } from "vue-router";
    const currentUser = useUserStore();
    const router = useRouter();
</script>

<template>
    
    <div v-if="currentUser.id == 0">
        <h2>Musíte být přihlášen pro zobrazení receptú</h2>
        <NavigationButton :showOnlyBackBtn="false"></NavigationButton>
    </div>
    <div v-else>
        <Button type="button" label="AddRecipe" @click="router.push('/addnewrecipe')"/>
    </div>
  
  </template>