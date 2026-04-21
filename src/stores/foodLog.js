import { defineStore } from "pinia";

// ── Food database (macros per 100g) ──────────────────────────────────────────
export const FOODS = [
  // Proteins
  {
    name: "Eggs",
    cat: "protein",
    cal: 143,
    p: 12.6,
    f: 9.5,
    c: 0.7,
    hint: "1 large egg ≈ 50g",
  },
  {
    name: "Chicken Breast",
    cat: "protein",
    cal: 165,
    p: 31.0,
    f: 3.6,
    c: 0.0,
    hint: "",
  },
  {
    name: "Ground Beef (80/20)",
    cat: "protein",
    cal: 254,
    p: 17.0,
    f: 20.0,
    c: 0.0,
    hint: "",
  },
  {
    name: "Salmon",
    cat: "protein",
    cal: 208,
    p: 20.0,
    f: 13.0,
    c: 0.0,
    hint: "",
  },
  {
    name: "Bacon",
    cat: "protein",
    cal: 541,
    p: 37.0,
    f: 42.0,
    c: 1.4,
    hint: "1 cooked strip ≈ 8g",
  },
  // Vegetables
  { name: "Spinach", cat: "veggie", cal: 23, p: 2.9, f: 0.4, c: 1.4, hint: "" },
  {
    name: "Broccoli",
    cat: "veggie",
    cal: 34,
    p: 2.8,
    f: 0.4,
    c: 4.0,
    hint: "",
  },
  {
    name: "Cauliflower",
    cat: "veggie",
    cal: 25,
    p: 1.9,
    f: 0.3,
    c: 3.0,
    hint: "",
  },
  {
    name: "Zucchini",
    cat: "veggie",
    cal: 17,
    p: 1.2,
    f: 0.3,
    c: 2.1,
    hint: "",
  },
  {
    name: "Asparagus",
    cat: "veggie",
    cal: 20,
    p: 2.2,
    f: 0.1,
    c: 1.8,
    hint: "",
  },
  // Fats
  {
    name: "Avocado",
    cat: "fat",
    cal: 160,
    p: 2.0,
    f: 15.0,
    c: 1.8,
    hint: "½ avocado ≈ 75g",
  },
  {
    name: "Butter",
    cat: "fat",
    cal: 717,
    p: 0.9,
    f: 81.0,
    c: 0.1,
    hint: "1 tbsp ≈ 14g",
  },
  {
    name: "Olive Oil",
    cat: "fat",
    cal: 884,
    p: 0.0,
    f: 100.0,
    c: 0.0,
    hint: "1 tbsp ≈ 14g",
  },
  {
    name: "Heavy Cream",
    cat: "fat",
    cal: 340,
    p: 2.0,
    f: 36.0,
    c: 2.8,
    hint: "1 tbsp ≈ 15g",
  },
  {
    name: "Cheddar Cheese",
    cat: "fat",
    cal: 402,
    p: 25.0,
    f: 33.0,
    c: 1.3,
    hint: "",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
export function todayStr() {
  const now = new Date();
  return (
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0")
  );
}

export function formatDateLabel(str) {
  const today = todayStr();
  if (str === today) return "Today";

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr =
    yesterday.getFullYear() +
    "-" +
    String(yesterday.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(yesterday.getDate()).padStart(2, "0");
  if (str === yStr) return "Yesterday";

  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function calcMacros(foodIdx, grams) {
  const fd = FOODS[foodIdx];
  const r = grams / 100;
  return {
    cal: Math.round(fd.cal * r),
    p: Math.round(fd.p * r * 10) / 10,
    f: Math.round(fd.f * r * 10) / 10,
    c: Math.round(fd.c * r * 10) / 10,
  };
}

// ── Pinia Store ───────────────────────────────────────────────────────────────
export const useFoodLogStore = defineStore("foodLog", {
  // ── STATE ──────────────────────────────────────────────────────────────────
  state: () => ({
    entries: [],
    currentDate: todayStr(),
    targets: { cal: 1800, p: 140, f: 140, c: 20 },
  }),

  // ── GETTERS ────────────────────────────────────────────────────────────────
  getters: {
    /** All entries for the currently-viewed date */
    currentEntries(state) {
      return state.entries.filter((e) => e.date === state.currentDate);
    },

    /** Macro totals for the currently-viewed date */
    currentTotals(state) {
      return state.entries
        .filter((e) => e.date === state.currentDate)
        .reduce(
          (acc, e) => ({
            cal: acc.cal + e.cal,
            p: acc.p + e.p,
            f: acc.f + e.f,
            c: acc.c + e.c,
          }),
          { cal: 0, p: 0, f: 0, c: 0 },
        );
    },

    /** Progress toward each daily target (0–100) */
    progress(state) {
      const t = this.currentTotals;
      return {
        cal: Math.min(100, (t.cal / state.targets.cal) * 100),
        p: Math.min(100, (t.p / state.targets.p) * 100),
        f: Math.min(100, (t.f / state.targets.f) * 100),
        c: Math.min(100, (t.c / state.targets.c) * 100),
      };
    },

    /** Sorted unique dates that have entries, excluding currentDate */
    pastDates(state) {
      return [...new Set(state.entries.map((e) => e.date))]
        .filter((d) => d !== state.currentDate)
        .sort()
        .reverse();
    },

    /** Macro totals for an arbitrary date — used by HistoryPanel */
    totalsForDate: (state) => (date) => {
      return state.entries
        .filter((e) => e.date === date)
        .reduce(
          (acc, e) => ({
            cal: acc.cal + e.cal,
            p: acc.p + e.p,
            f: acc.f + e.f,
            c: acc.c + e.c,
          }),
          { cal: 0, p: 0, f: 0, c: 0 },
        );
    },

    /** Whether the current date is today (disables forward navigation) */
    isToday: (state) => state.currentDate === todayStr(),
  },

  // ── ACTIONS ────────────────────────────────────────────────────────────────
  actions: {
    /** Add a new food entry for the current date */
    addEntry(foodIdx, meal, grams) {
      const macros = calcMacros(foodIdx, grams);
      this.entries.push({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        date: this.currentDate,
        foodIdx: Number(foodIdx),
        food: FOODS[foodIdx].name,
        meal,
        grams: Number(grams),
        ...macros,
      });
      this._persist();
    },

    /** Remove a food entry by id */
    deleteEntry(id) {
      this.entries = this.entries.filter((e) => e.id !== id);
      this._persist();
    },

    /** Navigate to a different date */
    setDate(dateStr) {
      this.currentDate = dateStr;
    },

    /** Go forward or back by N days (won't advance past today) */
    shiftDate(delta) {
      const [y, m, d] = this.currentDate.split("-").map(Number);
      const dt = new Date(y, m - 1, d);
      dt.setDate(dt.getDate() + delta);
      const newStr =
        dt.getFullYear() +
        "-" +
        String(dt.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(dt.getDate()).padStart(2, "0");
      if (newStr <= todayStr()) this.currentDate = newStr;
    },

    /** Save entries to localStorage */
    _persist() {
      try {
        localStorage.setItem("keto_v1_entries", JSON.stringify(this.entries));
      } catch (e) {
        console.error("Failed to persist entries", e);
      }
    },

    /** Load saved entries from localStorage on app start */
    loadFromStorage() {
      try {
        const raw = localStorage.getItem("keto_v1_entries");
        if (raw) this.entries = JSON.parse(raw);
      } catch (e) {
        console.error("Failed to load entries", e);
      }
    },
  },
});
