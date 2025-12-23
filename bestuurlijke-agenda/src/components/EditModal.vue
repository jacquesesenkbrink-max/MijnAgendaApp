<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,       
  item: Object,
  availableDates: Object // <--- ONTVANGT DE DATA VAN APP.VUE
});

const emit = defineEmits(['close', 'save']);

const formData = ref({});
const manualInputMode = ref({
  PFO: false,
  DBBesluit: false,
  ABBrief: false,
  Delta: false,
  DBSchrift: false,
  DBInformeel: false,
  ABBesluit: false
});

watch(() => props.item, (newItem) => {
  if (newItem) {
    formData.value = JSON.parse(JSON.stringify(newItem));
    if (!formData.value.schedule) formData.value.schedule = {};

    // Reset manual modes bij openen
    Object.keys(manualInputMode.value).forEach(key => {
        const currentDate = formData.value.schedule[key];
        // Check of de huidige datum in de lijst met availableDates staat
        const isKnownDate = props.availableDates[key]?.includes(currentDate);
        // Zo niet, zet dan manual mode aan zodat de tekst zichtbaar is
        manualInputMode.value[key] = currentDate && !isKnownDate;
    });

  } else {
    // Nieuw item
    formData.value = { id: Date.now(), title: '', schedule: {} };
    Object.keys(manualInputMode.value).forEach(k => manualInputMode.value[k] = false);
  }
}, { immediate: true });

function opslaan() {
  emit('save', formData.value);
  emit('close');
}

function toggleManual(field) {
    manualInputMode.value[field] = !manualInputMode.value[field];
    if (!manualInputMode.value[field]) {
        // Als we terugkeren naar de lijst en de waarde staat er niet in, resetten
        if (!props.availableDates[field]?.includes(formData.value.schedule[field])) {
            formData.value.schedule[field] = '';
        }
    }
}
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>✏️ Bewerken</h2>
        <span class="close-btn" @click="$emit('close')">&times;</span>
      </div>

      <form @submit.prevent="opslaan">
        <div class="form-group">
            <label>Onderwerp Titel</label>
            <input v-model="formData.title" type="text" required placeholder="Bijv. Archiefverordening...">
        </div>

        <div class="row">
            <div class="form-group">
                <label>Strategisch Label</label>
                <select v-model="formData.strategicLabel">
                    <option value="">-- Kies --</option>
                    <option value="Beleid">Beleid</option>
                    <option value="Uitvoering">Uitvoering</option>
                    <option value="Kaders">Kaders</option>
                    <option value="Organisatiegesteldheid">Organisatiegesteldheid</option>
                    <option value="Externe ontwikkelingen">Externe ontwikkelingen</option>
                    <option value="Evaluatie">Evaluatie</option>
                </select>
            </div>
            <div class="form-group">
                <label>Portefeuillehouder (PH)</label>
                <input v-model="formData.ph" type="text">
            </div>
        </div>

        <div class="form-group">
            <label>Bestuurlijk Aanspreekpunt 🗣️</label>
            <input v-model="formData.administrativeContact" type="text" placeholder="Wie is de trekkende bestuurder?">
        </div>

        <div class="form-group">
            <label>Opmerkingen (Admin)</label>
            <textarea v-model="formData.comments" rows="2"></textarea>
        </div>

        <hr>
        <h3>Planning (Kies vaste data)</h3>
        
        <div class="date-grid">
            <div v-for="field in ['PFO', 'DBBesluit', 'ABBrief', 'Delta', 'DBSchrift', 'DBInformeel', 'ABBesluit']" :key="field" class="form-group">
                <div class="label-row">
                    <label>{{ field }}</label>
                    <small class="toggle-link" @click="toggleManual(field)">
                        {{ manualInputMode[field] ? 'Terug naar lijst' : 'Handmatig' }}
                    </small>
                </div>

                <select 
                    v-if="!manualInputMode[field]" 
                    v-model="formData.schedule[field]"
                    class="date-select"
                >
                    <option value="">-- Geen datum --</option>
                    <option v-if="availableDates[field]" v-for="date in availableDates[field]" :key="date" :value="date">
                        {{ date }}
                    </option>
                </select>

                <input 
                    v-else 
                    v-model="formData.schedule[field]" 
                    type="text" 
                    placeholder="dd-mm-jjjj..."
                    class="manual-input"
                >
            </div>
        </div>

        <button type="submit" class="save-btn">💾 Opslaan</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); z-index: 1000;
  display: flex; justify-content: center; align-items: center;
}
.modal-content {
  background: white; padding: 20px; border-radius: 8px;
  width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.close-btn { font-size: 28px; cursor: pointer; }

.form-group { margin-bottom: 15px; }
label { display: block; font-weight: bold; margin-bottom: 5px; font-size: 0.9rem; }
.label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }

.toggle-link { color: #3498db; cursor: pointer; font-size: 0.75rem; text-decoration: underline; }
.toggle-link:hover { color: #2980b9; }

input, select, textarea { 
    width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; 
}
.manual-input { border-color: #e67e22; background: #fffdf9; }

.row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.date-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f9f9f9; padding: 15px; border-radius: 4px; border: 1px solid #eee; }

.save-btn {
    background: #27ae60; color: white; border: none; padding: 10px 20px;
    width: 100%; font-size: 1rem; border-radius: 4px; cursor: pointer; margin-top: 15px;
}
.save-btn:hover { background: #219150; }
</style>