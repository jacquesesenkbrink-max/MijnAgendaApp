<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,       // Is het venster open?
  item: Object         // Het item dat we gaan bewerken (of null voor nieuw)
});

const emit = defineEmits(['close', 'save']);

// We maken een lokale kopie van de data, zodat we niet direct in de 'live' data typen
const formData = ref({});

// --- OPTIES VOOR DROPDOWNS ---
const directieLeden = [
  "M. Boersen",
  "I. Geveke",
  "M. Werges"
];

const bestuurders = [
  "D.S. Schoonman",
  "H.J. Pereboom",
  "N. Koks",
  "J.C.G. Wijnen",
  "M. Wesselink",
  "F. Stienstra"
];

const strategischeLabels = [
  "Beleid",
  "Uitvoering",
  "Kaders",
  "Organisatiegesteldheid",
  "Externe ontwikkelingen",
  "Evaluatie"
];

// Zodra het venster opent, vullen we het formulier met de gegevens van het item
watch(() => props.item, (newItem) => {
  if (newItem) {
    // We maken een 'deep copy' zodat we veilig kunnen rommelen
    formData.value = JSON.parse(JSON.stringify(newItem));
    // Zorg dat schedule bestaat
    if (!formData.value.schedule) formData.value.schedule = {};
  } else {
    // Nieuw item? Maak alles leeg
    formData.value = { 
        id: Date.now(), 
        title: '', 
        schedule: {},
        ph: '',
        dir: '',
        administrativeContact: ''
    };
  }
}, { immediate: true });

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
                    <option value="">-- Kies Label --</option>
                    <option v-for="label in strategischeLabels" :key="label" :value="label">
                        {{ label }}
                    </option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Verantwoordelijk Directielid</label>
                <select v-model="formData.dir">
                    <option value="">-- Kies Directeur --</option>
                    <option v-for="d in directieLeden" :key="d" :value="d">
                        {{ d }}
                    </option>
                </select>
            </div>
        </div>

        <div class="row">
            <div class="form-group">
                <label>Portefeuillehouder (PH)</label>
                <select v-model="formData.ph">
                    <option value="">-- Kies PH --</option>
                    <option v-for="b in bestuurders" :key="b" :value="b">
                        {{ b }}
                    </option>
                </select>
            </div>

            <div class="form-group">
                <label>Bestuurlijk Aanspreekpunt 🗣️</label>
                <select v-model="formData.administrativeContact">
                    <option value="">-- Kies Aanspreekpunt --</option>
                    <option v-for="b in bestuurders" :key="b" :value="b">
                        {{ b }}
                    </option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <label>Opmerkingen (Admin)</label>
            <textarea v-model="formData.comments" rows="2"></textarea>
        </div>

        <hr>
        
        <h3>Planning (Datums)</h3>
        <p style="font-size: 0.8rem; color: #666; margin-top: -10px; margin-bottom: 10px;">
            Vul in als dd-mm-jjjj of bijv. "Q1 2026". Leeg laten mag ook.
        </p>
        
        <div class="date-grid">
            <div class="form-group">
                <label>PFO</label>
                <input v-model="formData.schedule.PFO" type="text" placeholder="...">
            </div>
            
            <div class="form-group">
                <label>DB Besluit</label>
                <input v-model="formData.schedule.DBBesluit" type="text" placeholder="...">
            </div>
            
            <div class="form-group">
                <label>DB Schriftelijk</label>
                <input v-model="formData.schedule.DBSchrift" type="text" placeholder="...">
            </div>

            <div class="form-group">
                <label>Informeel DB</label>
                <input v-model="formData.schedule.DBInformeel" type="text" placeholder="...">
            </div>

            <div class="form-group">
                <label>AB Brief</label>
                <input v-model="formData.schedule.ABBrief" type="text" placeholder="...">
            </div>

            <div class="form-group">
                <label>Deltabijeenkomst</label>
                <input v-model="formData.schedule.Delta" type="text" placeholder="...">
            </div>
            
            <div class="form-group">
                <label>AB Besluit</label>
                <input v-model="formData.schedule.ABBesluit" type="text" placeholder="...">
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
  max-height: 90vh; overflow-y: auto;
}
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.close-btn { font-size: 28px; cursor: pointer; }

.form-group { margin-bottom: 15px; }
label { display: block; font-weight: bold; margin-bottom: 5px; font-size: 0.9rem; }
input, select, textarea { 
    width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; font-size: 0.95rem;
}
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

/* Grid voor datums: 2 kolommen */
.date-grid { 
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 10px; 
    background: #f9f9f9; 
    padding: 15px; 
    border-radius: 4px; 
    border: 1px solid #eee;
}

.save-btn {
    background: #27ae60; color: white; border: none; padding: 12px 20px;
    width: 100%; font-size: 1rem; border-radius: 4px; cursor: pointer; margin-top: 15px; font-weight: bold;
}
.save-btn:hover { background: #219150; }
</style>