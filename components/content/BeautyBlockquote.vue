<template>
    <blockquote class="blockquote">
        <div class="blockquote--title">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16px" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>

            <span>
                {{ props.title }}
            </span>
        </div>
        <slot />
    </blockquote>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
  }>(),
  { title: ''}
)
</script>

<style>
.blockquote--title {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #0784b5;
}
.blockquote {
  margin: 1rem 0;
  border-left: 0.2rem solid #0784b5;
  padding: 0.5rem 1rem;
}

h1 {
    
}
</style>
