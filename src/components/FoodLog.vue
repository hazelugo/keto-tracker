<template>
  <div class="card">
    <div class="card-title">{{ logTitle }}</div>

    <div v-if="store.currentEntries.length === 0" class="empty-log">
      No entries yet — add your first food above
    </div>

    <template v-else>
      <div v-for="meal in MEALS" :key="meal" class="meal-section">
        <template v-if="entriesByMeal[meal]?.length">
          <div class="meal-label">
            {{ MEAL_ICONS[meal] }} {{ capitalize(meal) }}
          </div>

          <div
            v-for="entry in entriesByMeal[meal]"
            :key="entry.id"
            class="entry-row"
          >
            <div class="entry-info">
              <div class="entry-name">{{ entry.food }}</div>
              <div class="entry-grams">{{ entry.grams }}g</div>
            </div>

            <div class="entry-macros">
              <span class="em-cal">{{ entry.cal }} cal</span>
              <span class="em-pro">{{ entry.p }}g P</span>
              <span class="em-fat">{{ entry.f }}g F</span>
              <span class="em-carb">{{ entry.c }}g C</span>
            </div>

            <button
              class="btn-del"
              title="Remove"
              @click="store.deleteEntry(entry.id)"
            >
              ✕
            </button>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useFoodLogStore, formatDateLabel } from "../stores/foodLog";

const store = useFoodLogStore();

const MEALS = ["breakfast", "lunch", "dinner", "snack"];
const MEAL_ICONS = { breakfast: "", lunch: "", dinner: "", snack: "" };

const logTitle = computed(() => {
  const label = formatDateLabel(store.currentDate);
  return label === "Today" ? "Today's Log" : `${label}'s Log`;
});

const entriesByMeal = computed(() => {
  const map = {};
  MEALS.forEach((m) => {
    map[m] = store.currentEntries.filter((e) => e.meal === m);
  });
  return map;
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
  margin-bottom: 14px;
}

.card-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #9ca3af;
  margin-bottom: 13px;
}

.empty-log {
  text-align: center;
  color: #d1d5db;
  font-size: 0.875rem;
  padding: 22px 0;
}

.meal-section {
  margin-bottom: 12px;
}
.meal-section:last-child {
  margin-bottom: 0;
}

.meal-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #b0b7c3;
  padding-bottom: 5px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 4px;
}

.entry-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  border-bottom: 1px solid #f9f9f9;
}
.entry-row:last-child {
  border-bottom: none;
}

.entry-info {
  flex: 1;
  min-width: 0;
}
.entry-name {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.entry-grams {
  font-size: 0.7rem;
  color: #9ca3af;
}

.entry-macros {
  display: flex;
  gap: 7px;
  font-size: 0.68rem;
  white-space: nowrap;
}
.em-cal {
  color: #d97706;
  font-weight: 600;
}
.em-pro {
  color: #2563eb;
}
.em-fat {
  color: #db2777;
}
.em-carb {
  color: #7c3aed;
}

.btn-del {
  background: none;
  border: none;
  color: #e5e7eb;
  cursor: pointer;
  font-size: 0.8rem;
  padding: 3px 6px;
  border-radius: 5px;
  line-height: 1;
  transition:
    color 0.15s,
    background 0.15s;
  flex-shrink: 0;
}
.btn-del:hover {
  color: #ef4444;
  background: #fef2f2;
}

@media (max-width: 460px) {
  .entry-macros {
    display: none;
  }
}
</style>
