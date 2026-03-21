"use client";

import type { CounterDto } from "@/entities/counter";

interface IncrementCounterButtonProps {
  counter: CounterDto;
  onIncrement: (id: string) => void;
}

export function IncrementCounterButton({
  counter,
  onIncrement,
}: IncrementCounterButtonProps) {
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
