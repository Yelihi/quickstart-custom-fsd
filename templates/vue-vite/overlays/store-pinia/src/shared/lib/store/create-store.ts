import { defineStore } from "pinia";

/**
 * Pinia 스토어 생성 헬퍼
 *
 * 사용 예시:
 * ```ts
 * export const useCounterStore = createStore("counter", {
 *   state: () => ({ count: 0 }),
 *   actions: {
 *     increment() { this.count++ },
 *     decrement() { this.count-- },
 *     reset() { this.count = 0 },
 *   },
 * });
 * ```
 */
export const createStore = defineStore;
