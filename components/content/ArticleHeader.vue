<script setup lang="ts">

const props = defineProps<{
    url: string,
    version: string,
}>();

const route = useRoute();
const { data } = await useAsyncData('page-data', () => queryContent(route.path).findOne());
</script>
<template>
    <p>date: {{ data.date }}</p>
    <a v-if="url" :href="url"> {{ version === "french" ? "Lire l'article en anglais" : "Read this article in french" }}</a>
</template>

