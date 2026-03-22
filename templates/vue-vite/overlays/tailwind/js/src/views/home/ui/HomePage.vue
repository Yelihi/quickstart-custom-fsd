<script setup>
import { ref } from "vue";
import { CounterStatus } from "@/entities/counter";
import { IncrementCounterButton } from "@/features/increment-counter";

const counter = ref({
  id: "1",
  value: 0,
  status: CounterStatus.ACTIVE,
});

const handleIncrement = (id) => {
  if (id !== counter.value.id) return;
  counter.value = { ...counter.value, value: counter.value.value + 1 };
};
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen gap-4">
    <h1 class="text-4xl font-bold m-0">__PROJECT_NAME__</h1>
    <p class="text-base text-white/60 m-0">FSD(Feature-Sliced Design) 기반 프로젝트입니다.</p>
    <IncrementCounterButton
      :counter="counter"
      @increment="handleIncrement"
    />
  </div>
</template>
