<template>
  <div class="macro-grid">
    <div
      v-for="card in cards"
      :key="card.key"
      class="macro-card"
      :class="card.key"
    >
      <div class="m-label">{{ card.label }}</div>
      <div class="m-value" :class="{ over: card.key === 'carb' && isOver }">
        {{ card.display }}
      </div>
      <div class="m-goal">/ {{ card.goal }}</div>
      <div class="prog">
        <div
          class="prog-fill"
          :class="{ over: card.key === 'carb' && isOver }"
          :style="{ width: store.progress[card.progKey] + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useFoodLogStore } from "../stores/foodLog";

const store = useFoodLogStore();

const isOver = computed(() => store.currentTotals.c > store.targets.c);

const cards = computed(() => [
  {
    key: "cal",
    progKey: "cal",
    label: "Calories",
    display: store.currentTotals.cal,
    goal: "1,800",
  },
  {
    key: "pro",
    progKey: "p",
    label: "Protein",
    display: store.currentTotals.p + "g",
    goal: "140g",
  },
  {
    key: "fat",
    progKey: "f",
    label: "Fat",
    display: store.currentTotals.f + "g",
    goal: "140g",
  },
  {
    key: "carb",
    progKey: "c",
    label: "Net Carbs",
    display: store.currentTotals.c + "g",
    goal: "20g",
  },
]);
</script>

<style scoped>
.macro-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 14px;
}
.macro-card {
  background: white;
  border-radius: 12px;
  padding: 11px 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);
}
.m-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #9ca3af;
  margin-bottom: 3px;
}
.m-value {
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}
.m-goal {
  font-size: 0.65rem;
  color: #d1d5db;
  margin-bottom: 6px;
}
.prog {
  height: 4px;
  background: #f0f0f0;
  border-radius: 2px;
  overflow: hidden;
}
.prog-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.35s ease;
}

.cal .m-value {
  color: #d97706;
}
.cal .prog-fill {
  background: #f59e0b;
}
.pro .m-value {
  color: #2563eb;
}
.pro .prog-fill {
  background: #3b82f6;
}
.fat .m-value {
  color: #db2777;
}
.fat .prog-fill {
  background: #ec4899;
}
.carb .m-value {
  color: #7c3aed;
}
.carb .prog-fill {
  background: #8b5cf6;
}

.m-value.over {
  color: #ef4444 !important;
}
.prog-fill.over {
  background: #ef4444 !important;
}

@media (max-width: 460px) {
  .macro-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
