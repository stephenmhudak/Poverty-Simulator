<script setup lang="ts">
import { computed } from "vue";
import { useSimulationStore } from '../../Stores/SimulationStore';
import PsButton from '../../Components/PsButton.vue';

const store = useSimulationStore();

const groupedLog = computed(() => {
    const grouped = Object.groupBy(store.dailyLog, day => day.day);

    return Object.entries(grouped).sort(([a], [b]) => Number(b) - Number(a));
})
</script>

<template>
    <div class="mt-4 w-full">
        <ul>
            <li v-for="([key, day], index) in groupedLog" :class="index !== 0 ? 'mt-4' : ''">
                <h6>{{ key }}</h6>
                <ul>
                    <li v-for="item in day">{{ item.description }}</li>
                </ul>
            </li>
        </ul>
    </div>
</template>