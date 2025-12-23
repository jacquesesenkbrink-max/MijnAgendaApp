<script setup>
import { ref, computed } from 'vue'
import TopicCard from './TopicCard.vue'

const props = defineProps({
  items: Array,         // Dit ontvangt nu de 'gefilterdeEvents' (platte events) uit App.vue
  searchQuery: String,
  selectedDomein: String
})

const emit = defineEmits(['edit-item', 'open-detail'])

// 1. DEFINITIE VAN DE LANES (De 5 overgebleven stuks)
const lanes = [
  { id: 'PFO', title: 'PFO' },
  { id: 'DBBesluit', title: 'DB Besluit' },
  // DBSchrift verwijderd
  { id: 'DBInformeel', title: 'Informeel DB' },
  // ABBrief verwijderd
  { id: 'Delta', title: 'Delta' },
  { id: 'ABBesluit', title: 'AB Besluit' }
]

// 2. Filter logica (indien nodig, App.vue doet het zware werk al)
const filteredItems = computed(() => {
  let result = props.items || [] 

  if (props.searchQuery) {
    const q = props.searchQuery.toLowerCase()
    result = result.filter(ev => 
      (ev.title && ev.title.toLowerCase().includes(q)) ||
      (ev.comments && ev.comments.toLowerCase().includes(q))
    )
  }
  return result
})

// 3. Items ophalen voor een specifieke cel
// AANGEPAST: We checken nu op 'type' en 'dateDisplay' van het event object
const getItemsForCell = (laneId, date) => {
  return filteredItems.value.filter(ev => {
    return ev.type === laneId && ev.dateDisplay === date
  })
}

// 4. Unieke datums verzamelen
// AANGEPAST: We kijken alleen naar datums van events die in de ACTIEVE lanes vallen
const uniqueDates = computed(() => {
  const dates = new Set()
  // Maak een set van de ID's die we tonen (PFO, Delta, etc.)
  const activeLaneIds = new Set(lanes.map(l => l.id))

  filteredItems.value.forEach(ev => {
    // Check of dit event überhaupt in een kolom getoond wordt die we nog hebben
    if (activeLaneIds.has(ev.type) && ev.dateDisplay) {
        dates.add(ev.dateDisplay)
    }
  })
  
  // Sorteer datums (DD-MM-YYYY)
  return Array.from(dates).sort((a, b) => {
    const [d1, m1, y1] = a.split('-')
    const [d2, m2, y2] = b.split('-')
    return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`)
  })
})
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
              v-for="item in getItemsForCell(lane.id, date)"
              :key="item.uniqueId"
              :event="item"
              @open-details="$emit('open-detail', item.originalItem)"
              @edit="$emit('edit-item', item.originalItem)"
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
  overflow-y: auto;
  padding: 20px;
  background-color: #f3f4f6;
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
  width: 100px;
  background: #eef2ff; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #4f46e5;
  border-right: 1px solid #e5e7eb;
  padding: 10px;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.lanes-container {
  flex: 1;
  display: grid;
  /* 5 kolommen voor de resterende lanes */
  grid-template-columns: repeat(5, 1fr); 
}

.lane-cell {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-right: 1px solid #f0f0f0;
}

/* Zorg dat de laatste kolom geen lijn rechts heeft */
.lane-cell:last-child {
  border-right: none;
}

.no-items {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-style: italic;
}
</style>