<script setup>
  import { ref, computed, watch, onMounted, nextTick } from 'vue';
  
  import { defaultItems } from './data/items.js';
  import { parseDate, getMonthName } from './utils/dateHelpers.js';
  
  import TopicCard from './components/TopicCard.vue';
  import FilterBar from './components/FilterBar.vue';
  import SidebarNav from './components/SidebarNav.vue';
  import SwimlaneHeaders from './components/SwimlaneHeaders.vue';
  import DetailModal from './components/DetailModal.vue';
  import EditModal from './components/EditModal.vue';
  import ReportView from './components/ReportView.vue';

  // DATA
  const agendaPunten = ref([]); 
  
  // STATEN
  const viewMode = ref('grid'); 
  const filterType = ref('fase');
  const filterWaarde = ref('all');
  const startJaar = ref(0);
  const activeFocusId = ref(null); 
  
  const isAdmin = ref(false); 
  const fileInput = ref(null);

  // NIEUW: Header Toggle State
  const isHeaderOpen = ref(true);

  // HISTORIE (Undo / Redo)
  const historyStack = ref([]);
  const futureStack = ref([]);

  // Modals
  const isDetailOpen = ref(false);
  const isEditOpen = ref(false);
  const geselecteerdItem = ref(null);
  const editItem = ref(null);

  // SVG Refs
  const connectionsPath = ref('');
  const strokeColor = ref('#2c3e50');
  const timelineRef = ref(null);

  onMounted(() => {
    const opgeslagen = localStorage.getItem('mijn-agenda-data');
    if (opgeslagen) {
      agendaPunten.value = JSON.parse(opgeslagen);
    } else {
      agendaPunten.value = defaultItems;
    }
    // Check sessie
    if (sessionStorage.getItem('is-admin') === 'true') {
        isAdmin.value = true;
    }
    window.addEventListener('resize', drawConnections);
  });

  // Automatisch opslaan in LocalStorage bij wijzigingen
  watch(agendaPunten, (nieuweLijst) => {
    localStorage.setItem('mijn-agenda-data', JSON.stringify(nieuweLijst));
    if(activeFocusId.value) nextTick(() => drawConnections());
  }, { deep: true });

  watch(viewMode, () => {
    if(activeFocusId.value) nextTick(() => drawConnections());
  });

  // --- NIEUW: Header Toggle Functie ---
  function toggleHeader() {
    isHeaderOpen.value = !isHeaderOpen.value;
    
    // Als we het menu openen, scrollen we soepel terug naar boven zodat de filters zichtbaar zijn
    if (isHeaderOpen.value) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // --- 1. HISTORIE FUNCTIES (UNDO / REDO) ---
  function addToHistory() {
    // Sla een kopie van de HUIDIGE staat op in de geschiedenis
    historyStack.value.push(JSON.parse(JSON.stringify(agendaPunten.value)));
    // Als je iets nieuws doet, is de 'toekomst' (redo) niet meer geldig
    futureStack.value = [];
  }

  function undo() {
    if (historyStack.value.length === 0) return;
    
    // Huidige staat naar future
    futureStack.value.push(JSON.parse(JSON.stringify(agendaPunten.value)));
    
    // Vorige staat ophalen
    const vorigeStaat = historyStack.value.pop();
    agendaPunten.value = vorigeStaat;
  }

  function redo() {
    if (futureStack.value.length === 0) return;

    // Huidige staat naar history
    historyStack.value.push(JSON.parse(JSON.stringify(agendaPunten.value)));

    // Volgende staat ophalen
    const volgendeStaat = futureStack.value.pop();
    agendaPunten.value = volgendeStaat;
  }

  // --- 2. ADMIN & CRUD ---
  function toggleAdmin() {
    if (isAdmin.value) {
        isAdmin.value = false;
        sessionStorage.removeItem('is-admin');
    } else {
        const ww = prompt("Wachtwoord:", "");
        if (ww === "wdo" || ww === "admin") {
            isAdmin.value = true;
            sessionStorage.setItem('is-admin', 'true');
        } else if (ww) {
            alert("Onjuist wachtwoord");
        }
    }
  }

  function openNieuw() { 
      editItem.value = null; 
      isEditOpen.value = true; 
  }

  function openEdit(item) { 
      editItem.value = item; 
      isEditOpen.value = true; 
  }

  function saveChanges(updatedItem) {
      addToHistory(); // <--- Eerst huidige staat opslaan!

      const index = agendaPunten.value.findIndex(i => i.id === updatedItem.id);
      if (index !== -1) {
          // Update bestaand
          agendaPunten.value[index] = updatedItem;
      } else {
          // Nieuw item (id genereren als die er niet is, of max id + 1)
          if(!updatedItem.id) {
             const maxId = agendaPunten.value.reduce((max, i) => Math.max(max, i.id), 0);
             updatedItem.id = maxId + 1;
          }
          agendaPunten.value.push(updatedItem);
      }
      isEditOpen.value = false;
  }

  function deleteItem(item) {
      if(confirm(`Weet je zeker dat je "${item.title}" wilt verwijderen?`)) {
          addToHistory(); // <--- Opslaan voor undo
          agendaPunten.value = agendaPunten.value.filter(i => i.id !== item.id);
      }
  }

  // --- IMPORT / EXPORT ---
  function downloadBackup() {
    const dataStr = JSON.stringify(agendaPunten.value, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bestuurlijke-planning-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function triggerImport() { fileInput.value.click(); }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target.result);
            if (Array.isArray(json)) {
                addToHistory(); // Veiligheid voor alles
                agendaPunten.value = json;
                alert("Import geslaagd!");
            } else {
                alert("Ongeldig bestand.");
            }
        } catch (err) { alert("Fout bij lezen: " + err); }
        event.target.value = '';
    };
    reader.readAsText(file);
  }

  // --- DATA TRANSFORMATIE & FILTERS ---
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

  const gefilterdeEvents = computed(() => {
    let list = alleEvents.value;
    if (startJaar.value > 0) list = list.filter(e => e.dateObj.getFullYear() >= startJaar.value);
    if (filterWaarde.value !== 'all') {
        if (filterType.value === 'fase') list = list.filter(e => e.type === filterWaarde.value);
        else list = list.filter(e => e.strategicLabel === filterWaarde.value);
    }
    return list;
  });

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

  // --- HELPERS VOOR UI ---
  function toggleFocus(topicId) {
    if (activeFocusId.value === topicId) clearFocus();
    else { activeFocusId.value = topicId; nextTick(() => drawConnections()); }
  }
  function clearFocus() { activeFocusId.value = null; connectionsPath.value = ''; }
  
  function openDetails(item) { geselecteerdItem.value = item; isDetailOpen.value = true; }
  function updateHoofdFilter(p) { filterType.value = p.type; filterWaarde.value = p.value; clearFocus(); }
  function updateJaar(j) { startJaar.value = j; clearFocus(); }

  // --- SVG CONNECTIONS ---
  function drawConnections() {
    if (!activeFocusId.value || !timelineRef.value) return;
    const topicId = activeFocusId.value;
    const cards = Array.from(timelineRef.value.querySelectorAll(`[id^='card-${topicId}-']`));
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
    {{ isHeaderOpen ? '▼ Verberg Menu' : '☰ Menu' }}
  </button>

  <header :class="{ collapsed: !isHeaderOpen }">
    <div class="top-bar">
        <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none" accept=".json">
        
        <div class="header-content">
            <h1>Bestuurlijke Planning WDODelta</h1>
            <p class="subtitle">Vue Versie v11.0</p>
        </div>
        
        <div class="login-container">
            <button class="login-btn" @click="toggleAdmin" :class="{ active: isAdmin }">
                {{ isAdmin ? '🔓 Uitloggen' : '🔒 Admin Login' }}
            </button>
        </div>
    </div>
    
    <div class="header-actions">
      <div class="view-toggle">
        <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">🃏 Kaart</button>
        <button :class="{ active: viewMode === 'dots' }" @click="viewMode = 'dots'">🟣 Stippen</button>
        <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">📄 Tabel</button>
      </div>

      <transition name="fade">
        <div v-if="isAdmin" class="admin-toolbar">
            <div class="admin-group">
                <span class="label">Acties:</span>
                <button class="action-btn new" @click="openNieuw">+ Nieuw</button>
            </div>
            <div class="admin-group">
                <span class="label">Historie:</span>
                <button class="action-btn" @click="undo" :disabled="historyStack.length === 0" title="Ongedaan maken">↩️ Undo</button>
                <button class="action-btn" @click="redo" :disabled="futureStack.length === 0" title="Opnieuw uitvoeren">↪️ Redo</button>
            </div>
            <div class="admin-group">
                <span class="label">Data:</span>
                <button class="action-btn" @click="downloadBackup">⬇️ Export</button>
                <button class="action-btn" @click="triggerImport">⬆️ Import</button>
            </div>
        </div>
      </transition>
    </div>
  </header>

  <main :class="{ 'has-focus': activeFocusId !== null }">
    <SidebarNav v-if="viewMode === 'grid' || viewMode === 'dots'" :groepen="gegroepeerdeLijst" />
    <FilterBar :jaren="uniekeJaren" @change-filter="updateHoofdFilter" @change-jaar="updateJaar" />
    <SwimlaneHeaders v-if="viewMode === 'grid'" />

    <DetailModal :show="isDetailOpen" :item="geselecteerdItem" @close="isDetailOpen = false" />
    <EditModal :show="isEditOpen" :item="editItem" @save="saveChanges" @close="isEditOpen = false" />

    <div class="container" ref="timelineRef" :class="{ 'view-dots': viewMode === 'dots' }">
      
      <svg v-if="viewMode === 'grid' || viewMode === 'dots'" id="connections-layer">
        <path v-if="connectionsPath" :d="connectionsPath" class="connection-line" :style="{ stroke: strokeColor }" />
      </svg>

      <div v-if="viewMode === 'grid' || viewMode === 'dots'">
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

      <div v-else>
         <ReportView :items="gefilterdeEvents" />
      </div>
    </div>

    <button v-if="activeFocusId" class="reset-focus-btn" @click="clearFocus">❌ Reset Weergave</button>
  </main>
</template>

<style scoped>
/* NIEUWE MENU TOGGLE KNOP */
.header-toggle-btn {
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 200; /* Zorgt dat hij boven alles zweeft */
  background: #2c3e50;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  transition: background 0.3s;
}
.header-toggle-btn:hover { background: #34495e; }

/* HEADER STYLING MET ANIMATIE */
header { 
    background: linear-gradient(135deg, #2c3e50, #4ca1af); 
    color: white; 
    padding: 1rem; 
    position: relative; 
    z-index: 100; 
    box-shadow: 0 4px 10px rgba(0,0,0,0.2); 
    
    /* Animatie eigenschappen */
    transition: max-height 0.4s ease-in-out, opacity 0.3s ease, padding 0.4s ease;
    max-height: 500px; /* Genoeg ruimte voor het menu */
    overflow: hidden;
    opacity: 1;
}

header.collapsed {
    max-height: 0;
    padding: 0;
    opacity: 0;
    pointer-events: none;
}

/* Print aanpassing voor toggle knop */
@media print {
    .header-toggle-btn { display: none !important; }
    header { display: none !important; } /* Of wil je de header WEL zien bij print? */
}


.top-bar { display: flex; justify-content: space-between; align-items: center; max-width: 1400px; margin: 0 auto; }
.header-content { text-align: center; flex-grow: 1; }

.header-actions { display: flex; flex-direction: column; align-items: center; gap: 15px; margin-top: 15px; }

/* View Toggle (Grid/Dots/Table) */
.view-toggle { background: rgba(0,0,0,0.2); border-radius: 20px; padding: 3px; display: flex; }
.view-toggle button { background: transparent; border: none; color: white; padding: 5px 15px; border-radius: 15px; cursor: pointer; transition: background 0.2s; }
.view-toggle button.active { background: white; color: #2c3e50; font-weight: bold; }

/* LOGIN KNOP */
.login-btn { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.4); color: white; padding: 5px 12px; border-radius: 4px; cursor: pointer; }
.login-btn.active { background: #e67e22; border-color: #d35400; font-weight: bold; }

/* ADMIN TOOLBAR */
.admin-toolbar {
    background: rgba(0, 0, 0, 0.3); padding: 8px 15px; border-radius: 8px;
    display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
    border: 1px solid rgba(255,255,255,0.1); margin-top: 5px;
}
.admin-group { display: flex; align-items: center; gap: 8px; border-right: 1px solid rgba(255,255,255,0.2); padding-right: 15px; }
.admin-group:last-child { border-right: none; }
.admin-group .label { font-size: 0.75rem; text-transform: uppercase; opacity: 0.8; font-weight: bold; }

.action-btn { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; }
.action-btn:hover:not(:disabled) { background: rgba(255,255,255,0.2); transform: translateY(-1px); }
.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.action-btn.new { background: #27ae60; border-color: #2ecc71; font-weight: bold; }

/* ANIMATIE TOOLBAR */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }

/* MAIN CONTAINER */
.container { max-width: 1400px; margin: 0 auto; padding: 20px; position: relative; min-height: 80vh; }

/* SVG */
#connections-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 15; }
.connection-line { fill: none; stroke-width: 3; stroke-linecap: round; stroke-dasharray: 10; animation: dash 30s linear infinite; opacity: 0.8; }
@keyframes dash { to { stroke-dashoffset: -1000; } }

/* FOCUS EFFECT */
main.has-focus .month-block { z-index: 10; } 
main.has-focus .card-wrapper { opacity: 0.2; filter: grayscale(100%); transition: opacity 0.3s; }
.reset-focus-btn { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: #e74c3c; color: white; padding: 12px 24px; border-radius: 30px; font-weight: bold; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.3); z-index: 200; animation: popIn 0.3s; }
@keyframes popIn { from { transform: translate(-50%, 50px); } to { transform: translate(-50%, 0); } }

/* GRID LAYOUT */
.month-block { margin-bottom: 40px; scroll-margin-top: 140px; position: relative; }
.month-header { text-align: center; margin-bottom: 20px; position: relative; }
.month-header::before { content: ''; position: absolute; left: 0; right: 0; top: 50%; height: 1px; background: #ccc; z-index: -1; }
.month-badge { background-color: #fff; color: #2c3e50; border: 2px solid #2c3e50; padding: 5px 20px; border-radius: 30px; font-weight: bold; }
.grid-layout { display: grid; gap: 15px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
@media (min-width: 1100px) { .grid-layout { grid-template-columns: repeat(7, 1fr); align-items: start; } }
</style>