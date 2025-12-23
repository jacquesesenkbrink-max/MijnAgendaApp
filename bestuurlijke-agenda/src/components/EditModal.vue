<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  item: Object,
  availableDates: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'save'])

const defaultForm = {
  id: null,
  title: '',
  indiener: '',
  portefeuillehouder: '',
  domein: '',
  status: 'Concept', // Algemene status (indien nodig)
  prioriteit: 'Normaal',
  toelichting: '',
  schedule: {
    PFO: '',
    DBBesluit: '',
    DBInformeel: '',
    Delta: '',
    ABBesluit: ''
  },
  // NIEUW: Status per fase
  scheduleStatus: {
    PFO: 'Concept',
    DBBesluit: 'Concept',
    DBInformeel: 'Concept',
    Delta: 'Concept',
    ABBesluit: 'Concept'
  },
  ph: '', 
  dir: '',
  strategicLabel: '',
  comments: ''
}

const formData = ref({ ...defaultForm })

// Statussen voor de dropdowns
const statusOptions = ['Concept', 'Ingediend', 'Geagendeerd', 'Afgerond'];

watch(() => props.item, (newItem) => {
  if (newItem) {
    const copy = JSON.parse(JSON.stringify(newItem))
    if (!copy.schedule) copy.schedule = { ...defaultForm.schedule }
    
    // Zorg dat scheduleStatus bestaat, ook voor oude items
    if (!copy.scheduleStatus) copy.scheduleStatus = { ...defaultForm.scheduleStatus }
    
    formData.value = copy
  } else {
    formData.value = JSON.parse(JSON.stringify(defaultForm))
    formData.value.id = Date.now()
  }
}, { immediate: true })

const save = () => {
  if(formData.value.portefeuillehouder) formData.value.ph = formData.value.portefeuillehouder
  emit('save', formData.value)
}

const cancel = () => {
  emit('close')
}
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="cancel">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ item ? 'Agendapunt Bewerken' : 'Nieuw Agendapunt' }}</h2>
        <button class="close-btn" @click="cancel">&times;</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Onderwerp Titel</label>
          <input type="text" v-model="formData.title" placeholder="Bijv. Jaarstukken 2024" autofocus>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Indiener / Steller</label>
            <input type="text" v-model="formData.indiener">
          </div>
          <div class="form-group">
            <label>Portefeuillehouder (PH)</label>
            <select v-model="formData.portefeuillehouder">
              <option value="">-- Selecteer --</option>
              <option>D.S. Schoonman</option>
              <option>H.J. Pereboom</option>
              <option>N. Koks</option>
              <option>J.C.G. Wijnen</option>
              <option>M. Wesselink</option>
              <option>F. Stienstra</option>
            </select>
          </div>
        </div>

        <div class="grid-2">
          <div class="form-group">
            <label>Strategisch Label</label>
            <select v-model="formData.strategicLabel">
               <option value="">-- Kies Label --</option>
               <option>Beleid</option>
               <option>Uitvoering</option>
               <option>Kaders</option>
               <option>Organisatiegesteldheid</option>
               <option>Externe ontwikkelingen</option>
               <option>Evaluatie</option>
            </select>
          </div>
          <div class="form-group">
             <label>Algemene Status</label>
            <select v-model="formData.status">
              <option>Concept</option>
              <option>Lopend</option>
              <option>On hold</option>
              <option>Afgerond</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Toelichting / Opmerkingen</label>
          <textarea v-model="formData.comments" rows="3" placeholder="Interne notities..."></textarea>
        </div>

        <hr class="divider">

        <h3>Planning & Status</h3>
        <p class="hint-text">Selecteer per fase de datum én de status (Concept/Afgerond).</p>
        
        <div class="date-grid">
            
            <div class="form-group schedule-block">
                <label>PFO</label>
                <div class="input-row">
                    <select v-model="formData.schedule.PFO" class="date-select">
                        <option value="">-- Datum --</option>
                        <option v-for="date in (availableDates.PFO || [])" :key="date" :value="date">{{ date }}</option>
                    </select>
                    <select v-model="formData.scheduleStatus.PFO" class="status-select" :class="formData.scheduleStatus.PFO">
                        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group schedule-block">
                <label>DB Besluit</label>
                <div class="input-row">
                    <select v-model="formData.schedule.DBBesluit" class="date-select">
                        <option value="">-- Datum --</option>
                        <option v-for="date in (availableDates.DBBesluit || [])" :key="date" :value="date">{{ date }}</option>
                    </select>
                    <select v-model="formData.scheduleStatus.DBBesluit" class="status-select" :class="formData.scheduleStatus.DBBesluit">
                        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group schedule-block">
                <label>Informeel DB</label>
                <div class="input-row">
                    <select v-model="formData.schedule.DBInformeel" class="date-select">
                        <option value="">-- Datum --</option>
                        <option v-for="date in (availableDates.DBInformeel || [])" :key="date" :value="date">{{ date }}</option>
                    </select>
                    <select v-model="formData.scheduleStatus.DBInformeel" class="status-select" :class="formData.scheduleStatus.DBInformeel">
                        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
                    </select>
                </div>
            </div>

            <div class="form-group schedule-block">
                <label>Delta</label>
                <div class="input-row">
                    <select v-model="formData.schedule.Delta" class="date-select">
                        <option value="">-- Datum --</option>
                        <option v-for="date in (availableDates.Delta || [])" :key="date" :value="date">{{ date }}</option>
                    </select>
                    <select v-model="formData.scheduleStatus.Delta" class="status-select" :class="formData.scheduleStatus.Delta">
                        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group schedule-block">
                <label>AB Besluit</label>
                <div class="input-row">
                    <select v-model="formData.schedule.ABBesluit" class="date-select">
                        <option value="">-- Datum --</option>
                        <option v-for="date in (availableDates.ABBesluit || [])" :key="date" :value="date">{{ date }}</option>
                    </select>
                    <select v-model="formData.scheduleStatus.ABBesluit" class="status-select" :class="formData.scheduleStatus.ABBesluit">
                        <option v-for="s in statusOptions" :key="s">{{ s }}</option>
                    </select>
                </div>
            </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="cancel">Annuleren</button>
        <button class="btn-save" @click="save">Opslaan</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background: white; width: 750px; max-width: 95%; max-height: 90vh;
  overflow-y: auto; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  display: flex; flex-direction: column;
}
.modal-header { padding: 16px 24px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; background: #f8f9fa; }
.modal-header h2 { margin: 0; font-size: 1.25rem; color: #2c3e50; }
.close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666; }
.modal-body { padding: 24px; flex: 1; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.date-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* Iets breder voor dubbele input */
  gap: 16px; background: #f9fafb; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb;
}

.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 600; font-size: 0.9rem; color: #34495e; }
.form-group input, .form-group textarea, .form-group select {
  width: 100%; padding: 10px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 0.95rem; font-family: inherit;
}

/* NIEUW: STIJL VOOR DE DUBBELE INPUTS */
.input-row { display: flex; gap: 8px; }
.date-select { flex: 2; }
.status-select { flex: 1; font-weight: bold; }

/* Kleurtjes in de select dropdown */
.status-select.Afgerond { color: #27ae60; border-color: #27ae60; }
.status-select.Geagendeerd { color: #3498db; }

.divider { border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0; }
.modal-footer { padding: 16px 24px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 12px; background: #f9fafb; }
.btn-cancel { padding: 10px 20px; background: white; border: 1px solid #d1d5db; border-radius: 4px; cursor: pointer; font-weight: bold; color: #555; }
.btn-save { padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
.btn-save:hover { background: #219150; }

@media (max-width: 600px) { .grid-2 { grid-template-columns: 1fr; } }
</style>