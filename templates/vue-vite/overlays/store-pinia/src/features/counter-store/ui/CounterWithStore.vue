<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCounterStore } from "../model/store";

const counterStore = useCounterStore();
const { count } = storeToRefs(counterStore);
</script>

<template>
  <div class="counter">
    <p class="count">{{ count }}</p>
    <div class="actions">
      <button @click="counterStore.decrement">-</button>
      <button @click="counterStore.increment">+</button>
      <button @click="counterStore.reset">초기화</button>
    </div>
  </div>
</template>

<style scoped>
.counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.count {
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.actions button {
  padding: 0.4rem 1rem;
  cursor: pointer;
}
</style>
