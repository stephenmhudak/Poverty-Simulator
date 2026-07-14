import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('User', () => {
    const firstName = ref<string>('');
    const lastName = ref<string>('');
    const age = ref<number>(0);
    const gender = ref<string>('');

    return { 
        firstName,
        lastName,
        age,
        gender
    }
})