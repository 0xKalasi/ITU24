<!-- Tomáš Bordák, xborda01 -->

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from '../../stores/userStore';
import { getLastUsedFilters, selectFilter } from "@utils/api";

const router = useRouter();
const user = useUserStore();

// FILTERS
const filters = ref(await getLastUsedFilters(user.id));

const isLoading = ref(false);
const selectFilterById = async (id) => {
    isLoading.value = true;

    await selectFilter(user.id, id);
    getLastUsedFilters(user.id).then((res) => {
        filters.value = res;
    });

    isLoading.value = false;
}
</script>

<template>
    <div style="margin-bottom: 16px;">
        <div v-if="user.id" class="filters" style="display: flex; justify-content: center; flex-wrap: wrap; margin-top: 6px; gap: 4px;">
            <div v-if="filters.first">
                <Tag :value="filters.first.name" :icon="isLoading ? 'pi pi-spin pi-spinner': ''" @click="selectFilterById(filters.first.id)" style="cursor: pointer"/>
            </div> 
            <div v-if="filters.second">
                <Tag :value="filters.second.name" :icon="isLoading ? 'pi pi-spin pi-spinner': ''" @click="selectFilterById(filters.second.id)" style="cursor: pointer"/>
            </div> 
            <Tag value="Filtry" style="cursor: pointer;" severity="info" icon="pi pi-folder-open" @click="router.push('/filters')"/>
        </div>
    </div>
    
</template>