<script setup lang="ts">
import PsButton from '../Components/PsButton.vue';
</script>

<template>
    <div>
        <PsButton
            label="Start a new simulation"
            color="blue"
            :disabled="false"
            class="block my-1"
            to="/new"
                />

        <PsButton
            label="Resume a simulation"
            color="blue"
            :disabled="false"
            class="block my-1"
            to="/resume"
        />

        <PsButton
            label="Help"
            color="blue"
            :disabled="false"
            class="block my-1"
            to="/help"
        />

        <PsButton
            label="About"
            color="blue"
            :disabled="false"
            class="block my-1"
            to="/about"
        />
    </div>
</template>
