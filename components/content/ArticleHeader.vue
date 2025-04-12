<script setup lang="ts">

const route = useRoute();
const { data } = await useAsyncData('page-data', () => queryContent(route.path).findOne());
</script>
<template>
    <p>date: {{ data.date }}</p>
</template>

