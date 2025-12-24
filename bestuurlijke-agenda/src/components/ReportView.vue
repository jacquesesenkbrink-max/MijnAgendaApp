<script setup>
import { computed } from 'vue';

// We ontvangen de gefilterde items. 
// Let op: dit zijn "events", dus we moeten ze terugbrengen naar unieke onderwerpen (topics).
const props = defineProps({
  items: Array
});

// Helper voor kleuren bolletjes
const typeColors = { 
  'PFO': 'var(--c-pfo)', 
  'DBBesluit': 'var(--c-db-besluit)', 
  'DBInformeel': 'var(--c-db-informeel)',
  'ABBesluit': 'var(--c-ab-besluit)', 
  'Delta': 'var(--c-delta)' 
};

// --- 1. TRANSFORMATIE: VAN EVENTS NAAR UNIEKE TOPICS ---
const uniqueTopics = computed(() => {
    const topicMap = new Map();

    props.items.forEach(ev => {
        // We gebruiken het ID van het originele item om te groeperen
        if (!topicMap.has(ev.topicId)) {
            topicMap.set(ev.topicId, {
                id: ev.topicId,
                title: ev.title,
                ph: ev.ph,
                dir: ev.dir,
                contact: ev.originalItem.administrativeContact,
                label: ev.strategicLabel,
                // We pakken de VOLLEDIGE planning van het originele item
                schedule: ev.originalItem.schedule || {}
            });
        }
    });

    // Omzetten naar array en sorteren (bijv. op datum van PFO, of als die leeg is, op titel)
    return Array.from(topicMap.values()).sort((a, b) => {
        const dateA = a.schedule.PFO ? new Date(a.schedule.PFO.split('-').reverse().join('-')) : new Date(9999, 11, 31);
        const dateB = b.schedule.PFO ? new Date(b.schedule.PFO.split('-').reverse().join('-')) : new Date(9999, 11, 31);
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
            <small>Totaal: {{ uniqueTopics.length }} onderwerpen in huidige selectie</small>
        </div>
        <button class="print-btn no-print" @click="printReport">🖨️ Print Tabel</button>
    </div>

    <div class="table-responsive">
        <table class="matrix-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Onderwerp</th>
                    <th style="width: 15%;">Betrokkenen</th>
                    <th style="width: 10%;">Label</th>
                    
                    <th class="col-date">PFO</th>
                    <th class="col-date">Informeel DB</th> <th class="col-date">DB Besluit</th>
                    <th class="col-date">Delta</th>        <th class="col-date">AB Besluit</th>
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
                        <div v-if="topic.schedule.PFO" class="date-pill" style="border-left-color: var(--c-pfo)">
                            <span class="dot" style="background: var(--c-pfo)"></span>
                            {{ topic.schedule.PFO }}
                        </div>
                    </td>

                    <td class="cell-date">
                        <div v-if="topic.schedule.DBInformeel" class="date-pill" style="border-left-color: var(--c-db-informeel)">
                            <span class="dot" style="background: var(--c-db-informeel)"></span>
                            {{ topic.schedule.DBInformeel }}
                        </div>
                    </td>

                    <td class="cell-date">
                        <div v-if="topic.schedule.DBBesluit" class="date-pill" style="border-left-color: var(--c-db-besluit)">
                            <span class="dot" style="background: var(--c-db-besluit)"></span>
                            {{ topic.schedule.DBBesluit }}
                        </div>
                    </td>

                    <td class="cell-date">
                        <div v-if="topic.schedule.Delta" class="date-pill" style="border-left-color: var(--c-delta)">
                            <span class="dot" style="background: var(--c-delta)"></span>
                            {{ topic.schedule.Delta }}
                        </div>
                    </td>

                    <td class="cell-date">
                        <div v-if="topic.schedule.ABBesluit" class="date-pill" style="border-left-color: var(--c-ab-besluit)">
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
.col-date { width: 110px; }
.date-pill {
    display: flex; align-items: center; gap: 6px;
    font-family: monospace; font-size: 0.85rem; color: #333;
    background: #fff; 
    /* Subtiel randje links voor kleurherkenning */
    border-left: 3px solid #ccc; 
    padding-left: 8px;
}

.dot {
    width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
}

.empty-msg { text-align: center; padding: 40px; color: #999; font-style: italic; }

@media print {
    .no-print { display: none; }
    .report-container { box-shadow: none; padding: 0; }
    .matrix-table th { background: #eee !important; color: #000; }
}
</style>