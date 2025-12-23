<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import AgendaView from './components/AgendaView.vue';
import ReportView from './components/ReportView.vue';
import FilterBar from './components/FilterBar.vue';
import DetailModal from './components/DetailModal.vue';
import EditModal from './components/EditModal.vue';
import SidebarNav from './components/SidebarNav.vue';
import { items } from './data/items';
import { getMonthName } from './utils/dateHelpers';

// State
const allItems = ref(items);
const activeView = ref('agenda'); // 'agenda' or 'report'
const selectedYear = ref(2025);
const activeFocusId = ref(null);
const activeMonthId = ref(null);
const showDetailModal = ref(false);
const showEditModal = ref(false);
const selectedItem = ref(null);

// Filters
const filters = ref({
    PFO: true,
    DBBesluit: true,
    DBSchrift: true,
    DBInformeel: true,
    ABBesluit: true,
    ABBrief: true,
    Delta: true
});

// Computed: Filter items based on year and active phases
const filteredItems = computed(() => {
    return allItems.value.filter(item => {
        // Check if any schedule date falls in selected year
        const hasYear = Object.values(item.schedule).some(dateStr => {
            const parts = dateStr.split('-');
            return parts.length === 3 && parseInt(parts[2]) === selectedYear.value;
        });
        if (!hasYear) return false;

        // Check if item has any of the active filter phases
        const hasPhase = Object.keys(item.schedule).some(phase => filters.value[phase]);
        return hasPhase;
    });
});

// Helper to generate nav data
const navMonths = computed(() => {
    // Collect all months present in filtered items
    const monthSet = new Set();
    filteredItems.value.forEach(item => {
        Object.values(item.schedule).forEach(dateStr => {
             const parts = dateStr.split('-');
             if (parts.length === 3 && parseInt(parts[2]) === selectedYear.value) {
                 const m = parseInt(parts[1]) - 1; // 0-based
                 monthSet.add(m);
             }
        });
    });
    
    return Array.from(monthSet).sort((a,b) => a - b).map(m => {
        // Calculate traffic color based on density (mock logic)
        const count = filteredItems.value.filter(i => 
            Object.values(i.schedule).some(d => {
                const p = d.split('-');
                return parseInt(p[1])-1 === m && parseInt(p[2]) === selectedYear.value;
            })
        ).length;
        
        let color = 'low';
        if (count > 5) color = 'med';
        if (count > 10) color = 'high';

        const name = getMonthName(new Date(selectedYear.value, m, 1));
        return { id: 'maand-' + name, name: name, trafficColor: color };
    });
});

// Actions
const toggleFilter = (filterKey) => {
    filters.value[filterKey] = !filters.value[filterKey];
};

const setYear = (year) => {
    selectedYear.value = year;
};

const openDetail = (item) => {
    selectedItem.value = item;
    showDetailModal.value = true;
};

const openEdit = () => {
    showDetailModal.value = false;
    showEditModal.value = true;
};

const saveItem = (updatedItem) => {
    const idx = allItems.value.findIndex(i => i.id === updatedItem.id);
    if (idx !== -1) allItems.value[idx] = updatedItem;
    showEditModal.value = false;
};

const toggleFocus = (id) => {
    activeFocusId.value = activeFocusId.value === id ? null : id;
};

const handleScroll = () => {
    // Simple logic to detect active month header
    const headers = document.querySelectorAll('.month-block');
    let currentId = null;
    headers.forEach(h => {
        const rect = h.getBoundingClientRect();
        if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            currentId = h.id;
        }
    });
    if (currentId) activeMonthId.value = currentId;
};

const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="app-container">
    <div class="main-content">
        <div class="top-bar">
            <div class="logo-area">
                <h1>Bestuurlijke Agenda</h1>
                <span class="subtitle">Strategische Planning & Besluitvorming</span>
            </div>
            <div class="view-toggles">
                 <button :class="{ active: activeView === 'agenda' }" @click="activeView = 'agenda'">Agenda</button>
                 <button :class="{ active: activeView === 'report' }" @click="activeView = 'report'">Rapportage</button>
            </div>
        </div>

        <FilterBar 
            :filters="filters" 
            :years="[2024, 2025, 2026]" 
            :selectedYear="selectedYear"
            @toggle-filter="toggleFilter"
            @set-year="setYear"
        />

        <div class="content-area">
            <div v-if="activeView === 'agenda'" class="agenda-wrapper">
                <AgendaView 
                    :events="filteredItems" 
                    :activeFocusId="activeFocusId"
                    @item-click="openDetail"
                    @toggle-focus="toggleFocus"
                />
                
                <svg id="connections-layer">
                     <path class="animated-line" d="M100,0 Q200,100 100,200" stroke="#e0e0e0" fill="none" stroke-width="2" />
                </svg>
            </div>

            <div v-else class="report-wrapper">
                <ReportView :items="filteredItems" />
            </div>
        </div>

        <div class="floating-controls">
             <button class="control-btn reset-btn" @click="activeFocusId = null" v-if="activeFocusId">
                ✕ Reset Focus
             </button>
             <button class="control-btn add-btn">
                + Nieuw Onderwerp
             </button>
        </div>
    </div>

    <SidebarNav :months="navMonths" :activeMonthId="activeMonthId" @scroll-to="scrollTo" />

    <DetailModal 
        v-if="showDetailModal" 
        :item="selectedItem" 
        @close="showDetailModal = false"
        @edit="openEdit"
    />
    
    <EditModal 
        v-if="showEditModal" 
        :item="selectedItem" 
        @close="showEditModal = false"
        @save="saveItem"
    />
  </div>
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
  /* Margin right for sidebar nav space if needed, usually handled by overlay */
  margin-left: 20px; /* Small offset */
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  z-index: 10;
  position: sticky;
  top: 0;
}

.logo-area h1 { margin: 0; font-size: 1.5rem; color: var(--text-main); }
.subtitle { font-size: 0.9rem; color: #888; }

.view-toggles button {
    background: none; border: none; padding: 10px 20px;
    cursor: pointer; font-weight: bold; color: #aaa;
    border-bottom: 3px solid transparent;
}
.view-toggles button.active {
    color: var(--text-main);
    border-color: var(--text-main);
}

.content-area {
    flex: 1;
    position: relative;
}

.agenda-wrapper {
    position: relative;
    padding: 20px;
    flex: 1;
}

#connections-layer {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none;
    z-index: 1;
}

.animated-line {
    stroke-dasharray: 10;
    animation: dash 30s linear infinite;
    opacity: 0.6;
}

@keyframes dash {
  to {
    stroke-dashoffset: -1000;
  }
}

:deep(.month-block) {
    position: relative;
    z-index: 2; /* Boven de lijnen */
}

/* Floating Controls */
.floating-controls {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 15px;
    z-index: 200;
    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.control-btn {
    padding: 12px 24px;
    border-radius: 30px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    transition: transform 0.2s;
}

.control-btn:hover { transform: translateY(-3px); }

.reset-btn { background: #e74c3c; color: white; }
.add-btn { background: #2c3e50; color: white; }

@keyframes popIn {
    from { opacity: 0; transform: translate(-50%, 20px); }
    to { opacity: 1; transform: translate(-50%, 0); }
}

.report-wrapper {
    padding: 20px;
}
</style>