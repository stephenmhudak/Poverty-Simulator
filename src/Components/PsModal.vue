<script setup lang="ts">
import { computed } from 'vue';

const model = defineModel<boolean>();

const props = defineProps({
    class: {
        type: String,
        required: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        default: ''
    }
});

const psModalClasses = computed(() => {
    if (model.value) {
        return 'ps-modal block'
    }

    return 'ps-modal hidden'
})
</script>

<template>
    <div :id="props.name" :class="psModalClasses">

        <div class="ps-modal-content">
            <div class="text-right">
                <span class="close" @click="model = false">&times;</span>
            </div>
            <slot></slot>
        </div>

    </div>
</template>