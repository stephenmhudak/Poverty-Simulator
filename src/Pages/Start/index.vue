<script setup lang="ts">
import { ref } from 'vue';
import PsButton from '../../Components/PsButton.vue';
import PsTextField from '../../Components/PsTextField.vue';
import PsSelect from '../../Components/PsSelect.vue';

import { useUserStore } from '../../Stores/UserStore.ts';
import { useSimulationStore } from '../../Stores/SimulationStore.ts';

const userStore = useUserStore();
const simulationStore = useSimulationStore();

const firstName = ref<string>('');
const lastName = ref<string>('');
const age = ref<number>(0);
const gender = ref<string>('');

const genders = [
    {
        text: "Male",
        value: "male"
    },
    {
        text: "Female",
        value: "female"
    }
]

function applyUserDetails() {
    userStore.firstName = firstName.value;
    simulationStore.dailyLog.push("First name: " + firstName.value);

    userStore.lastName = lastName.value;
    simulationStore.dailyLog.push("Last name: " + lastName.value);

    userStore.age = age.value;
    simulationStore.dailyLog.push("Age: " + age.value);

    userStore.gender = gender.value;
    simulationStore.dailyLog.push("Gender " + gender.value);

    return
}
</script>

<template>
    <div>
        <div>
            <PsTextField name="firstName" label="First Name" class="" :disabled="false" v-model="firstName" />
        </div>
        <div>
            <PsTextField name="lastName" label="Last Name" :disabled="false" v-model="lastName" />
        </div>
        <div>
            <PsTextField name="age" label="Age" :disabled="false" type="number" v-model="age" />
        </div>
        <div>
            <PsSelect name="gender" label="Gender" :disabled="false" :values="genders" v-model="gender" />
        </div>

        <PsButton label="Begin simulation" color="blue" class="block my-1" @click="applyUserDetails" />
    </div>
</template>
