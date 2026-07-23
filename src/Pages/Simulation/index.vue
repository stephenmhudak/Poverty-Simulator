<script setup lang="ts">
import { useUserStore } from '../../Stores/UserStore.ts';
import { useSimulationStore } from '../../Stores/SimulationStore.ts';

import PsButton from '../../Components/PsButton.vue';

import Actions from './Actions.vue'
import Bills from './Bills.vue'
import Log from './Log.vue'
import Start from '../Start/index.vue';

const userStore = useUserStore();
const simulationStore = useSimulationStore();

simulationStore.startSimulation();
</script>

<template>
    <Start
        v-show="userStore.firstName === '' || userStore.lastName === '' || userStore.age === 0 || userStore.gender === ''" />

    <div
        v-show="userStore.firstName !== '' || userStore.lastName !== '' || userStore.age !== 0 || userStore.gender !== ''"
        class="pb-4"
    >

        <Actions />

        <Bills />
       
        <div class="flex items-start">
            <Log />
        </div>

    </div>
</template>