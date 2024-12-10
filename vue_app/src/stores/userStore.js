// Martin Jabůrek, xjabur02

import { defineStore } from "pinia"
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const id = ref(0);
  const name = ref("");
  const bio = ref("");
  
  return { id, name, bio };
});

// name and bio might have been edited and aren't store elsewhere
// editMode is needed to set the mode correctly when returning from preview page
export const profilePreviewStore = defineStore("preview", () => {
  const name = ref("");
  const bio = ref("");

  const editMode = ref(false);

  return { name, bio, editMode };
});
