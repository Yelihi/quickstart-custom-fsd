import IncrementCounterButton from "@/features/increment-counter/ui/IncrementCounterButton.vue";
import { CounterStatus } from "@/entities/counter";

const meta = {
  title: "features/IncrementCounterButton",
  component: IncrementCounterButton,
  tags: ["autodocs"],
  args: {
    counter: { id: "1", value: 0, status: CounterStatus.ACTIVE },
  },
};

export default meta;

export const Default = {};

export const WithHighCount = {
  args: {
    counter: { id: "2", value: 42, status: CounterStatus.ACTIVE },
  },
};
