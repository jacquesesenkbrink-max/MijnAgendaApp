<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: Object,
  isAdmin: Boolean // <--- NIEUW: Krijgen we door van de baas
});

const emit = defineEmits(['edit', 'delete']);

const borderColor = computed(() => {
    const phases = props.item.schedule ? Object.keys(props.item.schedule) : [];
    const firstPhase = phases.length > 0 ? phases[0] : '';
    const colors = { 
        'PFO':'var(--c-pfo)', 'DBBesluit':'var(--c-db-besluit)', 
        'DBSchrift':'var(--c-db-schrift)', 'DBInformeel': 'var(--c-db-informeel)',
        'ABBesluit':'var(--c-ab-besluit)', 'ABBrief':'var(--c-ab-brief)', 
        'Delta':'var(--c-delta)' 
    };
    return colors[firstPhase] || '#ccc';
});
</script>

<template>
  <div 
    class="card-wrapper" 
    :class="'col-' + (Object.keys(item.schedule)[0] || 'unknown')"
    :style="{ borderTopColor: borderColor }"
  >
    <div class="content">
        <div class="header-row">
            <span class="id-badge">#{{ item.id }}</span>
            
            <div class="actions" v-if="isAdmin">
                <button class="btn-icon edit" @click.stop="$emit('edit', item)">✏️</button>
                <button class="btn-icon delete" @click.stop="$emit('delete', item)">🗑️</button>
            </div>
        </div>
        
        <div class="strat-badge" v-if="item.strategicLabel">{{ item.strategicLabel }}</div>
        
        <h4>{{ item.title }}</h4>
        
        <div class="role-grid">
            <div class="role-item"><strong>PH:</strong> {{ item.ph }}</div>
            <div class="role-item"><strong>Dir:</strong> {{ item.dir }}</div>
        </div>

        <div v-if="item.comments" class="comments-box">
            📝 {{ item.comments }}
        </div>
    </div>
  </div>
</template>

<style scoped>
.card-wrapper {
    background: white; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    border-top: 4px solid #ccc; padding: 1rem; margin-bottom: 1rem; transition: transform 0.2s;
    position: relative;
}
.card-wrapper:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.15); }

.header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; min-height: 24px; }
.id-badge { color: #888; font-size: 0.75rem; }

.actions { display: flex; gap: 5px; }

.btn-icon {
    background: none; border: none; cursor: pointer; font-size: 1.1rem; opacity: 0.5; transition: all 0.2s;
}
.btn-icon:hover { opacity: 1; transform: scale(1.2); }
.btn-icon.delete:hover { filter: grayscale(100%) brightness(40%) sepia(100%) hue-rotate(-50deg) saturate(600%) contrast(0.8); }

.strat-badge {
    background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: bold; color: #475569;
    font-size: 0.7rem; display: inline-block; margin-bottom: 5px;
}
h4 { margin: 0 0 10px 0; color: #2c3e50; font-size: 1rem; }
.role-grid { font-size: 0.8rem; color: #666; display: grid; grid-template-columns: 1fr 1fr; gap: 5px; }
.comments-box { margin-top: 10px; background: #fff3cd; color: #856404; padding: 5px; border-radius: 4px; font-size: 0.75rem; }

/* SWIMLANE POSITIES (Alleen op grote schermen) */
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