<script setup lang="ts">
import AppFooter from '~/components/AppFooter.vue'
import AppHeader from '~/components/AppHeader.vue'
import Article from '~/components/Article.vue'
import ZineHeader from '~/components/ZineHeader.vue'
import TOC from '~/components/TOC.vue'

const route = useRoute()

// Detect issue number from route param (default to '01')
const issue = computed(() => route.params.issue || '01')

// Determine variant based on route path
const variant = computed(() => {
  if (route.path.startsWith('/zine')) return 'issue'
  if (route.path.startsWith('/about')) return 'about'
  return 'home'
})

// Fetch metadata only if variant is 'issue'
const { data: issueMeta } = await useAsyncData(
  () => variant.value === 'issue' ? `zine-issue-${issue.value}` : null,
  () => queryContent(`zine/${issue.value}`)
    .where({ title: 'Introduction' })
    .only(['subtitle', 'title'])
    .findOne()
)

const subtitle = computed(() =>
  variant.value === 'issue'
    ? issueMeta.value?.subtitle || `Hackandpwned Issue #${issue.value}`
    : 'Hackandpwned webzine'
)
</script>
<template>
  <ZineNav />
  <ZineHeader :issueNumber="variant === 'issue' ? issue : null" :subtitle="subtitle" :variant="variant" />
  <TOC v-if="variant === 'issue'" />
  <main>
    <slot />
  </main>
  <AppFooter />
</template>
