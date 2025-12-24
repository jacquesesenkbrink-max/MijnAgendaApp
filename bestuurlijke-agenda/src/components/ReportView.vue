<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: Array
});

// Kleurenconfiguratie voor de bolletjes
const typeColors = { 
  'PFO': 'var(--c-pfo)', 
  'DBBesluit': 'var(--c-db-besluit)', 
  'DBInformeel': 'var(--c-db-informeel)',
  'ABBesluit': 'var(--c-ab-besluit)', 
  'Delta': 'var(--c-delta)' 
};

// Helper: converteer DD-MM-YYYY string naar Date object
const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('-');
    return new Date(year, month - 1, day);
};

// Helper: Vind de eerstvolgende datum in een schedule voor sortering
const getEarliestDate = (schedule) => {
    // We checken de datums in logische volgorde
    const dates = [
        schedule.PFO, 
        schedule.DBInformeel, 
        schedule.DBBesluit, 
        schedule.Delta, 
        schedule.ABBesluit
    ].map(parseDate).filter(d => d !== null);

    // Return de vroegste datum, of een datum ver in de toekomst als er geen is
    if (dates.length === 0) return new Date(9999, 11, 31);
    return new Date(Math.min(...dates));
};

// --- TRANSFORMATIE & SORTERING ---
const uniqueTopics = computed(() => {
    const topicMap = new Map();

    // 1. Groeperen op Topic ID
    props.items.forEach(ev => {
        if (!topicMap.has(ev.topicId)) {
            topicMap.set(ev.topicId, {
                id: ev.topicId,
                title: ev.title,
                ph: ev.ph,
                dir: ev.dir,
                contact: ev.originalItem.administrativeContact,
                label: ev.strategicLabel,
                schedule: ev.originalItem.schedule || {}
            });
        }
    });

    // 2. Sorteren op de eerst beschikbare datum in de keten
    return Array.from(topicMap.values()).sort((a, b) => {
        const dateA = getEarliestDate(a.schedule);
        const dateB = getEarliestDate(b.schedule);
        return dateA - dateB;
    });
});

function printReport() {
    window.print();
}
</script>

<template>
  <div class="report-container">
    <div class="report-header">
        <div class="header-title">
            <h2>📄 Compact Tabeloverzicht</h2>
            <small>Totaal: {{ uniqueTopics.length }} onderwerpen</small>
        </div>
        <button class="print-btn no-print" @click="printReport">🖨️ Print</button>
    </div>

    <div class="table-responsive">
        <table class="matrix-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Onderwerp</th>
                    <th style="width: 15%;">Betrokkenen</th>
                    <th style="width: 10%;">Label</th>
                    
                    <th class="col-date">PFO</th>
                    <th class="col-date">Inf. DB</th>
                    <th class="col-date">DB</th>
                    <th class="col-date">Delta</th>
                    <th class="col-date">AB</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="topic in uniqueTopics" :key="topic.id">
                    <td>
                        <div class="topic-title">{{ topic.title }}</div>
                    </td>

                    <td>
                        <div class="meta-text"><strong>PH:</strong> {{ topic.ph }}</div>
                        <div v-if="topic.contact" class="meta-text">🗣️ {{ topic.contact }}</div>
                        <div class="meta-text" style="color:#999">Dir: {{ topic.dir }}</div>
                    </td>

                    <td>
                        <span v-if="topic.label" class="label-badge">{{ topic.label }}</span>
                    </td>

                    <td class="cell-date">
                        <div v-if="topic.schedule.PFO" class="date-pill">
                            <span class="dot" style="background: var(--c-pfo)"></span>
                            {{ topic.schedule.PFO }}
                        </div>
                    </td>

                    <td class="cell-date">
                        <div v-if="topic.schedule.DBInformeel" class="date-pill">
                            <span class="dot" style="background: var(--c-db-informeel)"></span>
                            {{ topic.schedule.DBInformeel }}
                        </div>
                    </td>

                    <td class="cell-date">
                        <div v-if="topic.schedule.DBBesluit" class="date-pill">
                            <span class="dot" style="background: var(--c-db-besluit)"></span>
                            {{ topic.schedule.DBBesluit }}
                        </div>
                    </td>

                    <td class="cell-date">
                        <div v-if="topic.schedule.Delta" class="date-pill">
                            <span class="dot" style="background: var(--c-delta)"></span>
                            {{ topic.schedule.Delta }}
                        </div>
                    </td>

                    <td class="cell-date">
                        <div v-if="topic.schedule.ABBesluit" class="date-pill">
                            <span class="dot" style="background: var(--c-ab-besluit)"></span>
                            {{ topic.schedule.ABBesluit }}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="uniqueTopics.length === 0" class="empty-msg">
            Geen onderwerpen gevonden met de huidige filters.
        </div>
    </div>
  </div>
</template>

<style scoped>
.report-container { 
    background: white; 
    padding: 25px; 
    border-radius: 8px; 
    box-shadow: 0 4px 15px rgba(0,0,0,0.05); 
}

.report-header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    margin-bottom: 20px; 
    border-bottom: 2px solid #f0f0f0; 
    padding-bottom: 15px;
}

.header-title h2 { margin: 0; color: #2c3e50; }
.header-title small { color: #7f8c8d; }

.print-btn { 
    background: #2c3e50; color: white; border: none; 
    padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; 
}
.print-btn:hover { background: #34495e; }

.table-responsive { overflow-x: auto; }

.matrix-table { 
    width: 100%; 
    border-collapse: separate; 
    border-spacing: 0; 
    font-size: 0.9rem; 
}

.matrix-table th { 
    background: #f8fafc; 
    color: #64748b; 
    font-weight: 700; 
    text-transform: uppercase; 
    font-size: 0.75rem; 
    padding: 12px 15px; 
    border-bottom: 2px solid #e2e8f0; 
    text-align: left;
}

.matrix-table td { 
    padding: 12px 15px; 
    border-bottom: 1px solid #f1f5f9; 
    vertical-align: top; 
}

.matrix-table tr:last-child td { border-bottom: none; }
.matrix-table tr:hover td { background-color: #fcfcfc; }

/* Inhoud Styling */
.topic-title { font-weight: 600; color: #2c3e50; line-height: 1.4; }
.meta-text { font-size: 0.8rem; color: #555; margin-bottom: 2px; }

.label-badge { 
    background: #eef2f6; color: #475569; 
    padding: 4px 8px; border-radius: 12px; 
    font-size: 0.75rem; font-weight: 600; white-space: nowrap;
}

/* Datum Styling */
.col-date { width: 105px; } /* Iets smaller gemaakt voor strakke look */

.date-pill {
    display: flex; 
    align-items: center; 
    gap: 8px;
    font-size: 0.85rem; 
    color: #333;
    /* Geen border-left meer, geen monospace meer */
}

.dot {
    width: 10px; 
    height: 10px; 
    border-radius: 50%; 
    flex-shrink: 0;
}

.empty-msg { text-align: center; padding: 40px; color: #999; font-style: italic; }

@media print {
    .no-print { display: none; }
    .report-container { box-shadow: none; padding: 0; }
    .matrix-table th { background: #eee !important; color: #000; }
}
</style>