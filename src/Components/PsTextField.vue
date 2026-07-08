<script setup lang="ts">
import { computed } from 'vue';

const model = defineModel<string | number | Date | null>();

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
    <input
        :name="props.name"
        :disabled="props.disabled"
        :class="'ps-textfield' + isDisabled + ' ' + props.class"
        :placeholder="props.label"
        :type="props.type"
        v-model="model"
    >
</template>