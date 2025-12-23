<template>
  <div class="headers-wrapper">
    <div class="date-header-placeholder"></div> <div class="headers-grid">
      <div class="header-item">PFO</div>
      <div class="header-item">DB Besluit</div>
      <div class="header-item">Informeel DB</div>
      <div class="header-item">Delta</div>
      <div class="header-item">AB Besluit</div>
    </div>
  </div>
</template>

<style scoped>
.headers-wrapper {
  display: flex;
  background: white;
  border-bottom: 2px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.date-header-placeholder {
  width: 100px; /* Moet matchen met AgendaView .date-label width */
  flex-shrink: 0;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
}

.headers-grid {
  flex: 1;
  display: grid;
  /* AANGEPAST: Nu 5 kolommen ipv 7 */
  grid-template-columns: repeat(5, 1fr); 
}

.header-item {
  padding: 12px;
  font-weight: 700;
  color: #374151;
  text-align: center;
  border-right: 1px solid #f0f0f0;
  background: #f9fafb;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.header-item:last-child {
  border-right: none;
}
</style>