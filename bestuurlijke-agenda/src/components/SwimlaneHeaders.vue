<template>
  <div class="swimlane-headers">
    <div class="header-item" style="border-color: var(--c-pfo)">PFO</div>
    <div class="header-item" style="border-color: var(--c-db-besluit)">DB Besluit</div>
    <div class="header-item" style="border-color: var(--c-db-schrift)">DB Schrift.</div>
    <div class="header-item" style="border-color: var(--c-db-informeel)">Informeel DB</div>
    <div class="header-item" style="border-color: var(--c-ab-brief)">AB Brief</div>
    <div class="header-item" style="border-color: var(--c-delta)">Delta</div>
    <div class="header-item" style="border-color: var(--c-ab-besluit)">AB Besluit</div>
  </div>
</template>

<style scoped>
.swimlane-headers {
  display: none; /* Op mobiel verbergen we dit */
  grid-template-columns: repeat(7, 1fr); /* 7 gelijke kolommen */
  gap: 10px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 20px;
  position: sticky;
  top: 0; /* Plakt aan de bovenkant */
  background: var(--bg-body);
  z-index: 90;
  border-bottom: 2px solid #ddd;
}

/* Op grote schermen tonen we het grid */
@media (min-width: 1100px) {
  .swimlane-headers {
    display: grid;
  }
}

.header-item {
  text-align: center;
  font-weight: bold;
  font-size: 0.85rem;
  color: #555;
  padding: 5px;
  border-bottom: 4px solid transparent; /* Kleur komt uit de style tag */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>