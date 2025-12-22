<script setup>
import { computed } from 'vue';

const props = defineProps({
  event: Object,      // Het agenda-item (met datum, titel, etc.)
  isAdmin: Boolean,   // Is de gebruiker ingelogd?
  isFocused: Boolean, // Heeft dit onderwerp focus?
  isCompact: Boolean  // Moeten we de "Stippen" weergave tonen?
});

const emit = defineEmits(['edit', 'delete', 'toggle-focus', 'open-details']);

// Kleuren per fase
const colors = { 
  'PFO':'var(--c-pfo)', 'DBBesluit':'var(--c-db-besluit)', 
  'DBSchrift':'var(--c-db-schrift)', 'DBInformeel': 'var(--c-db-informeel)',
  'ABBesluit':'var(--c-ab-besluit)', 'ABBrief':'var(--c-ab-brief)', 
  'Delta':'var(--c-delta)' 
};

// Labels voor weergave
const labels = { 
  'PFO':'PFO', 'DBBesluit':'DB Besluit', 'DBSchrift':'DB Schrift.', 
  'DBInformeel': 'Informeel DB', 'ABBesluit':'AB Besluit', 
  'ABBrief':'AB Brief', 'Delta':'Delta' 
};

// Kleur bepalen (in compact mode is dit de achtergrond, anders de rand)
const borderColor = computed(() => colors[props.event.type] || '#ccc');
const phaseLabel = computed(() => labels[props.event.type] || props.event.type);

// Tooltip tekst voor de stippen-modus (anders zie je niet wat het is)
const tooltipText = computed(() => `${props.event.title} (${props.event.dateDisplay})`);
</script>

<template>
  <div 
    class="card-wrapper" 
    :class="[
        'col-' + event.type, 
        { 'is-focused': isFocused },
        { 'view-dots': isCompact } 
    ]"
    :id="'card-' + event.topicId + '-' + event.type"
    :style="isCompact ? { background: borderColor, boxShadow: '0 0 5px ' + borderColor } : { borderTopColor: borderColor }"
    @click="$emit('toggle-focus', event.topicId)"
    :data-tooltip="tooltipText"
  >
    <div class="content">
        <template v-if="!isCompact">
            <div class="header-row">
                <span class="date-badge">📅 {{ event.dateDisplay }}</span>
                
                <div class="actions" v-if="isAdmin">
                    <button class="btn-icon edit" @click.stop="$emit('edit', event.originalItem)">✏️</button>
                    <button class="btn-icon delete" @click.stop="$emit('delete', event.originalItem)">🗑️</button>
                </div>
            </div>
            
            <div class="strat-badge" v-if="event.strategicLabel">{{ event.strategicLabel }}</div>
            
            <h3>{{ phaseLabel }}</h3>
            <h4>{{ event.title }}</h4>
            
            <div class="role-grid">
                <div class="role-item"><strong>PH:</strong> {{ event.ph }}</div>
            </div>

            <div v-if="event.comments && isAdmin" class="comments-box">
                🔒 {{ event.comments }}
            </div>

            <div class="card-footer">
                <div class="card-action-btn" @click.stop="$emit('open-details', event.originalItem)">
                    👁 Details
                </div>
            </div>
        </template>
    </div>
  </div>
</template>

<style scoped>
/* --- BASIS STIJL (NORMALE KAART) --- */
.card-wrapper {
    background: white; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border-top: 4px solid #ccc; padding: 1rem; margin-bottom: 1rem; 
    transition: all 0.3s ease; position: relative; cursor: pointer;
    min-height: 140px; /* Zorg voor gelijke hoogte in grid */
    opacity: 1; filter: grayscale(0%);
}
.card-wrapper:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(0,0,0,0.15); }

/* --- STIPPEN MODUS (VIEW-DOTS) --- */
.card-wrapper.view-dots {
    width: 40px; height: 40px; 
    border-radius: 50%; 
    padding: 0; 
    border-top: none !important; /* Overschrijf inline style van border-top */
    margin: 0 auto 5px auto;
    min-height: 0;
    display: flex; align-items: center; justify-content: center;
    overflow: visible; /* Voor de tooltip die er buiten valt */
}

/* Tooltip logica (alleen zichtbaar bij hover in dots modus) */
.card-wrapper.view-dots::after {
    content: attr(data-tooltip);
    position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%);
    background: #333; color: #fff; padding: 5px 10px; border-radius: 4px;
    font-size: 0.75rem; white-space: nowrap; opacity: 0; pointer-events: none;
    transition: opacity 0.2s; z-index: 1000; box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}
.card-wrapper.view-dots:hover::after { opacity: 1; }

/* Driehoekje onder tooltip */
.card-wrapper.view-dots::before {
    content: ''; position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
    border-width: 5px; border-style: solid; border-color: #333 transparent transparent transparent;
    opacity: 0; transition: opacity 0.2s; pointer-events: none; z-index: 1000;
}
.card-wrapper.view-dots:hover::before { opacity: 1; }

/* --- FOCUS MODUS --- */
.is-focused { z-index: 20; transform: scale(1.05); opacity: 1 !important; filter: grayscale(0%) !important; }

/* Focus in Dots mode heeft een extra randje nodig om op te vallen */
.card-wrapper.view-dots.is-focused { 
    border: 3px solid white; box-shadow: 0 0 0 3px #333; transform: scale(1.3); 
}

/* --- INTERNE ELEMENTEN (alleen zichtbaar in kaart modus) --- */
.header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
.date-badge { font-family: monospace; font-size: 0.75rem; color: #666; font-weight: bold; }
.strat-badge { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #475569; font-size: 0.7rem; display: inline-block; margin-bottom: 5px; }

h3 { margin: 0; font-size: 0.75rem; text-transform: uppercase; color: #999; }
h4 { margin: 0 0 10px 0; color: #2c3e50; font-size: 0.9rem; line-height: 1.3; }

.role-grid { font-size: 0.75rem; color: #666; margin-bottom: 10px; }
.comments-box { background: #fff3cd; color: #856404; padding: 5px; border-radius: 4px; font-size: 0.75rem; margin-bottom: 5px; }

.actions { display: flex; gap: 5px; }
.btn-icon { background: none; border: none; cursor: pointer; font-size: 1rem; opacity: 0.5; transition: 0.2s; }
.btn-icon:hover { opacity: 1; transform: scale(1.2); }

.card-footer { border-top: 1px solid #eee; padding-top: 5px; text-align: right; }
.card-action-btn { font-size: 0.75rem; font-weight: bold; color: #3498db; text-transform: uppercase; cursor: pointer; }
.card-action-btn:hover { text-decoration: underline; }

/* Grid posities voor grote schermen */
@media (min-width: 1100px) {
    .col-PFO { grid-column: 1; }
    .col-DBBesluit { grid-column: 2; }
    .col-DBSchrift { grid-column: 3; }
    .col-DBInformeel { grid-column: 4; }
    .col-ABBrief { grid-column: 5; }
    .col-Delta { grid-column: 6; }
    .col-ABBesluit { grid-column: 7; }
}
</style>