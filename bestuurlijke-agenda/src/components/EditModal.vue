<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,       // Is het venster open?
  item: Object         // Het item dat we gaan bewerken (of null voor nieuw)
});

const emit = defineEmits(['close', 'save']);

// We maken een lokale kopie van de data, zodat we niet direct in de 'live' data typen
// (Pas als je op Opslaan klikt, sturen we het terug)
const formData = ref({});

// Zodra het venster opent, vullen we het formulier met de gegevens van het item
watch(() => props.item, (newItem) => {
  if (newItem) {
    // We maken een 'deep copy' zodat we veilig kunnen rommelen
    formData.value = JSON.parse(JSON.stringify(newItem));
    // Zorg dat schedule bestaat
    if (!formData.value.schedule) formData.value.schedule = {};
  } else {
    // Nieuw item? Maak alles leeg
    formData.value = { id: Date.now(), title: '', schedule: {} };
  }
});

function opslaan() {
  emit('save', formData.value);
  emit('close');
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
            <label>Opmerkingen (Admin)</label>
            <textarea v-model="formData.comments" rows="2"></textarea>
        </div>

        <hr>
        <h3>Planning (Datums)</h3>
        <div class="date-grid">
            <div class="form-group">
                <label>PFO</label>
                <input v-model="formData.schedule.PFO" type="text" placeholder="dd-mm-jjjj">
            </div>
            <div class="form-group">
                <label>DB Besluit</label>
                <input v-model="formData.schedule.DBBesluit" type="text" placeholder="dd-mm-jjjj">
            </div>
            <div class="form-group">
                <label>AB Brief</label>
                <input v-model="formData.schedule.ABBrief" type="text" placeholder="dd-mm-jjjj">
            </div>
             <div class="form-group">
                <label>Delta</label>
                <input v-model="formData.schedule.Delta" type="text" placeholder="dd-mm-jjjj">
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
  width: 90%; max-width: 600px;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.close-btn { font-size: 28px; cursor: pointer; }

.form-group { margin-bottom: 15px; }
label { display: block; font-weight: bold; margin-bottom: 5px; font-size: 0.9rem; }
input, select, textarea { 
    width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; 
}
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.date-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f9f9f9; padding: 10px; border-radius: 4px; }

.save-btn {
    background: #27ae60; color: white; border: none; padding: 10px 20px;
    width: 100%; font-size: 1rem; border-radius: 4px; cursor: pointer; margin-top: 15px;
}
.save-btn:hover { background: #219150; }
</style>