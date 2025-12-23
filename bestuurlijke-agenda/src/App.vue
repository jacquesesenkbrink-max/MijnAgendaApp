<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import SidebarNav from './components/SidebarNav.vue';
import SwimlaneHeaders from './components/SwimlaneHeaders.vue';
import AgendaView from './components/AgendaView.vue';
import ReportView from './components/ReportView.vue';
import DateManager from './components/DateManager.vue';
import FilterBar from './components/FilterBar.vue';
import DetailModal from './components/DetailModal.vue';
import EditModal from './components/EditModal.vue';

// Data importeren
import { items } from './data/items.js'; 

// --- STATE ---
const currentView = ref('agenda'); // 'agenda' of 'report'
const startJaar = ref(new Date().getFullYear()); // Standaard huidig jaar
const filterWaarde = ref('all'); // 'all', 'strategie', 'beleid', etc.
const filterType = ref('fase');  // 'fase' of 'label'

// Modals
const showDetailModal = ref(false);
const selectedItem = ref(null);
const showEditModal = ref(false);
const itemToEdit = ref(null);

// Data
const alleEvents = ref(items);

// --- NIEUW: Focus & Isolatie Logic ---
const activeFocusId = ref(null);    // Welke keten is actief?
const showOnlyFocus = ref(false);   // Willen we de rest verbergen?

// SVG Lijn ref
const connectionsPath = ref('');
const connectionsLayer = ref(null);

// --- FILTER LOGICA ---
const gefilterdeEvents = computed(() => {
  let list = alleEvents.value;

  // 1. ISOLATIE CHECK: Als focus actief is én isolatie staat aan
  if (activeFocusId.value && showOnlyFocus.value) {
    // Toon ALLEEN items van deze keten (negeer andere filters)
    return list.filter(e => e.topicId === activeFocusId.value);
  }

  // 2. Normale filters (als isolatie uit staat)
  // Filter op jaar (toon alles vanaf startJaar)
  if (startJaar.value > 0) {
    list = list.filter(e => e.dateObj.getFullYear() >= startJaar.value);
  }

  // Filter op fase of label
  if (filterWaarde.value !== 'all') {
    if (filterType.value === 'fase') {
      list = list.filter(e => e.type === filterWaarde.value);
    } else {
      list = list.filter(e => e.strategicLabel === filterWaarde.value);
    }
  }

  return list;
});

// --- ACTIONS ---

function handleDateChange(year) {
  startJaar.value = year;
  // Als we van jaar wisselen, reset focus om verwarring te voorkomen
  clearFocus();
}

function handleFilter(type, value) {
  filterType.value = type;
  filterWaarde.value = value;
  clearFocus();
}

function openDetail(item) {
  selectedItem.value = item;
  showDetailModal.value = true;
}

function editItem(item) {
  itemToEdit.value = item; // Referentie doorgeven
  showEditModal.value = true;
  showDetailModal.value = false; // Detail sluiten als we gaan editen
}

function handleSave(updatedItem) {
  // Update in de lokale lijst
  const index = alleEvents.value.findIndex(i => i.id === updatedItem.id);
  if (index !== -1) {
    alleEvents.value[index] = updatedItem;
  }
  showEditModal.value = false;
  
  // Als we in focus mode zitten, lijn hertekenen
  if(activeFocusId.value) {
    nextTick(() => drawConnections());
  }
}

// --- FOCUS & LIJNEN TEKENEN ---

// Wordt aangeroepen als je op een kaartje klikt (via emit in AgendaView)
function handleToggleFocus(topicId) {
  if (activeFocusId.value === topicId) {
    // Al actief? Dan uitzetten
    clearFocus();
  } else {
    // Nieuwe focus
    activeFocusId.value = topicId;
    showOnlyFocus.value = false; // Reset isolatie bij nieuwe selectie
    // Wacht tot DOM update klaar is, dan tekenen
    nextTick(() => {
      drawConnections();
    });
  }
}

function clearFocus() {
  activeFocusId.value = null;
  connectionsPath.value = '';
  showOnlyFocus.value = false; // Reset de toggle ook
}

// Watcher: Als we schakelen tussen "Alles tonen" en "Isoleren", teken lijn opnieuw
watch(showOnlyFocus, () => {
  if(activeFocusId.value) {
    nextTick(() => drawConnections());
  }
});

// De functie die de SVG lijn berekent
function drawConnections() {
  if (!activeFocusId.value) {
    connectionsPath.value = '';
    return;
  }

  // Zoek alle zichtbare kaartjes met dit topicId
  // We gebruiken querySelectorAll om de posities in de DOM te vinden
  // Let op: we zoeken naar elementen met data-topic-id attribuut
  const selector = `.topic-card[data-topic-id="${activeFocusId.value}"]`;
  const elements = Array.from(document.querySelectorAll(selector));

  if (elements.length < 2) {
    connectionsPath.value = ''; // Geen lijn nodig bij 0 of 1 item
    return;
  }

  // Sorteer elementen op positie in de DOM (tijdlijn loopt van boven naar beneden)
  // Dit gaat ervan uit dat de DOM volgorde klopt met de tijd
  // We kunnen ook checken op data-date attribuut als dat zekerder is, 
  // maar DOM order in AgendaView is normaal chronologisch.
  
  // We berekenen coördinaten relatief aan de #connections-layer
  const containerRect = document.getElementById('connections-layer').getBoundingClientRect();
  const scrollY = window.scrollY; // Voor correctie als er gescrollt is

  let path = '';
  
  // Loop door de elementen en trek lijnen
  for (let i = 0; i < elements.length - 1; i++) {
    const elA = elements[i];
    const elB = elements[i+1];

    const rectA = elA.getBoundingClientRect();
    const rectB = elB.getBoundingClientRect();

    // Startpunt: Midden onderkant van kaart A
    const startX = (rectA.left + rectA.width / 2) - containerRect.left;
    const startY = (rectA.top + rectA.height) - containerRect.top;

    // Eindpunt: Midden bovenkant van kaart B
    const endX = (rectB.left + rectB.width / 2) - containerRect.left;
    const endY = rectB.top - containerRect.top;

    // Bezier curve voor mooie "slang" beweging
    const distY = endY - startY;
    const controlY1 = startY + distY * 0.5;
    const controlY2 = endY - distY * 0.5;

    if (i === 0) {
      path += `M ${startX} ${startY}`;
    }
    
    path += ` C ${startX} ${controlY1}, ${endX} ${controlY2}, ${endX} ${endY}`;
  }

  connectionsPath.value = path;
}

// Event listener voor resize (hertekenen)
function onResize() {
  if (activeFocusId.value) {
    drawConnections();
  }
}

onMounted(() => {
  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onResize); // Soms nodig als layout verschuift
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  window.removeEventListener('scroll', onResize);
});

</script>

<template>
  <div class="app-container">
    
    <SidebarNav 
      :currentView="currentView" 
      @update:view="currentView = $event" 
    />

    <main class="main-content">
      
      <header class="top-bar">
        <DateManager 
          :startJaar="startJaar" 
          @update:year="handleDateChange" 
        />
        
        <FilterBar 
          @filter="handleFilter" 
        />
      </header>

      <div v-if="currentView === 'agenda'" class="agenda-wrapper">
        
        <SwimlaneHeaders />

        <AgendaView 
          :events="gefilterdeEvents" 
          :activeFocusId="activeFocusId"
          @item-click="openDetail"
          @toggle-focus="handleToggleFocus"
        />

        <svg id="connections-layer">
          <path 
            v-if="connectionsPath" 
            :d="connectionsPath" 
            stroke="#3498db" 
            stroke-width="3" 
            fill="none" 
            stroke-dasharray="5,5"
            class="animated-line"
          />
        </svg>

        <div v-if="activeFocusId" class="floating-controls">
           <button 
              class="control-btn toggle-btn" 
              :class="{ active: showOnlyFocus }" 
              @click="showOnlyFocus = !showOnlyFocus"
           >
              {{ showOnlyFocus ? '👐 Toon Alles' : '🔍 Focus Isoleren' }}
           </button>
           
           <button class="control-btn reset-btn" @click="clearFocus">
              ❌ Sluiten
           </button>
        </div>

      </div>

      <div v-else-if="currentView === 'report'" class="report-wrapper">
        <ReportView :events="gefilterdeEvents" />
      </div>

    </main>

    <DetailModal 
      v-if="showDetailModal" 
      :item="selectedItem" 
      @close="showDetailModal = false"
      @edit="editItem"
    />

    <EditModal
      v-if="showEditModal"
      :item="itemToEdit"
      @close="showEditModal = false"
      @save="handleSave"
    />

  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f7f6;
  overflow-x: hidden; /* Voorkom horizontale scroll door lijnen */
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative; /* Voor absolute positioning van layers */
  margin-left: 260px; /* Breedte van sidebar */
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100; /* Boven alles bij scrollen */
}

.agenda-wrapper {
  position: relative;
  padding: 20px;
  flex: 1;
}

/* --- SVG VERBINDINGSLIJNEN --- */
/* FIX 1: Z-Index verlaagd naar 1 zodat hij ACHTER de kaarten loopt */
#connections-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Klikken gaat er doorheen */
  z-index: 1; 
}

.animated-line {
  animation: dash 30s linear infinite;
  opacity: 0.6;
}

@keyframes dash {
  to {
    stroke-dashoffset: -1000;
  }
}

/* FIX 2: Zorg dat de maand-blokken (met kaarten) boven de lijn liggen */
:deep(.month-block) {
  position: relative;
  z-index: 2; 
}

/* --- FLOATING CONTROLS (NIEUW) --- */
.floating-controls {
  position: fixed;
  bottom: 30px;
  left: calc(50% + 130px); /* Centeren rekening houdend met sidebar */
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 200; /* Boven alles */
  animation: popIn 0.3s;
  background: white;
  padding: 8px;
  border-radius: 40px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  border: 1px solid #ddd;
}

.control-btn {
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 5px;
}

.reset-btn {
  background: #e74c3c;
  color: white;
}
.reset-btn:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.toggle-btn {
  background: #f1c40f; 
  color: #34495e;
}
.toggle-btn:hover {
  background: #f39c12;
  color: white;
  transform: translateY(-2px);
}
.toggle-btn.active {
  background: #27ae60; 
  color: white;
}

@keyframes popIn {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

.report-wrapper {
  padding: 20px;
}
</style>