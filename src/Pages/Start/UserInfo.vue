<script setup lang="ts">
import { useUserStore } from '../../Stores/UserStore.ts';
import PsTextField from '../../Components/PsTextField.vue';
import PsSelect from '../../Components/PsSelect.vue';

const userStore = useUserStore();

const ages = [{text: "11", value: 11}];
</script>

<template>
    <div>
        <PsTextField
            name="firstName"
            label="First Name"
            class=""
            :disabled="false"
            v-model="userStore.firstName"
        />
    </div>
    <div>
        <PsTextField
            name="lastName"
            label="Last Name"
            :disabled="false"
            v-model="userStore.lastName"
        />
    </div>
    <div>
        <PsTextField
            name="age"
            label="Age"
            :disabled="false"
            type="number"
            v-model="userStore.age"
        />
    </div>
    <div>
        
    </div>
</template>
