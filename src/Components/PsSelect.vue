<script setup lang="ts">
import { computed, type PropType } from 'vue';



const model = defineModel<string | number | Date | null>({ default: null });

interface PsSelectOption {
    value: string | number;
    text: string;
}

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'text'
    },
    values: {
        type: Array as PropType<PsSelectOption[]>,
        default: () => []
    }
});

const isDisabled = computed(() => {
    if (!props.disabled) {
        return '';
    }
    return ` ps-textfield-disabled`;
});
</script>

<template>
    <label :for="props.name" class="ps-textfield-label">{{ props.label }}</label>
    <select
        :name="props.name"
        :disabled="props.disabled"
        :class="'ps-textfield' + isDisabled + ' ' + props.class"
        :placeholder="props.label"
        :type="props.type"
        v-model="model"
    >
        <option :value="null" disabled>Select a value...</option>
        <option v-for="item in props.values" :key="item.value" :value="item.value">{{ item.text }}</option>
    </select>
</template>