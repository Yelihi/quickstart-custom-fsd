<script setup>
const props = defineProps({
  counter: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["increment"]);
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
