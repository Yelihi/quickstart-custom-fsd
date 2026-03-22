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
    class="py-2 px-6 text-base cursor-pointer rounded-md"
    @click="emit('increment', props.counter.id)"
  >
    카운트: {{ props.counter.value }}
  </button>
</template>
