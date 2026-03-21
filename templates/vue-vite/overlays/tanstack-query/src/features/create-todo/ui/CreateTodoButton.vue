<script setup lang="ts">
import { useCreateTodo } from "../services/query/useCreateTodo";

const { mutate: createTodo, isPending } = useCreateTodo();

const handleClick = () => {
  createTodo({ title: `새 할 일 #${Date.now()}` });
};
</script>

<template>
  <button
    @click="handleClick"
    :disabled="isPending"
    :style="{
      padding: '0.5rem 1.5rem',
      fontSize: '1rem',
      cursor: isPending ? 'not-allowed' : 'pointer',
      borderRadius: '0.375rem',
      opacity: isPending ? 0.6 : 1,
    }"
  >
    {{ isPending ? "추가 중..." : "할 일 추가" }}
  </button>
</template>
