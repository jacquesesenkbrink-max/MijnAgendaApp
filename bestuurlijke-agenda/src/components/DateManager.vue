<script setup>
import { ref } from 'vue';

const props = defineProps({
  show: Boolean,
  datesData: Object // Dit object komt vanuit App.vue
});

const emit = defineEmits(['close', 'update-dates']);

const activeTab = ref('PFO'); // Welke tab staat open?
const newDateInput = ref('');

// Lijst van tabbladen gebaseerd op de keys in je data
const tabs = ['PFO', 'DBBesluit', 'ABBrief', 'Delta', 'DBSchrift', 'DBInformeel', 'ABBesluit'];

// Helper om datum toe te voegen en direct te sorteren
function addDate() {
    if (!newDateInput.value) return;
    
    // Voeg toe aan de lijst
    if (!props.datesData[activeTab.value]) props.datesData[activeTab.value] = [];
    props.datesData[activeTab.value].push(newDateInput.value);
    
    // Sorteer de lijst chronologisch (dd-mm-jjjj)
    props.datesData[activeTab.value].sort((a, b) => {
        const [d1, m1, y1] = a.split('-');
        const [d2, m2, y2] = b.split('-');
        return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`);
    });

    // Reset input en geef seintje aan App.vue om op te slaan
    newDateInput.value = '';
    emit('update-dates');
}

function removeDate(dateToRemove) {
    if(confirm(`Datum ${dateToRemove} verwijderen?`)) {
        props.datesData[activeTab.value] = props.datesData[activeTab.value].filter(d => d !== dateToRemove);
        emit('update-dates');
    }
}

// Functie om JSON te genereren voor de ontwikkelaar (jij dus)
function copyCode() {
    const code = `export const meetingDates = ${JSON.stringify(props.datesData, null, 2)};`;
    navigator.clipboard.writeText(code).then(() => alert("Code gekopieerd naar klembord! Plak dit in src/data/meetingDates.js als je dit permanent wilt maken."));
}
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>📅 Beheer Vergaderdata</h2>
        <span class="close-btn" @click="$emit('close')">&times;</span>
      </div>

      <div class="manager-container">
        <div class="tabs">
            <button 
                v-for="tab in tabs" 
                :key="tab"
                :class="{ active: activeTab === tab }"
                @click="activeTab = tab"
            >
                {{ tab }}
            </button>
        </div>

        <div class="tab-content">
            <h3>Datums voor {{ activeTab }}</h3>
            
            <div class="add-row">
                <input 
                    v-model="newDateInput" 
                    type="text" 
                    placeholder="dd-mm-jjjj" 
                    @keyup.enter="addDate"
                >
                <button class="add-btn" @click="addDate">➕ Toevoegen</button>
            </div>

            <ul class="date-list">
                <li v-for="date in datesData[activeTab]" :key="date">
                    <span>{{ date }}</span>
                    <button class="del-btn" @click="removeDate(date)">🗑️</button>
                </li>
                <li v-if="!datesData[activeTab] || datesData[activeTab].length === 0" class="empty">
                    Nog geen datums ingesteld.
                </li>
            </ul>
        </div>
      </div>

      <div class="modal-footer">
        <button class="copy-btn" @click="copyCode">📋 Kopieer JS Config (voor Developer)</button>
        <button class="close-main-btn" @click="$emit('close')">Sluiten</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); z-index: 1100; /* Hoger dan gewone modals */
  display: flex; justify-content: center; align-items: center;
}
.modal-content {
  background: white; width: 90%; max-width: 800px; height: 80vh;
  border-radius: 8px; display: flex; flex-direction: column;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}
.modal-header {
    padding: 15px 20px; border-bottom: 1px solid #eee;
    display: flex; justify-content: space-between; align-items: center;
}
.close-btn { font-size: 28px; cursor: pointer; }

.manager-container { display: flex; flex: 1; overflow: hidden; }

/* Tabs Links */
.tabs {
    width: 200px; background: #f4f7f6; border-right: 1px solid #ddd;
    display: flex; flex-direction: column; overflow-y: auto;
}
.tabs button {
    padding: 15px; border: none; background: transparent; text-align: left;
    cursor: pointer; border-bottom: 1px solid #eee; font-weight: 600; color: #555;
    transition: background 0.2s;
}
.tabs button:hover { background: #e2e6ea; }
.tabs button.active { background: #fff; color: #2c3e50; border-left: 4px solid #3498db; }

/* Content Rechts */
.tab-content { flex: 1; padding: 20px; overflow-y: auto; }

.add-row { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
.add-row input { flex: 1; padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
.add-btn { background: #27ae60; color: white; border: none; padding: 0 20px; border-radius: 4px; cursor: pointer; }

.date-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
.date-list li {
    background: #fff; border: 1px solid #ddd; padding: 8px 12px; border-radius: 4px;
    display: flex; justify-content: space-between; align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.date-list li.empty { grid-column: 1 / -1; background: transparent; border: none; color: #999; box-shadow: none; }

.del-btn { background: none; border: none; cursor: pointer; opacity: 0.5; }
.del-btn:hover { opacity: 1; transform: scale(1.1); color: #c0392b; }

.modal-footer {
    padding: 15px 20px; border-top: 1px solid #eee; background: #f9f9f9;
    display: flex; justify-content: space-between;
}
.copy-btn { background: #34495e; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
.close-main-btn { background: #95a5a6; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
</style>