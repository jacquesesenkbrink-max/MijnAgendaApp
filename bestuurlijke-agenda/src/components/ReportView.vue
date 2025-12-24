<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: Array
});

// We groeperen de 'events' (die nu losse regels zijn) terug naar unieke items.
// Dit voorkomt dubbele regels voor hetzelfde agendapunt.
const uniqueItems = computed(() => {
    const itemMap = new Map();

    props.items.forEach(event => {
        // We gebruiken het topicId om items te groeperen
        const id = event.topicId;
        
        if (!itemMap.has(id)) {
            // Als dit item nog niet bestaat, maken we een basis entry
            itemMap.set(id, {
                id: id,
                title: event.title,
                ph: event.ph,
                dir: event.dir,
                strategicLabel: event.strategicLabel,
                administrativeContact: event.originalItem?.administrativeContact || '',
                // We houden een lijstje bij van de planningen
                schedule: {} 
            });
        }

        // Voeg de datum toe aan de juiste fase in het schedule object
        const entry = itemMap.get(id);
        
        // Sla de datum op onder het type (bijv. 'PFO', 'DBBesluit')
        // We slaan ook het volledige event op als je later tooltips wilt
        entry.schedule[event.type] = {
            dateDisplay: event.dateDisplay,
            dateObj: event.dateObj
        };
    });

    // Converteer de Map terug naar een Array en sorteer eventueel (bijv. op titel)
    return Array.from(itemMap.values()).sort((a, b) => a.title.localeCompare(b.title));
});

// Hulpfunctie om te checken of een datum in het verleden ligt (voor styling)
function isPast(dateObj) {
    if (!dateObj) return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    return dateObj < today;
}

// Print functie
function printReport() {
    window.print();
}
</script>

<template>
  <div class="report-container">
    <div class="report-header no-print">
        <h2>📄 Compact Tabeloverzicht</h2>
        <button @click="printReport" class="print-btn">🖨️ Print Tabel</button>
    </div>

    <div v-if="uniqueItems.length === 0" class="empty-msg">
        Geen items gevonden met de huidige filters.
    </div>

    <table v-else class="report-table">
        <thead>
            <tr>
                <th style="width: 25%">Onderwerp</th>
                <th style="width: 10%">Betrokkenen</th>
                <th style="width: 10%">Label</th>
                
                <th style="width: 15%" class="date-col-header">PFO</th>
                <th style="width: 15%" class="date-col-header">DB</th>
                <th style="width: 15%" class="date-col-header">AB / Delta</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in uniqueItems" :key="item.id">
                <td>
                    <div class="title">{{ item.title }}</div>
                    <div class="sub-text" v-if="item.administrativeContact">
                        🗣️ {{ item.administrativeContact }}
                    </div>
                </td>

                <td>
                    <div class="ph-tag" v-if="item.ph">{{ item.ph }}</div>
                    <div class="dir-text" v-if="item.dir">Dir: {{ item.dir }}</div>
                </td>

                <td>
                    <span v-if="item.strategicLabel" class="label-badge">{{ item.strategicLabel }}</span>
                </td>

                <td class="date-cell">
                    <div v-if="item.schedule.PFO" class="date-badge pfo" :class="{ past: isPast(item.schedule.PFO.dateObj) }">
                        <span class="dot"></span> {{ item.schedule.PFO.dateDisplay }}
                    </div>
                </td>

                <td class="date-cell">
                    <div v-if="item.schedule.DBBesluit" class="date-badge db-besluit" :class="{ past: isPast(item.schedule.DBBesluit.dateObj) }">
                        <span class="dot"></span> {{ item.schedule.DBBesluit.dateDisplay }}
                    </div>
                    <div v-if="item.schedule.DBInformeel" class="date-badge db-informeel" :class="{ past: isPast(item.schedule.DBInformeel.dateObj) }">
                        <span class="dot"></span> Info: {{ item.schedule.DBInformeel.dateDisplay }}
                    </div>
                </td>

                <td class="date-cell">
                    <div v-if="item.schedule.ABBesluit" class="date-badge ab" :class="{ past: isPast(item.schedule.ABBesluit.dateObj) }">
                        <span class="dot"></span> AB: {{ item.schedule.ABBesluit.dateDisplay }}
                    </div>
                    <div v-if="item.schedule.Delta" class="date-badge delta" :class="{ past: isPast(item.schedule.Delta.dateObj) }">
                        <span class="dot"></span> Delta: {{ item.schedule.Delta.dateDisplay }}
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<style scoped>
.report-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    overflow-x: auto;
}

.report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.print-btn {
    background: #2c3e50;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.empty-msg {
    text-align: center;
    color: #777;
    font-style: italic;
    padding: 40px;
}

.report-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
}

.report-table th {
    text-align: left;
    padding: 12px 8px;
    background-color: #f8f9fa;
    border-bottom: 2px solid #ddd;
    color: #555;
    font-weight: bold;
}

.report-table td {
    padding: 10px 8px;
    border-bottom: 1px solid #eee;
    vertical-align: top;
}

.title {
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 4px;
}

.sub-text {
    font-size: 0.8rem;
    color: #888;
}

.ph-tag {
    font-weight: bold;
    font-size: 0.85rem;
    color: #34495e;
}

.dir-text {
    font-size: 0.8rem;
    color: #7f8c8d;
}

.label-badge {
    background: #eef2f5;
    color: #555;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    display: inline-block;
}

/* Datum Badges */
.date-cell {
    white-space: nowrap;
}

.date-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 2px 0;
    margin-bottom: 4px;
    font-size: 0.85rem;
    color: #333;
}

.date-badge.past {
    opacity: 0.5;
    text-decoration: line-through;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
}

/* Kleuren van de bolletjes (overeenkomstig met CSS vars) */
.pfo .dot { background-color: var(--c-pfo); }
.db-besluit .dot { background-color: var(--c-db-besluit); }
.db-informeel .dot { background-color: var(--c-db-informeel); }
.ab .dot { background-color: var(--c-ab-besluit); }
.delta .dot { background-color: var(--c-delta); }

@media print {
    .no-print { display: none; }
    .report-container { box-shadow: none; padding: 0; }
    .report-table { font-size: 0.8rem; }
    /* Zorg dat achtergrondkleuren (bolletjes) geprint worden */
    .dot { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>