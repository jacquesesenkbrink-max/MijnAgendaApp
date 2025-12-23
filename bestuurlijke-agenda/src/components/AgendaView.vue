<script setup>
import { computed } from 'vue';
import TopicCard from './TopicCard.vue';
import SwimlaneHeaders from './SwimlaneHeaders.vue';
import { getMonthName, parseDate } from '../utils/dateHelpers';

const props = defineProps({
  events: Array,
  activeFocusId: [String, Number]
});

const emit = defineEmits(['item-click', 'toggle-focus']);

// Group events by month
const groupedEvents = computed(() => {
  const groups = {};
  
  props.events.forEach(event => {
     // Find the earliest date in the schedule to determine month
     // Or just use the first available date for sorting
     const dates = Object.values(event.schedule).map(d => parseDate(d)).filter(Boolean);
     if (dates.length === 0) return;
     
     // Sort dates to find start
     dates.sort((a,b) => a - b);
     const startDate = dates[0];
     
     const monthKey = `${startDate.getFullYear()}-${startDate.getMonth()}`;
     if (!groups[monthKey]) {
         groups[monthKey] = {
             date: startDate,
             name: getMonthName(startDate),
             items: []
         };
     }
     groups[monthKey].items.push(event);
  });
  
  // Sort months chronologically
  return Object.values(groups).sort((a,b) => a.date - b.date);
});
</script>

<template>
  <div class="agenda-swimlane">
     <SwimlaneHeaders />
     
     <div v-for="month in groupedEvents" :key="month.name" class="month-block" :id="'maand-' + month.name">
        <div class="month-header">{{ month.name }}</div>
        
        <div class="topic-list">
           <TopicCard 
              v-for="event in month.items" 
              :key="event.id"
              :event="event"
              :is-focused="activeFocusId === event.id"
              :is-admin="true" 
              @toggle-focus="$emit('toggle-focus', event.id)"
              @open-details="$emit('item-click', event)"
           />
        </div>
     </div>
     
     <div v-if="groupedEvents.length === 0" class="empty-state">
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
}

.month-header {
    font-size: 1.2rem;
    font-weight: bold;
    color: #888;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
    margin-bottom: 20px;
    margin-left: 20px; /* Align with content */
}

.topic-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.empty-state {
    text-align: center;
    padding: 50px;
    color: #ccc;
    font-style: italic;
}
</style>