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
  overflow: auto;
  /* Style scrollbar */
  scrollbar-width: thin;
  border-radius: 0.5rem;
}

.container::-webkit-scrollbar {
  width: 8px; /* width of the entire scrollbar */
}

.container::-webkit-scrollbar-track {
  background: #2e2e2e; /* color of the track (part the scrollbar can move within) */
  border-radius: 10px; /* roundness of the track */
}

.container::-webkit-scrollbar-thumb {
  background-color: #555; /* color of the scrollbar itself */
  border-radius: 10px; /* roundness of the scrollbar */
  border: 2px solid #1e1e1e; /* Creates a border around the scrollbar */
}

.container::-webkit-scrollbar-thumb:hover {
  background: #666; /* color of the scrollbar when hovered */
}

.container {
  scrollbar-width: thin; /* "auto" or "thin" */
  scrollbar-color: #555 #2e2e2e; /* thumb and track color */
}


.filename-text {
  position: absolute;
  top: .5em;
  left: 1em;
  color: white;
  font-size: 14px;
}

.copy-container {
    padding: .3em .3em .3em 10px; /* top right bottom left */
    background: #343434;
    display: flex;
    justify-content: space-between;
}

.copy-button {
    display: flex;
}
.copy-container button {
    cursor: pointer;
    background: none;
    color: inherit;
    border: none;
}

:deep(pre) {
    padding-left: 1em;
    padding-right: 1em;
}
</style>

