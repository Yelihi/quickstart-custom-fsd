import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { todoRepository, type CreateTodoRequestDto } from "@/entities/todo";
import { todoKeys } from "@/features/filter-todos";

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTodoRequestDto) => todoRepository.createTodo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys._def });
    },
  });
}
