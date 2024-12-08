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
  <div style="display: flex;">
    <!-- Display image preview if a photo is selected -->
    <div v-if="photo">
      <img :src="photo" alt="Preview" class="image-preview" />
    </div>
    <!-- File Input for photo upload -->
    <input 
      type="file" 
      accept="image/*" 
      @change="onFileChange" 
      :disabled="disabled"
      ref="fileInput"
    />
  </div>
</template>

<style>
/* Container for the image preview with a fixed aspect ratio (rectangle) */
.image-preview {
  max-width: 100px;  /* Adjust the max width as needed */
  max-height: 100px;
  object-fit: cover;
  margin-top: 10px;
  width: 100px; /* Width of the rectangle */
  height: 100px; /* Height of the rectangle */
  overflow: hidden; /* Hide the overflowed part of the image */
}

/* Ensure the image is cropped to fit the container */
.image-preview img {
  width: 100%; /* Fill the width of the container */
  height: 100%; /* Fill the height of the container */
  object-fit: cover; /* Crop the image to fill the area, maintaining aspect ratio */
}
</style>