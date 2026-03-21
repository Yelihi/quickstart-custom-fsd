<script setup lang="ts">
import { ref } from "vue";
import { CounterStatus, type CounterDto } from "@/entities/counter";
import { IncrementCounterButton } from "@/features/increment-counter";

const counter = ref<CounterDto>({
  id: "1",
  value: 0,
  status: CounterStatus.ACTIVE,
});

const handleIncrement = (id: string) => {
  if (id !== counter.value.id) return;
  counter.value = { ...counter.value, value: counter.value.value + 1 };
};
</script>

<template>
  <div class="home">
    <h1>__PROJECT_NAME__</h1>
    <p>FSD(Feature-Sliced Design) 기반 프로젝트입니다.</p>
    <IncrementCounterButton
      :counter="counter"
      @increment="handleIncrement"
    />
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 1rem;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}
</style>
