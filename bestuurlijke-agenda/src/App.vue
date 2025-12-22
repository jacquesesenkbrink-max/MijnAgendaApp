<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  
  import { defaultItems } from './data/items.js';
  import { getSortDate, getMonthName } from './utils/dateHelpers.js';
  
  import TopicCard from './components/TopicCard.vue';
  import FilterBar from './components/FilterBar.vue';
  import SidebarNav from './components/SidebarNav.vue';
  import SwimlaneHeaders from './components/SwimlaneHeaders.vue';
  import DetailModal from './components/DetailModal.vue';
  import EditModal from './components/EditModal.vue';
  import ReportView from './components/ReportView.vue';

  const agendaPunten = ref([]); 
  
  // STATEN
  const viewMode = ref('grid'); 
  const filterType = ref('fase');
  const filterWaarde = ref('all');
  const startJaar = ref(0);
  
  // ADMIN STATUS
  const isAdmin = ref(false); // Standaard ben je geen admin
  const fileInput = ref(null); // Voor het upload knopje

  // Modals
  const isDetailOpen = ref(false);
  const isEditOpen = ref(false);
  const geselecteerdItem = ref(null);
  const editItem = ref(null);

  onMounted(() => {
    const opgeslagen = localStorage.getItem('mijn-agenda-data');
    if (opgeslagen) {
      agendaPunten.value = JSON.parse(opgeslagen);
    } else {
      agendaPunten.value = defaultItems;
    }
    // Check of we nog ingelogd waren van vorige keer
    if (sessionStorage.getItem('is-admin') === 'true') {
        isAdmin.value = true;
    }
  });

  watch(agendaPunten, (nieuweLijst) => {
    localStorage.setItem('mijn-agenda-data', JSON.stringify(nieuweLijst));
  }, { deep: true });

  const uniekeJaren = computed(() => {
    const jarenSet = new Set();
    agendaPunten.value.forEach(item => {
      const datum = getSortDate(item);
      if (datum.getFullYear() < 9000) jarenSet.add(datum.getFullYear());
    });
    return Array.from(jarenSet).sort();
  });

  // --- ADMIN FUNCTIES ---
  function toggleAdmin() {
    if (isAdmin.value) {
        // Uitloggen
        isAdmin.value = false;
        sessionStorage.removeItem('is-admin');
    } else {
        // Inloggen
        const ww = prompt("Voer wachtwoord in:", "");
        if (ww === "wdo") { // SIMPEL WACHTWOORD
            isAdmin.value = true;
            sessionStorage.setItem('is-admin', 'true');
        } else if (ww !== null) {
            alert("Fout wachtwoord!");
        }
    }
  }

  // --- BACKUP FUNCTIES ---
  function downloadBackup() {
    const dataStr = JSON.stringify(agendaPunten.value, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `agenda-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function triggerImport() {
    fileInput.value.click();
  }

  function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = JSON.parse(e.target.result);
            if (Array.isArray(json)) {
                if(confirm(`Weet je zeker dat je de huidige lijst wilt overschrijven met ${json.length} items uit de backup?`)) {
                    agendaPunten.value = json;
                    alert("Import geslaagd!");
                }
            } else {
                alert("Ongeldig bestand: Geen lijst gevonden.");
            }
        } catch (err) {
            alert("Fout bij lezen bestand: " + err.message);
        }
        // Reset input zodat je hetzelfde bestand nog eens kan kiezen
        event.target.value = '';
    };
    reader.readAsText(file);
  }

  // --- OVERIGE FUNCTIES ---
  function updateHoofdFilter(payload) {
    filterType.value = payload.type;
    filterWaarde.value = payload.value;
  }
  function updateJaar(jaar) { startJaar.value = jaar; }
  
  const gefilterdeItems = computed(() => {
    let items = agendaPunten.value;
    if (startJaar.value > 0) items = items.filter(item => getSortDate(item).getFullYear() >= startJaar.value);
    if (filterWaarde.value !== 'all') {
      if (filterType.value === 'fase') items = items.filter(item => item.schedule && item.schedule[filterWaarde.value]);
      else items = items.filter(item => item.strategicLabel === filterWaarde.value);
    }
    return items;
  });

  const gegroepeerdeLijst = computed(() => {
    const groepen = {};
    gefilterdeItems.value.forEach(item => {
      const datum = getSortDate(item);
      const maandNaam = getMonthName(datum);
      const sortKey = datum.toISOString().slice(0, 7);
      if (!groepen[sortKey]) groepen[sortKey] = { titel: maandNaam, sortKey: sortKey, items: [] };
      groepen[sortKey].items.push(item);
    });
    return Object.values(groepen).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  });

  function openDetails(item) { geselecteerdItem.value = item; isDetailOpen.value = true; }
  function openEdit(item) { editItem.value = item; isEditOpen.value = true; }
  function openNieuw() { editItem.value = null; isEditOpen.value = true; }
  function saveChanges(updatedItem) {
    const index = agendaPunten.value.findIndex(i => i.id === updatedItem.id);
    if (index !== -1) agendaPunten.value[index] = updatedItem;
    else agendaPunten.value.push(updatedItem);
    isEditOpen.value = false;
  }
  function deleteItem(item) {
    if (confirm(`Weet je zeker dat je "${item.title}" wilt verwijderen?`)) {
      agendaPunten.value = agendaPunten.value.filter(i => i.id !== item.id);
    }
  }
</script>

<template>
  <header>
    <div class="top-bar">
        <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none" accept=".json">

        <div class="header-content">
            <h1>Bestuurlijke Planning WDODelta</h1>
            <p class="subtitle">Framework Versie (Vue.js)</p>
        </div>

        <div class="admin-controls">
            <button class="login-btn" @click="toggleAdmin" :class="{ 'is-active': isAdmin }">
                {{ isAdmin ? '🔓 Admin' : '🔒 Login' }}
            </button>
            
            <div v-if="isAdmin" class="admin-tools">
                <button class="tool-btn" @click="downloadBackup" title="Download Backup">⬇️ Export</button>
                <button class="tool-btn" @click="triggerImport" title="Upload Backup">⬆️ Import</button>
            </div>
        </div>
    </div>
    
    <div class="header-actions">
      <div class="view-toggle">
        <button :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">Grid</button>
        <button :class="{ active: viewMode === 'table' }" @click="viewMode = 'table'">Tabel</button>
      </div>

      <button v-if="isAdmin" class="add-btn" @click="openNieuw">+ Nieuw</button>
    </div>
  </header>

  <main>
    <SidebarNav v-if="viewMode === 'grid'" :groepen="gegroepeerdeLijst" />
    <FilterBar :jaren="uniekeJaren" @change-filter="updateHoofdFilter" @change-jaar="updateJaar" />
    <SwimlaneHeaders v-if="viewMode === 'grid'" />

    <DetailModal :show="isDetailOpen" :item="geselecteerdItem" @close="isDetailOpen = false" />
    <EditModal :show="isEditOpen" :item="editItem" @save="saveChanges" @close="isEditOpen = false" />

    <div class="container">
      <div v-if="viewMode === 'grid'">
        <div v-if="gegroepeerdeLijst.length === 0" class="empty-state">
          Geen agendapunten gevonden.
        </div>
        <div v-for="groep in gegroepeerdeLijst" :key="groep.sortKey" :id="'maand-' + groep.sortKey" class="month-block">
          <div class="month-header"><span class="month-badge">{{ groep.titel }}</span></div>
          <div class="grid-layout">
            <TopicCard 
              v-for="punt in groep.items" :key="punt.id" :item="punt"
              :isAdmin="isAdmin"
              @click="openDetails(punt)" @edit="openEdit" @delete="deleteItem"
              style="cursor: pointer;" 
            />
          </div>
        </div>
      </div>

      <div v-else>
        <ReportView :items="gefilterdeItems" />
      </div>
    </div>
  </main>
</template>

<style scoped>
header {
  background: linear-gradient(135deg, #2c3e50, #4ca1af);
  color: white; padding: 1rem; 
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  position: relative; z-index: 10;
}

.top-bar {
    display: flex; justify-content: space-between; align-items: flex-start;
    max-width: 1400px; margin: 0 auto; width: 100%;
}

/* Zorg dat de titel mooi in het midden blijft, ook met knoppen rechts */
.header-content { text-align: center; flex-grow: 1; padding-left: 100px; /* compenseer voor login knop */ }

h1 { margin: 0; font-size: 1.8rem; }
.subtitle { opacity: 0.9; margin: 0; }

/* Admin knoppen */
.admin-controls { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
.login-btn {
    background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.3); color: white;
    padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;
}
.login-btn:hover { background: rgba(0,0,0,0.4); }
.login-btn.is-active { background: #e67e22; border-color: #d35400; font-weight: bold; }

.admin-tools { display: flex; gap: 5px; }
.tool-btn {
    background: white; color: #333; border: none; padding: 2px 8px; border-radius: 4px; 
    font-size: 0.75rem; cursor: pointer;
}
.tool-btn:hover { background: #eee; }


.header-actions {
  display: flex; gap: 15px; align-items: center; justify-content: center; margin-top: 15px;
}

.view-toggle {
  background: rgba(0,0,0,0.2); border-radius: 20px; padding: 3px; display: flex;
}
.view-toggle button {
  background: transparent; border: none; color: white; padding: 5px 15px;
  border-radius: 15px; cursor: pointer; font-size: 0.9rem;
}
.view-toggle button.active {
  background: white; color: #2c3e50; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.add-btn {
    background: #27ae60; border: none; color: white;
    padding: 8px 20px; border-radius: 20px; cursor: pointer; font-weight: bold;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.add-btn:hover { background: #2ecc71; }

.container { max-width: 1400px; margin: 0 auto; padding: 20px; }
.month-block { margin-bottom: 40px; scroll-margin-top: 140px; }
.month-header { text-align: center; margin-bottom: 20px; position: relative; z-index: 1; }
.month-header::before {
    content: ''; position: absolute; left: 0; right: 0; top: 50%;
    height: 1px; background: #ccc; z-index: -1;
}
.month-badge {
    background-color: #fff; color: #2c3e50; border: 2px solid #2c3e50;
    padding: 5px 20px; border-radius: 30px; font-size: 1rem; font-weight: bold; display: inline-block;
}

.grid-layout { display: grid; gap: 15px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
@media (min-width: 1100px) {
  .grid-layout { grid-template-columns: repeat(7, 1fr); align-items: start; }
}
.empty-state { text-align: center; color: #888; margin-top: 50px; font-size: 1.2rem; }
</style>