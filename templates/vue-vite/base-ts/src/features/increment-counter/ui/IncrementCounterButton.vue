<script setup lang="ts">
import type { CounterDto } from "@/entities/counter";

interface Props {
  counter: CounterDto;
}

interface Emits {
  increment: [id: string];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <button
    @click="emit('increment', props.counter.id)"
    :style="{
      padding: '0.5rem 1.5rem',
      fontSize: '1rem',
      cursor: 'pointer',
      borderRadius: '0.375rem',
    }"
  >
    카운트: {{ props.counter.value }}
  </button>
</template>
