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

    
    // Full-screen view state
const isFullImage = ref(false);
const toggleFullImage = () => {
  isFullImage.value = !isFullImage.value;
};

// Reference for file input
const fileInput = ref(null);

// Trigger the hidden file input for editing an existing photo
const triggerFileInput = () => {
  fileInput.value.click();
};

// Handle the file change for editing the photo
const handleFileEdit = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      recipe.value.photo = reader.result; // Update the photo
    };
    reader.readAsDataURL(file);
  }
};

// Delete the photo
const deleteRecipePhoto = () => {
  recipe.value.photo = ''; // Clear the photo
};
  </script>

<template>
  <!-- Aert component for showing alerts use the fucntion showAlertMessage -->
  <Alert v-if="showAlert" :type="alertType" :text="alertText" :key="alertKey"></Alert>

  <!-- If loading the recipe from database wait for it to load -->
  <LoadingScreen v-if="isLoading" />

  <!-- Show the form for creating/editing a recipe -->
  <div v-else>
    <BasicPageHeader v-if="recipeId" text="Uprav recept"/>
    <BasicPageHeader v-else text="Vytvoř recept"/>

      <div>

      <div v-if="recipe.photo" class="image-container">
        <img :src="recipe.photo" alt="Preview" class="image-preview" @click="toggleFullImage" />

        <!-- Delete Photo Button -->
    <Button 
      icon="pi pi-trash" 
      class="delete-photo-button p-button-danger" 
      @click="deleteRecipePhoto" 
    />

    <!-- Edit Photo Button -->
    <Button 
      icon="pi pi-pencil" 
      class="edit-photo-button p-button-success" 
      @click="triggerFileInput"
    />

    <!-- Hidden File Input to trigger edit functionality -->
    <input 
      type="file" 
      accept="image/*" 
      ref="fileInput" 
      style="display: none" 
      @change="handleFileEdit"
    />

        <!-- Full-Screen Image -->
        <div v-if="isFullImage" class="full-image-overlay" @click="toggleFullImage">
          <img :src="recipe.photo" alt="Full View" class="full-image" />
        </div>
      </div>

       <!-- Title TextArea Input -->
       <div class="p-field p-d-flex p-ai-center p-mb-3 title-container in-one-row">
        <!-- <h2>Název</h2> -->
        <Textarea
          id="title"
          placeholder="Vložte název pro váš recept!"
          class="title-textarea"
          rows="1"
          autoResize
          v-model="recipe.name"
        />
        <PhotoUploader v-if="!recipe.photo" v-model="recipe.photo" />
      </div>

        <h2>Ingredence</h2>
        <addIngredient v-model="recipe.Ingredients"/>
        
        <h2>Instrukce</h2>
        <addSteps v-model="recipe.Step"/>
        

        <h2>Speciální pomúcky</h2>
        <addUtencils v-model="recipe.Utencils"/>
    
        <!-- General Info Section -->
        <div class="p-mb-3">
          <h2>Všeobecné informace</h2>
          <div class="p-d-flex p-ai-center p-mb-2">
            <h3 class="p-mr-2">Počet porcí</h3>
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
            <h3 class="p-mr-2">Čas přípravy</h3>
            <TimePicker v-model="recipe.time_to_cook" showIcon fluid iconDisplay="input" timeOnly >
              <template #inputicon="slotProps" @change="saveTime" >
                  <i class="pi pi-clock" @click="slotProps.clickCallback" />
              </template>
            </TimePicker>
          </div>

          <div style="display: flex; align-items: center;">
            <h3 style="padding-right: 3rem;">Is public</h3>
            <ToggleSwitch v-model="checked" @click="setPublic">
              <template #handle="{ checked }">
                <i :class="['!text-xs pi', { 'pi-check': checked, 'pi-times': !checked }]" />
              </template>
            </ToggleSwitch>
          </div>
        </div>
        
  
        <!-- Create, Delete Button -->
        <div class="flex justify-between items-center px-4">
          <div v-if="recipeId">
            <Button label="Uložit úpravy" class="wide-button p-button-ok" @click='updateRecipeLocal();'></Button>
            <Button label="Vytvořit jako kopii" class=" wide-button p-button-ok" @click='createRecipe();'></Button>
          </div>
          <div v-else>
            <Button label="Zrušit" class="wide-button p-button-danger" @click='cancelEditing();'></Button>
            <Button label="Vytvořit" class="wide-button p-button-ok" @click='createRecipe();'></Button>
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
  align-items: center; /* Center-aligns items */
  justify-content: space-between; /* Ensures title and uploader are spaced */
}

.title-textarea {
  width: 100%; /* Ensures the Textarea fills the available width */
  font-size: 20px;
  background-color: #5a5a5a;
  border: none; /* Removes border */
  border-radius: 5px; /* Slight rounding */
  resize: none; /* Prevents resizing */
  padding: 10px; /* Adds padding for better usability */
  color: #fff; /* Text color for better readability */
  overflow: hidden; /* Prevents scrollbars if any */
  line-height: 1.5; /* Adjusts line spacing */
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

  /* Container for image and buttons */
.image-container {
  position: relative; /* Enable positioning for buttons */
  width: 100%; /* Full width */
  max-height: 100px; /* Constrain height */
}

/* Image preview */
.image-preview {
  width: 100%; /* Full width */
  max-height: 100px; /* Fix the maximum height */
  object-fit: cover; /* Ensure image covers the container proportionally */
  border-radius: 5px; /* Rounded corners */
}

/* Delete button positioned at the top-right corner */
.delete-photo-button {
  position: absolute; /* Position relative to the container */
  top: 5px; /* Adjust vertical positioning */
  right: 5px; /* Adjust horizontal positioning */
  padding: 5px; /* Compact padding */
  width: 30px; /* Square button */
  height: 30px; /* Square button */
  border-radius: 50%; /* Circular button */
  display: flex; /* Center icon */
  align-items: center; /* Center icon vertically */
  justify-content: center; /* Center icon horizontally */
  font-size: 1rem; /* Icon size */
  z-index: 10; /* Ensure it's above the image */
}

/* Edit button positioned below the delete button */
.edit-photo-button {
  position: absolute; /* Position relative to the container */
  top: 45px; /* Positioned below the delete button */
  right: 5px; /* Align with the delete button */
  padding: 5px; /* Compact padding */
  width: 30px; /* Square button */
  height: 30px; /* Square button */
  border-radius: 50%; /* Circular button */
  display: flex; /* Center icon */
  align-items: center; /* Center icon vertically */
  justify-content: center; /* Center icon horizontally */
  font-size: 1rem; /* Icon size */
  z-index: 10; /* Ensure it's above the image */
}
  /* Full-Screen Image Overlay */
.full-image-overlay {
  position: fixed; /* Full-screen positioning */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* Semi-transparent black background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000; /* Ensure it overlays everything */
  cursor: pointer; /* Clicking anywhere will exit */
}

/* Full-Screen Image */
.full-image {
  max-width: 90%; /* Ensure the image fits the screen */
  max-height: 90%;
  object-fit: contain; /* Ensure aspect ratio is maintained */
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

h2 {
  position: relative; /* Ensure relative positioning for the line */
  padding-bottom: 0.5rem; /* Add some spacing below the text */
  margin-bottom: 1rem; /* Add spacing between the text and subsequent content */
  font-size: 1.5rem; /* Adjust heading size if needed */
}

h2::after {
  content: ""; /* Creates an empty element for the line */
  position: absolute;
  left: 0;
  bottom: 0; /* Positions the line at the bottom of the heading */
  width: 100%;
  height: 2px; /* Thickness of the line */
  background-color: #ccc; /* Line color */
  border-radius: 2px; /* Slight rounding for a softer look */
}

.wide-button {
    min-width: 70px;
    padding: 0.5rem 1rem;
    font-size: 1rem;
    text-align: center;
}
  </style>