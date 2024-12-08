<template>
    <div class="time-input">
      <div class="time-fields">
        <InputNumber 
          id="hours" 
          v-model="hours" 
          :min="0" 
          :max="100" 
          placeholder="Hours" 
          :showButtons="true" 
          buttonLayout="horizontal" 
          decrementButtonClass="p-button-sm p-button-secondary" 
          incrementButtonClass="p-button-sm p-button-secondary" 
          decrementButtonIcon="pi pi-minus" 
          incrementButtonIcon="pi pi-plus" 
          class="p-inputnumber-sm centered-input"
          @paste="handlePaste"
        />
        <span>h</span>
        <InputNumber 
          id="minutes" 
          v-model="minutes" 
          :min="0" 
          :max="59" 
          placeholder="Minutes" 
          :showButtons="true" 
          buttonLayout="horizontal" 
          decrementButtonClass="p-button-sm p-button-secondary" 
          incrementButtonClass="p-button-sm p-button-secondary" 
          decrementButtonIcon="pi pi-minus" 
          incrementButtonIcon="pi pi-plus" 
          class="p-inputnumber-sm centered-input"
          @paste="handlePaste"
        />
        <span>m</span>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import InputNumber from 'primevue/inputnumber';
  
  // Reactive variables for hours and minutes
  const hours = ref(0);
  const minutes = ref(0);
  
  // Computed property for displaying the total time
  const formattedTime = computed(() => {
    return `${hours.value} hours and ${minutes.value.toString().padStart(2, '0')} minutes`;
  });
  
  // Handle pasting time in HH:MM format
  const handlePaste = (event) => {
    const pasteContent = event.clipboardData.getData('Text');
  
    // Check if the pasted content matches the HH:MM format
    const timePattern = /^(\d{1,3}):([0-5]?\d)$/;
    const match = pasteContent.match(timePattern);
  
    if (match) {
      const pastedHours = parseInt(match[1], 10);
      const pastedMinutes = parseInt(match[2], 10);
  
      if (pastedHours >= 0 && pastedHours <= 100 && pastedMinutes >= 0 && pastedMinutes < 60) {
        hours.value = pastedHours;
        minutes.value = pastedMinutes;
      } else {
        alert("Invalid time format or out of range (Hours: 0–100, Minutes: 0–59).");
      }
  
      event.preventDefault();
    } else {
      alert("Please paste time in HH:MM format.");
      event.preventDefault();
    }
  };
  </script>
  
  <style>
  .time-input {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .time-fields {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .time-fields span {
    font-weight: bold;
  }
  
  /* Centering the numbers inside the InputNumber fields */
  .centered-input .p-inputtext {
    text-align: center;
  }
  </style>
  