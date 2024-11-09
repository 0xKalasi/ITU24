import { defineStore } from 'pinia'
import {ref} from 'vue';

export const useUserStore = defineStore('user', () => {
    const id = ref(0)
    const name = ref("")
    const bio = ref("")
    
    return { id, name, bio }
})