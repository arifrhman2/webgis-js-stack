<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // Wajib memanggil CSS Leaflet

onMounted(() => {
  // 1. Inisialisasi Peta (Koordinat tengah Indonesia)
  const map = L.map('map').setView([-2.5, 117.0], 5);

  // 2. Tambahkan Basemap OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // 3. Panggil API Node.js kita yang ada di port 3000
  fetch('http://localhost:3000/api/candi/area')
    .then(response => response.json())
    .then(data => {
      // 4. Ubah data GeoJSON menjadi layer peta
      const candiLayer = L.geoJSON(data, {
        style: function (feature) {
          return {
            color: "#ff7800",      // Warna garis tepi
            weight: 2,
            fillColor: "#ffbd33",  // Warna isian
            fillOpacity: 0.5
          };
        },
        onEachFeature: function (feature, layer) {
          // Memunculkan popup jika diklik
          if (feature.properties) {
            // Karena kita pakai SELECT *, atribut QGIS-mu akan otomatis terbaca
            // Ganti 'nama_area' dengan nama kolom aslimu jika berbeda
            let nama = feature.properties.nama_area || feature.properties.Name || "Area Candi"; 
            layer.bindPopup(`<b>${nama}</b>`);
          }
        }
      }).addTo(map);

      // 5. Otomatis Zoom/Terbang ke lokasi Candi
      map.fitBounds(candiLayer.getBounds());
    })
    .catch(error => console.error('Gagal memuat data peta:', error));
});
</script>

<style>
/* Reset margin bawaan browser dan atur ukuran peta full layar */
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#map {
  width: 100vw;
  height: 100vh;
}
</style>