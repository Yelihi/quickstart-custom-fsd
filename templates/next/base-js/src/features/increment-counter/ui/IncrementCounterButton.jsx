"use client";

/**
 * @param {{ counter: import('@/entities/counter/models/dtos').CounterDto; onIncrement: (id: string) => void }} props
 */
export function IncrementCounterButton({ counter, onIncrement }) {
  return (
    <button
      onClick={() => onIncrement(counter.id)}
      style={{
        padding: "0.5rem 1.5rem",
        fontSize: "1rem",
        cursor: "pointer",
        borderRadius: "0.375rem",
      }}
    >
      카운트: {counter.value}
    </button>
  );
}
