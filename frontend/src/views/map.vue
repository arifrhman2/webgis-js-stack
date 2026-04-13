<template>
  <div class="map-view">
    <button @click="$router.push('/')" class="back-btn">
      ⬅️ Kembali ke Beranda
    </button>
    
    <div id="map"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; 

// Memperbaiki ikon marker Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

onMounted(() => {
  const map = L.map('map').setView([-7.4, 110.2], 14); // Kordinat disesuaikan ke area Magelang

  const basemapOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  // Siapkan Layer Kosong
  const areaLayer = L.geoJSON(null, {
    style: { color: "#ff7800", weight: 2, fillColor: "#ffbd33", fillOpacity: 0.5 },
    onEachFeature: (feature, layer) => { layer.bindPopup(`<b>${feature.properties.nama_area || 'Zona Kawasan'}</b>`); }
  }).addTo(map);

  const jalanLayer = L.geoJSON(null, {
    style: { color: "#007bff", weight: 4, opacity: 0.8 },
    onEachFeature: (feature, layer) => { layer.bindPopup(`<b>${feature.properties.nama_jalan || 'Jalan'}</b>`); }
  }).addTo(map);

  const fasumLayer = L.geoJSON(null, {
    onEachFeature: (feature, layer) => { layer.bindPopup(`<b>${feature.properties.nama_fasum || 'Fasilitas'}</b>`); }
  }).addTo(map);

  // Kontrol Menu On/Off Layer
  L.control.layers(
    { "Peta Dasar (OSM)": basemapOSM },
    { "📍 Fasilitas Umum": fasumLayer, "🛣️ Jalan Kawasan": jalanLayer, "🟧 Zona Candi": areaLayer },
    { collapsed: false }
  ).addTo(map);

  // Ambil Data dari Backend (Pastikan server.js menyala)
  fetch('http://localhost:3000/api/candi/area')
    .then(r => r.json()).then(d => { areaLayer.addData(d); areaLayer.bringToBack(); if(d.features?.length) map.fitBounds(areaLayer.getBounds()); }).catch(e=>console.log(e));
  
  fetch('http://localhost:3000/api/candi/jalan')
    .then(r => r.json()).then(d => { jalanLayer.addData(d); jalanLayer.bringToFront(); }).catch(e=>console.log(e));
  
  fetch('http://localhost:3000/api/candi/fasum')
    .then(r => r.json()).then(d => { fasumLayer.addData(d); }).catch(e=>console.log(e));


});
</script>

<style scoped>
.map-view { position: relative; width: 100vw; height: 100vh; }
#map { width: 100%; height: 100%; z-index: 1; }
.back-btn {
  position: absolute; top: 20px; left: 50px; z-index: 1000;
  padding: 10px 20px; cursor: pointer; border-radius: 8px; border: none; 
  font-weight: bold; background: #2ab5a5; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}
.back-btn:hover { background: #1e8f82; }

/* Memaksa text menu leaflet ke kiri (menimpa bawaan vite) */
:deep(.leaflet-control-layers) { text-align: left !important; }
</style>