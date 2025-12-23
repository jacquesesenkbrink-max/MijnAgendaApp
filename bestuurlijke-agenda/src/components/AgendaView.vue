<script setup>
import { computed } from 'vue'
import TopicCard from './TopicCard.vue'

const props = defineProps({
  items: Array,        // Dit zijn de 'flattened' events uit App.vue
  activeFilter: String,
  activeFocusId: Number
})

const emit = defineEmits(['item-click', 'toggle-focus'])

// De 5 kolommen (moeten matchen met de rest van de app)
const lanes = [
  { id: 'PFO', title: 'PFO' },
  { id: 'DBBesluit', title: 'DB Besluit' },
  { id: 'DBInformeel', title: 'Informeel DB' },
  { id: 'Delta', title: 'Delta' },
  { id: 'ABBesluit', title: 'AB Besluit' }
]

// 1. Unieke datums verzamelen uit de losse events
const uniqueDates = computed(() => {
  const dates = new Set()
  
  // We loopen door de events die App.vue ons geeft
  if (props.items) {
      props.items.forEach(event => {
        if (event.dateDisplay) {
            dates.add(event.dateDisplay)
        }
      })
  }
  
  // Sorteer datums (DD-MM-YYYY)
  return Array.from(dates).sort((a, b) => {
    // Q-notatie (bijv Q1 2026) achteraan zetten of simpel sorteren
    if(a.startsWith('Q') || b.startsWith('Q')) return a.localeCompare(b);
    
    const [d1, m1, y1] = a.split('-')
    const [d2, m2, y2] = b.split('-')
    return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`)
  })
})

// 2. Helper: Haal events op die precies in deze cel (datum + kolom) horen
const getEventsForCell = (laneId, date) => {
  if (!props.items) return []
  return props.items.filter(event => {
    return event.type === laneId && event.dateDisplay === date
  })
}
</script>

<template>
  <div class="agenda-container">
    <div class="agenda-grid">
      
      <div 
        v-for="date in uniqueDates" 
        :key="date" 
        class="agenda-row"
      >
        <div class="date-label">
          {{ date }}
        </div>

        <div class="lanes-container">
          <div 
            v-for="lane in lanes" 
            :key="lane.id" 
            class="lane-cell"
          >
            <TopicCard 
              v-for="event in getEventsForCell(lane.id, date)"
              :key="event.uniqueId"
              :event="event"
              :isFocused="activeFocusId === event.topicId"
              @open-details="$emit('item-click', event.originalItem)"
              @toggle-focus="$emit('toggle-focus', event.topicId)"
            />
          </div>
        </div>
      </div>
      
      <div v-if="uniqueDates.length === 0" class="no-items">
        Geen agendapunten gevonden voor de huidige selectie.
      </div>
    </div>
  </div>
</template>

<style scoped>
.agenda-container {
  flex: 1;
  /* Zorgt dat de scrollbar alleen op dit deel komt als het te lang is */
  overflow-y: auto; 
  padding: 20px;
  background-color: #f3f4f6;
  border-radius: 8px;
}

.agenda-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.agenda-row {
  display: flex;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden; 
  min-height: 100px;
}

.date-label {
  width: 120px;
  background: #eef2ff; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #4f46e5;
  border-right: 1px solid #e5e7eb;
  padding: 10px;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.lanes-container {
  flex: 1;
  display: grid;
  /* 5 kolommen verdeling */
  grid-template-columns: repeat(5, 1fr); 
}

.lane-cell {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-right: 1px solid #f0f0f0;
}

.lane-cell:last-child {
  border-right: none;
}

.no-items {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-style: italic;
  font-size: 1.1rem;
}
</style>