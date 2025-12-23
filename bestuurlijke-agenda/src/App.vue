<script setup>
  import { ref, computed, watch, onMounted, nextTick } from 'vue';
  
  // DATA IMPORTS (Correcte namen)
  import { defaultItems } from './data/items.js';
  import { meetingDates as defaultDates } from './data/meetingDates.js'; 
  import { parseDate, getMonthName } from './utils/dateHelpers.js';
  
  // COMPONENT IMPORTS
  import TopicCard from './components/TopicCard.vue';
  import FilterBar from './components/FilterBar.vue';
  import SidebarNav from './components/SidebarNav.vue';
  import SwimlaneHeaders from './components/SwimlaneHeaders.vue';
  import DetailModal from './components/DetailModal.vue';
  import EditModal from './components/EditModal.vue';
  import ReportView from './components/ReportView.vue';
  import AgendaView from './components/AgendaView.vue';
  import DateManager from './components/DateManager.vue';

  // --- DATA & STATE ---
  const agendaPunten = ref([]); 
  const viewMode = ref('grid'); // 'grid', 'dots', 'table', 'agenda'
  const filterType = ref('fase');
  const filterWaarde = ref('all');
  const startJaar = ref(0);
  
  const activeFocusId = ref(null); 
  const showOnlyFocus = ref(false); // NIEUW: Toggle voor isolatie modus

  const isAdmin = ref(false); 
  const fileInput = ref(null);

  // UI States
  const isHeaderOpen = ref(true);
  const isLoginOpen = ref(false);
  const wachtwoordInput = ref('');
  const isDateManagerOpen = ref(false);
  const activeDates = ref({});

  // Modals
  const isDetailOpen = ref(false);
  const isEditOpen = ref(false);
  const geselecteerdItem = ref(null);
  const editItem = ref(null);

  // Undo/Redo Stacks
  const historyStack = ref([]);
  const futureStack = ref([]);

  // SVG Refs
  const connectionsPath = ref('');
  const strokeColor = ref('#2c3e50');
  const timelineRef = ref(null);

  // --- INITIALISATIE ---
  onMounted(() => {
    // 1. Agenda Items Laden
    const opgeslagen = localStorage.getItem('mijn-agenda-data');
    if (opgeslagen) {
      agendaPunten.value = JSON.parse(opgeslagen);
    } else {
      agendaPunten.value = defaultItems;
    }

    // 2. Datums Laden
    const opgeslagenDatums = localStorage.getItem('mijn-agenda-dates');
    if (opgeslagenDatums) {
        activeDates.value = JSON.parse(opgeslagenDatums);
    } else {
        activeDates.value = JSON.parse(JSON.stringify(defaultDates));
    }

    // 3. Admin check
    if (sessionStorage.getItem('is-admin') === 'true') {
        isAdmin.value = true;
    }
    window.addEventListener('resize', drawConnections);
  });

  // Opslaan bij wijzigingen
  watch(agendaPunten, (nieuweLijst) => {
    localStorage.setItem('mijn-agenda-data', JSON.stringify(nieuweLijst));
    if(activeFocusId.value) nextTick(() => drawConnections());
  }, { deep: true });

  watch(viewMode, () => {
    if(activeFocusId.value) nextTick(() => drawConnections());
  });

  // NIEUW: Als focus-isolatie verandert, herteken de lijnen
  watch(showOnlyFocus, () => {
      if(activeFocusId.value) nextTick(() => drawConnections());
  });

  function saveDates() {
    localStorage.setItem('mijn-agenda-dates', JSON.stringify(activeDates.value));
  }

  // --- LOGICA & TRANSFORMATIE ---
  
  // Stap 1: Maak platte lijst van alle events
  const alleEvents = computed(() => {
    const events = [];
    agendaPunten.value.forEach(item => {
        if (!item.schedule) return;
        Object.keys(item.schedule).forEach(type => {
            const dateStr = item.schedule[type];
            if (!dateStr) return;
            events.push({
                uniqueId: `${item.id}-${type}`,
                topicId: item.id,
                title: item.title,
                ph: item.ph,
                dir: item.dir,
                strategicLabel: item.strategicLabel,
                comments: item.comments,
                type: type,
                dateDisplay: dateStr,
                dateObj: parseDate(dateStr),
                originalItem: item 
            });
        });
    });
    return events.sort((a, b) => a.dateObj - b.dateObj);
  });

  // Stap 2: Filteren (Inclusief de nieuwe isolatie-optie!)
  const gefilterdeEvents = computed(() => {
    let list = alleEvents.value;

    // NIEUW: Als er een focus is én isolatie staat aan -> Toon alleen deze keten
    if (activeFocusId.value && showOnlyFocus.value) {
        return list.filter(e => e.topicId === activeFocusId.value);
    }

    // Anders: reguliere filters
    if (startJaar.value > 0) list = list.filter(e => e.dateObj.getFullYear() >= startJaar.value);
    if (filterWaarde.value !== 'all') {
        if (filterType.value === 'fase') list = list.filter(e => e.type === filterWaarde.value);
        else list = list.filter(e => e.strategicLabel === filterWaarde.value);
    }
    return list;
  });

  // Stap 3: Groeperen per maand (voor de Grid weergave)
  const gegroepeerdeLijst = computed(() => {
    const groepen = {};
    gefilterdeEvents.value.forEach(ev => {
        const d = ev.dateObj;
        let sortKey, titel;
        if (d.getFullYear() === 9999) { sortKey = '9999-99'; titel = 'Datum onbekend'; } 
        else { sortKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; titel = getMonthName(d); }
        
        if (!groepen[sortKey]) groepen[sortKey] = { titel, sortKey, items: [] };
        groepen[sortKey].items.push(ev);
    });
    return Object.values(groepen).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  });

  const uniekeJaren = computed(() => {
    const jaren = new Set(alleEvents.value.map(e => e.dateObj.getFullYear()).filter(y => y < 9000));
    return Array.from(jaren).sort();
  });

  // --- ACTIES ---

  function toggleHeader() {
    isHeaderOpen.value = !isHeaderOpen.value;
    if (isHeaderOpen.value) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleAdminClick() {
    if (isAdmin.value) {
        isAdmin.value = false;
        sessionStorage.removeItem('is-admin');
    } else {
        wachtwoordInput.value = ''; isLoginOpen.value = true;
    }
  }

  function checkLogin() {
    if (wachtwoordInput.value === "wdo" || wachtwoordInput.value === "admin") {
        isAdmin.value = true; sessionStorage.setItem('is-admin', 'true'); isLoginOpen.value = false; 
    } else { alert("Onjuist wachtwoord"); }
  }

  // Focus & Lijnen
  function toggleFocus(topicId) {
    if (activeFocusId.value === topicId) clearFocus();
    else { 
        activeFocusId.value = topicId; 
        showOnlyFocus.value = false; // Reset isolatie bij wissel
        nextTick(() => drawConnections()); 
    }
  }

  function clearFocus() { 
      activeFocusId.value = null; 
      connectionsPath.value = ''; 
      showOnlyFocus.value = false; // Reset de knop
  }

  // Items openen
  function openDetails(item) { geselecteerdItem.value = item; isDetailOpen.value = true; }
  function openNieuw() { editItem.value = null; isEditOpen.value = true; }
  function openEdit(item) { editItem.value = item; isEditOpen.value = true; }
  function updateHoofdFilter(p) { filterType.value = p.type; filterWaarde.value = p.value; clearFocus(); }
  function updateJaar(j) { startJaar.value = j; clearFocus(); }

  // CRUD (Versimpeld)
  function saveChanges(updatedItem) {
      addToHistory();
      const index = agendaPunten.value.findIndex(i => i.id === updatedItem.id);
      if (index !== -1) agendaPunten.value[index] = updatedItem;
      else { if(!updatedItem.id) updatedItem.id = Date.now(); agendaPunten.value.push(updatedItem); }
      isEditOpen.value = false;
  }
  function deleteItem(item) {
      if(confirm(`Verwijderen: "${item.title}"?`)) { addToHistory(); agendaPunten.value = agendaPunten.value.filter(i => i.id !== item.id); }
  }

  // Historie
  function addToHistory() { historyStack.value.push(JSON.parse(JSON.stringify(agendaPunten.value))); futureStack.value = []; }
  function undo() { if (historyStack.value.length) { futureStack.value.push(JSON.parse(JSON.stringify(agendaPunten.value))); agendaPunten.value = historyStack.value.pop(); } }
  function redo() { if (futureStack.value.length) { historyStack.value.push(JSON.parse(JSON.stringify(agendaPunten.value))); agendaPunten.value = futureStack.value.pop(); } }
  function downloadBackup() { /* ...bestaande code... */ }
  function triggerImport() { fileInput.value.click(); }
  function handleFileUpload(e) { /* ...bestaande code... */ }

  // SVG Drawing Logic
  function drawConnections() {
    if (!activeFocusId.value || !timelineRef.value) return;
    const topicId = activeFocusId.value;
    const cards = Array.from(timelineRef.value.querySelectorAll(`[id^='card-${topicId}-']`));
    
    // Sorteer kaarten op positie (van boven naar beneden)
    cards.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);

    if (cards.length < 2) { connectionsPath.value = ''; return; }

    const style = window.getComputedStyle(cards[0]);
    strokeColor.value = viewMode.value === 'dots' ? style.backgroundColor : style.borderTopColor;
    if (!strokeColor.value || strokeColor.value === 'rgba(0, 0, 0, 0)') strokeColor.value = '#2c3e50';

    const containerRect = timelineRef.value.getBoundingClientRect();
    let pathD = '';
    for (let i = 0; i < cards.length - 1; i++) {
        const rectA = cards[i].getBoundingClientRect();
        const rectB = cards[i+1].getBoundingClientRect();
        const x1 = rectA.left + (rectA.width / 2) - containerRect.left;
        const y1 = rectA.top + (rectA.height / 2) - containerRect.top;
        const x2 = rectB.left + (rectB.width / 2) - containerRect.left;
        const y2 = rectB.top + (rectB.height / 2) - containerRect.top;
        const deltaY = y2 - y1;
        pathD += `M ${x1} ${y1} C ${x1} ${y1 + deltaY * 0.5}, ${x2} ${y2 - deltaY * 0.5}, ${x2} ${y2} `;
    }
    connectionsPath.value = pathD;
  }
</script>

<template>
  <button class="header-toggle-btn" @click="toggleHeader" title="Menu openen/sluiten">
    {{ isHeaderOpen ? '▼ Verberg' : '☰ Menu' }}
  </button>

  <header :class="{ collapsed: !isHeaderOpen }">
    <div class="top-bar">
        <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none" accept=".json">
        <div class="header-content">
            <h1>Bestuurlijke Planning WDODelta</h1>
            <p class="subtitle">Vue Versie v11.2</p>
        </div>
        <div class="login-container">
            <button class="login-btn" @click="handleAdminClick" :class="{ active: isAdmin }">
                {{ isAdmin ? '🔓 Uitloggen' : '🔒 Admin Login' }}
            </button>
        </div>
    </div>
    
    <div class="header-actions">
      <div class="view-toggle">
        <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">🃏 Kaart</button>
        <button :class="{ active: viewMode === 'dots' }" @click="viewMode = 'dots'">🟣 Stippen</button>
        <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">📄 Tabel</button>
        <button :class="{ active: viewMode === 'agenda' }" @click="viewMode = 'agenda'">🗓️ Agenda</button>
      </div>

      <transition name="fade">
        <div v-if="isAdmin" class="admin-toolbar">
            <div class="admin-group">
                <span class="label">Acties:</span>
                <button class="action-btn new" @click="openNieuw">+ Nieuw</button>
            </div>
            <div class="admin-group">
                <span class="label">Data:</span>
                <button class="action-btn" @click="isDateManagerOpen = true">📅 Beheer Datums</button> 
                </div>
            <div class="admin-group">
                <span class="label">Historie:</span>
                <button class="action-btn" @click="undo" :disabled="historyStack.length === 0">↩️</button>
                <button class="action-btn" @click="redo" :disabled="futureStack.length === 0">↪️</button>
            </div>
        </div>
      </transition>
    </div>
  </header>

  <main :class="{ 'has-focus': activeFocusId !== null }">
    
    <DetailModal :show="isDetailOpen" :item="geselecteerdItem" @close="isDetailOpen = false" />
    <EditModal :show="isEditOpen" :item="editItem" :availableDates="activeDates" @save="saveChanges" @close="isEditOpen = false" />
    <DateManager :show="isDateManagerOpen" :datesData="activeDates" @update-dates="saveDates" @close="isDateManagerOpen = false" />

    <div v-if="isLoginOpen" class="login-overlay" @click.self="isLoginOpen = false">
        <div class="login-modal">
            <h3>Beheerder Inloggen</h3>
            <input type="password" v-model="wachtwoordInput" class="login-input" @keyup.enter="checkLogin" autofocus>
            <button class="login-confirm-btn" @click="checkLogin">Inloggen</button>
        </div>
    </div>

    <div v-if="viewMode === 'grid' || viewMode === 'dots'">
        <SidebarNav :groepen="gegroepeerdeLijst" />
        <FilterBar :jaren="uniekeJaren" @change-filter="updateHoofdFilter" @change-jaar="updateJaar" />
        <SwimlaneHeaders v-if="viewMode === 'grid'" />

        <div class="container" ref="timelineRef" :class="{ 'view-dots': viewMode === 'dots' }">
          
          <svg id="connections-layer">
            <path v-if="connectionsPath" :d="connectionsPath" class="connection-line" :style="{ stroke: strokeColor }" />
          </svg>

          <div v-if="gegroepeerdeLijst.length === 0" class="empty-state">Geen punten gevonden.</div>
          
          <div v-for="groep in gegroepeerdeLijst" :key="groep.sortKey" :id="'maand-' + groep.sortKey" class="month-block">
            <div class="month-header"><span class="month-badge">{{ groep.titel }}</span></div>
            <div class="grid-layout">
              <TopicCard 
                v-for="ev in groep.items" :key="ev.uniqueId" 
                :event="ev" :isAdmin="isAdmin" :isFocused="activeFocusId === ev.topicId" :isCompact="viewMode === 'dots'"
                @toggle-focus="toggleFocus" @open-details="openDetails" @edit="openEdit" @delete="deleteItem"
              />
            </div>
          </div>
        </div>
    </div>

    <div v-else-if="viewMode === 'table'" class="container">
        <ReportView :items="gefilterdeEvents" />
    </div>

    <div v-else-if="viewMode === 'agenda'" class="container">
        <AgendaView :items="gefilterdeEvents" :activeFilter="filterWaarde" />
    </div>

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

  </main>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--bg-body);
  overflow-x: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  margin-left: 260px;
}

/* --- DE NIEUWE GRADIENT HEADER --- */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Zorgt dat filterbar netjes uitlijnt */
  padding: 15px 30px;
  
  /* WDODelta Gradient: Van Primair Blauw naar Cyaan */
  background: linear-gradient(135deg, var(--wdod-blue) 0%, var(--wdod-cyan) 100%);
  
  /* Subtiele schaduw */
  box-shadow: 0 4px 12px rgba(7, 88, 149, 0.2);
  
  color: white; /* Alle tekst in de header wit */
  position: sticky;
  top: 0;
  z-index: 100;
}

/* De rest blijft hetzelfde */
.agenda-wrapper { position: relative; padding: 20px; flex: 1; }

#connections-layer {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 1; 
}

.animated-line { animation: dash 30s linear infinite; opacity: 0.6; }
@keyframes dash { to { stroke-dashoffset: -1000; } }

:deep(.month-block) { position: relative; z-index: 2; }

.floating-controls {
  position: fixed; bottom: 30px; left: calc(50% + 130px);
  transform: translateX(-50%); display: flex; gap: 15px; z-index: 200;
  animation: popIn 0.3s; background: white; padding: 8px;
  border-radius: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); border: 1px solid #ddd;
}

.control-btn {
  padding: 10px 20px; border-radius: 30px; font-weight: bold; border: none;
  cursor: pointer; font-size: 0.9rem; transition: all 0.2s; white-space: nowrap;
  display: flex; align-items: center; gap: 5px;
}

.reset-btn { background: var(--wdod-red); color: white; }
.toggle-btn { background: var(--wdod-orange); color: white; }
.toggle-btn:hover { transform: translateY(-2px); box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
.toggle-btn.active { background: var(--wdod-green); }

@keyframes popIn {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

.report-wrapper { padding: 20px; }
</style>