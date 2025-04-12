<template>
  <nav class="toc" v-if="showToc && articles && articles.length">
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
const route = useRoute();

// Computed properties to reactively determine the current state
const issueMatch = computed(() => route.path.match(/\/zine\/(\d+)/));
const issueNumber = computed(() => issueMatch.value ? issueMatch.value[1] : '01');
const showToc = computed(() => {
  // Show TOC only on exact zine issue pages like /zine/01, not on /zine or /zine/01/article
  const zineRegex = /^\/zine\/\d{2}(\/.*)?$/;
  return zineRegex.test(route.path);
});

// Use a ref for the asyncData key that updates when issueNumber changes
const asyncDataKey = computed(() => `toc-${issueNumber.value}`);

// Re-fetch articles when the issue number changes
const { data: articles } = await useAsyncData(
  asyncDataKey.value, // String key, not a function
  () => queryContent(`/zine/${issueNumber.value}`)
    .only(['_path', 'title', 'chapter'])
    .sort({ chapter: 1 })
    //.where({ _path: { $ne: `/zine/${issueNumber.value}` } }) // Exclude the index file
    .find(),
  {
    watch: [issueNumber]
  }
);

console.log('Issue number detected:', issueNumber.value);
console.log('Articles found:', articles.value);
console.log('Should show TOC:', showToc.value);
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
