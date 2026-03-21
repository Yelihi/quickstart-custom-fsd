import { createApp } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import "./style.css";
import App from "@/app/App.vue";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1분
      retry: 1,
    },
  },
});

const app = createApp(App);
app.use(VueQueryPlugin, { queryClient });
app.mount("#app");
