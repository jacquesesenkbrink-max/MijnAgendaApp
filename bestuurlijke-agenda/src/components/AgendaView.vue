<script setup>
import { computed } from 'vue';
import TopicCard from './TopicCard.vue';
import { parseDate, getMonthName } from '../utils/dateHelpers';

const props = defineProps({
  events: Array,         // De "Topics" die vanuit App.vue komen
  activeFocusId: [String, Number]
});

const emit = defineEmits(['item-click', 'toggle-focus']);

// --- 1. TRANSFORMATIE: Van Topics naar losse Kaartjes ---
// App.vue geeft 'topics' (met een schedule object), maar wij moeten
// voor elke datum in dat schedule een apart kaartje maken.
const allCards = computed(() => {
  const cards = [];
  if (!props.events) return cards;

  props.events.forEach(topic => {
     if (!topic.schedule) return;
     
     // Loop door elke fase in het schedule (bijv. PFO: '25-11-2025')
     Object.entries(topic.schedule).forEach(([phase, dateStr]) => {
        const d = parseDate(dateStr);
        // Filter ongeldige data (of placeholders ver in toekomst)
        if (!d || d.getFullYear() === 9999) return; 

        cards.push({
            uniqueId: `${topic.id}_${phase}`, // Unieke key voor Vue
            topicId: topic.id,                // Om te weten bij welk onderwerp het hoort
            originalItem: topic,              // Referentie naar het originele object (voor details)
            title: topic.title,
            type: phase,                      // 'PFO', 'DBBesluit', etc. (bepaalt de kolom)
            dateObj: d,
            dateDisplay: dateStr,
            ph: topic.ph,
            dir: topic.dir,
            strategicLabel: topic.strategicLabel,
            comments: topic.comments
        });
     });
  });
  
  // Sorteer alle kaartjes chronologisch
  return cards.sort((a, b) => a.dateObj - b.dateObj);
});

// --- 2. GROEPEREN: Per Maand ---
const months = computed(() => {
    const groups = {};
    allCards.value.forEach(card => {
        // Groep sleutel jjjj-mm
        const k = `${card.dateObj.getFullYear()}-${card.dateObj.getMonth()}`;
        if (!groups[k]) {
            groups[k] = {
                dateObj: card.dateObj,
                name: getMonthName(card.dateObj),
                items: []
            };
        }
        groups[k].items.push(card);
    });
    // Sorteer de maanden
    return Object.values(groups).sort((a, b) => a.dateObj - b.dateObj);
});
</script>

<template>
  <div class="agenda-swimlane">
     
     <div v-for="month in months" :key="month.name" class="month-block" :id="'maand-' + month.name">
        <div class="month-header">{{ month.name }}</div>
        
        <div class="month-grid">
           <TopicCard 
              v-for="card in month.items" 
              :key="card.uniqueId"
              :event="card"
              :is-focused="activeFocusId === card.topicId"
              :is-admin="true" 
              @toggle-focus="$emit('toggle-focus', card.topicId)"
              @open-details="$emit('item-click', card.originalItem)"
           />
        </div>
     </div>
     
     <div v-if="months.length === 0" class="empty-state">
        <p>Geen agendapunten gevonden met de huidige filters.</p>
     </div>
  </div>
</template>

<style scoped>
.agenda-swimlane {
    padding-bottom: 60px;
}

.month-block {
    margin-bottom: 40px;
    position: relative; /* Belangrijk voor z-index van lijnen */
}

/* Maand Titel */
.month-header {
    max-width: 1400px; 
    margin: 0 auto 15px auto; 
    padding: 0 20px;
    font-size: 1.2rem; 
    font-weight: bold; 
    color: var(--wdod-blue); /* Gebruikt de nieuwe huisstijl kleur */
    border-bottom: 2px solid #e0e0e0;
}

/* --- GRID LAYOUT (Dit lost het probleem op) --- */
.month-grid {
    display: grid;
    /* 7 Gelijke kolommen, matcht met SwimlaneHeaders.vue */
    grid-template-columns: repeat(7, 1fr); 
    gap: 15px; /* Ruimte tussen kaartjes */
    
    /* Zelfde breedte als headers */
    max-width: 1400px; 
    margin: 0 auto; 
    padding: 0 20px;
}

.empty-state {
    text-align: center;
    padding: 50px;
    color: #999;
    font-style: italic;
}

/* Mobiele weergave: stapelen */
@media (max-width: 1100px) {
    .month-grid {
        display: flex;
        flex-direction: column;
    }
}
</style>