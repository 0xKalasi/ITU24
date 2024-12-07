// stores/recipeStore.js
import { defineStore } from 'pinia';

export const useRecipeStore = defineStore('recipeStore', {
  state: () => ({
    recipeData: {
      ingredients: [],
      title: '',
      imageFile: null, // Temporarily holds the image file
      imageUrl: null, // Holds the URL after the upload
    }
  }),
  actions: {
    setImage(file) {
      this.recipeData.imageFile = file;
    },
    setImageUrl(url) {
      this.recipeData.imageUrl = url;
    },
    resetRecipeData() {
      this.recipeData = {
        ingredients: [],
        title: '',
        imageFile: null,
        imageUrl: null,
      };
    }
  }
});