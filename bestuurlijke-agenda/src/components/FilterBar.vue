<script setup>
import { ref } from 'vue';

// We ontvangen de beschikbare jaren vanuit App.vue
const props = defineProps({
  jaren: { type: Array, default: () => [] }
});

const emit = defineEmits(['change-filter', 'change-jaar']);

const actiefFilter = ref('all');     // Welke knop is actief?
const actiefType = ref('fase');      // Is het een 'fase' of 'label' knop?
const geselecteerdJaar = ref(0);     // 0 = Alles tonen

function kiesFase(naam) {
  actiefFilter.value = naam;
  actiefType.value = 'fase';
  emit('change-filter', { type: 'fase', value: naam });
}

function kiesLabel(naam) {
  actiefFilter.value = naam;
  actiefType.value = 'label';
  emit('change-filter', { type: 'label', value: naam });
}

function kiesJaar(event) {
  const jaar = parseInt(event.target.value);
  geselecteerdJaar.value = jaar;
  emit('change-jaar', jaar);
}
</script>

<template>
  <div class="filter-container">
    
    <div class="filters">
      <button class="filter-btn" 
        :class="{ selected: actiefFilter === 'all' }" 
        @click="kiesFase('all')">
        Alles tonen
      </button>
      
      <button class="filter-btn btn-PFO" :class="{ selected: actiefFilter === 'PFO' }" @click="kiesFase('PFO')">Portefeuilleoverleg</button>
      <button class="filter-btn btn-DBBesluit" :class="{ selected: actiefFilter === 'DBBesluit' }" @click="kiesFase('DBBesluit')">Besluitvorming DB</button>
      <button class="filter-btn btn-DBInformeel" :class="{ selected: actiefFilter === 'DBInformeel' }" @click="kiesFase('DBInformeel')">Informeel DB</button>
      <button class="filter-btn btn-Delta" :class="{ selected: actiefFilter === 'Delta' }" @click="kiesFase('Delta')">Deltabijeenkomst</button>
      <button class="filter-btn btn-ABBesluit" :class="{ selected: actiefFilter === 'ABBesluit' }" @click="kiesFase('ABBesluit')">Besluitvorming AB</button>
    </div>

    <div class="filter-divider"><span>Filter op Strategische Duiding</span></div>

    <div class="filters secondary">
      <button class="filter-btn btn-strat" :class="{ selected: actiefFilter === 'Beleid' }" @click="kiesLabel('Beleid')">Beleid</button>
      <button class="filter-btn btn-strat" :class="{ selected: actiefFilter === 'Uitvoering' }" @click="kiesLabel('Uitvoering')">Uitvoering</button>
      <button class="filter-btn btn-strat" :class="{ selected: actiefFilter === 'Kaders' }" @click="kiesLabel('Kaders')">Kaders</button>
      <button class="filter-btn btn-strat" :class="{ selected: actiefFilter === 'Evaluatie' }" @click="kiesLabel('Evaluatie')">Evaluatie</button>
      <button class="filter-btn btn-strat" :class="{ selected: actiefFilter === 'Organisatiegesteldheid' }" @click="kiesLabel('Organisatiegesteldheid')">Organisatie</button>
      <button class="filter-btn btn-strat" :class="{ selected: actiefFilter === 'Externe ontwikkelingen' }" @click="kiesLabel('Externe ontwikkelingen')">Externe ontw.</button>
    </div>

    <div class="filter-divider"><span>Periode</span></div>

    <div class="filters">
      <select class="filter-btn year-select" @change="kiesJaar">
        <option value="0">📅 Historie (Alles)</option>
        <option v-for="jaar in jaren" :key="jaar" :value="jaar">
          Vanaf {{ jaar }}
        </option>
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
  box-shadow: 0 4px 6px -1px rgba(7, 88, 149, 0.05); /* Blue-ish shadow */
}

.filters {
  display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;
}

.filter-divider {
  width: 100%; height: 1px; background: rgba(7, 88, 149, 0.1); margin: 20px 0;
  display: flex; align-items: center; justify-content: center;
}
.filter-divider span {
  background: white; padding: 2px 15px; font-size: 0.7rem; text-transform: uppercase; 
  color: #075895; font-weight: bold; letter-spacing: 0.5px;
}

/* Standard Button Style - Clean & Corporate */
.filter-btn {
  background: white; 
  border: 1px solid #cce4f2; 
  padding: 8px 16px; 
  border-radius: 4px; /* Boxier looks more "official" */
  cursor: pointer; 
  font-size: 0.9rem; 
  transition: all 0.2s; 
  color: #075895; 
}

.filter-btn:hover { 
  background: #f0f8fc; 
  border-color: #00b0ea; 
}

/* Active State */
.filter-btn.selected { 
  background: #075895; 
  color: white; 
  border-color: #075895; 
  font-weight: 600; 
  box-shadow: 0 2px 4px rgba(7, 88, 149, 0.3);
}

/* Specific colors when active (Overrides) */
.filter-btn.btn-PFO.selected { background: var(--c-pfo); border-color: var(--c-pfo); }
.filter-btn.btn-DBBesluit.selected { background: var(--c-db-besluit); border-color: var(--c-db-besluit); }
/* DBSchrift verwijderd */
.filter-btn.btn-DBInformeel.selected { background: var(--c-db-informeel); border-color: var(--c-db-informeel); }
.filter-btn.btn-ABBesluit.selected { background: var(--c-ab-besluit); border-color: var(--c-ab-besluit); }
/* ABBrief verwijderd */
.filter-btn.btn-Delta.selected { background: var(--c-delta); border-color: var(--c-delta); }

.year-select { 
  padding-right: 35px; 
  font-weight: bold; 
  color: #075895; 
  border: 2px solid #075895;
}
</style>