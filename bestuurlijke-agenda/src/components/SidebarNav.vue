<script setup>
const props = defineProps({
  groepen: Array // We krijgen de lijst met maanden binnen
});

// Functie om soepel naar de juiste maand te scrollen
function scrollToMaand(sortKey) {
  const element = document.getElementById('maand-' + sortKey);
  if (element) {
    // We scrollen ietsje hoger (-100px) zodat de header er niet overheen valt
    const top = element.getBoundingClientRect().top + window.scrollY - 120;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
}

// Hulpfunctie: Bepaal de kleur van het bolletje op basis van drukte
function getHeatClass(itemCount) {
  if (itemCount > 7) return 'heat-high'; // Druk (Rood)
  if (itemCount >= 3) return 'heat-med'; // Gemiddeld (Oranje)
  return 'heat-low';                     // Rustig (Groen)
}
</script>

<template>
  <div class="sidebar-nav">
    <div class="sidebar-line"></div>
    
    <div 
      v-for="groep in groepen" 
      :key="groep.sortKey" 
      class="nav-item"
      @click="scrollToMaand(groep.sortKey)"
    >
      <span class="nav-label">
        {{ groep.titel }} <span class="count">({{ groep.items.length }})</span>
      </span>
      
      <div class="nav-dot" :class="getHeatClass(groep.items.length)"></div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-nav {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0;
  z-index: 150;
  pointer-events: none; /* Zodat je 'door' de lege ruimte heen kunt klikken */
}

.sidebar-line {
  position: absolute;
  right: 9px; top: 10px; bottom: 10px;
  width: 2px; background: #e0e0e0; z-index: -1;
}

.nav-item {
  display: flex; align-items: center; justify-content: flex-end;
  cursor: pointer; padding: 6px 0; pointer-events: auto; position: relative; height: 30px;
}

.nav-label {
  background: rgba(44, 62, 80, 0.9); color: white; padding: 4px 8px; border-radius: 4px;
  font-size: 0.75rem; margin-right: 12px; opacity: 0; transform: translateX(10px);
  transition: all 0.3s ease; white-space: nowrap; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
/* Laat label zien als je over het bolletje muist */
.nav-item:hover .nav-label { opacity: 1; transform: translateX(0); }

.nav-dot {
  width: 12px; height: 12px; border-radius: 50%;
  transition: all 0.3s ease; border: 2px solid white; box-shadow: 0 0 2px rgba(0,0,0,0.3);
  flex-shrink: 0;
}
.nav-item:hover .nav-dot { transform: scale(1.4); }

/* De Heatmap kleuren */
.heat-low { background-color: #2ecc71; border-color: #27ae60; }
.heat-med { background-color: #f39c12; border-color: #e67e22; }
.heat-high { background-color: #e74c3c; border-color: #c0392b; }
</style>