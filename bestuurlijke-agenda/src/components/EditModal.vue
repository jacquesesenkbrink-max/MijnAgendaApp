<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,        // AANGEPAST: matcht nu met App.vue (:show)
  item: Object,         // AANGEPAST: matcht nu met App.vue (:item)
  availableDates: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['close', 'save'])

// Leeg formulier template
const defaultForm = {
  id: null,
  title: '',
  indiener: '',             // Nieuw veld
  portefeuillehouder: '',   // Nieuw veld
  domein: '',               // Nieuw veld
  status: 'Concept',        // Nieuw veld
  prioriteit: 'Normaal',    // Nieuw veld
  toelichting: '',          // Nieuw veld
  schedule: {
    PFO: '',
    DBBesluit: '',
    DBSchrift: '',
    DBInformeel: '',
    ABBrief: '',
    Delta: '',
    ABBesluit: ''
  },
  // Oude velden behouden voor backward compatibility
  ph: '', 
  dir: '',
  strategicLabel: '',
  comments: ''
}

const formData = ref({ ...defaultForm })

// Wanneer het venster opent of het item wijzigt
watch(() => props.item, (newItem) => {
  if (newItem) {
    // We maken een kopie van het item
    const copy = JSON.parse(JSON.stringify(newItem))
    
    // Zorg dat het schedule object bestaat
    if (!copy.schedule) copy.schedule = { ...defaultForm.schedule }
    
    formData.value = copy
  } else {
    // Reset naar leeg bij "Nieuw"
    formData.value = JSON.parse(JSON.stringify(defaultForm))
    formData.value.id = Date.now() // Tijdelijk ID voor nieuwe items
  }
}, { immediate: true })

const save = () => {
  // Sync oude velden met nieuwe voor compatibility (optioneel)
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
            <label>Status</label>
            <select v-model="formData.status">
              <option>Concept</option>
              <option>Ingediend</option>
              <option>Geagendeerd</option>
              <option>Afgerond</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Toelichting / Opmerkingen</label>
          <textarea v-model="formData.comments" rows="3" placeholder="Interne notities..."></textarea>
        </div>

        <hr class="divider">

        <h3>Planning (Datums)</h3>
        <p class="hint-text">Selecteer een datum uit de vastgestelde lijst.</p>
        
        <div class="date-grid">
            <div class="form-group">
                <label>PFO</label>
                <select v-model="formData.schedule.PFO">
                    <option value="">-- Geen / Kies datum --</option>
                    <option v-for="date in (availableDates.PFO || [])" :key="date" :value="date">
                        {{ date }}
                    </option>
                </select>
            </div>
            
            <div class="form-group">
                <label>DB Besluit</label>
                <select v-model="formData.schedule.DBBesluit">
                    <option value="">-- Geen / Kies datum --</option>
                    <option v-for="date in (availableDates.DBBesluit || [])" :key="date" :value="date">
                        {{ date }}
                    </option>
                </select>
            </div>
            
            <div class="form-group">
                <label>DB Schriftelijk</label>
                <select v-model="formData.schedule.DBSchrift">
                    <option value="">-- Geen / Kies datum --</option>
                    <option v-for="date in (availableDates.DBSchrift || [])" :key="date" :value="date">
                        {{ date }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>Informeel DB</label>
                <select v-model="formData.schedule.DBInformeel">
                    <option value="">-- Geen / Kies datum --</option>
                    <option v-for="date in (availableDates.DBInformeel || [])" :key="date" :value="date">
                        {{ date }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>AB Brief</label>
                <select v-model="formData.schedule.ABBrief">
                    <option value="">-- Geen / Kies datum --</option>
                    <option v-for="date in (availableDates.ABBrief || [])" :key="date" :value="date">
                        {{ date }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>Delta</label>
                <select v-model="formData.schedule.Delta">
                    <option value="">-- Geen / Kies datum --</option>
                    <option v-for="date in (availableDates.Delta || [])" :key="date" :value="date">
                        {{ date }}
                    </option>
                </select>
            </div>
            
            <div class="form-group">
                <label>AB Besluit</label>
                <select v-model="formData.schedule.ABBesluit">
                    <option value="">-- Geen / Kies datum --</option>
                    <option v-for="date in (availableDates.ABBesluit || [])" :key="date" :value="date">
                        {{ date }}
                    </option>
                </select>
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
  position: fixed;
  top: 0; 
  left: 0;
  width: 100%; 
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 700px;
  max-width: 95%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}
.close-btn:hover { color: #000; }

.modal-body {
  padding: 24px;
  flex: 1;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.date-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  background: #f9fafb;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #34495e;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.95rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37,99,235,0.1);
}

.hint-text {
  font-size: 0.85rem;
  color: #6b7280;
  margin-top: -8px;
  margin-bottom: 16px;
}

.divider {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 24px 0;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f9fafb;
}

.btn-cancel {
  padding: 10px 20px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  color: #555;
}
.btn-cancel:hover { background: #f0f0f0; }

.btn-save {
  padding: 10px 20px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-save:hover {
  background: #219150;
}

/* Mobiel aanpassing */
@media (max-width: 600px) {
    .grid-2 { grid-template-columns: 1fr; }
}
</style>