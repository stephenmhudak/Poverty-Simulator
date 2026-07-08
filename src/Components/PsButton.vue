<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: 'blue',
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
    to: {
        type: String,
        required: false
    },
    type: {
        type: String,
        default: 'button'
    }
});

const router = useRouter();

const buttonColor = computed(() => {
    if (props.disabled) {
        return `ps-btn-disabled`;
    }
    return `ps-btn-${props.color}`;
});
</script>

<template>
    <button
        v-if="props.to"
        :disabled="props.disabled"
        :class="'ps-btn ' + buttonColor + ' ' + props.class"
        @click="router.push(props.to)"
    >
        {{ props.label }}
    </button>

    <button
        v-else
        :disabled="props.disabled"
        :class="'ps-btn ' + buttonColor">
        {{ props.label }}
    </button>
</template>