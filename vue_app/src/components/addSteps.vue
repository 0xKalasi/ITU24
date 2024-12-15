<!-- 
    FILE:       addSteps.vue
    AUTHOR:     Tomáš Tomcsányi, xtomcs00 
    DATE:       15.12.2024
-->

<script setup>
    import { ref, onBeforeMount } from "vue";
    import PhotoUploader from "./photoUploader.vue";

     // Aray which is propagated out of the component
    const steps = defineModel();
    // Step data
    const newStep = ref({ number: 1, text: "", name: "Krok 1", photo: "", name_was_edited: false});
    const editedStep = ref({ number: 0, text: "", name: "", photo: "", name_was_edited: false });
    const editingStepIndex = ref(null);

    // Dragging logic
    const draggedStep = ref(null);
    const draggingIndex = ref(null);

    const temporarySteps = ref({});
    // Update step numbers 
    function updateStepNumbers() {
        steps.value.forEach((step, idx) => {
            step.number = idx + 1;
            if(!step.name_was_edited){
            step.name = "Krok " + step.number;
            }
        });
        newStep.value.number = steps.value.length + 1;
        newStep.value.name = "Krok " + newStep.value.number;
    };

    onBeforeMount(async () => {
        updateStepNumbers();
    }) 

    // Add new step
    function PushStep() {
        console.log(newStep.value.name);
        if(newStep.value.name === ""){
            newStep.value.name = "Krok " + newStep.value.number;
            newStep.value.name_was_edited = false;
        }
        steps.value.push({ ...newStep.value });
        newStep.value.number++;
        // Reset newStep to initial values
        newStep.value = { 
            number: newStep.value.number,
            text: "", 
            name: "Krok " + newStep.value.number, 
            photo: ""
        }; 
    }

    // Edit step
    function editStep(index, step) {
      editingStepIndex.value = index;
      editedStep.value = { ...step };
    }

    // Delete step
    function deleteStep(index) {
    const deletedStepNumber = steps.value[index].number;
    steps.value.splice(index, 1);
    updateStepNumbers();
    }

    // Save edited step
    function saveStep(index) {
      console.log(editedStep.value);
      steps.value[index] = { ...editedStep.value };
      editingStepIndex.value = null;
      editedStep.value = { number: 1, text: "", name: "", photo: "" };
    }

    // Start dragging
    function handleDragStart(event, index) {
        if(!editingStepIndex.value){
            draggedStep.value = index;
            draggingIndex.value = index;
            event.dataTransfer.effectAllowed = "move";
        }

    }

    // Allow dropping
    function handleDragOver(event) {
        event.preventDefault(); 
        event.dataTransfer.dropEffect = "move";
    }

    // Handle dropping
    function handleDrop(event, index) {
        event.preventDefault();
        if (draggedStep.value !== null && draggedStep.value !== index) {
            const step = steps.value.splice(draggedStep.value, 1)[0];
            steps.value.splice(index, 0, step);

            updateStepNumbers();
        }
        draggedStep.value = null;
        draggingIndex.value = null;
    }

    // Cancel dragging
    function handleDragEnd() {
        draggedStep.value = null;
        draggingIndex.value = null;
    }

    // Function to delete the photo in both editing mode and new mode
    function deletePhoto(mode) {
        if (mode === "new") {
            newStep.value.photo = "";
        } else if (mode === "edit") {
            editedStep.value.photo = "";
        }
    }

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
            delete temporarySteps.value[index];
            updateStepNumbers();
        }
    };
</script>

<template>
    <div class="p-mb-3">
        <!-- Steps List -->
        <div v-if="steps.length > 0" class="steps-list">
            <div
                v-for="(step, index) in steps"
                :key="index"
                class="step-item"
                :class="{ 'dragging': draggingIndex === index }"
                draggable="true"
                @dragstart="handleDragStart($event, index)"
                @dragover="handleDragOver"
                @drop="handleDrop($event, index)"
                @dragend="handleDragEnd"
            >
                <!-- Editing Mode -->
                <template v-if="editingStepIndex === index">
                    <div class="step-container">
                        <InputText 
                            v-model="editedStep.name" 
                            placeholder="Název kroku" 
                            class="step-name-input"
                            @input="editedStep.name_was_edited = true" 
                        />
                        <div class="step-input-row">
                            <Textarea
                                v-model="editedStep.text"
                                class="step-textarea"
                                placeholder="Sem vložte vaše kroky"
                                rows="3"
                                autoResize
                            />
                            <div class="image-container">
                                <div class="image-wrapper" v-if="editedStep.photo">
                                    <img 
                                        :src="editedStep.photo" 
                                        alt="step-photo" 
                                        class="image-preview" 
                                    />
                                    <button class="delete-photo-btn p-button-danger" @click="deletePhoto('edit')">×</button>
                                </div>
                                <PhotoUploader v-model="editedStep.photo" />
                            </div>
                        </div>
                    </div>
                    <div class="button-wrapper">
                        <Button icon="pi pi-check" class="wide-button p-button-outlined" @click="saveStep(index)" />
                    </div>
                </template>
  
                <!-- Display Mode -->
                <template v-else>
                    <div class="step-display">
                        <div class="step-name">
                            <i class="pi pi-bars draggable-icon" title="Drag to reorder"></i>
                            {{ step.name }}
                        </div>
                        <div class="step-text" :title="step.text">{{ step.text }}</div>
                        <div class="button-wrapper">
                            <Button icon="pi pi-pencil" class="wide-button p-button-outlined" @click="editStep(index, step)" />
                            <Button icon="pi pi-trash" class="wide-button p-button-outlined p-button-danger" @click="deleteStep(index)" />
                        </div>
                    </div>
                    <div v-if="step.photo" class="image-wrapper">
                        <img :src="step.photo" alt="step-preview" class="image-preview" />
                    </div>
                </template>

                <div v-if="index < steps.length - 1" class="p-d-flex p-ai-center p-my-2">
                  <Button
                      label="Přidat krok mezi jiné kroky"
                      class="p-button-outlined p-button-secondary"
                      @click="addStepBetween(index)"
                  />
              </div>
              <!-- Add step inbetween -->
              <div v-if="temporarySteps[index]?.isVisible" class="temporary-step-container">
                <div class="step-container">
            <InputText 
                v-model="newStep.name" 
                class="step-name-input"
                @input="temporarySteps[index].name_was_edited = true" 
            />
            <div class="step-input-row">
                <Textarea
                    v-model="temporarySteps[index].text"
                    class="step-textarea"
                    placeholder="Sem vložte vaše kroky"
                    rows="3"
                    autoResize
                />
                <div class="image-container">
                    <div class="image-wrapper" v-if="temporarySteps[index].photo">
                        <img 
                            :src="temporarySteps[index].photo" 
                            alt="new-step-photo" 
                            class="image-preview" 
                        />
                        <button class="delete-photo-btn p-button-danger" @click="deletePhoto('new')">×</button>
                    </div>
                    <PhotoUploader v-model="temporarySteps[index].photo" />
                </div>
            </div>  
        </div>
                  <Button icon="pi pi-check" class="wide-button p-button-outlined" @click="finalizeStepBetween(index)" />
              </div>
            </div>
        </div>
  
        <!-- New Step Input -->
        <div class="step-container">
            <InputText 
                v-model="newStep.name" 
                placeholder="Krok 1" 
                class="step-name-input"
                @input="newStep.name_was_edited = true" 
                @keyup.enter="PushStep"
            />
            <div class="step-input-row">
                <Textarea
                    v-model="newStep.text"
                    class="step-textarea"
                    placeholder="Sem pište vaše kroky"
                    rows="3"
                    autoResize
                    @keyup.enter="PushStep"
                />
                <div class="image-container">
                    <div class="image-wrapper" v-if="newStep.photo">
                        <img 
                            :src="newStep.photo" 
                            alt="new-step-photo" 
                            class="image-preview" 
                        />
                        <button class="delete-photo-btn p-button-danger" @click="deletePhoto('new')" />
                    </div>
                    <PhotoUploader v-model="newStep.photo" />
                </div>
            </div>
        </div>
        <div class="button-wrapper">
            <Button icon="pi pi-plus" class="wide-button p-button-outlined" @click="PushStep" />
        </div>
    </div>
</template>


<style scoped>
    .step-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 1rem;
    }

    .step-name-input {
        width: 100%;
        font-size: 1.2rem;
        padding: 0.5rem;
    }

    .step-input-row {
        display: flex;
        width: 100%;
        gap: 1rem;
        align-items: flex-start;
    }

    .step-textarea {
        flex: 2;
        font-size: 1rem;
        padding: 0.5rem;
        resize: none;
    }

    .image-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .image-wrapper {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .image-preview {
        width: 100%;
        height: 150px;
        object-fit: cover;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    .delete-photo-btn {
        position: absolute;
        top: 5px;
        right: 5px;
        border: none;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .steps-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .step-item {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
        border-radius: 8px;
        transition: box-shadow 0.3s ease;
    }

    .step-item:hover {
        background-color: rgb(42, 42, 42);
    }

    .step-display {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .step-name {
        font-weight: bold;
        font-size: 1.4rem;
        overflow: scroll;
        white-space: nowrap;
        max-width: 300px;
    }

    .step-text {
        font-size: 1rem;
        word-wrap: break-word;
        white-space: pre-wrap;
        line-height: 1.5;
        max-width: 300px;
    }

    .button-wrapper {
        display: flex;
        gap: 1rem;
        justify-content: flex-start;
    }

    .wide-button {
        margin-top: 0.5rem;  
        min-width: 120px;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        text-align: center;
    }

    .draggable-icon {
        cursor: grab;
        margin-right: 0.5rem;
        color: #888;
        font-size: 1.2rem;
        vertical-align: middle;
    }

</style>