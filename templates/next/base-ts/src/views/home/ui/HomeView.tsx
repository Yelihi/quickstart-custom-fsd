"use client";

import { useState } from "react";
import { CounterStatus, type CounterDto } from "@/entities/counter";
import { IncrementCounterButton } from "@/features/increment-counter";
import styles from "./HomeView.module.css";

export function HomeView() {
  const [counter, setCounter] = useState<CounterDto>({
    id: "1",
    value: 0,
    status: CounterStatus.ACTIVE,
  });

  const handleIncrement = (id: string) => {
    if (id !== counter.id) return;
    setCounter((prev) => ({ ...prev, value: prev.value + 1 }));
  };

  return (
    <main className={styles.main}>
      <h1>__PROJECT_NAME__</h1>
      <p>FSD(Feature-Sliced Design) 기반 프로젝트입니다.</p>
      <IncrementCounterButton counter={counter} onIncrement={handleIncrement} />
    </main>
  );
}
