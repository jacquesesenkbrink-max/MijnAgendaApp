<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { parseDate, getMonthName } from '../utils/dateHelpers.js';

const props = defineProps({
  items: Array // De ruwe lijst met agendapunten
});

// Opslag voor vergaderdetails (tijd/locatie)
// Key format: "DD-MM-YYYY_TYPE_PH(opt)"
const meetingMeta = ref({});

// Laad opgeslagen tijden/locaties bij start
onMounted(() => {
  const saved = localStorage.getItem('meeting-meta-data');
  if (saved) meetingMeta.value = JSON.parse(saved);
});

// Sla wijzigingen direct op
watch(meetingMeta, (newVal) => {
  localStorage.setItem('meeting-meta-data', JSON.stringify(newVal));
}, { deep: true });

// --- 1. DATA TRANSFORMATIE ---
const agendaMeetings = computed(() => {
    const meetingsMap = {};

    props.items.forEach(item => {
        if (!item.schedule) return;

        Object.keys(item.schedule).forEach(type => {
            const dateStr = item.schedule[type];
            if (!dateStr || dateStr.toLowerCase().includes('q')) return; // Alleen echte datums

            // Bepaal de unieke sleutel voor de vergadering
            // PFO's worden gesplitst per PH, DB/AB zijn generiek op datum
            let meetingKey = '';
            let meetingTitle = '';
            let groupPh = '';

            if (type === 'PFO') {
                // PFO is uniek per datum ÉN per PH
                // Gebruik item.ph (of de eerste naam als er meerdere zijn)
                groupPh = item.ph ? item.ph.split('/')[0].trim() : 'Onbekend';
                meetingKey = `${dateStr}_${type}_${groupPh}`;
                meetingTitle = `PFO ${groupPh}`;
            } else {
                // DB en AB zijn uniek per datum en type
                meetingKey = `${dateStr}_${type}`;
                meetingTitle = mapTypeToTitle(type);
            }

            // Maak vergadering aan als die nog niet bestaat
            if (!meetingsMap[meetingKey]) {
                meetingsMap[meetingKey] = {
                    key: meetingKey,
                    dateDisplay: dateStr,
                    dateObj: parseDate(dateStr),
                    title: meetingTitle,
                    type: type,
                    ph: groupPh,
                    items: []
                };
            }

            // Voeg item toe aan deze vergadering
            meetingsMap[meetingKey].items.push(item);
        });
    });

    // Zet om naar array en sorteer op datum
    return Object.values(meetingsMap).sort((a, b) => a.dateObj - b.dateObj);
});

// Helpers
function mapTypeToTitle(type) {
    const labels = { 
        'DBBesluit': 'DB Besluitvormend', 'DBSchrift': 'DB Schriftelijk', 
        'DBInformeel': 'DB Informeel', 'ABBesluit': 'AB Vergadering', 
        'ABBrief': 'Verzendlijst AB Brieven', 'Delta': 'Deltabijeenkomst'
    };
    return labels[type] || type;
}

function getDayName(dateObj) {
    return dateObj.toLocaleDateString('nl-NL', { weekday: 'long' });
}

// Kleuren voor de header balkjes
const typeColors = { 
  'PFO':'var(--c-pfo)', 'DBBesluit':'var(--c-db-besluit)', 
  'DBSchrift':'var(--c-db-schrift)', 'DBInformeel': 'var(--c-db-informeel)',
  'ABBesluit':'var(--c-ab-besluit)', 'ABBrief':'var(--c-ab-brief)', 
  'Delta':'var(--c-delta)' 
};

// Print functie (simpel)
function printAgenda() {
    window.print();
}
</script>

<template>
  <div class="agenda-view-container">
    <div class="no-print header-controls">
        <h2>🗓️ Agenda Samenstelling</h2>
        <p>Beheer hieronder de tijden en locaties per vergadering. PFO's zijn gesplitst per bestuurder.</p>
        <button @click="printAgenda" class="print-btn">🖨️ Print Lijsten</button>
    </div>

    <div v-if="agendaMeetings.length === 0" class="empty-state">
        Geen ingeplande vergaderingen gevonden.
    </div>

    <div class="timeline-stream">
        <div v-for="meeting in agendaMeetings" :key="meeting.key" class="meeting-card">
            
            <div class="meeting-header" :style="{ borderLeftColor: typeColors[meeting.type] || '#ccc' }">
                <div class="meeting-date">
                    <span class="day">{{ getDayName(meeting.dateObj) }}</span>
                    <span class="date">{{ meeting.dateDisplay }}</span>
                </div>
                <div class="meeting-title">
                    <h3>{{ meeting.title }}</h3>
                    <span class="item-count">{{ meeting.items.length }} agendapunten</span>
                </div>
            </div>

            <div class="meeting-meta no-print">
                <div class="input-group">
                    <label>🕐 Tijdstip:</label>
                    <input 
                        v-model="meetingMeta[meeting.key + '_time']" 
                        placeholder="bijv. 09:00 - 10:30" 
                    />
                </div>
                <div class="input-group">
                    <label>📍 Bespreekruimte:</label>
                    <input 
                        v-model="meetingMeta[meeting.key + '_room']" 
                        placeholder="bijv. Kamer 3.02" 
                    />
                </div>
            </div>

            <div class="print-only meta-display" v-if="meetingMeta[meeting.key + '_time'] || meetingMeta[meeting.key + '_room']">
                <span v-if="meetingMeta[meeting.key + '_time']"><strong>Tijd:</strong> {{ meetingMeta[meeting.key + '_time'] }}</span>
                <span v-if="meetingMeta[meeting.key + '_room']" style="margin-left: 15px;"><strong>Locatie:</strong> {{ meetingMeta[meeting.key + '_room'] }}</span>
            </div>

            <table class="agenda-table">
                <thead>
                    <tr>
                        <th style="width: 30px">#</th>
                        <th>Onderwerp</th>
                        <th style="width: 150px">Betrokkenen</th>
                        <th style="width: 100px">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in meeting.items" :key="item.id">
                        <td class="index-col">{{ index + 1 }}.</td>
                        <td>
                            <div class="topic-title">{{ item.title }}</div>
                            <div v-if="item.comments" class="topic-comment">Opmerking: {{ item.comments }}</div>
                        </td>
                        <td>
                            <div class="role-text" v-if="meeting.type !== 'PFO'">PH: {{ item.ph }}</div>
                            <div class="role-text">Dir: {{ item.dir }}</div>
                            <div class="role-text" v-if="item.administrativeContact">🗣️: {{ item.administrativeContact }}</div>
                        </td>
                        <td>
                            <span class="badge">{{ item.strategicLabel || 'Geen label' }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>
    </div>
  </div>
</template>

<style scoped>
.agenda-view-container { max-width: 1000px; margin: 0 auto; padding-bottom: 50px; }
.header-controls { margin-bottom: 30px; text-align: center; }
.print-btn { background: #2c3e50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 1rem; }
.print-btn:hover { background: #34495e; }

/* MEETING CARD */
.meeting-card { 
    background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); 
    margin-bottom: 30px; overflow: hidden; page-break-inside: avoid;
    border: 1px solid #eee;
}

.meeting-header {
    display: flex; align-items: center; padding: 15px 20px;
    background: #f8f9fa; border-bottom: 1px solid #eee;
    border-left: 6px solid #ccc; /* Kleur wordt dynamisch overschreven */
}

.meeting-date { 
    display: flex; flex-direction: column; align-items: center; 
    margin-right: 20px; min-width: 80px; padding-right: 20px; border-right: 1px solid #ddd; 
}
.meeting-date .day { font-size: 0.8rem; text-transform: uppercase; color: #666; }
.meeting-date .date { font-size: 1.2rem; font-weight: bold; color: #2c3e50; }

.meeting-title h3 { margin: 0; font-size: 1.3rem; color: #2c3e50; }
.item-count { font-size: 0.85rem; color: #7f8c8d; }

/* META INPUTS */
.meeting-meta { 
    display: flex; gap: 20px; padding: 15px 20px; background: #fffbe6; border-bottom: 1px solid #eee; 
}
.input-group { display: flex; align-items: center; gap: 10px; flex: 1; }
.input-group label { font-weight: bold; font-size: 0.9rem; color: #555; }
.input-group input { 
    flex: 1; padding: 6px; border: 1px solid #ccc; border-radius: 4px; 
}

.meta-display { padding: 10px 20px; background: #f4f7f6; border-bottom: 1px solid #eee; font-size: 0.9rem; }

/* TABLE */
.agenda-table { width: 100%; border-collapse: collapse; }
.agenda-table th { text-align: left; padding: 10px 15px; background: #fff; border-bottom: 2px solid #eee; font-size: 0.8rem; text-transform: uppercase; color: #999; }
.agenda-table td { padding: 12px 15px; border-bottom: 1px solid #f0f0f0; vertical-align: top; font-size: 0.95rem; }
.agenda-table tr:last-child td { border-bottom: none; }

.index-col { color: #999; font-weight: bold; }
.topic-title { font-weight: 600; color: #2c3e50; margin-bottom: 4px; }
.topic-comment { font-size: 0.8rem; color: #c0392b; font-style: italic; }
.role-text { font-size: 0.8rem; color: #666; margin-bottom: 2px; }
.badge { background: #eee; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; color: #555; }

/* PRINT STYLES */
@media print {
    .no-print { display: none !important; }
    .print-only { display: block !important; }
    .meeting-card { box-shadow: none; border: 1px solid #000; break-inside: avoid; }
    .meeting-header { background: #eee !important; -webkit-print-color-adjust: exact; }
    body { background: white; }
    .agenda-view-container { width: 100%; max-width: none; }
}
</style>