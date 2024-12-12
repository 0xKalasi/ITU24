<script setup>
import { ref, defineModel } from "vue";
import PhotoUploader from "./photoUploader.vue";

const steps = defineModel();
// Step data
const newStep = ref({ number: 1, text: "", name: "Krok 1", photo: "", name_was_edited: false});
const editedStep = ref({ number: 0, text: "", name: "", photo: "", name_was_edited: false });
const editingStepIndex = ref(null);

// Update step numbers after adding or deleting a step
function updateStepNumbers() {
    steps.value.forEach((step, idx) => {
        step.number = idx + 1;
        if(!step.name_was_edited){
          step.name = "Krok " + step.number;
        }
        //console.log(step);
    });
    newStep.value.number = steps.value.length + 1; // Next step number
    newStep.value.name = "Krok " + newStep.value.number;
};

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
    // Get the number of the step being deleted
    const deletedStepNumber = steps.value[index].number;

    // Remove the step at the specified index
    steps.value.splice(index, 1);

    // Update the numbers and names of remaining steps
    updateStepNumbers();

    // Optionally log the number of the deleted step
    console.log(`Deleted step number: ${deletedStepNumber}`);
  }

    // Save edited step
    function saveStep(index) {
      console.log(editedStep.value);
      steps.value[index] = { ...editedStep.value };
      editingStepIndex.value = null;
      editedStep.value = { number: 1, text: "", name: "", photo: "" };
    }

    // Cancel step edit
    function cancelStepEdit() {
      editingStepIndex.value = null;
      editedStep.value = { number: 1, text: "", name: "", photo: "" };
    }

    const temporarySteps = ref({}); // Track temporary inputs for "add between" fields

// Add step between function
function addStepBetween(index) {
    if (!temporarySteps.value[index]) {
        temporarySteps.value[index] = {
            number: steps.value[index].number + 1,
            name: "Krok " + (steps.value[index].number + 1),
            text: "",
            photo: "",
            isVisible: true,
            name_was_edited: false,
        };
    }
};

// Finalize the temporary step
function finalizeStepBetween(index){
    const tempStep = temporarySteps.value[index];
    if (tempStep && tempStep.name.trim() !== "" && tempStep.text.trim() !== "") {
        steps.value.splice(index + 1, 0, { ...tempStep });
        delete temporarySteps.value[index]; // Clear temporary step
        updateStepNumbers();
    }
};

// Cancel editing and remove temporary step
function cancelStepBetween (index) {
    delete temporarySteps.value[index];
};

// Dragging logic
const draggedStep = ref(null);
const draggingIndex = ref(null); // To track the index being dragged

// Start dragging
function handleDragStart(event, index) {
    draggedStep.value = index;
    draggingIndex.value = index; // Set the index for styling
    event.dataTransfer.effectAllowed = "move";
}

// Allow dropping
function handleDragOver(event) {
    event.preventDefault(); // Necessary for drop to work
    event.dataTransfer.dropEffect = "move";
}

// Handle dropping
function handleDrop(event, index) {
    event.preventDefault();
    if (draggedStep.value !== null && draggedStep.value !== index) {
        const step = steps.value.splice(draggedStep.value, 1)[0]; // Remove dragged step
        steps.value.splice(index, 0, step); // Insert step at new position
        updateStepNumbers(); // Recalculate step numbers
    }
    draggedStep.value = null;
    draggingIndex.value = null; // Reset after drop
}

// Cancel dragging
function handleDragEnd() {
    draggedStep.value = null;
    draggingIndex.value = null; // Reset after drag ends
}

// Function to delete the photo in editing mode
function deletePhoto() {
    editedStep.value.photo = ""; // Clear the photo field
}
</script>

<template>
  <div class="p-mb-3">
      <div v-if="steps.length > 0" class="p-d-flex p-ai-center p-mb-10">
          <div
              v-for="(step, index) in steps"
              :key="index"
              class="p-d-flex p-ai-center p-mb-2"
              :class="{ 'dragging': draggingIndex === index }"
              draggable="true"
              @dragstart="handleDragStart($event, index)"
              @dragover="handleDragOver"
              @drop="handleDrop($event, index)"
              @dragend="handleDragEnd"
          >
              <template v-if="editingStepIndex === index">
                  <InputText v-model="editedStep.name" placeholder="Název kroku" @input="editedStep.name_was_edited = true" />
                  <div class="in-one-row">
                      <Textarea
                          v-model="editedStep.text"
                          placeholder="Sem pište vaše kroky"
                          rows="3"
                          autoResize
                      />
                      <PhotoUploader v-model="editedStep.photo" />
                  </div>

                  <!-- Delete Photo Button -->
                  <Button 
                      v-if="editedStep.photo" 
                      label="Smazat foto" 
                      class="p-button-danger p-button-outlined p-my-2" 
                      @click="deletePhoto" 
                  />

                  <Button icon="pi pi-check" class="p-button-text p-button-rounded" @click="saveStep(index)" />
              </template>
              <template v-else>
                  <li>
                      {{ step.name }} <br /> {{ step.text }}
                      <Button icon="pi pi-pencil" class="p-button-text p-button-rounded" @click="editStep(index, step)" />
                      <Button icon="pi pi-trash" class="p-button-text p-button-rounded" @click="deleteStep(index)" />
                  </li>

                  <div v-if="step.photo">
                      <img :src="step.photo" alt="step-preview" class="image-preview" />
                  </div>
              </template>

              <div v-if="index < steps.length - 1" class="p-d-flex p-ai-center p-my-2">
                  <Button
                      label="Přidat krok mezi"
                      class="p-button-outlined p-button-secondary"
                      @click="addStepBetween(index)"
                  />
              </div>

              <div v-if="temporarySteps[index]?.isVisible" class="temporary-step-container">
                  <InputText
                      v-model="temporarySteps[index].name"
                      placeholder="Název kroku"
                      class="step-name-input"
                      @input="temporarySteps[index].name_was_edited = true"
                  />
                  <Textarea
                      v-model="temporarySteps[index].text"
                      placeholder="Popis kroku"
                      class="step-textarea"
                      rows="3"
                  />
                  <PhotoUploader v-model="temporarySteps[index].photo" />
                  <Button icon="pi pi-check" @click="finalizeStepBetween(index)" />
                  <Button icon="pi pi-times" @click="cancelStepBetween(index)" />
              </div>
          </div>
      </div>

      <InputText v-model="newStep.name" placeholder="Krok 1" @input="newStep.name_was_edited = true" />
      <div class="in-one-row">
          <Textarea
              v-model="newStep.text"
              class="step-textarea"
              placeholder="Sem pište vaše kroky"
              rows="3"
              autoResize
          />
          <PhotoUploader v-model="newStep.photo" />
      </div>
  </div>
  <Button icon="pi pi-plus" class="p-button-text p-button-rounded" @click="PushStep" />
</template>


<style scoped>
  .dragging {
    opacity: 0.5; /* Make it semi-transparent */
    border: 2px dashed #007bff; /* Highlight with a dashed border */
    background-color: #8d8d8e; /* Light background color */
    transform: scale(1.05); /* Slightly enlarge for effect */
    transition: transform 0.2s ease;
  }
</style>