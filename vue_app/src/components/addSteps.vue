<script setup>
import { ref, defineModel } from "vue";
import PhotoUploader from "./photoUploader.vue";

const steps = defineModel();
// Step data
const newStep = ref({ number: 1, text: "", name: "Krok 1", photo: "" });
const editedStep = ref({ number: 0, text: "", name: "", photo: "" });
const editingStepIndex = ref(null);

// Add new step
function PushStep() {
    steps.value.push({ ...newStep.value }); // Push the step into the recipe
    newStep.value.number++; // Increment the step number
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
      steps.value.splice(index, 1);
      newStep.value.number--;
      newStep.value.name = "Krok " + newStep.value.number;
    }

    // Save edited step
    function saveStep(index) {
      steps.value[index] = { ...editedStep.value };
      editingStepIndex.value = null;
      editedStep.value = { number: 1, text: "", name: "", photo: "" };
    }

    // Cancel step edit
    function cancelStepEdit() {
      editingStepIndex.value = null;
      editedStep.value = { number: 1, text: "", name: "", photo: "" };
    }
</script>

<template>
    <!-- Instructions (Step) Section -->
    <div class="p-mb-3">
        <!-- Display each step with edit options -->
        <div v-if="steps.length > 0" class="p-d-flex p-ai-center p-mb-10">
        <div v-for="(step, index) in steps" :key="index" class="p-d-flex p-ai-center p-mb-2">
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
</template>