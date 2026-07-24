<script setup>
import { ref } from 'vue'

const menuIsOpen = ref(false)

const closeMenu = () => {
  menuIsOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <div class="container d-flex align-items-center justify-content-between gap-3 py-3">
      <RouterLink class="brand" to="/" @click="closeMenu">
        <span class="brand-mark" aria-hidden="true">OS</span>
        <span>
          <strong>Open Shelf</strong>
          <small>Library catalogue</small>
        </span>
      </RouterLink>

      <button
        class="menu-toggle d-md-none"
        type="button"
        :aria-expanded="menuIsOpen"
        aria-label="Toggle navigation"
        @click="menuIsOpen = !menuIsOpen"
      >
        <span></span><span></span><span></span>
      </button>

      <nav :class="['site-nav', { 'is-open': menuIsOpen }]" aria-label="Main navigation">
        <RouterLink to="/" @click="closeMenu">Catalogue</RouterLink>
        <a href="#about" @click="closeMenu">About</a>
      </nav>
    </div>
  </header>
</template>
