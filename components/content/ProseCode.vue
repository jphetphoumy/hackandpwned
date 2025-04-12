<template>
  <div class="container">
    <div class="copy-container">
      <span class="language-text"> {{ language }}</span>
      <span class="copied-text" v-if="copied">Copied!</span>
      <div class="copy-button" v-if="!copied">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="15px">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
          <button @click="copy(code)" class="copy-button">Copy</button>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
const props = withDefaults(
  defineProps<{
    code?: string
    language?: string | null
    filename?: string | null
    highlights?: Array<number>
  }>(),
  { code: '', language: null, filename: null, highlights: [] }
)
const { copy, copied, text } = useClipboard()
</script>

<style scoped>
.container {
  background: #1e1e1e;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  overflow: hidden; /* Fix for scroll overflow glitch */
}

.copy-container {
  background: #343434;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3em 1em;
  border-bottom: 1px solid #2e2e2e;
}

.copy-container button {
  cursor: pointer;
  background: none;
  color: inherit;
  border: none;
  font-family: inherit;
  font-size: 0.9rem;
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 0.25em;
}

/* Ensures the <pre> scrolls inside its container */
:deep(pre) {
  background: transparent;
  margin: 0;
  padding: 1em;
  overflow-x: auto;
  white-space: pre; /* Keep formatting */
  word-wrap: normal;
  font-size: 0.875rem;
}

/* Optional: clean up scrollbar inside the code box */
:deep(pre::-webkit-scrollbar) {
  height: 8px;
}
:deep(pre::-webkit-scrollbar-thumb) {
  background: #555;
  border-radius: 10px;
}

</style>

