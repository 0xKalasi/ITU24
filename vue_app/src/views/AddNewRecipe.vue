<script setup>
  import { ref } from 'vue';
  import InputText from 'primevue/inputtext';
  import InputNumber from 'primevue/inputnumber';
  import Textarea from 'primevue/textarea';
  import Dropdown from 'primevue/dropdown';
  import Button from 'primevue/button';
  import { insertCompleteRecipe } from '../../utils/add_recipe_api'
  import { useUserStore } from '../stores/userStore';

  const currentUser = useUserStore();

  const formData = ref({
    name: "",
    like_count: 0,
    times_cooked: 0,
    creator: currentUser.id,
    private: true,
    portions: 4,
    time_to_cook: 5300,
    alergens: [],
    categories: [],
    steps: [
        { number: "1", text: 'Example', name: 'Step 1' },
    ],
    ingredients: [
        { name: "", unit: "", quantity: 0 }
    ],
    utencils: [
        {name: ""}
    ],
    timers: [
        { step_number: 1, description: 'Boil for 10 minutes', time: 600 },
    ]
  });
  </script>

<template>
    <div class="p-card p-p-4 p-mx-auto p-mt-5" style="max-width: 500px;">
      <!-- Header -->
      <div class="p-d-flex p-ai-center p-jc-between p-mb-3">
        <h2 class="p-m-0">Add Recipe</h2>
      </div>
  
     <!-- Title TextArea Input -->
<div class="p-field p-d-flex p-ai-center p-mb-3 title-container">
  <label for="title" class="title-label">Title</label>
  <Textarea
    id="title"
    placeholder="Enter a name for your recipe!"
    class="resizable-textarea"
    rows="1"
    autoResize
    v-model="formData.name"
  />
</div>
<div>{{formData.name}}</div>
  
      <!-- Ingredients Section -->
      <div class="p-mb-3">
        <h3>Ingredients</h3>
        <div class="p-d-flex p-ai-center p-mb-2">
          <InputText placeholder="Enter an ingredient" class="p-inputtext-sm p-mr-2" style="flex: 1" />
          <InputNumber placeholder="Quantity" class="p-inputtext-sm p-mr-2" mode="decimal" />
          <Dropdown placeholder="unit" class="p-inputtext-sm p-mr-2" style="width: 80px" />
          <Button icon="pi pi-camera" class="p-button-text p-button-rounded"></Button>
        </div>
      </div>
  
      <!-- Instructions Section -->
      <div class="p-mb-3">
        <h3>Instructions</h3>
        <div class="p-d-flex p-jc-between p-ai-center p-mb-2">
          <label>Step 1</label>
          <Button icon="pi pi-check" class="p-button-text p-button-rounded"></Button>
        </div>
        <Textarea placeholder="Write your instructions here" class="p-inputtext-sm p-d-block p-mb-2" rows="3" />
        <div class="p-d-flex p-jc-between">
          <Button icon="pi pi-plus" class="p-button-text p-button-rounded"></Button>
          <Button icon="pi pi-camera" class="p-button-text p-button-rounded"></Button>
        </div>
      </div>
  
      <!-- Special Utensils Section -->
      <div class="p-field">
        <h3>Special utensils</h3>
        <InputText placeholder="Enter name of the utensil" class="p-inputtext-sm p-d-block" />
      </div>
  
      <!-- General Info Section -->
      <div class="p-mb-3">
        <h3>General info</h3>
        <div class="p-d-flex p-ai-center p-mb-2">
          <label class="p-mr-2">Number of portions</label>
          <InputNumber :value="4" class="p-inputtext-sm p-mr-3" style="width: 60px" />
          <label class="p-mr-2">Prep time</label>
          <InputText value="01:30" class="p-inputtext-sm" style="width: 60px" />
        </div>
      </div>
  
      <!-- Delete Button -->
      <div class="p-text-right">
        <Button label="Delete" class="p-button-danger"></Button>
      </div>

      <!-- Delete Button -->
      <div class="p-text-right">
        <Button label="Create" class="p-button-ok" @click="insertCompleteRecipe(formData)"></Button>
      </div>

    </div>
  </template>
  
  
  <style scoped>
.title-container {
  display: flex;
  align-items: top; /* Center-aligns the label with the Textarea vertically */
  text-align: center;
}

.title-label {
  white-space: nowrap; /* Prevents the label text from wrapping */
  margin-right: 5px; /* Adds space between the label and the Textarea */
}

.resizable-textarea {
  width: 100%; /* Ensures the Textarea fills the available width */
  font-size: 20px;
  background-color: #5a5a5a;
  border: 0;
  align-content: top;
  border-radius: 0px;
  row-gap: 0;
  
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