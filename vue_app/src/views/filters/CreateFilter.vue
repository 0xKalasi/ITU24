<!-- Tomáš Bordák, xborda01 -->

<script setup>
import { ref, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { createFilter } from '@utils/api';
import { useUserStore } from '@/stores/userStore'
import { useFilterStore } from '@/stores/filterStore';

import BasicHeader from '@/components/basicPageHeader.vue';
import AlergensPick from '@/components/filters/alergensPick.vue';
import CategoriesPick from '@/components/filters/categoriesPick.vue'; 

const router = useRouter();
const user = useUserStore();
const filterStore = useFilterStore();

const filterName = ref("");
const keyword = ref("");

const selectedCategories = ref([]);
const selectedAlergens = ref([]);

const showWarnMsg = ref(false);

const savingFilter = ref(false);
const createFilterFunc = async () => {
    if(!filterName.value){
        showWarnMsg.value = true;
        document.getElementById("filter_name").focus();
        return;
    }

    savingFilter.value = true;
    createFilter(
        user.id, 
        filterName.value,
        toRaw(selectedAlergens.value), 
        toRaw(selectedCategories.value),
        keyword.value
    )
    .then((result) => {
        savingFilter.value = false;

        // show result in /filters
        if(result === false){
            filterStore.filterAddError = true;
        } else{
            filterStore.filterAddSuccess = true;
        }
        
        router.back();
    })
};

const filterNameInput = () => {
    showWarnMsg.value = false;
}

</script>

<template>
    <BasicPageHeader text="Vytváření filtru" backArrow />

    <!-- NAME -->
    <h3>Název *</h3>
    <div style="margin: 0 16px;">
        <InputText id="filter_name" v-model="filterName" @input="filterNameInput" placeholder="Vytvořte název filtru" :invalid="showWarnMsg" style="width: 100%;" />
       
        <!-- ERORR MESSAGE FOR EMPTY NAME -->
        <Message 
        tabindex="0" 
        id="filter_name_warn_msg"
        v-if="showWarnMsg" 
        severity="error" 
        icon="pi pi-exclamation-circle" 
        variant="simple" 
        size="small"
        style="margin-top: 8px;"
       >Povinné pole nevyplneno.</Message>
    </div>

    <!-- ALERGENS PICK -->
    <h3>Alergeny</h3>
    <AlergensPick v-model="selectedAlergens"/>

    <!-- KEYWORD -->
    <h3>Klíčové slovo v názvu nebo ingredience</h3>
    <div style="margin: 0 16px;">
        <InputText id="filter_keyword" v-model="keyword" placeholder="Zadejte klíčové slovo" style="width: 100%;" />
    </div>

    <!-- CATEGORIES PICK -->
    <h3>Kategorie</h3>
    <CategoriesPick v-model="selectedCategories"/>

    <!-- FLOATING SAVE FILTER BUTTON -->
   <div style="text-align: center; margin-top: 16px;">
        <Button label="Uložit" :icon="savingFilter ? 'pi pi-spin pi-spinner': 'pi pi-check'"  @click="createFilterFunc()" />
    </div>
</template>

<style scoped>
h3 {
    font-size: 20px;
}
</style>