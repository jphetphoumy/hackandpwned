<script setup lang="ts">
import { computed } from 'vue'
const { data } = await useAsyncData('articles', () => queryContent('/articles').find())
const tags = computed(() => data.value.map((article) => article.tag).filter((tag) => tag !== undefined))
const LLMArticles = (tag) => data.value.filter((article) => article.tag === tag).sort((a, b) => a.date > b.date ? -1 : 1)
console.log(LLMArticles('LLM'))
</script>
<template>
    <section class="articles">
        <article>
            <h1>Latest Articles</h1>
            <ul>
                <li v-for="tag in tags" :key="tag">
                    <h2>{{ tag }}</h2>
                    <ul>
                        <li v-for="article in LLMArticles(tag)" :key="article.id">
                            <router-link :to="`${article._path}`">{{ article.title }} - [Published {{article.date}}]</router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </article>
    </section>
</template>

<style scoped>
ul {
    list-style-type: none;
    padding: 0;
}
</style>
