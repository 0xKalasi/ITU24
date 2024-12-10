<script setup>
  import { ref } from 'vue';
  import InputText from 'primevue/inputtext';
  import InputNumber from 'primevue/inputnumber';
  import Textarea from 'primevue/textarea';
  import Button from 'primevue/button';
  import { insertCompleteRecipe, deleteRecipe } from '../../utils/add_recipe_api'
  import { updateCompleteRecipe } from '../../utils/update_recipe_api'
  import { useUserStore } from '../stores/userStore';
  import MyOnFloatLabel from '../components/myOnFloatLabel.vue';
  import PhotoUploader from '../components/photoUploader.vue';
  import TimePicker from '../components/timePicker.vue';
  import { useRouter } from "vue-router";
  import { readPublicRecipe } from "../../utils/api";


  const currentUser = useUserStore();
  const router = useRouter();

  const showAlert = ref(false);
  const alertKey = ref(0);
  const alertType = ref("");
  const alertText = ref("");
  const timeInput = ref(0);
  const recipeId = router.currentRoute.value.params.recipe_id;
  const isLoading = ref(true);
  const recipe = ref({});

  readPublicRecipe(recipeId).then(async (result) => {
    //recipe = result;
    isLoading.value = false;
    Object.assign(recipe.value, result);
    console.log("recipe:");
    console.log(recipe.value);
})

  // Ingredient data
  const newIngredient = ref({ name: "", quantity: null, unit: "" });
  const editedIngredient = ref({ name: "", quantity: null, unit: "" });
  const editingIngredientIndex = ref(null);

  // Step data
  const newStep = ref({ number: 1, text: "", name: "Krok 1", photo: "" });
  const editedStep = ref({ number: 1, text: "", name: "", photo: "" });
  const editingStepIndex = ref(null);

   // Add new ingredient
   function PushIngredient() {
      if (newIngredient.value.name) {
        recipe.value.Ingredients.push({ ...newIngredient.value });
        newIngredient.value = { name: "", quantity: null, unit: "" };
      }
    }

    // Edit ingredient
    function editIngredient(index, ingredient) {
      editingIngredientIndex.value = index;
      editedIngredient.value = { ...ingredient };
    }
    // Delete ingredient
    function deleteIngredient(index) {
      recipe.value.Ingredients.splice(index, 1);
    }

    // Save edited ingredient
    function saveIngredient(index) {
      recipe.value.Ingredients[index] = { ...editedIngredient.value };
      editingIngredientIndex.value = null;
      editedIngredient.value = { name: "", quantity: null, unit: "" };
    }

    // Cancel ingredient edit
    function cancelIngredientEdit() {
      editingIngredientIndex.value = null;
      editedIngredient.value = { name: "", quantity: null, unit: "" };
    }

    // Add new step
    function PushStep() {
      newStep.value.number++; // Increment the step number
      recipe.value.Step.push({ ...newStep.value }); // Push the step into the recipe
      newStep.value = { 
        number: newStep.value.number, // Retain the number for the next step
        text: "", 
        name: "Krok " + newStep.value.number, 
        photo: ""
      }; // Reset newStep
    }

    // Edit step
    function editStep(index, step) {
      editingStepIndex.value = index;
      editedStep.value = { ...step };
    }

    // Delete step
    function deleteStep(index) {
      recipe.value.Step.splice(index, 1);
    }

    // Save edited step
    function saveStep(index) {
      recipe.value.Step[index] = { ...editedStep.value };
      editingStepIndex.value = null;
      editedStep.value = { number: 1, text: "", name: "", photo: "" };
    }

    // Cancel step edit
    function cancelStepEdit() {
      editingStepIndex.value = null;
      editedStep.value = { number: 1, text: "", name: "", photo: "" };
    }


  // References to data properties
  const newUtencil = ref("");
  const editedUtencil = ref("");
  const editingIndex = ref(null);

  // Add a new utensil
  function PushUtencil() {
      if (recipe.value.Utencils.length < 5 && newUtencil.value.trim() !== "") {
        recipe.value.Utencils.push({ name: newUtencil.value });
        newUtencil.value = "";
      }
    }

    // Enable editing mode for a utensil
    function editUtencil(index, name) {
      editingIndex.value = index;
      editedUtencil.value = name;
    }

    // Delete step
    function deleteUtencil(index) {
      recipe.value.Utencils.splice(index, 1);
    }

    // Save the edited utensil
    function saveUtencil(index) {
      recipe.value.Utencils[index].name = editedUtencil.value;
      editingIndex.value = null; // Exit editing mode
      editedUtencil.value = ""; // Clear the edited utensil input
    }

    // Cancel the edit
    function cancelEdit() {
      editingIndex.value = null;
      editedUtencil.value = ""; // Clear the edited utensil input
    }

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
            router.push(`/recipe/public/${recipe.value.id}`)
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
            router.push(`/recipe/public/${recipe.value.id}`);
        })
    } else {
        showAlertMessage("error", "Název receptu nesmí být prázdný.");
    }
    }

    function createRecipe(){
      if(recipe.value.name != "") {
        recipe.value.name = recipe.value.name + " (kopie)";
        insertCompleteRecipe(recipe.value)
        .then(() => {
            showAlertMessage("success", "Recept úspešne vytvořen!");
            router.push("/profile/"+currentUser.id);
        })
        
      } else {
        showAlertMessage("error", "Není možné vytvořit recept bez jména");
      }
    }


  </script>

<template>
  <Alert v-if="showAlert" :type="alertType" :text="alertText" :key="alertKey"></Alert>

  <LoadingScreen v-if="isLoading" />
  <div v-else>
    <BasicPageHeader text="Uprav recept"/>
      <div class="p-card p-p-4 p-mx-auto p-mt-5" style="max-width: 500px;">
    
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
        <h3>Ingredence</h3>
        <!-- Display each ingredient with edit options -->
        <div v-if="recipe.Ingredients.length > 0" class="p-d-flex p-ai-center p-mb-10">
          <div v-for="(ingredient, index) in recipe.Ingredients" :key="index" class="p-d-flex p-ai-center p-mb-2">
            <template v-if="editingIngredientIndex === index">
              <!-- Editing Mode -->
              <MyOnFloatLabel label="Název Ingredence" v-model="editedIngredient.name" />
              <MyOnFloatLabel :number="true" label="Množství" v-model="editedIngredient.quantity" />
              <MyOnFloatLabel label="Jednotka" v-model="editedIngredient.unit" />
              <Button icon="pi pi-check" class="p-button-text p-button-rounded" @click="saveIngredient(index)" />
              <!-- <Button icon="pi pi-times" class="p-button-text p-button-rounded" @click="cancelIngredientEdit" /> -->
            </template> 
            <template v-else>
              <!-- Display Mode -->
              <li>{{ ingredient.name }}, {{ ingredient.quantity }} {{ ingredient.unit }}
                <Button icon="pi pi-pencil" class="p-button-text p-button-rounded" @click="editIngredient(index, ingredient)" />
                <Button icon="pi pi-trash" class="p-button-text p-button-rounded" @click="deleteIngredient(index)" />
              </li>
            </template>
          </div>
        </div>
  
        <!-- New ingredient input -->
        <div class="in-one-row">
          <MyOnFloatLabel label="Název Ingredence" v-model="newIngredient.name" />
          <MyOnFloatLabel :number="true" label="Množství" v-model="newIngredient.quantity" />
          <MyOnFloatLabel label="Jednotka" v-model="newIngredient.unit" />
        </div>
        <Button icon="pi pi-plus" class="p-button-text p-button-rounded" @click="PushIngredient" />
  
    
        <!-- Instructions (Step) Section -->
        <div class="p-mb-3">
          <h3>Instrukce</h3>
  
          <!-- Display each step with edit options -->
          <div v-if="recipe.Step.length > 0" class="p-d-flex p-ai-center p-mb-10">
            <div v-for="(step, index) in recipe.Step" :key="index" class="p-d-flex p-ai-center p-mb-2">
              <template v-if="editingStepIndex === index">
                <!-- Editing Mode -->
                <InputText v-model="editedStep.name" placeholder="Název kroku" />
                <div class="in-one-row">
                  <Textarea v-model="editedStep.text" placeholder="Sem pište vaše kroky" rows="3" autoResize />
                  <PhotoUploader v-model="editedStep.photo" />
                </div>
                <Button icon="pi pi-check" class="p-button-text p-button-rounded" @click="saveStep(index)" />
                <!-- <Button icon="pi pi-times" class="p-button-text p-button-rounded" @click="cancelStepEdit" /> -->
              </template>
              <template v-else>
                <!-- Display Mode -->
                <li>{{ step.number }} - {{ step.name }} - {{ step.text }} 
                  <Button icon="pi pi-pencil" class="p-button-text p-button-rounded" @click="editStep(index, step)" />
                  <Button icon="pi pi-trash" class="p-button-text p-button-rounded" @click="deleteStep(index)" />
                </li>
                
                <div v-if="step.photo">
                  <img :src="step.photo" alt="step-preview" class="image-preview" />
                </div>
              </template>
            </div>
          </div>
  
          <!-- New step input -->
          <InputText v-model="newStep.name" placeholder="Krok 1" />
           <div class="in-one-row">
             <Textarea v-model="newStep.text" class="step-textarea" placeholder="Sem pište vaše kroky" rows="3" autoResize />
             <PhotoUploader v-model="newStep.photo" />
           </div>
        </div>
        <Button icon="pi pi-plus" class="p-button-text p-button-rounded" @click="PushStep" />
    
        <!-- Special Utensils Section -->
        <div class="p-field">
          <h3>Speciální pomúcky</h3>
  
          <!-- List of utensils with edit and save options -->
          <div v-if="recipe.Utencils.length > 0" class="p-d-flex p-ai-center p-mb-10">
            <div v-for="(utencil, index) in recipe.Utencils" :key="index" class="p-d-flex p-ai-center p-mb-2">
              <template v-if="editingIndex === index">
                <!-- Editing Mode -->
                <InputText v-model="editedUtencil" class="p-inputtext-sm" />
                <Button icon="pi pi-check" class="p-button-text p-button-rounded p-ml-2" @click="saveUtencil(index)" />
                <!-- <Button icon="pi pi-times" class="p-button-text p-button-rounded p-ml-2" @click="cancelEdit" /> -->
              </template>
              <template v-else>
                <!-- Display Mode -->
                <span>{{ utencil.name }} 
                  <Button icon="pi pi-pencil" class="p-button-text p-button-rounded p-ml-2" @click="editUtencil(index, utencil.name)" />
                  <Button icon="pi pi-trash" class="p-button-text p-button-rounded" @click="deleteUtencil(index)" />
                </span>
              </template>
            </div>
          </div>
  
          <!-- New utensil input -->
          <InputText v-model="newUtencil" placeholder="Napiš jméno pomúcky" class="p-inputtext-sm p-d-block" />
          <Button icon="pi pi-plus" class="p-button-text p-button-rounded" @click="PushUtencil" />
        </div>
    
        <!-- General Info Section -->
        <div class="p-mb-3">
          <h3>Všeobecné informace</h3>
          <div class="p-d-flex p-ai-center p-mb-2">
            <label class="p-mr-2">Počet porcí</label>
            <InputNumber v-model="recipe.portions" mode="decimal" showButtons :min="0" :max="100" buttonLayout="horizontal" fluid class="p-inputnumber-sm centered-input">
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
          <Button label="Uložit úpravy" class="p-button-ok" @click='updateRecipeLocal();'></Button>
          <Button label="Vytvořit jako kopii" class="p-button-ok" @click='createRecipe();'></Button>
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