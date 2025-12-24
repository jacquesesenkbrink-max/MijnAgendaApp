<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  items: Array
});

// Event om naar de parent te sturen voor navigatie
const emit = defineEmits(['navigate-to-topic']);

// --- STATE ---
const isCompact = ref(false); // Default op 'Gedetailleerd' zoals gevraagd, maar switchbaar

// --- COMPUTED: STATISTIEKEN ---
const monthNames = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];

const monthStats = computed(() => {
    const stats = {};
    props.items.forEach(ev => {
        if (!ev.dateObj || ev.dateObj.getFullYear() === 9999) return;
        const year = ev.dateObj.getFullYear();
        const monthIndex = ev.dateObj.getMonth();
        const key = `${year}-${String(monthIndex+1).padStart(2, '0')}`;
        
        if (!stats[key]) {
            stats[key] = { name: `${monthNames[monthIndex]} ${year}`, count: 0, sortKey: key };
        }
        stats[key].count++;
    });
    return Object.values(stats).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
});

const busyMonths = computed(() => monthStats.value.filter(m => m.count > 7).map(m => m.name));

// --- COMPUTED: COMPACTE LIJST (UNIEKE ONDERWERPEN) ---
const compactItems = computed(() => {
    // We gebruiken een Map om unieke items op te slaan op basis van ID
    const uniqueMap = new Map();
    
    props.items.forEach(ev => {
        const item = ev.originalItem;
        if (!item || uniqueMap.has(item.id)) return;
        uniqueMap.set(item.id, item);
    });

    // Terug naar array en sorteren (bijv. op titel of PFO datum, hier titel)
    return Array.from(uniqueMap.values()).sort((a, b) => a.title.localeCompare(b.title));
});

// --- HELPERS ---
function getStatusClass(count) {
    if (count > 7) return 'high'; 
    if (count >= 3) return 'med'; 
    return 'low';
}

function getStatusText(count) {
    if (count > 7) return 'Druk';
    if (count >= 3) return 'Normaal';
    return 'Rustig';
}

function handleRowClick(topicId) {
    emit('navigate-to-topic', topicId);
}

// Kleurcodes en labels
const typeColors = { 
  'PFO':'var(--c-pfo)', 
  'DBBesluit':'var(--c-db-besluit)', 
  'DBInformeel': 'var(--c-db-informeel)',
  'ABBesluit':'var(--c-ab-besluit)', 
  'Delta':'var(--c-delta)' 
};

const typeLabels = { 
  'PFO':'PFO', 
  'DBBesluit':'DB Besluit', 
  'DBInformeel': 'Informeel DB', 
  'ABBesluit':'AB Besluit', 
  'Delta':'Delta' 
};
</script>

<template>
  <div class="report-container">
    <div class="report-header">
        <div class="header-title">
            <h2>Bestuurlijke Rapportage</h2>
            <p class="subtitle">Gegenereerd op: {{ new Date().toLocaleDateString('nl-NL') }}</p>
        </div>
        
        <div class="view-switcher">
            <button 
                class="switch-btn" 
                :class="{ active: !isCompact }" 
                @click="isCompact = false"
            >
                📄 Gedetailleerd
            </button>
            <button 
                class="switch-btn" 
                :class="{ active: isCompact }" 
                @click="isCompact = true"
            >
                📑 Compact
            </button>
        </div>
    </div>

    <div v-if="busyMonths.length > 0 && !isCompact" class="report-summary-text">
        <strong>⚠️ Analyse Bestuurlijke Drukte:</strong> 
        Er zijn piekmomenten (meer dan 7 agendapunten) in: <em>{{ busyMonths.join(', ') }}</em>.
    </div>

    <div v-if="!isCompact" class="report-dashboard">
        <div 
            v-for="stat in monthStats" :key="stat.sortKey" 
            class="dashboard-card" :class="'border-' + getStatusClass(stat.count)"
        >
            <h5>{{ stat.name }}</h5>
            <div class="count">{{ stat.count }}</div>
            <div class="status" :class="getStatusClass(stat.count)">{{ getStatusText(stat.count) }}</div>
        </div>
    </div>

    <div class="list-header">
        <h3>{{ isCompact ? 'Compact Overzicht per Onderwerp' : 'Gedetailleerd Tijdlijn Overzicht' }}</h3>
        <p class="hint-text">💡 Klik op een rij om naar het kaartje te springen.</p>
    </div>
    
    <table v-if="!isCompact" class="report-table">
        <thead>
            <tr>
                <th style="width:100px">Datum</th>
                <th style="width:140px">Fase</th>
                <th>Onderwerp</th>
                <th style="width:150px">Rollen</th>
                <th style="width:120px">Label</th>
            </tr>
        </thead>
        <tbody>
            <tr 
                v-for="ev in items" 
                :key="ev.uniqueId" 
                @click="handleRowClick(ev.topicId)"
                class="clickable-row"
            >
                <td>{{ ev.dateDisplay }}</td>
                <td>
                    <span class="status-dot" :style="{ background: typeColors[ev.type] || '#ccc' }"></span>
                    {{ typeLabels[ev.type] || ev.type }}
                </td>
                <td>
                    <strong>{{ ev.title }}</strong>
                    <div v-if="ev.comments" class="table-note">Opmerking: {{ ev.comments }}</div>
                </td>
                <td>
                    <small>PH: {{ ev.ph || '-' }}<br>
                    <span v-if="ev.originalItem.administrativeContact">
                        <strong>🗣️: {{ ev.originalItem.administrativeContact }}</strong><br>
                    </span>
                    Dir: {{ ev.dir || '-' }}</small>
                </td>
                <td><small>{{ ev.strategicLabel || '-' }}</small></td>
            </tr>
        </tbody>
    </table>

    <table v-else class="report-table compact-table">
        <thead>
            <tr>
                <th>Onderwerp</th>
                <th style="width:100px">PH</th>
                <th class="col-date">PFO</th>
                <th class="col-date">Inf. DB</th>
                <th class="col-date">DB Besluit</th>
                <th class="col-date">Delta</th>
                <th class="col-date">AB Besluit</th>
            </tr>
        </thead>
        <tbody>
            <tr 
                v-for="item in compactItems" 
                :key="item.id" 
                @click="handleRowClick(item.id)"
                class="clickable-row"
            >
                <td>
                    <strong>{{ item.title }}</strong>
                    <div v-if="item.comments" class="table-note">{{ item.comments }}</div>
                </td>
                <td>
                    {{ item.ph }}
                    <div v-if="item.administrativeContact" style="font-size: 0.75rem; color: #666;">
                        🗣️ {{ item.administrativeContact }}
                    </div>
                </td>
                
                <td class="center-text">{{ item.schedule?.PFO || '-' }}</td>
                <td class="center-text">{{ item.schedule?.DBInformeel || '-' }}</td>
                <td class="center-text">{{ item.schedule?.DBBesluit || '-' }}</td>
                <td class="center-text">{{ item.schedule?.Delta || '-' }}</td>
                <td class="center-text">{{ item.schedule?.ABBesluit || '-' }}</td>
            </tr>
        </tbody>
    </table>

  </div>
</template>

<style scoped>
.report-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }

/* Header & Toggle */
.report-header { 
    display: flex; justify-content: space-between; align-items: flex-start; 
    margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; flex-wrap: wrap; gap: 15px;
}
.header-title h2 { margin: 0; color: #2c3e50; }
.subtitle { margin: 5px 0 0 0; color: #7f8c8d; font-size: 0.9rem; }

.view-switcher { background: #f0f2f5; padding: 4px; border-radius: 8px; display: flex; gap: 5px; }
.switch-btn { 
    border: none; background: transparent; padding: 6px 15px; border-radius: 6px; 
    cursor: pointer; color: #666; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; 
}
.switch-btn.active { background: white; color: #2c3e50; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

/* SUMMARY (Blauwe blok) */
.report-summary-text {
    background: #eaf2f8; padding: 15px; border-left: 5px solid #3498db;
    margin-bottom: 25px; border-radius: 4px; color: #2c3e50;
}

.list-header { margin-top: 20px; margin-bottom: 10px; }
.hint-text { color: #666; font-style: italic; font-size: 0.9rem; margin-top: 5px; }

/* DASHBOARD GRID */
.report-dashboard {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px; margin-bottom: 30px;
}
.dashboard-card {
    background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 15px 10px;
    text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-top-width: 4px; border-top-style: solid;
}
.dashboard-card.border-low { border-top-color: #27ae60; }
.dashboard-card.border-med { border-top-color: #e67e22; }
.dashboard-card.border-high { border-top-color: #c0392b; }

.dashboard-card h5 { margin: 0 0 5px 0; font-size: 0.9rem; color: #666; }
.dashboard-card .count { font-size: 1.8rem; font-weight: bold; color: #2c3e50; margin-bottom: 5px; }
.dashboard-card .status { font-size: 0.7rem; text-transform: uppercase; font-weight: bold; padding: 2px 8px; border-radius: 10px; color: white; display: inline-block;}

.status.low { background-color: #27ae60; }
.status.med { background-color: #e67e22; }
.status.high { background-color: #c0392b; }

/* TABLE STYLING */
.report-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-top: 10px; }
.report-table th, .report-table td { border: 1px solid #ddd; padding: 10px 10px; text-align: left; vertical-align: top; }
.report-table th { background-color: #2c3e50; color: white; position: sticky; top: 0; font-weight: 600; }
.report-table tr:nth-child(even) { background-color: #f9f9f9; }

.clickable-row { cursor: pointer; transition: background-color 0.15s; }
.clickable-row:hover { background-color: #e3f2fd !important; }

.status-dot { height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-right: 6px; }
.table-note { color: #c0392b; font-style: italic; font-size: 0.75rem; margin-top: 4px; }

/* Compact Table specifics */
.compact-table th.col-date { width: 90px; text-align: center; font-size: 0.8rem; }
.compact-table td.center-text { text-align: center; white-space: nowrap; }
.compact-table th { white-space: nowrap; }
</style>