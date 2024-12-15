<!-- Tomáš Bordák, xborda01 -->

<script setup>
  import { ref, onMounted, onUnmounted} from 'vue';
  import { useUserStore } from '../stores/userStore';
  import { useRouter } from "vue-router";
  import { getSavedRecipes, readUsersPublicRecipe } from '../../utils/api';
  import { deleteRecipe } from '../../utils/add_recipe_api'
  
  const currentUser = useUserStore();
  const router = useRouter();

  const savedRecipes = await getSavedRecipes(currentUser.id);
  const usersRecipes = ref(await readUsersPublicRecipe(currentUser.id));

  console.log(usersRecipes);

  const startTime = ref(null);
const endTime = ref(null);
const showSureDeleteMsg = ref(false);
const delLoading = ref(false);
// saving filter id for the filter that was touched for 1s
const showOptionsOnRecipe = ref(null);
let pressTimer = null;

const touchStart = (id) => {
  // Start a timer that will trigger after 500ms
  pressTimer = setTimeout(() => {
    showOptionsOnRecipe.value = id;
  }, 500);
};

const touchEnd = (id, event) => {
  // Clear the timer if the touch ends before 500ms
  clearTimeout(pressTimer);

  if (showOptionsOnRecipe.value !== id) {
    if (event.target.tagName === 'DIV') {
      router.push(`/recipe/public/${id}`);
      console.log("selected filter with id:", id);
    }
  }
}

// function to close opened options on filter if 
const closeOptions = (event) => {
  const recipeWithOpenedOptions = document.getElementById(showOptionsOnRecipe.value);

    // hide options when user clicks outside the filter 
    // contains method checks if the clicked element is the filter or its descedant HTML nodes
    if(recipeWithOpenedOptions && !recipeWithOpenedOptions.contains(event.target)){
        showOptionsOnRecipe.value = null;
        showSureDeleteMsg.value = false; // reset delete proccess
    }
}

// add event listener for click that is send to callback func closeOptions
onMounted(() => { 
    document.addEventListener('click', closeOptions) 
})

// remove ev. listener when component is unmounted from page
onUnmounted(() => { document.removeEventListener('click', closeOptions) })

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

    if(await deleteRecipe(id)){
        usersRecipes.value = await readUsersPublicRecipe(currentUser.id);
    } else {
    }

    delLoading.value = false; // stop loading animation
    showSureDeleteMsg.value = false;
}
</script>

<template>
  <BasicPageHeader text="Kniha receptů"></BasicPageHeader>
  <div>
    <Button type="button" label="Přidat recept" @click="router.push('/addnewrecipe')"></Button>
    <h3 style="margin-top: 50px;">Vaše recepty</h3>

    <div v-for="recipe in usersRecipes" style="margin-top: 8px;">
      <Message severity="success"
      :id="recipe.id"
      style="position: relative;"
      @touchstart="touchStart(recipe.id)" @touchend="touchEnd(recipe.id, $event)" 
      @mousedown="touchStart(recipe.id)" @mouseup="touchEnd(recipe.id, $event)">
          <div>{{ recipe.name }}</div>
          <span v-if="recipe.creator == currentUser.id && showOptionsOnRecipe == recipe.id" style="display: flex; position: absolute; right: 8px; gap: 8px; transform: translateY(-90%); z-index: 10">
                        <Button :label="showSureDeleteMsg ? '' : 'Upravit'" @click.stop="router.push(`/edit-recipe/${recipe.id}`)" icon="pi pi-pencil" severity="" size="small"/>
                        <Button :label="showSureDeleteMsg ? 'Jste jsi jisti?' : ''" @click.stop="tryDelete(recipe.id)" :icon="delLoading ? 'pi pi-spin pi-spinner': 'pi pi-trash'" severity="danger" size="small"/>
                    </span>
      </Message>
    </div>
    <Message severity="secondary" icon="pi pi-info-circle" variant="simple" size="small">Podržte recept pro úpravu nebo smazání.</Message>

    <h3 style="margin-top: 50px;">Uložené recepty</h3>

    <div v-for="recipe in savedRecipes" style="margin-top: 8px">
      <Message severity="success" @click="router.push(`/recipe/public/${recipe.Recipe.id}`)">
        {{ recipe.Recipe.name }}
      </Message>
    </div>

  </div>
  
  </template>