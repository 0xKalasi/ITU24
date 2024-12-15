/* Tomáš Bordák, xborda01 */

import { defineStore } from "pinia"
import { ref } from "vue";

export const useFilterStore = defineStore("filterStore", () => {
    const filterAddSuccess = ref(false);
    const filterAddError = ref(false);
    const filterEditSuccess = ref(false);
    const filterEditError = ref(false);
    
    return { filterAddSuccess, filterAddError, filterEditSuccess, filterEditError };
});
  