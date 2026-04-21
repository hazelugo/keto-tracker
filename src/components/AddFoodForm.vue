<template>
  <div class="card">
    <div class="card-title">Add Food</div>

    <div class="form-row">
      <div class="form-group">
        <label for="sel-food">Food</label>
        <select id="sel-food" v-model="selectedFoodIdx" @change="onFoodChange">
          <option value="">Select food…</option>
          <optgroup label="Proteins">
            <option v-for="food in proteins" :key="food.idx" :value="food.idx">
              {{ food.name }}
            </option>
          </optgroup>
          <optgroup label="Vegetables">
            <option v-for="food in veggies" :key="food.idx" :value="food.idx">
              {{ food.name }}
            </option>
          </optgroup>
          <optgroup label="Fats">
            <option v-for="food in fats" :key="food.idx" :value="food.idx">
              {{ food.name }}
            </option>
          </optgroup>
        </select>
        <div class="food-hint">{{ selectedHint }}</div>
      </div>

      <div class="form-group">
        <label for="sel-meal">Meal</label>
        <select id="sel-meal" v-model="selectedMeal">
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="inp-grams">Serving (grams)</label>
        <input
          id="inp-grams"
          v-model.number="grams"
          type="number"
          placeholder="e.g. 150"
          min="1"
          max="3000"
        />
      </div>
    </div>

    <div class="macro-preview">
      <template v-if="preview">
        <span class="pv-cal">{{ preview.cal }} cal</span>
        <span class="pv-sep">·</span>
        <span class="pv-pro">{{ preview.p }}g protein</span>
        <span class="pv-sep">·</span>
        <span class="pv-fat">{{ preview.f }}g fat</span>
        <span class="pv-sep">·</span>
        <span class="pv-carb">{{ preview.c }}g net carbs</span>
      </template>
      <span v-else class="pv-hint"
        >Select a food and enter grams to preview nutrition</span
      >
    </div>

    <button class="btn-primary" :disabled="!canAdd" @click="handleAdd">
      + Add to Log
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useFoodLogStore, FOODS } from "../stores/foodLog";

const store = useFoodLogStore();

const selectedFoodIdx = ref("");
const selectedMeal = ref("breakfast");
const grams = ref(null);

const proteins = FOODS.map((f, i) => ({ ...f, idx: i })).filter(
  (f) => f.cat === "protein",
);
const veggies = FOODS.map((f, i) => ({ ...f, idx: i })).filter(
  (f) => f.cat === "veggie",
);
const fats = FOODS.map((f, i) => ({ ...f, idx: i })).filter(
  (f) => f.cat === "fat",
);

const selectedHint = computed(() =>
  selectedFoodIdx.value !== "" ? FOODS[selectedFoodIdx.value].hint : "",
);

const preview = computed(() => {
  const idx = selectedFoodIdx.value;
  const g = grams.value;
  if (idx === "" || !g || g <= 0) return null;
  const fd = FOODS[idx];
  const r = g / 100;
  return {
    cal: Math.round(fd.cal * r),
    p: Math.round(fd.p * r * 10) / 10,
    f: Math.round(fd.f * r * 10) / 10,
    c: Math.round(fd.c * r * 10) / 10,
  };
});

const canAdd = computed(() => selectedFoodIdx.value !== "" && grams.value > 0);

function onFoodChange() {}

function handleAdd() {
  if (!canAdd.value) return;
  store.addEntry(selectedFoodIdx.value, selectedMeal.value, grams.value);
  selectedFoodIdx.value = "";
  grams.value = null;
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
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.form-group label {
  font-size: 0.72rem;
  font-weight: 600;
  color: #374151;
}
select,
input[type="number"] {
  padding: 9px 11px;
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  font-size: 0.875rem;
  background: #fafafa;
  color: #1a1a1a;
  outline: none;
  width: 100%;
  transition: border-color 0.15s;
}
select:focus,
input:focus {
  border-color: #16a34a;
  background: white;
}
.food-hint {
  font-size: 0.68rem;
  color: #b0b7c3;
  min-height: 14px;
  margin-top: 1px;
}
.macro-preview {
  background: #f8f7f4;
  border-radius: 9px;
  padding: 9px 13px;
  margin-bottom: 11px;
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  min-height: 38px;
}
.macro-preview span {
  font-size: 0.75rem;
}
.pv-hint {
  color: #c0c4cd;
}
.pv-sep {
  color: #d1d5db;
}
.pv-cal {
  color: #d97706;
  font-weight: 700;
}
.pv-pro {
  color: #2563eb;
  font-weight: 700;
}
.pv-fat {
  color: #db2777;
  font-weight: 700;
}
.pv-carb {
  color: #7c3aed;
  font-weight: 700;
}
.btn-primary {
  width: 100%;
  padding: 10px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 9px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    transform 0.1s;
}
.btn-primary:hover {
  background: #15803d;
}
.btn-primary:active {
  transform: scale(0.98);
}
.btn-primary:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}
@media (max-width: 460px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
