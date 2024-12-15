<!-- 
    FILE:       basicPageHeader.vue
    AUTHOR:     Tomáš Bordák, xborda01 
    DATE:       15.12.2024
    INFO:       Page header that goes to top of every page. Can have back button (arrow) to go back in app routing. 
-->

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
