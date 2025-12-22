<script setup>
import { computed } from 'vue';
import { getSortDate } from '../utils/dateHelpers.js';

const props = defineProps({
  items: Array // De platte lijst met items
});

// We sorteren de lijst op datum voor de tabel
const gesorteerdeItems = computed(() => {
  // We maken een kopie [...] om de originele lijst niet te verpesten
  return [...props.items].sort((a, b) => {
    return getSortDate(a) - getSortDate(b);
  });
});

// Helper voor de kleuren bolletjes
const kleuren = { 
  'PFO':'var(--c-pfo)', 'DBBesluit':'var(--c-db-besluit)', 
  'DBSchrift':'var(--c-db-schrift)', 'DBInformeel': 'var(--c-db-informeel)',
  'ABBesluit':'var(--c-ab-besluit)', 'ABBrief':'var(--c-ab-brief)', 
  'Delta':'var(--c-delta)' 
};

// Helper om de eerstvolgende datum te tonen
function getDisplayDate(item) {
  if (!item.schedule) return '-';
  // We pakken de datum van de eerste fase die we vinden
  const dates = Object.values(item.schedule);
  return dates.length > 0 ? dates[0] : '-';
}

function getFirstPhase(item) {
    if (!item.schedule) return '';
    const keys = Object.keys(item.schedule);
    return keys.length > 0 ? keys[0] : '';
}
</script>

<template>
  <div class="report-container">
    <h3>📄 Rapportage Overzicht</h3>
    <table class="report-table">
      <thead>
        <tr>
          <th width="120">Datum</th>
          <th width="140">Fase</th>
          <th>Onderwerp</th>
          <th width="150">Rollen</th>
          <th width="120">Label</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in gesorteerdeItems" :key="item.id">
          
          <td class="date-cell">{{ getDisplayDate(item) }}</td>
          
          <td>
            <span class="dot" :style="{ background: kleuren[getFirstPhase(item)] || '#ccc' }"></span>
            {{ getFirstPhase(item) }}
          </td>
          
          <td>
            <strong>{{ item.title }}</strong>
            <div v-if="item.comments" class="comment-text">
               📝 {{ item.comments }}
            </div>
          </td>
          
          <td class="small-text">
            <div>PH: {{ item.ph }}</div>
            <div>Dir: {{ item.dir }}</div>
          </td>
          
          <td>
            <span v-if="item.strategicLabel" class="mini-badge">
              {{ item.strategicLabel }}
            </span>
          </td>

        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.report-container {
  background: white; padding: 20px; border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin-top: 20px;
}

h3 { margin-top: 0; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; }

.report-table {
  width: 100%; border-collapse: collapse; font-size: 0.9rem;
}

.report-table th {
  text-align: left; background: #2c3e50; color: white; padding: 10px;
  position: sticky; top: 0;
}

.report-table td {
  border-bottom: 1px solid #eee; padding: 10px; vertical-align: top;
}

.report-table tr:nth-child(even) { background-color: #f9f9f9; }
.report-table tr:hover { background-color: #f0f4f8; }

.dot {
  display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 6px;
}

.comment-text { font-size: 0.8rem; color: #c0392b; margin-top: 4px; font-style: italic; }
.small-text { font-size: 0.8rem; color: #666; }
.date-cell { font-family: monospace; font-weight: bold; color: #555; }

.mini-badge {
  background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; color: #475569;
}
</style>