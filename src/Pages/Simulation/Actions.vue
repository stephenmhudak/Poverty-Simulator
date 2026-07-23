<script setup lang="ts">
import { ref } from "vue";
import { useSimulationStore } from '../../Stores/SimulationStore.ts';

import PsButton from '../../Components/PsButton.vue';
import PsModal from '../../Components/PsModal.vue';

const store = useSimulationStore();

const showModal = ref<boolean>(false);
</script>

<template>
    <div class="flex flex-wrap justify-between bg-blue-500">
        <PsButton
            label="Show Bill Options"
            color="blue"
            @click="showModal = true"
        />
        <PsButton
            :label="'Start Next Day'"
            color="blue"
            @click="store.startNextDay"
        />

        <PsModal v-model="showModal">
            <div class="flex justify-between">
                <PsButton
                    v-for="item in store.unpaidBills"
                    :label="'Pay ' + item + ' Bill'"
                    color="blue"
                    class="ps-btn-sm"
                    @click="store.payBill(item)"
                />
            </div>
        </PsModal>
    </div>
</template>