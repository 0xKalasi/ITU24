<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <ButtonGroup>
        <Button icon="pi pi-user" @click="router.push('/profile')"/>
        <Button icon="pi pi-home" @click="router.push('/')"/>
        <Button icon="pi pi-bookmark" @click="router.push('/recipes')"/>
        <Button icon="pi pi-comments" @click="router.push('/chats')"/>
    </ButtonGroup>
</template>

<style scoped>
.p-buttongroup{
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