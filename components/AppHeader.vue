<script setup lang="ts">
const props = defineProps<{
    title: string;
    links: Array<{
        href: string;
        name: string;
        dropdown?: Array<{
            href: string;
            name: string;
        }>;
    }>;
}>();

const route = useRoute();

const isActive = (href: string) => {
    if (href === '/') {
        return route.path === '/';
    }
    return route.path.includes(href);
};
</script>
<template>
    <header>
        <h1>{{ title }}</h1>
        <h2>DevOps & Hacking Insights</h2>
        <nav>
            <ul>
                <li v-for="link in links" :key="link.href">
                    <a :class="{ 'current-link': isActive(link.href) }" :href="link.href">{{ link.name }}</a>
                    <ul v-if="link.dropdown" class="dropdown">
                        <li v-for="dropdownLink in link.dropdown" :key="dropdownLink.href">
                            <a :href="dropdownLink.href">{{ dropdownLink.name }}</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped>
.current-link {
    border-bottom: 1px solid #fff;
}

nav ul {
    list-style-type: none; /* Removes bullet points from lists */
    padding: 0; /* Removes padding around the list */
}

li {
    position: relative; /* Makes this a reference for absolute positioning of children */
}

.dropdown {
    display: none; /* Initially hides the dropdown */
    position: absolute;
    background-color: #f9f9f9; /* Light grey background */
    box-shadow: 0 8px 16px rgba(0,0,0,0.2); /* Adds shadow for better visibility */
    z-index: 1;
    left: 0; /* Aligns the dropdown with the left edge of the parent link */
    top: 100%; /* Positions the dropdown right below the parent link */
    min-width: 100%; /* Ensures the dropdown is at least as wide as the parent */
}

.dropdown li {
    float: none; /* Prevents floating to align properly */
}

.dropdown li a {
    color: black; /* Text color for links */
    padding: 12px 16px; /* Spacing inside the link for easier clicking */
    text-decoration: none; /* Removes underline from links */
    display: block; /* Makes the link fill the container for better clickability */
    text-align: left; /* Aligns text to the left */
}

.dropdown li a:hover {
    text-decoration: underline; /* Underlines the link when hovered */
    border: none;
}

li:hover > .dropdown {
    display: block; /* Shows the dropdown when parent li is hovered */
}
</style>
