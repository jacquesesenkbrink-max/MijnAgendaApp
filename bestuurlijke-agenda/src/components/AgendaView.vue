<script setup>
import { ref, computed } from 'vue'
import TopicCard from './TopicCard.vue'

const props = defineProps({
  items: Array,
  searchQuery: String,
  selectedDomein: String
})

const emit = defineEmits(['edit-item', 'open-detail'])

// DEFINITIE VAN DE LANES (DBSchrift en ABBrief zijn hier verwijderd)
const lanes = [
  { id: 'PFO', title: 'PFO' },
  { id: 'DBBesluit', title: 'DB Besluit' },
  // DBSchrift verwijderd
  { id: 'DBInformeel', title: 'Informeel DB' },
  // ABBrief verwijderd
  { id: 'Delta', title: 'Delta' },
  { id: 'ABBesluit', title: 'AB Besluit' }
]

// Hulpfunctie: haal items op voor een specifieke lane en datum
const getItemsForCell = (laneId, date) => {
  return filteredItems.value.filter(item => {
    // Check of item in deze lane en op deze datum staat
    const scheduledDate = item.schedule?.[laneId]
    return scheduledDate === date
  })
}

// Filter logica
const filteredItems = computed(() => {
  let result = props.items

  if (props.selectedDomein) {
    result = result.filter(i => i.domein === props.selectedDomein)
  }

  if (props.searchQuery) {
    const q = props.searchQuery.toLowerCase()
    result = result.filter(i => 
      i.title.toLowerCase().includes(q) ||
      (i.toelichting && i.toelichting.toLowerCase().includes(q))
    )
  }

  return result
})

// Unieke datums verzamelen (over alle resterende lanes heen) om de rijen te bepalen
const uniqueDates = computed(() => {
  const dates = new Set()
  filteredItems.value.forEach(item => {
    if (item.schedule) {
      Object.values(item.schedule).forEach(date => {
        if (date) dates.add(date)
      })
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
              :key="item.id"
              :item="item"
              @click="$emit('open-detail', item)"
              @edit="$emit('edit-item', item)"
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
  /* We hebben nu 5 kolommen in plaats van 7 */
  grid-template-columns: repeat(5, 1fr); 
  /* FOUTIEVE REGEL VERWIJDERD: divide-x... */
}

.lane-cell {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  /* CORRECTIE: We zetten de border hier */
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