<template>
  <div class="map-view">
    <nav class="map-nav">
      <router-link to="/" class="back-btn">← Kembali ke Home</router-link>
    </nav>
    <div id="map"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

onMounted(() => {
  // Masukkan logika inisialisasi peta Leaflet-mu di sini
  const map = L.map('map').setView([-7.4, 110.2], 15)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
})
</script>

<style scoped>
#map { height: 100vh; width: 100%; }
.back-btn { padding: 10px; color: teal; text-decoration: none; font-weight: bold; }
</style>