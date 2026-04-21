import { defineStore } from "pinia";

export const useFoodLogStore = defineStore("foodLog", {
  // STATE — the single source of truth for all app data
  state: () => ({
    entries: [],
    currentDate: new Date().toISOString().split("T")[0],
    targets: { cal: 1800, p: 140, f: 140, c: 20 },
  }),

  // GETTERS and ACTIONS coming next
  getters: {},
  actions: {},
});
