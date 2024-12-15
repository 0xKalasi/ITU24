/*
    FILE:       filterStore.js
    AUTHOR:     Tomáš Bordák, xborda01 
    DATE:       15.12.2024
    INFO:       Exchange data between filter views.
*/

import { defineStore } from "pinia"
import { ref } from "vue";

export const useFilterStore = defineStore("filterStore", () => {
    const filterAddSuccess = ref(false);
    const filterAddError = ref(false);
    const filterEditSuccess = ref(false);
    const filterEditError = ref(false);

    return { filterAddSuccess, filterAddError, filterEditSuccess, filterEditError };
});
  