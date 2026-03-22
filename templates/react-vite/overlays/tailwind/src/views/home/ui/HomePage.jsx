import { useState } from "react";
import { CounterStatus } from "@/entities/counter";
import { IncrementCounterButton } from "@/features/increment-counter";

export function HomePage() {
  const [counter, setCounter] = useState({
    id: "1",
    value: 0,
    status: CounterStatus.ACTIVE,
  });

  const handleIncrement = (id) => {
    if (id !== counter.id) return;
    setCounter((prev) => ({ ...prev, value: prev.value + 1 }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center p-8">
      <h1 className="text-4xl font-bold">__PROJECT_NAME__</h1>
      <p className="text-base text-white/60">FSD(Feature-Sliced Design) 기반 프로젝트입니다.</p>
      <IncrementCounterButton counter={counter} onIncrement={handleIncrement} />
    </div>
  );
}
