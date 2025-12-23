<script setup>
const props = defineProps({
    months: Array,
    activeMonthId: String
});

const emit = defineEmits(['scroll-to']);

const scrollToMonth = (id) => {
    emit('scroll-to', id);
};
</script>

<template>
  <div class="sidebar-nav">
     <div 
       v-for="month in months" 
       :key="month.id"
       class="nav-item"
       :class="{ active: activeMonthId === month.id }"
       @click="scrollToMonth(month.id)"
     >
        <span class="nav-label">{{ month.name }}</span>
        <div class="nav-dot" :class="month.trafficColor"></div>
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
    gap: 15px;
    z-index: 90;
}

.nav-item {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    transition: transform 0.2s;
}

.nav-item:hover {
    transform: translateX(-5px);
}

.nav-label {
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-right: 10px;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
    white-space: nowrap;
}

.nav-item:hover .nav-label {
    opacity: 1;
}

.nav-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #ddd;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.nav-item.active .nav-dot {
    transform: scale(1.3);
    border-color: #333;
}

/* Traffic light colors */
.nav-dot.low { background-color: #2ecc71; }
.nav-dot.med { background-color: #f1c40f; }
.nav-dot.high { background-color: #e74c3c; }

@media (max-width: 900px) {
    .sidebar-nav { display: none; }
}
</style>