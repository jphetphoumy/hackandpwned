<template>
  <pre class="ascii">
    {{ asciiHeader }}
  </pre>
</template>

<script setup>
const props = defineProps({
  issueNumber: {
    type: [Number, String],
    default: null
  },
  subtitle: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'home' // 'home', 'about', 'issue'
  }
})

const asciiHeader = computed(() => {
  if (props.variant === 'issue' && props.issueNumber) {
    return `H A C K A N D   P W N E D   Z I N E\n  Issue #${props.issueNumber} - ${props.subtitle}`
  } else if (props.variant === 'about') {
    return `H A C K A N D   P W N E D\n  About the Operator`
  } else {
    return `H A C K A N D   P W N E D\n  Underground Ops for Blue/Red/Dev/AI`
  }
})
</script>

<style scoped>
.ascii {
  white-space: pre;
  line-height: 1.2;
  margin-bottom: 2rem;
  color: #ccc;
  font-size: 0.95rem;
}
</style>
