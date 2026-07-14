<script setup lang="ts">
import { useUserStore } from '../../Stores/UserStore.ts';
import { useSimulationStore } from '../../Stores/SimulationStore.ts';

import Start from '../Start/index.vue';

const userStore = useUserStore();
const simulationStore = useSimulationStore();
</script>

<template>
    <Start
        v-show="userStore.firstName === '' || userStore.lastName === '' || userStore.age === 0 || userStore.gender === ''" />

    <template
        v-show="userStore.firstName !== '' || userStore.lastName !== '' || userStore.age !== 0 || userStore.gender !== ''">
        <!-- Avatar -->
        <!-- Work and Bank Balances -->
        <!-- Day's Events -->
        <!-- Actions -->
    </template>
</template>