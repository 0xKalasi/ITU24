<script setup>
  import { onBeforeMount, ref } from 'vue';
  import InputNumber from 'primevue/inputnumber';
  import Textarea from 'primevue/textarea';
  import Button from 'primevue/button';
  import { insertCompleteRecipe } from '../../utils/add_recipe_api'
  import { updateCompleteRecipe } from '../../utils/update_recipe_api'
  import { useUserStore } from '../stores/userStore';
  import PhotoUploader from '../components/photoUploader.vue';
  import TimePicker from '../components/timePicker.vue';
  import { useRouter } from "vue-router";
  import { readPublicRecipe } from "../../utils/api";
  import ToggleSwitch from 'primevue/toggleswitch';

  import addUtencils from '../components/addUtencils.vue';
  import addSteps from '../components/addSteps.vue';
  import addIngredient from '../components/addIngredient.vue';
  
  const currentUser = useUserStore();
  const router = useRouter();

  const showAlert = ref(false);
  const alertKey = ref(0);
  const alertType = ref("");
  const alertText = ref("");
  const recipeId = router.currentRoute.value.params.recipe_id;
  const isLoading = ref(true);
  
  const recipe = recipeId ? ref({}) : ref({
    name: "",
    like_count: 0,
    times_cooked: 0,
    creator: currentUser.id,
    private: true,
    portions: 4,
    time_to_cook: 0,
    RecipeAlergens: [],
    categories: [],
    Step: [],
    Ingredients: [],
    Utencils: [],
    timers: [],
    photo: "",
  });
  
  const checked= ref();

  onBeforeMount(async () => {
    if(recipeId){
      readPublicRecipe(recipeId).then(async (result) => {
      //recipe = result;
      isLoading.value = false;
      Object.assign(recipe.value, result); 
      console.log("recipe:",recipe.value);
    })
    } else {
      isLoading.value = false;
    }
    checked.value = !recipe.value.private; 
  }) 

    var delete_recipe = false;
    async function cancelEditing(){
        if (!delete_recipe){
            alertType.value = "warn";
            alertText.value = "Naozaj chcete smazat vaše úpravy?";
            showAlert.value = true;
            alertKey.value++;
            delete_recipe = true;
        } else {
            //await deleteRecipe(recipe);
            if(recipeId){
              router.replace(`/recipe/public/${recipe.value.id}`)
            }
            else {
              router.replace(`/recipes`)
            }

        }

    }

    // Alert utilities
    function showAlertMessage(type, text) {
    alertType.value = type;
    alertText.value = text;
    showAlert.value = true;
    alertKey.value++;
    }

    // Functions for handling edits
    function updateRecipeLocal() {
    if (recipe.value.name) {
        console.log("Before update");
        console.log(recipe.value);
        updateCompleteRecipe(recipe.value)
        .then(() => {
            showAlertMessage("success", "Recept úspešne uložen!");
            router.replace(`/recipe/public/${recipe.value.id}`);
        })
    } else {
        showAlertMessage("error", "Název receptu nesmí být prázdný.");
      }
    }

    function createRecipe(){
      if(recipe.value.name != "") {
        if(recipeId){
          recipe.value.name = recipe.value.name + " (kopie)";
        }
        insertCompleteRecipe(recipe.value)
        .then(() => {
            showAlertMessage("success", "Recept úspešne vytvořen!");
            router.replace("/recipes");
        })
        
      } else {
        showAlertMessage("error", "Není možné vytvořit recept bez jména");
      }
    }

    function setPublic() {
      recipe.value.private = !recipe.value.private;
      checked.value = recipe.value.private; // Ensure the switch reflects the change
      console.log("Recipe private status:", recipe.value.private ? "Private" : "Public");
    }

    // Function to delete the photo in editing mode
  function deleteRecipePhoto() {
    recipe.value.photo = ""; // Clear the photo field
  }
  </script>

<template>
  <Alert v-if="showAlert" :type="alertType" :text="alertText" :key="alertKey"></Alert>

  <LoadingScreen v-if="isLoading" />
  <div v-else>
    <BasicPageHeader text="Uprav recept"/>
      <div class="p-card p-p-4 p-mx-auto p-mt-5" style="max-width: 500px;">
        <div style="display: flex; align-items: center;">
        <label style="margin-right: 8px;">Is public</label>
        <ToggleSwitch v-model="checked" @click="setPublic">
          <template #handle="{ checked }">
            <i :class="['!text-xs pi', { 'pi-check': checked, 'pi-times': !checked }]" />
          </template>
        </ToggleSwitch>
      </div>
       <!-- Title TextArea Input -->
      <div class="p-field p-d-flex p-ai-center p-mb-3 title-container">
        <label for="title" class="title-label">Název</label>
        <Textarea
          id="title"
          placeholder="Enter a name for your recipe!"
          class="title-textarea"
          rows="1"
          autoResize
          v-model="recipe.name"
        />
      </div>
      <PhotoUploader v-model="recipe.photo" />
      <Button 
          v-if="recipe.photo" 
          label="Smazat foto" 
          class="p-button-danger p-button-outlined p-my-2" 
          @click="deleteRecipePhoto" 
      />

        <h3>Ingredence</h3>
        <addIngredient v-model="recipe.Ingredients"/>
        
        <h3>Instrukce</h3>
        <addSteps v-model="recipe.Step"/>
        

        <h3>Speciální pomúcky</h3>
        <addUtencils v-model="recipe.Utencils"/>
    
        <!-- General Info Section -->
        <div class="p-mb-3">
          <h3>Všeobecné informace</h3>
          <div class="p-d-flex p-ai-center p-mb-2">
            <label class="p-mr-2">Počet porcí</label>
            <InputNumber v-model="recipe.portions" mode="decimal" showButtons :min="1" :max="100" buttonLayout="horizontal" fluid class="p-inputnumber-sm centered-input">
                <template #incrementicon>
                    <span class="pi pi-plus" />
                </template>
                <template #decrementicon>
                    <span class="pi pi-minus" />
                </template>
            </InputNumber>
          </div>
          <div class="p-d-flex p-ai-center p-mb-2">
            <label class="p-mr-2">Čas přípravy</label>
            <TimePicker v-model="recipe.time_to_cook" showIcon fluid iconDisplay="input" timeOnly >
              <template #inputicon="slotProps" @change="saveTime" >
                  <i class="pi pi-clock" @click="slotProps.clickCallback" />
              </template>
            </TimePicker>
          </div>
        </div>
        
  
        <!-- Create, Delete Button -->
        <div class="flex justify-between items-center px-4">
          <Button label="Zrušit" class="p-button-danger" @click='cancelEditing();'></Button>
          <div v-if="recipeId">
            <Button label="Uložit úpravy" class="p-button-ok" @click='updateRecipeLocal();'></Button>
            <Button label="Vytvořit jako kopii" class="p-button-ok" @click='createRecipe();'></Button>
          </div>
          <div v-else>
            <Button label="Vytvořit" class="p-button-ok" @click='createRecipe();'></Button>
          </div>

        </div>
  
      </div>
  </div>
  </template>
  
  <style scoped>

.in-one-row {
  display: flex;
  align-items: center;
}

.title-container {
  display: flex;
  align-items: top; /* Center-aligns the label with the Textarea vertically */
  text-align: center;
}

.title-label {
  white-space: nowrap; /* Prevents the label text from wrapping */
  margin-right: 5px; /* Adds space between the label and the Textarea */
}

.title-textarea {
  width: 100%; /* Ensures the Textarea fills the available width */
  font-size: 20px;
  background-color: #5a5a5a;
  border: 0;
  align-content: top;
  border-radius: 0px;
  row-gap: 0;
}

.step-textarea {
  width: 100%; /* Ensures the Textarea fills the available width */
  font-size: 20px;
  background-color: #5a5a5a;
  border: 0;
  align-content: top;
  border-radius: 0px;
  row-gap: 0;
  resize: none;
}

  .p-field label {
    font-size: 30px;
  }
  .p-button {
    font-size: 14px;
  }
  .p-border-top-1 {
    border-top: 1px solid #ddd;
  }

  /* Centering the numbers inside the InputNumber fields */
  .centered-input .p-inputtext {
    text-align: center;
  }
  </style>