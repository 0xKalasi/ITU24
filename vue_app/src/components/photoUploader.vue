<script setup>
import { ref, watch } from 'vue';
import FileUpload from 'primevue/fileupload';

// Define prop for v-model binding and disable functionality
const props = defineProps({
  modelValue: String,  // This will hold the photo URL or base64 string
  disabled: {
    type: Boolean,
    default: false
  }
});

// Define emit to update the parent component with the selected photo
const emit = defineEmits(['update:modelValue']);

// Internal reference to the uploaded file
const photo = ref(props.modelValue || ''); // Initially set to the current value if passed from parent

// Watch for changes in modelValue from the parent and update internal photo state
watch(() => props.modelValue, (newValue) => {
  photo.value = newValue;
});

// Handle the file selection
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Create a file URL for image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const fileURL = reader.result; // This is the image URL (Base64 or file URL)
      photo.value = fileURL; // Set photo value to preview it
      emit('update:modelValue', fileURL); // Emit the selected file URL to the parent
    };
    reader.readAsDataURL(file); // Read the file as Data URL for preview
  }
};
</script>

<template>
  <div style="display: flex; align-items: center; gap: 10px;">
    <!-- Hidden File Input -->
    <input
      type="file"
      accept="image/*"
      @change="onFileChange"
      :disabled="disabled"
      ref="fileInput"
      style="display: none;"
    />

    <!-- Styled Button -->
    <button 
      class="upload-button"
      :disabled="disabled"
      @click="$refs.fileInput.click()"
    >
      <i class="pi pi-camera"></i> Upload Photo
    </button>
  </div>
</template>


<style scoped>
/* Style for the upload button */
.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none; /* Remove default border */
  border-radius: 5px; /* Rounded corners */
  padding: 10px 15px; /* Padding for button size */
  cursor: pointer; /* Pointer cursor on hover */
  font-size: 1rem; /* Adjust font size */
  gap: 8px; /* Space between icon and text */
}

.upload-button i {
  font-size: 1.2rem; /* Adjust camera icon size */
}


.upload-button:disabled {
  background-color: #cccccc; /* Gray for disabled state */
  cursor: not-allowed;
}
</style>