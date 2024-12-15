<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from '../../stores/userStore';

const router = useRouter();
const user = useUserStore();

//const filters = ref();

onBeforeMount(async () => {
    
})

</script>

<template>
    <div style="margin-bottom: 16px;">
        <div v-if="user.id" class="filters" style="display: flex; justify-content: center; flex-wrap: wrap; margin-top: 6px; gap: 4px;">
            <Tag value="Mleko a vejce" style="cursor: pointer"/>
            <Tag value="Bez lepku" style="cursor: pointer"/>
            <Tag value="Filtry" style="cursor: pointer;" severity="info" icon="pi pi-folder-open" @click="router.push('/filters')"/>
        </div>
    </div>
    
</template>