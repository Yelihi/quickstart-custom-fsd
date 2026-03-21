import type { CreateTodoRequestDto, GetTodosParams, TodoDto } from "./dtos";

export interface TodoRepository {
  getTodos(params?: GetTodosParams): Promise<TodoDto[]>;
  createTodo(data: CreateTodoRequestDto): Promise<TodoDto>;
}
