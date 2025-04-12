<script setup lang="ts">
// Query all index.md files in zine subdirectories
const { data: issues } = await useAsyncData('zine-issues', () =>
  queryContent('zine')
    .where({ _path: /^\/zine\/\d+$/, published: true })
    .only(['_path', 'title', 'description', 'subtitle'])
    .find()
)

// Filter functionality
const searchTerm = ref('')
const filteredIssues = computed(() => {
  if (!issues.value) return []
  
  const term = searchTerm.value.toLowerCase().trim()
  if (!term) return issues.value
  
  return issues.value.filter(issue => {
    // Get issue number from path
    const issueNum = issue._path.split('/')[2]
    
    // Check if search term is in issue number, title, subtitle or description
    return issueNum.includes(term) || 
           (issue.title && issue.title.toLowerCase().includes(term)) ||
           (issue.subtitle && issue.subtitle.toLowerCase().includes(term)) ||
           (issue.description && issue.description.toLowerCase().includes(term))
  })
})
</script>

<template>
  <section class="zine-container">
    <div class="ascii-title">.:: Hackandpwned Zine Index ::.</div>
    
    <!-- Refined search box -->
    <div class="search-box">
      <div class="search-input-wrapper">
        <span class="search-label">filter:</span>
        <input 
          v-model="searchTerm" 
          class="search-input" 
          type="text" 
          placeholder="Enter issue number or text..."
        />
      </div>
    </div>
    
    <!-- Display filtered issues or a "not found" message -->
    <div v-if="filteredIssues.length" class="issue-count">
      {{ filteredIssues.length }} issue{{ filteredIssues.length !== 1 ? 's' : '' }} found
    </div>
    <div v-else class="no-results">
      No matching issues found. Try a different search term.
    </div>
    
    <ul class="issue-list">
      <li v-for="issue in filteredIssues" :key="issue._path" class="issue-entry">
        <NuxtLink :to="issue._path" class="issue-link">
          <span class="issue-code">[ {{ issue._path.split('/')[2] }} ]</span>
          <div class="issue-text">
            <strong class="issue-title">Issue {{ issue._path.split('/')[2] }} - {{ issue.subtitle }}</strong>
            <p v-if="issue.description" class="issue-description">{{ issue.description }}</p>
          </div>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.zine-container {
  background-color: #111;
  color: #ccc;
  font-family: monospace;
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.ascii-title {
  text-align: center;
  border-top: 1px solid #777;
  border-bottom: 1px solid #777;
  padding: 0.5rem;
  margin-bottom: 2rem;
  font-size: 1.2rem;
  color: #ccc;
  letter-spacing: 1px;
}

.search-box {
  margin-bottom: 1.5rem;
  background-color: #1a1a1a;
  border: 1px solid #333;
  padding: 0.75rem;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
}

.search-label {
  color: #ffa500;
  margin-right: 0.75rem;
  font-weight: bold;
}

.search-input {
  background-color: #000;
  border: 1px solid #333;
  color: #ccc;
  font-family: monospace;
  padding: 0.5rem;
  width: 100%;
  outline: none;
}

.search-input:focus {
  border-color: #ffa500;
}

.search-input::placeholder {
  color: #555;
}

.issue-count, .no-results {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-bottom: 1px dashed #333;
  color: #ccc;
  font-size: 0.9rem;
}

.no-results {
  color: #ff6b6b;
}

.issue-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.issue-entry {
  margin-bottom: 1rem;
  padding: 1rem;
  border-left: 3px solid #444;
  background-color: #1a1a1a;
  transition: all 0.2s ease;
}

.issue-entry:hover {
  background-color: #222;
  border-left-color: #ffa500;
}

.issue-link {
  display: flex;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
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

.issue-description {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #aaa;
}

@media (max-width: 600px) {
  .issue-link {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
