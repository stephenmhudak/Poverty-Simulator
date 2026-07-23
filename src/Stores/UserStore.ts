import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('User', () => {
    const firstName = ref<string>('Stephen');
    const lastName = ref<string>('Hudak');
    const age = ref<number>(35);
    const gender = ref<string>('male');

    return { 
        firstName,
        lastName,
        age,
        gender
    }
})