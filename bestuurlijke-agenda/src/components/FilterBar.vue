<script setup>
import { computed } from 'vue';
import { useDateManager } from './DateManager.vue';

const props = defineProps({
  filters: Object,
  years: Array,
  selectedYear: Number
});

const emit = defineEmits(['toggle-filter', 'set-year']);

const yearOptions = computed(() => {
    return props.years || [2024, 2025, 2026];
});
</script>

<template>
  <div class="filter-container">
    <div class="filters">
      <button 
        class="filter-btn btn-PFO"
        :class="{ selected: filters.PFO }" 
        @click="$emit('toggle-filter', 'PFO')"
      >
        PFO
      </button>

      <button 
        class="filter-btn btn-DBBesluit"
        :class="{ selected: filters.DBBesluit }" 
        @click="$emit('toggle-filter', 'DBBesluit')"
      >
        DB Besluit
      </button>

      <button 
        class="filter-btn btn-DBSchrift"
        :class="{ selected: filters.DBSchrift }" 
        @click="$emit('toggle-filter', 'DBSchrift')"
      >
        DB Schriftelijk
      </button>

      <button 
        class="filter-btn btn-DBInformeel"
        :class="{ selected: filters.DBInformeel }" 
        @click="$emit('toggle-filter', 'DBInformeel')"
      >
        DB Informeel
      </button>

      <div class="filter-divider"><span>Algemeen Bestuur</span></div>

      <button 
        class="filter-btn btn-ABBesluit"
        :class="{ selected: filters.ABBesluit }" 
        @click="$emit('toggle-filter', 'ABBesluit')"
      >
        AB Besluit
      </button>

      <button 
        class="filter-btn btn-ABBrief"
        :class="{ selected: filters.ABBrief }" 
        @click="$emit('toggle-filter', 'ABBrief')"
      >
        AB Brief
      </button>

      <button 
        class="filter-btn btn-Delta"
        :class="{ selected: filters.Delta }" 
        @click="$emit('toggle-filter', 'Delta')"
      >
        Delta
      </button>
    </div>

    <div class="year-selector">
        <select :value="selectedYear" @change="$emit('set-year', Number($event.target.value))" class="year-select">
            <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
        </select>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  padding: 20px;
  background: white;
  margin-bottom: 25px;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
}

.filter-divider {
  width: 100%;
  height: 1px;
  background: #eee;
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.filter-divider span {
    background: white;
    padding: 0 10px;
    font-size: 0.8rem;
    color: #999;
}

.filter-btn {
  border: 1px solid #ddd;
  background: white;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  color: #555;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.filter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.filter-btn.selected {
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Kleuren per knop wanneer geselecteerd */
.filter-btn.btn-PFO.selected { background-color: var(--c-pfo); }
.filter-btn.btn-DBBesluit.selected { background-color: var(--c-db-besluit); }
.filter-btn.btn-DBSchrift.selected { background-color: var(--c-db-schrift); }
.filter-btn.btn-DBInformeel.selected { background-color: var(--c-db-informeel); }
.filter-btn.btn-ABBesluit.selected { background-color: var(--c-ab-besluit); }
.filter-btn.btn-ABBrief.selected { background-color: var(--c-ab-brief); }
.filter-btn.btn-Delta.selected { background-color: var(--c-delta); }

.year-selector {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}
.year-select {
    padding: 5px 15px;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid #ddd;
    cursor: pointer;
}
</style>