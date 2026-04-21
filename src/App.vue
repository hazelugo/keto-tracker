<template>
  <header>
    <h1>🥑 Keto Tracker</h1>
  </header>
  <main class="container">
    <MacroSummary />
  </main>
</template>

<script setup>
import { onMounted } from "vue";
import { useFoodLogStore } from "./stores/foodLog";
import MacroSummary from "./components/MacroSummary.vue";

const store = useFoodLogStore();
onMounted(() => store.loadFromStorage());
</script>

<style scoped>
header {
  background: #16a34a;
  color: white;
  padding: 14px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
header h1 {
  font-size: 1.1rem;
  font-weight: 700;
}
.container {
  max-width: 620px;
  margin: 0 auto;
  padding: 16px;
}
</style>
