<script setup lang="ts">
const projectName = "__PROJECT_NAME__";
</script>

<template>
  <div class="app">
    <h1>{{ projectName }}</h1>
    <p>FSD(Feature-Sliced Design) 기반 프로젝트입니다.</p>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
}

p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
}
</style>
