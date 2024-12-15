<!-- 
    FILE:       Filters.vue
    AUTHOR:     Tomáš Bordák, xborda01 
    DATE:       15.12.2024
    INFO:       View showing all user's filters. On click user selects the filter for search in recipes. By holding down the filter, options edit and remove are presented.
-->

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { useFilterStore } from '@/stores/filterStore';
import { readFilters, deleteFilter, selectFilter } from '@utils/api';

const router = useRouter();
const user = useUserStore();
const filterStore = useFilterStore();

const filters = ref(await readFilters(user.id));

// saving filter id for the filter that was touched for 1s
const showOptionsOnFilter = ref(null);

const startTime = ref(null);
const endTime = ref(null);

let timer = null;
const touchStart = (id) => {
    startTime.value = Date.now();

    timer = setTimeout(() => {
        showOptionsOnFilter.value = id;
    }, 500);
}

const touchEnd = (id, event) => {
    clearTimeout(timer);
    endTime.value = Date.now();
    
    // hold is less than 500ms -> its a click
    if(endTime.value - startTime.value < 500){
        if(event.target.tagName === 'DIV'){
            
            // clicked on message, not on span with buttons
            selectFilterById(id);
        }
    } 
}

const selectFilterById = async (id) => {
    await selectFilter(user.id, id);
    router.push("/");
}

// function to close opened options on filter if 
const closeOptions = (event) => {
    const filterWithOpenedOptions = document.getElementById(showOptionsOnFilter.value);

    // hide options when user clicks outside the filter 
    // contains method checks if the clicked element is the filter or its descedant HTML nodes
    if(filterWithOpenedOptions && !filterWithOpenedOptions.contains(event.target)){
        showOptionsOnFilter.value = null;
        showSureDeleteMsg.value = false; // reset delete proccess
    }
}

const delLoading = ref(false);
const delError = ref(false);
const delSuccess = ref(false);

const filterKey = ref(1);

const showSureDeleteMsg = ref(false);
const tryDelete = async (id) => {
    // if showSureDeleteMsg is false, that means its first click
    // on first click set showSureDeleteMsg to true

    // on second click delete filter
    // if showSureDeleteMsg is true, that means its second click

    // first click
    if(!showSureDeleteMsg.value){
        showSureDeleteMsg.value = true;
        return;
    }
    
    // code gets here at second click

    delLoading.value = true; // start removing animation

    if(await deleteFilter(id)){
        delSuccess.value = true;
        filters.value = await readFilters(user.id);
    } else {
        delError.value = true;
    }

    delLoading.value = false; // stop loading animation
    showSureDeleteMsg.value = false;

    // hide success or error message 
    setTimeout(() => {
       if(delSuccess.value){
           delSuccess.value = false;
       }

       if(delError.value){
            delError.value = false;
        }
   }, 3000)
}

// add event listener for click that is send to callback func closeOptions
onMounted(() => { 
    document.addEventListener('click', closeOptions) 
    
    // hide filter saved succesfully msg after 3s
    if(filterStore.filterAddSuccess == true || filterStore.filterEditSuccess == true){
        setTimeout(() => {
            filterStore.filterAddSuccess = false;
            filterStore.filterEditSuccess = false;
        }, 3000)
    }
})

// remove ev. listener when component is unmounted from page
onUnmounted(() => { document.removeEventListener('click', closeOptions) })
</script>

<template>
    <BasicPageHeader text="Uložené filtry" backArrow />

    <div style="display: flex; flex-direction: column; justify-content: center; height: 80%;">
        <div v-if="filters.length" style="width: 100%; padding: 6px; overflow-y: auto;">
            <div v-for="filter in filters" :key="filter.id">
                <Message 
                    :id="filter.id"
                    @touchstart="touchStart(filter.id)" @touchend="touchEnd(filter.id, $event)" 
                    @mousedown="touchStart(filter.id)" @mouseup="touchEnd(filter.id, $event)"
                    severity="secondary"
                    style="position: relative; margin-top: 10px; cursor: pointer;">
                    <div class="noSelect">{{ filter.name }}</div>
                    
                    <span v-if="showOptionsOnFilter == filter.id" style="display: flex; position: absolute; right: 6px; gap: 8px; bottom: 50%; transform: translateY(50%); z-index: 10">
                        <Button :label="showSureDeleteMsg ? '' : 'Upravit'" @click.stop="router.push(`/filter/edit/${filter.id}`)" icon="pi pi-pencil" severity="" size="small"/>
                        <Button :label="showSureDeleteMsg ? 'Jste jsi jisti?' : ''" @click.stop="tryDelete(filter.id)" :icon="delLoading ? 'pi pi-spin pi-spinner': 'pi pi-trash'" severity="danger" size="small"/>
                    </span>
                </Message>
            </div> 
        </div>
        
        <div v-else style="text-align: center;">
            <h3>Zatím nemáte žádne filtry.</h3>
        </div>
        
        <div style="margin-top: 4px">
            <!-- error / success messages to inform user -->
            <div v-if=" delError || delSuccess || 
                        filterStore.filterAddSuccess || filterStore.filterEditSuccess ||
                        filterStore.filterAddError   || filterStore.filterEditError ">
                <!-- success -->
                <Message v-if="delSuccess" severity="success" icon="pi pi-check" variant="simple" size="small">Filtr byl uspěšně smazán.</Message>
                <Message v-if="filterStore.filterAddSuccess" severity="success" icon="pi pi-check" variant="simple" size="small">Filter byl úspěšně vytvořen.</Message>
                <Message v-if="filterStore.filterEditSuccess" severity="success" icon="pi pi-check" variant="simple" size="small">Filter byl úspěšně upraven.</Message>
                
                <!-- error -->
                <Message v-if="delError" severity="error" icon="pi pi-exclamation-triangle" variant="simple" size="small">Došlo k chybě, zkuste to prosím znovu.</Message>
                <Message v-if="filterStore.filterAddError" severity="error" icon="pi pi-exclamation-triangle" variant="simple" size="small">Došlo k chybě při vytváření filtru. Prosím skuste to znovu.</Message>
                <Message v-if="filterStore.filterEditError" severity="error" icon="pi pi-exclamation-triangle" variant="simple" size="small">Došlo k chybě při úpravě filtru. Prosím skuste to znovu.</Message>                
            </div>
            <!-- just to inform user how to edit or remove filter -->
            <div v-else>
                <Message v-if="filters.length" severity="secondary" icon="pi pi-info-circle" variant="simple" size="small">Podržte filter pro úpravu nebo smazání.</Message>
            </div>
        </div>
    

        <div style="width: 100%; margin-top: 24px; text-align: center;">
            <Button @click="router.push('/filter/create')" icon="pi pi-plus" :label="filters.length != 0 ? 'Přidat filter' : 'Vytvořit filter'"/> 
        </div>
    </div>
</template>

<style scoped>
.noSelect {
    /* dont allow user to select text, because we want to catch the hold */
    -webkit-touch-callout:none;
    -webkit-user-select:none;
    -khtml-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    -webkit-tap-highlight-color:rgba(0,0,0,0);
}

/* class to disable clicks on filter when options are seen (so there isnt double click event - on filter and option) */
.disabled {
    pointer-events: none
}
</style>