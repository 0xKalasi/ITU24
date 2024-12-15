<!-- 
    FILE:       navigation.vue
    AUTHOR:     Tomáš Bordák, xborda01 
    DATE:       15.12.2024
    INFO:       Navigation bar that is fixed to bottom. Overlays all views. Uses navigation button to move around app.
                There is diferent nav. bar for logged in user and for NOT logged in user.
-->

<script setup>
import NavBtn from "@/components/navigation/button.vue"

import { useUserStore } from '../../stores/userStore';
const user = useUserStore();
</script>

<template>
    <ButtonGroup>
        <div v-if="user.id">
            <NavBtn path="/profile" icon="pi pi-user" />
            <NavBtn path="/" icon="pi pi-home" />
            <NavBtn path="/recipes" icon="pi pi-bookmark" />
            <NavBtn path="/chats" icon="pi pi-comments" />
        </div>
        
        <div v-else style="display: flex; justify-content: center;">
            <NavBtn path="/users" icon="pi pi-sign-in" hasLabel label="Přihlásit se" />
            <NavBtn path="/" icon="pi pi-home" />
        </div>
    </ButtonGroup>
</template>

<style scoped>
.p-buttongroup {
    position: fixed;
    bottom: 0;
    margin-bottom: 10px;
    left: 50%;
    transform: translate(-50%, 0);
    width: 250px;
}

.p-button {
    border: none;
    width: 62px;
    height: 50px;    
}
</style>