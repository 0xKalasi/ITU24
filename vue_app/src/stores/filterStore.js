/* Tomáš Bordák, xborda01 */

import { defineStore } from "pinia"
import { ref } from "vue";

export const useFilterStore = defineStore("filterStore", () => {
    const filterAddSuccess = ref(false);
    const filterEditSuccess = ref(false);

    return { filterAddSuccess, filterEditSuccess };
});
  