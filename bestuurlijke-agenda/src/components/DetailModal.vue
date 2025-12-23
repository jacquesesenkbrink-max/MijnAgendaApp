<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: Boolean,       // Is de popup open?
  item: Object         // Welk onderwerp laten we zien?
});

const emit = defineEmits(['close']);

// Hulpfunctie om te sluiten
function sluit() {
  emit('close');
}

// We maken een lijstje van alle fases voor in de popup
const fases = [
  { key: 'PFO', label: 'PFO', color: 'var(--c-pfo)' },
  { key: 'DBBesluit', label: 'DB Besluit', color: 'var(--c-db-besluit)' },
  { key: 'DBSchrift', label: 'DB Schrift.', color: 'var(--c-db-schrift)' },
  { key: 'DBInformeel', label: 'Informeel DB', color: 'var(--c-db-informeel)' },
  { key: 'ABBrief', label: 'AB Brief', color: 'var(--c-ab-brief)' },
  { key: 'Delta', label: 'Delta', color: 'var(--c-delta)' },
  { key: 'ABBesluit', label: 'AB Besluit', color: 'var(--c-ab-besluit)' }
];
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click="sluit">
    
    <div class="modal-content" @click.stop>
      <span class="close-btn" @click="sluit">&times;</span>
      
      <div v-if="item">
        <h2>{{ item.title }}</h2>
        <div class="meta-info">
            <span><strong>PH:</strong> {{ item.ph }}</span>
            <span><strong>Dir:</strong> {{ item.dir }}</span>
            
            <span v-if="item.administrativeContact" style="grid-column: span 2;">
                <strong>🗣️ Aanspreekpunt:</strong> {{ item.administrativeContact }}
            </span>
        </div>
        
        <hr>
        
        <h3>Planning Verloop</h3>
        <div class="flow-list">
            <div v-for="fase in fases" :key="fase.key" class="flow-row">
                <div class="flow-label">
                    <span class="dot" :style="{ background: fase.color }"></span>
                    {{ fase.label }}
                </div>
                <div class="flow-date" :class="{ 'has-date': item.schedule[fase.key] }">
                    {{ item.schedule[fase.key] || '-' }}
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.close-btn {
  position: absolute;
  top: 10px; right: 15px;
  font-size: 28px;
  cursor: pointer;
  font-weight: bold;
  color: #aaa;
}
.close-btn:hover { color: #000; }

h2 { margin-top: 0; color: #2c3e50; font-size: 1.4rem; }
h3 { font-size: 1rem; margin-top: 20px; color: #666; text-transform: uppercase; }

.meta-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    background: #f4f7f6;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
    font-size: 0.9rem;
}

.flow-list {
    background: #f9f9f9;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #eee;
}

.flow-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid #eee;
    font-size: 0.9rem;
}
.flow-row:last-child { border-bottom: none; }

.flow-label { display: flex; align-items: center; font-weight: 600; color: #555; }
.dot { width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; display: inline-block; }

.flow-date { font-family: monospace; color: #ccc; }
.flow-date.has-date { color: #2c3e50; font-weight: bold; }
</style>