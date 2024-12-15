<!-- Tomáš Bordák, xborda01 -->

<script setup>
import { ref, toRaw, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useFilterStore } from '@/stores/filterStore';
import { readFilterById, readFilterAlergens, readFilterCategories, editFilter } from '@utils/api';

import BasicHeader from '@/components/basicPageHeader.vue';
import AlergensPick from '@/components/filters/alergensPick.vue';
import CategoriesPick from '@/components/filters/categoriesPick.vue'; 
import LoadingScreen from '../../components/loadingScreen.vue';

const router = useRouter();
const filterId = router.currentRoute.value.params.filter_id;

const user = useUserStore();
const filterStore = useFilterStore();

const name = ref();
const keyword = ref();
const selectedAlergens = ref([]);
const selectedCategories = ref([]);
const isLoading = ref(false);

const loadData = async () => {
    isLoading.value = true;

    // get filter
    const filter = await readFilterById(filterId);
    name.value = filter.name;
    keyword.value = filter.key_word;
    
    // get filter's alergens and push their id's to selectedAlergens array
    const filterAlergens = await readFilterAlergens(filterId);
    for(let alergen of filterAlergens){
        selectedAlergens.value.push(alergen.alergen);
    }
    
    // the same with filter's categories
    const filterCategories = await readFilterCategories(filterId);
    for(let category of filterCategories){
        selectedCategories.value.push(category.category);
    }

    isLoading.value = false;
}


// not let user post edited filter with empty name
const showWarnMsg = ref(false);
const savingFilter = ref(false);

const filterNameInput = () => {
    showWarnMsg.value = false;
}

const editFilterFunc = async () => {
    if(!name.value){
        showWarnMsg.value = true;
        document.getElementById("filter_name").focus();
        return;
    }

    savingFilter.value = true;
    editFilter(
        filterId,
        name.value,
        toRaw(selectedAlergens.value),
        toRaw(selectedCategories.value),
        keyword.value
    ).then((result) => {
        savingFilter.value = false;

        // to show result of edit in /filters
        if(result === false){
            filterStore.filterEditError = true;
        }else {
            filterStore.filterEditSuccess = true;
        }
        
        router.back();
    })
}

onBeforeMount(async () => {
    await loadData();
})
</script>

<template>
    <LoadingScreen v-if="isLoading"/>
    <div v-else>
        <BasicPageHeader text="Upravení filtru" backArrow />

        <!-- NAME -->
        <h3>Název *</h3>
        <div style="margin: 0 16px;">
            <InputText id="filter_name" v-model="name" @input="filterNameInput" placeholder="Zadejte název" :invalid="showWarnMsg" style="width: 100%;" />
           
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
            <Button label="Uložit" :icon="savingFilter ? 'pi pi-spin pi-spinner': 'pi pi-check'"  @click="editFilterFunc()" />
        </div>
    </div>

</template>