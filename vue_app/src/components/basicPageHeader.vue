<!-- Tomáš Bordák, xborda01 -->

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

defineProps({
    text: String,
    backArrow: Boolean
})
</script>

<template>
    <div style="display: flex; align-items: center; min-width: 320px">
        <Button v-if="backArrow" @click="router.back" icon="pi pi-chevron-left" style="height: 35px; width: 35px; margin-right: 10px; background-color: transparent; color: white; border: 0px;"/>
        <h2 style="max-width: 240px;">{{ text }}</h2>
    </div> 
</template>
