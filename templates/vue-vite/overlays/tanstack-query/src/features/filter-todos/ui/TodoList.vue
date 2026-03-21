<script setup lang="ts">
import { useFilterTodos } from "../services/query/useFilterTodos";

const { data: todos, isPending, isError } = useFilterTodos({ limit: 10 });
</script>

<template>
  <p v-if="isPending">로딩 중...</p>
  <p v-else-if="isError">데이터를 불러오지 못했습니다.</p>
  <ul v-else style="list-style: none; padding: 0; margin: 0; text-align: left;">
    <li
      v-for="todo in todos"
      :key="todo.id"
      :style="{
        padding: '0.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        textDecoration: todo.completed ? 'line-through' : 'none',
        opacity: todo.completed ? 0.5 : 1,
      }"
    >
      {{ todo.title }}
    </li>
  </ul>
</template>
