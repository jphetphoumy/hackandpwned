<script setup lang="ts">
// Query all index.md files in zine subdirectories
const { data: issues } = await useAsyncData('zine-issues', () =>
  queryContent('zine')
    .where({ _path: /^\/zine\/\d+$/ }) // Match paths like /zine/01/index, /zine/02/index
    .only(['_path', 'title', 'description', 'subtitle']) // Include subtitle
    .find()
)
console.log(issues)
</script>

<template>
  <section>
    <div class="ascii-title">.:: Hackandpwned Zine Index ::.</div>
    <ul class="issue-list">
      <li v-for="issue in issues" :key="issue._path" class="issue-entry">
        <NuxtLink :to="issue._path.replace('/index', '')" class="issue-link">
          <span class="issue-code">[ {{ issue._path.split('/')[2] }} ]</span>
          <div class="issue-text">
              <strong class="issue-title">Issue - {{ issue._path.split('/')[2] }} - {{ issue.subtitle }}</strong>
            <span v-if="issue.subtitle" class="issue-subtitle">{{ issue.subtitle }}</span>
            <p v-if="issue.description" class="issue-description">{{ issue.description }}</p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.ascii-title {
  text-align: center;
  border-top: 1px solid #777;
  border-bottom: 1px solid #777;
  padding: 0.5rem;
  font-family: monospace;
  margin-bottom: 2rem;
  font-size: 1rem;
  color: #ccc;
}

.issue-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.issue-entry {
  margin-bottom: 2rem;
  padding: 1rem;
  border-left: 3px solid #444;
  background-color: #1a1a1a;
  transition: background-color 0.2s ease;
}

.issue-entry:hover {
  background-color: #222;
}

.issue-link {
  display: flex;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
  font-family: monospace;
}

.issue-code {
  font-weight: bold;
  color: #ffa500;
  min-width: 60px;
}

.issue-title {
  font-size: 1.1rem;
  color: #e0e0e0;
}

.issue-subtitle {
  display: block;
  font-size: 0.95rem;
  color: #999;
}

.issue-description {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #aaa;
}
</style>

