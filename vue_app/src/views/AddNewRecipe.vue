<script setup>
  import { ref } from 'vue';
  import InputText from 'primevue/inputtext';
  import InputNumber from 'primevue/inputnumber';
  import Textarea from 'primevue/textarea';
  import Button from 'primevue/button';
  import { insertCompleteRecipe } from '../../utils/add_recipe_api'
  import { useUserStore } from '../stores/userStore';
  import MyOnFloatLabel from '../components/myOnFloatLabel.vue';
  import PhotoUploader from '../components/photoUploader.vue';
  import { useRouter } from "vue-router";


  const currentUser = useUserStore();
  const router = useRouter();


  const recipe = ref({
    name: "",
    like_count: 0,
    times_cooked: 0,
    creator: currentUser.id,
    private: true,
    portions: 4,
    time_to_cook: 0,
    alergens: [],
    categories: [],
    steps: [],
    ingredients: [],
    utencils: [],
    timers: []
  });

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
        recipe.value.ingredients.push({ ...newIngredient.value });
        newIngredient.value = { name: "", quantity: null, unit: "" };
      }
    }

    // Edit ingredient
    function editIngredient(index, ingredient) {
      editingIngredientIndex.value = index;
      editedIngredient.value = { ...ingredient };
    }

    // Save edited ingredient
    function saveIngredient(index) {
      recipe.value.ingredients[index] = { ...editedIngredient.value };
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
      const stepNum = recipe.value.steps.length + 1;
      recipe.value.steps.push({ ...newStep.value, number: stepNum });
      newStep.value = { number: stepNum + 1, text: "", name: `Krok ${stepNum + 1}`, photo: "" };
    }

    // Edit step
    function editStep(index, step) {
      editingStepIndex.value = index;
      editedStep.value = { ...step };
    }

    // Save edited step
    function saveStep(index) {
      recipe.value.steps[index] = { ...editedStep.value };
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
      if (recipe.value.utencils.length < 5 && newUtencil.value.trim() !== "") {
        recipe.value.utencils.push({ name: newUtencil.value });
        newUtencil.value = "";
      }
    }

    // Enable editing mode for a utensil
    function editUtencil(index, name) {
      editingIndex.value = index;
      editedUtencil.value = name;
    }

    // Save the edited utensil
    function saveUtencil(index) {
      recipe.value.utencils[index].name = editedUtencil.value;
      editingIndex.value = null; // Exit editing mode
      editedUtencil.value = ""; // Clear the edited utensil input
    }

    // Cancel the edit
    function cancelEdit() {
      editingIndex.value = null;
      editedUtencil.value = ""; // Clear the edited utensil input
    }



  </script>

<template>
  <BasicPageHeader text="Add Recipe"/>
    <div class="p-card p-p-4 p-mx-auto p-mt-5" style="max-width: 500px;">
  
     <!-- Title TextArea Input -->
<div class="p-field p-d-flex p-ai-center p-mb-3 title-container">
  <label for="title" class="title-label">Title</label>
  <Textarea
    id="title"
    placeholder="Enter a name for your recipe!"
    class="title-textarea"
    rows="1"
    autoResize
    v-model="recipe.name"
  />
</div>
  
      <!-- Display each ingredient with edit options -->
      <div v-if="recipe.ingredients.length > 0" class="p-d-flex p-ai-center p-mb-10">
        <div v-for="(ingredient, index) in recipe.ingredients" :key="index" class="p-d-flex p-ai-center p-mb-2">
          <template v-if="editingIngredientIndex === index">
            <!-- Editing Mode -->
            <MyOnFloatLabel label="Název Ingredence" v-model="editedIngredient.name" />
            <MyOnFloatLabel :number="true" label="Množství" v-model="editedIngredient.quantity" />
            <MyOnFloatLabel label="Jednotka" v-model="editedIngredient.unit" />
            <Button icon="pi pi-check" class="p-button-text p-button-rounded" @click="saveIngredient(index)" />
            <Button icon="pi pi-times" class="p-button-text p-button-rounded" @click="cancelIngredientEdit" />
          </template>
          <template v-else>
            <!-- Display Mode -->
            <li>{{ ingredient.name }}, {{ ingredient.quantity }} {{ ingredient.unit }}
              <Button icon="pi pi-pencil" class="p-button-text p-button-rounded" @click="editIngredient(index, ingredient)" />
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

  
      <!-- Instructions (Steps) Section -->
      <div class="p-mb-3">
        <h3>Instrukce</h3>

        <!-- Display each step with edit options -->
        <div v-if="recipe.steps.length > 0" class="p-d-flex p-ai-center p-mb-10">
          <div v-for="(step, index) in recipe.steps" :key="index" class="p-d-flex p-ai-center p-mb-2">
            <template v-if="editingStepIndex === index">
              <!-- Editing Mode -->
              <InputText v-model="editedStep.name" placeholder="Název kroku" />
              <div class="in-one-row">
                <Textarea v-model="editedStep.text" placeholder="Sem pište vaše kroky" rows="3" autoResize />
                <PhotoUploader v-model="editedStep.photo" />
              </div>
              <Button icon="pi pi-check" class="p-button-text p-button-rounded" @click="saveStep(index)" />
              <Button icon="pi pi-times" class="p-button-text p-button-rounded" @click="cancelStepEdit" />
            </template>
            <template v-else>
              <!-- Display Mode -->
              <li>{{ step.number }} - {{ step.name }} - {{ step.text }} 
                <Button icon="pi pi-pencil" class="p-button-text p-button-rounded" @click="editStep(index, step)" />
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
        <div v-if="recipe.utencils.length > 0" class="p-d-flex p-ai-center p-mb-10">
          <div v-for="(utencil, index) in recipe.utencils" :key="index" class="p-d-flex p-ai-center p-mb-2">
            <template v-if="editingIndex === index">
              <!-- Editing Mode -->
              <InputText v-model="editedUtencil" class="p-inputtext-sm" />
              <Button icon="pi pi-check" class="p-button-text p-button-rounded p-ml-2" @click="saveUtencil(index)" />
              <Button icon="pi pi-times" class="p-button-text p-button-rounded p-ml-2" @click="cancelEdit" />
            </template>
            <template v-else>
              <!-- Display Mode -->
              <span>{{ utencil.name }} 
                <Button icon="pi pi-pencil" class="p-button-text p-button-rounded p-ml-2" @click="editUtencil(index, utencil.name)" />
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
        <h3>General info</h3>
        <div class="p-d-flex p-ai-center p-mb-2">
          <label class="p-mr-2">Number of portions</label>
          <InputNumber v-model="recipe.portions" class="p-inputtext-sm p-mr-3" style="width: 60px" />
          <label class="p-mr-2">Prep time</label>
          <InputText value="01:30" class="p-inputtext-sm" style="width: 60px" />
        </div>
      </div>
  
      <!-- Delete Button -->
      <div class="p-text-right">
        <Button label="Delete" class="p-button-danger"></Button>
      </div>

      <!-- Create Button -->
      <div class="p-text-right">
        <Button label="Create" class="p-button-ok" @click='router.push("/profile/"+currentUser.id); insertCompleteRecipe(recipe);'></Button>
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
  </style>