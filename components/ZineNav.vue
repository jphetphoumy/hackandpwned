<template>
  <nav class="zine-nav">
    <NuxtLink to="/" class="nav-link">[Home]</NuxtLink>
    <NuxtLink to="/zine" class="nav-link">[Issues]</NuxtLink>
    <NuxtLink to="/about" class="nav-link">[About Me]</NuxtLink>
  </nav>
</template>

<style scoped>
.zine-nav {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
  font-family: var(--font-body);
  font-size: var(--font-size-small);
  text-align: center;
  color: var(--color-muted);
}

.nav-link {
  text-decoration: none;
  color: var(--color-link);
  border-bottom: 1px dotted var(--color-border-soft);
  padding: 0.25rem 0.5rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: var(--color-code-bg);
  color: var(--color-text);
}
</style>
