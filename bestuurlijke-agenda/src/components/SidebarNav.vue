<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  groepen: Array
});

const activeIndex = ref(0);

// Scroll naar de juiste maand als je op een bolletje klikt
function scrollTo(sortKey, index) {
    activeIndex.value = index;
    const element = document.getElementById('maand-' + sortKey);
    if (element) {
        // Scroll iets minder ver (offset) vanwege de sticky header
        const y = element.getBoundingClientRect().top + window.scrollY - 180;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}

// Check welke maand nu in beeld is
function updateActiveState() {
    const blocks = document.querySelectorAll('.month-block');
    let current = -1;
    
    // Loop door alle blokken en kijk of de bovenkant in de bovenste helft van het scherm zit
    blocks.forEach((block, index) => {
        const rect = block.getBoundingClientRect();
        if (rect.top < (window.innerHeight / 2)) {
            current = index;
        }
    });

    // Als we nog helemaal bovenin zijn, selecteer de eerste
    if (current === -1 && blocks.length > 0) current = 0;
    
    activeIndex.value = current;
}

onMounted(() => {
    window.addEventListener('scroll', updateActiveState);
    // Eerste keer direct checken
    updateActiveState();
});

onUnmounted(() => {
    window.removeEventListener('scroll', updateActiveState);
});
</script>

<template>
  <nav class="sidebar-nav">
    <div 
        v-for="(groep, index) in groepen" 
        :key="groep.sortKey"
        class="nav-item"
        :class="{ active: index === activeIndex }"
        @click="scrollTo(groep.sortKey, index)"
    >
        <span class="nav-label">
            {{ groep.titel }}
            <span class="count">({{ groep.items.length }})</span>
        </span>
        
        <div class="nav-dot" 
             :class="{
                'high': groep.items.length > 7,
                'med': groep.items.length >= 3 && groep.items.length <= 7,
                'low': groep.items.length < 3
             }"
        ></div>
    </div>
  </nav>
</template>

<style scoped>
.sidebar-nav {
    position: fixed;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 90;
}

/* Nav Item Container */
.nav-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    transition: transform 0.2s;
}
.nav-item:hover { transform: translateX(-5px); }

/* Label (tekst) - Standaard onzichtbaar, zichtbaar bij hover of active */
.nav-label {
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    margin-right: 10px;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.3s ease;
    pointer-events: none;
    white-space: nowrap;
}

.nav-item:hover .nav-label,
.nav-item.active .nav-label {
    opacity: 1;
    transform: translateX(0);
}

.nav-item.active .nav-label {
    background: #2c3e50;
    font-weight: bold;
}

/* Bolletjes */
.nav-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ddd;
    border: 2px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
}

/* Active State Dot */
.nav-item.active .nav-dot {
    transform: scale(1.4);
    border-color: #2c3e50;
}

/* Heatmap kleuren voor de bolletjes */
.nav-dot.low { background-color: #27ae60; }
.nav-dot.med { background-color: #e67e22; }
.nav-dot.high { background-color: #c0392b; }

/* Mobiel verbergen */
@media (max-width: 900px) {
    .sidebar-nav { display: none; }
}
</style>