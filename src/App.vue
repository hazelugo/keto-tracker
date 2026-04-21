<template>
  <header>
    <h1>🥑 Keto Tracker</h1>
    <div class="date-nav">
      <button @click="store.shiftDate(-1)">&#8592;</button>
      <span class="date-label">{{ dateLabel }}</span>
      <button :disabled="store.isToday" @click="store.shiftDate(1)">
        &#8594;
      </button>
    </div>
  </header>

  <main class="container">
    <MacroSummary />
    <AddFoodForm />
    <FoodLog />
    <HistoryPanel />
  </main>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useFoodLogStore, formatDateLabel } from "./stores/foodLog";
import MacroSummary from "./components/MacroSummary.vue";
import AddFoodForm from "./components/AddFoodForm.vue";
import FoodLog from "./components/FoodLog.vue";
import HistoryPanel from "./components/HistoryPanel.vue";

const store = useFoodLogStore();

const dateLabel = computed(() => formatDateLabel(store.currentDate));

onMounted(() => store.loadFromStorage());
</script>

<style scoped>
header {
  background: #16a34a;
  color: white;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
header h1 {
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.3px;
}
.date-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}
.date-nav button {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.date-nav button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.35);
}
.date-nav button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.date-label {
  font-size: 0.875rem;
  font-weight: 600;
  min-width: 110px;
  text-align: center;
}
.container {
  max-width: 620px;
  margin: 0 auto;
  padding: 16px;
}
</style>
