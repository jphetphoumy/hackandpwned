<template>
  <nav class="toc" v-if="articles && articles.length">
    <h2>Table of Contents</h2>
    <ul>
      <li
        v-for="(article, index) in articles"
        :key="article._path"
        :class="{ active: route.path === article._path }"
      >
        <NuxtLink :to="article._path">
          [0x{{ (article.chapter || index).toString(16).padStart(2, '0') }}] {{ article.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const route = useRoute()
// Extract issue number from the route path
// This handles both '/zine/00' and '/zine/00/article-slug' paths
const issueMatch = route.path.match(/\/zine\/(\d+)/)
const issueNumber = issueMatch ? issueMatch[1] : '01'

console.log('Issue number detected:', issueNumber)

const { data: articles } = await useAsyncData(`toc-${issueNumber}`, () =>
  queryContent(`/zine/${issueNumber}`)
    .only(['_path', 'title', 'chapter'])
    .sort({ chapter: 1 })
    .where({ _path: { $ne: `/zine/${issueNumber}` } }) // Exclude the index file
    .find()
)

console.log('Articles found:', articles.value)
</script>
<style scoped>
.toc {
  margin-bottom: var(--space-lg);
  border-left: 3px solid var(--color-border-soft);
  padding-left: var(--space-sm);
}

.toc h2 {
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: var(--font-size-toc);
  margin-bottom: var(--space-xs);
}

.toc ul {
  list-style: none;
  padding-left: 0;
}

.toc li {
  margin-bottom: 0.5rem;
}

.toc a {
  color: var(--color-link);
  text-decoration: underline dotted;
}

.toc li.active a {
  font-weight: bold;
  color: var(--color-text);
  text-decoration: none;
  background-color: var(--color-code-bg);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}
</style>

