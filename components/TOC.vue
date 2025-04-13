<template>
    <nav class="toc" v-if="showToc && groupedArticles && Object.keys(groupedArticles).length">
        <h2>Table of Contents</h2>
        <ul>
            <li
                    v-for="({ langs, slug }, index) in groupedArticles"
                    :key="slug"
                    :class="{ active: route.path === langs.fr?._path || route.path === langs.en?._path }"
                    >
                    <NuxtLink :to="langs[currentLang]?.['_path'] || slug">
                    [0x{{ (langs.en?.chapter || langs.fr?.chapter || index).toString(16).padStart(2, '0') }}] 
                    {{ langs[currentLang]?.title || langs.en?.title || langs.fr?.title }}
                    </NuxtLink>
                <span class="lang-switch">
                    <template v-if="langs.fr && langs.en">
                        <NuxtLink
                                :to="langs.fr._path"
                                :class="{ selected: isCurrent(langs.fr._path) }"
                                >FR</NuxtLink> |
                                <NuxtLink
                                        :to="langs.en._path"
                                        :class="{ selected: isCurrent(langs.en._path) }"
                                        >EN</NuxtLink>
                    </template>
                    <template v-else-if="langs.fr">
                        <NuxtLink
                                :to="langs.fr._path"
                                :class="{ selected: isCurrent(langs.fr._path) }"
                                >FR</NuxtLink>
                    </template>
                    <template v-else-if="langs.en">
                        <NuxtLink
                                :to="langs.en._path"
                                :class="{ selected: isCurrent(langs.en._path) }"
                                >EN</NuxtLink>
                    </template>
                </span>

            </li>
        </ul>
    </nav>
</template>

<script setup>
const route = useRoute()

watchEffect(() => {
  console.log('Current route:', route.path)
})


// Detect issue number
const issueMatch = computed(() => route.path.match(/\/zine\/(\d+)/) || route.path.match(/\/fr\/zine\/(\d+)/))
const issueNumber = computed(() => issueMatch.value ? issueMatch.value[1] : '00')

// Show TOC only on /zine/XX or /fr/zine/XX and their subpaths
const showToc = computed(() => /^\/(fr\/)?zine\/\d{2}(\/.*)?$/.test(route.path))

// Detect current language context
const currentLang = computed(() => route.path.startsWith('/fr') ? 'fr' : 'en')

// Load all articles for both FR and EN
const { data: articles } = await useAsyncData(
  `toc-${issueNumber.value}`,
  () =>
    queryContent()
      .where({ _path: { $regex: `^(/fr)?/zine/${issueNumber.value}` }, published: true  })
      .only(['_path', 'title', 'chapter'])
      .sort({ chapter: 1, date: 1 })
      .find(),
  { watch: [issueNumber] }
)

// Group EN and FR versions by base slug

const groupedArticles = computed(() => {
  const groupedMap = new Map()

  for (const article of articles.value || []) {
    const isFr = article._path.startsWith('/fr/')
    const baseSlug = article._path.replace(/^\/fr/, '') // normalize to same slug

    if (!groupedMap.has(baseSlug)) {
      groupedMap.set(baseSlug, {})
    }

    groupedMap.get(baseSlug)[isFr ? 'fr' : 'en'] = article
  }

  // Convert to a sorted array
  return Array.from(groupedMap.entries())
    .map(([slug, langs]) => ({
      slug,
      langs,
      chapter: langs.en?.chapter ?? langs.fr?.chapter ?? 999 // fallback
    }))
    .sort((a, b) => a.chapter - b.chapter)
})

function isCurrent(path) {
  return route.path === path
}

</script>

<style scoped>
.toc {
  margin-bottom: var(--space-lg);
  border-left: 3px solid var(--color-border-soft);
  padding-left: var(--space-sm);
  overflow-x: auto;
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
  margin: 0;
}

.toc li {
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

/* Regular link style */
.toc a {
  color: var(--color-link);
  text-decoration: underline dotted;
}

/* Only highlight the main article link */
.toc li.active > a {
  font-weight: bold;
  color: var(--color-text);
  text-decoration: none;
  background-color: var(--color-code-bg);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
}

/* Language switch styling */
.lang-switch {
  font-size: 0.75rem;
  margin-left: 0.5rem;
  display: inline-flex;
  gap: 0.25rem;
  align-items: center;
}

.lang-switch a {
  color: var(--color-link);
  text-decoration: none;
  padding: 0 0.25rem;
  transition: opacity 0.2s ease;
}

/* Dim non-selected language */
.lang-switch a:not(.selected) {
  opacity: 0.5;
}

/* Selected language highlight */
.toc .lang-switch a.selected {
  font-weight: bold;
  color: var(--color-accent);
  text-decoration: underline;
}

</style>

