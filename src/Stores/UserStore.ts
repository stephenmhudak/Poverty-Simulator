import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('User', () => {
    const firstName = ref<string>('');
    const lastName = ref<string>('');
    const age = ref<number>(0);
    const gender = ref<"" | "Male" | "Female">('');
    const highestLevelOfEducation = ref<"" | "Some High School" | "High School Diploma" | "Some College" | "Associate's Degree" | "Bachelor's Degree or Higher">('');
    const race = ref<"" | "American Indian or Alaskan Native" | "Asian" | "Black or African American" | "Hispanic or Latino" | "Middle Eastern of North African" | "Native Hawaiian or Pacific Islander" | "White">(''); //https://www.census.gov/about/our-research/race-ethnicity/standards-updates.html

    return { 
        firstName,
        lastName,
        age,
        gender,
        highestLevelOfEducation,
        race
    }
})