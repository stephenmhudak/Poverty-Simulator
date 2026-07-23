<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';
import { useSimulationStore } from '../../Stores/SimulationStore.ts';
import type { Bill } from '../../Types/SimulationTypes';

const store = useSimulationStore();

function billsNamed(names: string[]): (bill: Bill) => boolean {
    return (bill: Bill): boolean => names.includes(bill.title);
}

const unpaidBillDetails: ComputedRef<Bill[]> = computed(() =>
    store.BILLS.filter(billsNamed(store.unpaidBills))
);

const cutoffBillDetails: ComputedRef<Bill[]> = computed(() =>
    store.BILLS.filter(billsNamed(store.cutoffBills))
);
</script>

<template>
    <p>Available Funds: ${{ store.bankAccount.toFixed(2) }}</p>

    <div v-if="unpaidBillDetails.length !== 0">
        <h5>Unpaid Bills</h5>
        <ul>
            <li
                v-for="(bill, index) in unpaidBillDetails"
                :key="bill.title"
                class="inline-block"
                :class="index !== unpaidBillDetails.length - 1 ? 'mr-4' : ''"
            >
                {{ bill.title }}: ${{ bill.amounts[0].toFixed(2) }}
            </li>
        </ul>
    </div>

    <div v-if="cutoffBillDetails.length !== 0">
        <h5>Cutoff Bills</h5>
        <ul>
            <li
                v-for="(bill, index) in cutoffBillDetails"
                :key="bill.title"
                class="inline-block"
                :class="index !== cutoffBillDetails.length - 1 ? 'mr-4' : ''"
            >
                {{ bill.title }}: ${{ bill.amounts[0].toFixed(2) }}
            </li>
        </ul>
    </div>
</template>