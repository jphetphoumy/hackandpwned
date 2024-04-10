<template>
  <div class="blog">
    <BlogHeader />
    <BlogPosts />
  </div>
</template>

<script>
import BlogHeader from './BlogHeader.vue';
import BlogPosts from './BlogPosts.vue';

export default {
  name: 'Blog',
  components: {
    BlogHeader,
    BlogPosts,
  },
};
</script>

<style scoped>
</style>

