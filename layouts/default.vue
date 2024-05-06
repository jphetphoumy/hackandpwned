<script setup lang="ts">
import AppFooter from '~/components/AppFooter.vue'
import AppHeader from '~/components/AppHeader.vue'
import Article from '~/components/Article.vue'
const links = [
    { name: 'Home', href: '/' },
    { name: 'Articles', href: '/articles' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
];
</script>
<template>
    <AppHeader title=".: Hackandpwned :." :links="links" />
    <main>
        <slot></slot>
    </main>
    <AppFooter />
</template>
