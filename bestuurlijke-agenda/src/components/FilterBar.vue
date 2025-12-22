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
      <button class="filter-btn btn-DBSchrift" :class="{ selected: actiefFilter === 'DBSchrift' }" @click="kiesFase('DBSchrift')">Schriftelijk DB</button>
      <button class="filter-btn btn-DBInformeel" :class="{ selected: actiefFilter === 'DBInformeel' }" @click="kiesFase('DBInformeel')">Informeel DB</button>
      <button class="filter-btn btn-ABBrief" :class="{ selected: actiefFilter === 'ABBrief' }" @click="kiesFase('ABBrief')">Brief DB aan AB</button>
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
  padding: 15px; background: rgba(0,0,0,0.03); margin-bottom: 20px; border-bottom: 1px solid #ddd;
}
.filters {
  display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;
}
.filter-divider {
  width: 100%; height: 1px; background: rgba(0,0,0,0.1); margin: 15px 0;
  display: flex; align-items: center; justify-content: center;
}
.filter-divider span {
  background: #fff; padding: 2px 12px; font-size: 0.75rem; text-transform: uppercase; 
  color: #999; border-radius: 12px; border: 1px solid #eee;
}

.filter-btn {
  background: white; border: 1px solid #ccc; padding: 6px 12px; border-radius: 20px;
  cursor: pointer; font-size: 0.9rem; transition: all 0.2s; color: #555;
}
.filter-btn:hover { transform: translateY(-2px); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
.filter-btn.selected { background: #2c3e50; color: white; border-color: #2c3e50; font-weight: bold; }

/* Specifieke kleuren voor fases als ze actief zijn */
.filter-btn.btn-PFO.selected { background: var(--c-pfo); border-color: var(--c-pfo); }
.filter-btn.btn-DBBesluit.selected { background: var(--c-db-besluit); border-color: var(--c-db-besluit); }
.filter-btn.btn-DBSchrift.selected { background: var(--c-db-schrift); border-color: var(--c-db-schrift); }
.filter-btn.btn-DBInformeel.selected { background: var(--c-db-informeel); border-color: var(--c-db-informeel); }
.filter-btn.btn-ABBesluit.selected { background: var(--c-ab-besluit); border-color: var(--c-ab-besluit); }
.filter-btn.btn-ABBrief.selected { background: var(--c-ab-brief); border-color: var(--c-ab-brief); }
.filter-btn.btn-Delta.selected { background: var(--c-delta); border-color: var(--c-delta); }

.year-select { padding-right: 30px; font-weight: bold; }
</style>