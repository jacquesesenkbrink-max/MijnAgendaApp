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
  padding: 10px 0; background: transparent; margin-bottom: 0; border: none; width: 100%;
}
.filters {
  display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;
}

/* Divider Styling - Beter contrast op blauw */
.filter-divider {
  width: 100%; height: 1px; 
  background: rgba(255,255,255,0.3); /* Iets feller lijntje */
  margin: 15px 0;
  display: flex; align-items: center; justify-content: center;
}
.filter-divider span {
  background: rgba(0, 0, 0, 0.25); /* Donkere achtergrond voor tekst */
  backdrop-filter: blur(4px);
  padding: 4px 15px; font-size: 0.75rem; text-transform: uppercase; 
  color: white; 
  border-radius: 12px; 
  border: 1px solid rgba(255,255,255,0.2);
  letter-spacing: 1px; font-weight: bold;
}

/* --- KNOPPEN (Glassmorphism Fix) --- */
.filter-btn {
  background: rgba(255, 255, 255, 0.2); /* Iets meer zichtbaar */
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 8px 16px; 
  border-radius: 6px;
  cursor: pointer; 
  font-size: 0.9rem; 
  transition: all 0.2s; 
  color: white !important; /* Forceer wit */
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.filter-btn:hover { 
  background: rgba(255, 255, 255, 0.4); 
  transform: translateY(-2px);
}

/* --- ACTIEVE STATUS (Wit vlak, blauwe tekst) --- */
.filter-btn.selected { 
  background: white !important; 
  color: var(--wdod-blue) !important; /* Blauwe tekst op wit */
  border-color: white; 
  font-weight: bold; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  text-shadow: none;
}

/* Specifieke fase-kleuren als ze actief zijn (met witte tekst) */
.filter-btn.btn-PFO.selected { background: var(--c-pfo) !important; color: white !important; }
.filter-btn.btn-DBBesluit.selected { background: var(--c-db-besluit) !important; color: white !important; }
.filter-btn.btn-DBSchrift.selected { background: var(--c-db-schrift) !important; color: white !important; }
.filter-btn.btn-DBInformeel.selected { background: var(--c-db-informeel) !important; color: white !important; }
.filter-btn.btn-ABBesluit.selected { background: var(--c-ab-besluit) !important; color: white !important; }
.filter-btn.btn-ABBrief.selected { background: var(--c-ab-brief) !important; color: white !important; }
.filter-btn.btn-Delta.selected { background: var(--c-delta) !important; color: white !important; }

/* Jaar Selectie */
.year-select { 
  padding-right: 35px; 
  background-color: rgba(0,0,0,0.2); 
  color: white;
  border: 1px solid rgba(255,255,255,0.4);
}
.year-select option {
    background-color: white;
    color: #333;
}
</style>