<script setup lang="ts">
import PsButton from '../../Components/PsButton.vue';
import UserInfo from './UserInfo.vue';
</script>

<template>
    <UserInfo />

    <PsButton label="Begin simulation" color="blue" :disabled="false" class="block my-1" to="/start" />
</template>
