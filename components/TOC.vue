<template>
  <nav class="toc" v-if="articles.length">
    <h2>Table of Contents</h2>
    <ul>
      <li
        v-for="(article, index) in articles"
        :key="article._path"
        :class="{ active: route.path === article._path }"
      >
        <NuxtLink :to="article._path">
          [0x{{ article.chapter.toString(16).padStart(2, '0') }}] {{ article.title }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup>
const route = useRoute()
const issueNumber = route.params.issue || '01'

const { data: articles } = await useAsyncData(`toc-${issueNumber}`, () =>
  queryContent(`/zine/${issueNumber}`)
    .only(['_path', 'title', 'chapter'])
    .sort({ chapter: 1 })
    .find()
)
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

