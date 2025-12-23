<script setup>
// We definiëren de headers hier zodat we ze een kleur kunnen geven
const headers = [
  { label: 'PFO', color: 'var(--c-pfo)' },
  { label: 'DB Besluit', color: 'var(--c-db-besluit)' },
  { label: 'Informeel DB', color: 'var(--c-db-informeel)' },
  { label: 'Delta', color: 'var(--c-delta)' },
  { label: 'AB Besluit', color: 'var(--c-ab-besluit)' }
];
</script>

<template>
  <div class="headers-wrapper">
    <div class="date-header-placeholder"></div> 
    
    <div class="headers-grid">
      <div 
        v-for="header in headers" 
        :key="header.label" 
        class="header-item"
        :style="{ borderBottomColor: header.color }"
      >
        {{ header.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.headers-wrapper {
  display: flex;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
  /* Schaduw iets subtieler gemaakt */
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.date-header-placeholder {
  width: 100px; /* Moet matchen met AgendaView/Grid width */
  flex-shrink: 0;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  border-bottom: 2px solid #e5e7eb; /* Grijze lijn onder het lege blokje */
}

.headers-grid {
  flex: 1;
  display: grid;
  /* 5 kolommen, even breed */
  grid-template-columns: repeat(5, 1fr); 
}

.header-item {
  padding: 12px 5px;
  font-weight: 800; /* Iets dikker font zoals op screenshot */
  color: #4b5563;
  text-align: center;
  background: white; /* Wit in plaats van grijs */
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  /* De gekleurde balk onderaan */
  border-bottom-width: 5px; 
  border-bottom-style: solid;
  /* border-color wordt via inline style geregeld in de HTML */
  
  /* Streepje rechts tussen de kolommen */
  border-right: 1px solid #f3f4f6;
  
  /* Zorgt dat de tekst mooi in het midden staat */
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-item:last-child {
  border-right: none;
}
</style>