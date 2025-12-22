<script setup>
import { computed } from 'vue';

// We ontvangen nu de gefilterde events (met datums en types) van App.vue
const props = defineProps({
  items: Array
});

// Helper voor maandnamen
const monthNames = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];

// --- 1. STATISTIEKEN BEREKENEN ---
const monthStats = computed(() => {
    const stats = {};
    
    props.items.forEach(ev => {
        // Alleen tellen als er een geldige datum is
        if (!ev.dateObj || ev.dateObj.getFullYear() === 9999) return;
        
        const year = ev.dateObj.getFullYear();
        const monthIndex = ev.dateObj.getMonth();
        // Sorteersleutel jjjj-mm zodat we chronologisch kunnen sorteren
        const key = `${year}-${String(monthIndex+1).padStart(2, '0')}`;
        
        if (!stats[key]) {
            stats[key] = {
                name: `${monthNames[monthIndex]} ${year}`,
                count: 0,
                sortKey: key
            };
        }
        stats[key].count++;
    });

    // Sorteren op datum
    return Object.values(stats).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
});

// --- 2. ANALYSE TEKST (Waarschuwing bij drukte) ---
const busyMonths = computed(() => {
    return monthStats.value
        .filter(m => m.count > 7) // Grenswaarde voor "Druk"
        .map(m => m.name);
});

// --- HELPER FUNCTIES VOOR KLEUREN ---
function getStatusClass(count) {
    if (count > 7) return 'high'; // Rood
    if (count >= 3) return 'med'; // Oranje
    return 'low'; // Groen
}

function getStatusText(count) {
    if (count > 7) return 'Druk';
    if (count >= 3) return 'Normaal';
    return 'Rustig';
}

// Kleurcodes en labels voor de tabel
const typeColors = { 
  'PFO':'var(--c-pfo)', 'DBBesluit':'var(--c-db-besluit)', 
  'DBSchrift':'var(--c-db-schrift)', 'DBInformeel': 'var(--c-db-informeel)',
  'ABBesluit':'var(--c-ab-besluit)', 'ABBrief':'var(--c-ab-brief)', 
  'Delta':'var(--c-delta)' 
};

const typeLabels = { 
  'PFO':'PFO', 'DBBesluit':'DB Besluit', 'DBSchrift':'DB Schrift.', 
  'DBInformeel': 'Informeel DB', 'ABBesluit':'AB Besluit', 
  'ABBrief':'AB Brief', 'Delta':'Delta' 
};
</script>

<template>
  <div class="report-container">
    <div class="report-header">
        <h2>Bestuurlijke Rapportage</h2>
        <p>Gegenereerd op: {{ new Date().toLocaleDateString('nl-NL') }}</p>
    </div>

    <div v-if="busyMonths.length > 0" class="report-summary-text">
        <strong>⚠️ Analyse Bestuurlijke Drukte:</strong> 
        Er zijn piekmomenten (meer dan 7 agendapunten) geconstateerd in: 
        <em>{{ busyMonths.join(', ') }}</em>. 
        Overweeg agendapunten te spreiden naar omliggende maanden.
    </div>

    <div class="report-dashboard">
        <div 
            v-for="stat in monthStats" 
            :key="stat.sortKey" 
            class="dashboard-card"
            :class="'border-' + getStatusClass(stat.count)"
        >
            <h5>{{ stat.name }}</h5>
            <div class="count">{{ stat.count }}</div>
            <div class="status" :class="getStatusClass(stat.count)">
                {{ getStatusText(stat.count) }}
            </div>
        </div>
    </div>

    <h3>Gedetailleerd Overzicht</h3>
    <table class="report-table">
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
            <tr v-for="ev in items" :key="ev.uniqueId">
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
                    <small>PH: {{ ev.ph || '-' }}<br>Dir: {{ ev.dir || '-' }}</small>
                </td>
                <td><small>{{ ev.strategicLabel || '-' }}</small></td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<style scoped>
.report-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.report-header { margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }

/* SUMMARY (Blauwe blok) */
.report-summary-text {
    background: #eaf2f8; padding: 15px; border-left: 5px solid #3498db;
    margin-bottom: 25px; border-radius: 4px; color: #2c3e50;
}

/* DASHBOARD GRID */
.report-dashboard {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px; margin-bottom: 30px;
}
.dashboard-card {
    background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 15px 10px;
    text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); border-top-width: 4px; border-top-style: solid;
}
/* Kleuren randen */
.dashboard-card.border-low { border-top-color: #27ae60; }
.dashboard-card.border-med { border-top-color: #e67e22; }
.dashboard-card.border-high { border-top-color: #c0392b; }

.dashboard-card h5 { margin: 0 0 5px 0; font-size: 0.9rem; color: #666; }
.dashboard-card .count { font-size: 1.8rem; font-weight: bold; color: #2c3e50; margin-bottom: 5px; }
.dashboard-card .status { font-size: 0.7rem; text-transform: uppercase; font-weight: bold; padding: 2px 8px; border-radius: 10px; color: white; display: inline-block;}

/* Kleuren labels */
.status.low { background-color: #27ae60; }
.status.med { background-color: #e67e22; }
.status.high { background-color: #c0392b; }

/* TABLE STYLING */
.report-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
.report-table th, .report-table td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; vertical-align: top; }
.report-table th { background-color: #2c3e50; color: white; position: sticky; top: 0; }
.report-table tr:nth-child(even) { background-color: #f9f9f9; }
.status-dot { height: 10px; width: 10px; border-radius: 50%; display: inline-block; margin-right: 6px; }
.table-note { color: #c0392b; font-style: italic; font-size: 0.75rem; margin-top: 4px; }
</style>