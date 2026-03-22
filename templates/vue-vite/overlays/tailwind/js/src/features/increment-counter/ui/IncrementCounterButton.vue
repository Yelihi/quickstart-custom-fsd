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
    class="py-2 px-6 text-base cursor-pointer rounded-md"
    @click="emit('increment', props.counter.id)"
  >
    카운트: {{ props.counter.value }}
  </button>
</template>
