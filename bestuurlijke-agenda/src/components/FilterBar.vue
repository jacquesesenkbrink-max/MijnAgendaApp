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
/* Container is nu transparant omdat de header de kleur regelt */
.filter-container {
  padding: 10px 0; 
  background: transparent; 
  margin-bottom: 0; 
  border: none;
  width: 100%;
}

.filters {
  display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;
}

/* Divider aangepast voor op donkere achtergrond */
.filter-divider {
  width: 100%; height: 1px; 
  background: rgba(255,255,255,0.2); 
  margin: 15px 0;
  display: flex; align-items: center; justify-content: center;
}
.filter-divider span {
  background: rgba(0, 0, 0, 0.2); /* Donkere pil voor contrast */
  backdrop-filter: blur(4px);
  padding: 2px 15px; font-size: 0.7rem; text-transform: uppercase; 
  color: rgba(255, 255, 255, 0.9); 
  border-radius: 12px; 
  border: 1px solid rgba(255,255,255,0.1);
  letter-spacing: 0.5px;
}

/* --- KNOPPEN STIJL (Glassmorphism) --- */
.filter-btn {
  background: rgba(255, 255, 255, 0.15); /* Semi-transparant */
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px; 
  border-radius: 6px;
  cursor: pointer; 
  font-size: 0.9rem; 
  transition: all 0.2s; 
  color: white; 
  font-weight: 500;
}

.filter-btn:hover { 
  background: rgba(255, 255, 255, 0.3); 
  transform: translateY(-2px);
}

/* --- ACTIEVE KNOP --- */
.filter-btn.selected { 
  background: white; 
  color: var(--wdod-blue); /* Blauwe tekst op witte knop */
  border-color: white; 
  font-weight: bold; 
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

/* Voor specifieke fases: als ze actief zijn, geven we ze toch hun eigen kleur
   zodat het functioneel blijft, maar wel met witte tekst en rand */
.filter-btn.btn-PFO.selected { background: var(--c-pfo); color: white; border-color: white; }
.filter-btn.btn-DBBesluit.selected { background: var(--c-db-besluit); color: white; border-color: white; }
.filter-btn.btn-DBSchrift.selected { background: var(--c-db-schrift); color: white; border-color: white; }
.filter-btn.btn-DBInformeel.selected { background: var(--c-db-informeel); color: white; border-color: white; }
.filter-btn.btn-ABBesluit.selected { background: var(--c-ab-besluit); color: white; border-color: white; }
.filter-btn.btn-ABBrief.selected { background: var(--c-ab-brief); color: white; border-color: white; }
.filter-btn.btn-Delta.selected { background: var(--c-delta); color: white; border-color: white; }

/* Jaar Select Dropdown */
.year-select { 
  padding-right: 35px; 
  background-color: rgba(0,0,0,0.2); /* Iets donkerder voor onderscheid */
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}
.year-select option {
    background-color: white;
    color: #333;
}
</style>