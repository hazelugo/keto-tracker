<template>
  <div>
    <button class="btn-history" @click="open = !open">
      📅 {{ open ? "Hide History" : "View Past Days" }}
    </button>

    <transition name="slide">
      <div v-if="open" class="history-section">
        <div v-if="store.pastDates.length === 0" class="card empty-history">
          No past days recorded yet
        </div>

        <div
          v-for="date in store.pastDates.slice(0, 30)"
          :key="date"
          class="history-day"
        >
          <button class="history-day-hdr" @click="toggle(date)">
            <span class="hd-date">{{ formatDateLabel(date) }}</span>
            <span
              class="hd-sum"
              :class="{ over: store.totalsForDate(date).c > store.targets.c }"
            >
              {{ store.totalsForDate(date).cal }} cal ·
              {{ store.totalsForDate(date).p }}g P ·
              {{ store.totalsForDate(date).f }}g F ·
              {{ store.totalsForDate(date).c }}g C
            </span>
          </button>

          <div v-if="expanded.has(date)" class="history-day-body">
            <div
              v-for="entry in entriesForDate(date)"
              :key="entry.id"
              class="hist-entry"
            >
              <span
                >{{ mealIcon(entry.meal) }} {{ entry.food }} ·
                {{ entry.grams }}g</span
              >
              <span>{{ entry.cal }} cal</span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useFoodLogStore, formatDateLabel } from "../stores/foodLog";

const store = useFoodLogStore();
const open = ref(false);
const expanded = reactive(new Set());

const MEAL_ICONS = { breakfast: "", lunch: "", dinner: "", snack: "" };

function mealIcon(meal) {
  return MEAL_ICONS[meal] ?? "";
}

function toggle(date) {
  expanded.has(date) ? expanded.delete(date) : expanded.add(date);
}

function entriesForDate(date) {
  return store.entries.filter((e) => e.date === date);
}
</script>

<style scoped>
.btn-history {
  width: 100%;
  padding: 10px;
  background: white;
  color: #16a34a;
  border: 1.5px solid #bbf7d0;
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 14px;
  transition: all 0.15s;
}
.btn-history:hover {
  background: #f0fdf4;
  border-color: #16a34a;
}

.history-section {
  margin-bottom: 16px;
}

.card.empty-history {
  background: white;
  border-radius: 14px;
  padding: 20px;
  text-align: center;
  color: #d1d5db;
  font-size: 0.875rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
}

.history-day {
  border: 1.5px solid #f0f0f0;
  border-radius: 11px;
  margin-bottom: 10px;
  overflow: hidden;
}

.history-day-hdr {
  width: 100%;
  padding: 11px 14px;
  background: #fafafa;
  border: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}
.history-day-hdr:hover {
  background: #f3f4f6;
}

.hd-date {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1a1a1a;
}
.hd-sum {
  font-size: 0.72rem;
  color: #9ca3af;
}
.hd-sum.over {
  color: #ef4444;
}

.history-day-body {
  padding: 4px 14px 10px;
}

.hist-entry {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #4b5563;
  padding: 5px 0;
  border-bottom: 1px solid #f5f5f5;
}
.hist-entry:last-child {
  border-bottom: none;
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
