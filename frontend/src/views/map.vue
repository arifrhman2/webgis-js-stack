<template>
  <div class="map-layout">
    
    <nav>
      <a class="nav-brand" @click="$router.push('/')">
        <span class="ico">🏛️</span>
        <span>CANDI SELOGRIYO</span>
      </a>
      <ul class="nav-links">
        <li><router-link to="/">🏠 Home</router-link></li>
        
        <li>
          <router-link :to="{ path: '/', query: { tab: 'about', sub: 'sejarah' } }">
            ℹ️ About
          </router-link>
        </li>
        
        <li><router-link to="/map" class="active">🗺️ WebGIS</router-link></li>
      </ul>
    </nav>

    <div class="main-content">
      
      <aside class="sidebar">
        
        <div class="sidebar-section layer-section">
          <h3>Layer Peta</h3>
          
          <div class="layer-item">
            <label>
              <input type="checkbox" v-model="layersState.area" @change="toggleLayer('area')" />
              🟧 Zona Kawasan
            </label>
            <div class="legend" v-if="layersState.area">
              <span class="legend-color" style="background: #ffbd33; border: 2px solid #ff7800;"></span> Area Poligon
            </div>
          </div>

          <div class="layer-item">
            <label>
              <input type="checkbox" v-model="layersState.jalan" @change="toggleLayer('jalan')" />
              🛣️ Jalan & Akses
            </label>
            <div class="legend" v-if="layersState.jalan">
              <span class="legend-color" style="background: #007bff; height: 4px;"></span> Garis Biru
            </div>
          </div>

          <div class="layer-item">
            <label>
              <input type="checkbox" v-model="layersState.fasum" @change="toggleLayer('fasum')" />
              📍 Fasilitas Umum
            </label>
            <div class="legend" v-if="layersState.fasum">
              <span class="legend-color" style="background: #fff; border: 1px solid #ccc; border-radius: 50%;"></span> Titik Marker
            </div>
          </div>
        </div>

        <div class="sidebar-section image-section">
          <h3>Visual / Gambar</h3>
          <div class="image-box" style="padding: 0; overflow: hidden; position: relative;">
            
            <div v-if="!lokasiTerpilih.gambar" class="placeholder-text" style="padding: 20px;">
              Pilih fitur titik (Fasilitas Umum) di peta untuk melihat gambar
            </div>
            
            <div v-else style="width: 100%; height: 100%;">
              <img :src="lokasiTerpilih.gambar" alt="Foto Lokasi" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: white; padding: 8px; font-size: 14px; font-weight: bold;">
                {{ lokasiTerpilih.nama }}
              </div>
            </div>

          </div>
        </div>

      </aside>

      <div id="map" class="map-container"></div>
      
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Memperbaiki ikon marker Leaflet
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// State reaktif Vue untuk memantau status centang checkbox
const layersState = reactive({
  area: true,
  jalan: true,
  fasum: true
});

// Objek untuk menyimpan referensi layer Leaflet agar bisa dimatikan/dinyalakan
const mapLayers = {};
let map = null;

// Kamus data foto (Nanti ini bisa dipindah ke database betulan)
const fotoFasilitas = {
  "Loket Entrance": "https://lh3.googleusercontent.com/p/AF1QipM-218m-Yy6k9i8E7HqJ1-s0H_wO-G1n1H2Xw_k=s680-w680-h510",
  "Area Parkir Mobil": "https://lh3.googleusercontent.com/p/AF1QipN-31Kx2Q_n9tG3w-6oY1-s0H_wO-G1n1H2Xw_k=s680-w680-h510", // Ganti dengan link fotomu
  "Toilet": "https://lh3.googleusercontent.com/p/AF1QipO-41Lz2Q_n9tG3w-6oY1-s0H_wO-G1n1H2Xw_k=s680-w680-h510" // Ganti dengan link fotomu
};

// Variabel untuk menyimpan data lokasi yang sedang diklik
const lokasiTerpilih = reactive({
  nama: '',
  gambar: ''
});

onMounted(() => {
  // Inisialisasi Peta
  map = L.map('map').setView([-7.4, 110.2], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  // Buat Layer Kosong terlebih dahulu dan masukkan ke objek mapLayers
  mapLayers.area = L.geoJSON(null, {
    style: { color: "#ff7800", weight: 2, fillColor: "#ffbd33", fillOpacity: 0.5 },
    onEachFeature: (feature, layer) => { layer.bindPopup(`<b>${feature.properties.nama_area || 'Zona'}</b>`); }
  }).addTo(map);

  mapLayers.jalan = L.geoJSON(null, {
    style: { color: "#007bff", weight: 4, opacity: 0.8 },
    onEachFeature: (feature, layer) => { layer.bindPopup(`<b>${feature.properties.nama_jalan || 'Jalan'}</b>`); }
  }).addTo(map);

 mapLayers.fasum = L.geoJSON(null, {
    onEachFeature: (feature, layer) => { 
      const namaFasum = feature.properties.nama_fasum || 'Fasilitas';
      
      // 1. Buat Popup seperti biasa
      layer.bindPopup(`<b>${namaFasum}</b>`); 
      
      // 2. Tambahkan aksi klik (Click Event)
      layer.on('click', () => {
        // Update variabel reaktif dengan nama dan cari fotonya di kamus
        lokasiTerpilih.nama = namaFasum;
        lokasiTerpilih.gambar = fotoFasilitas[namaFasum] || 'https://via.placeholder.com/400x300?text=Foto+Tidak+Tersedia'; // Foto default jika tidak ketemu
      });
    }
  }).addTo(map);

  // Ambil Data dari API Backend
  fetch('http://localhost:3000/api/candi/area')
    .then(r => r.json()).then(d => { mapLayers.area.addData(d); mapLayers.area.bringToBack(); if(d.features?.length) map.fitBounds(mapLayers.area.getBounds()); }).catch(e=>console.log(e));
  
  fetch('http://localhost:3000/api/candi/jalan')
    .then(r => r.json()).then(d => { mapLayers.jalan.addData(d); mapLayers.jalan.bringToFront(); }).catch(e=>console.log(e));
  
  fetch('http://localhost:3000/api/candi/fasum')
    .then(r => r.json()).then(d => { mapLayers.fasum.addData(d); }).catch(e=>console.log(e));
});

// Fungsi yang dipanggil saat checkbox di-klik
const toggleLayer = (layerName) => {
  if (!map || !mapLayers[layerName]) return;
  
  if (layersState[layerName]) {
    map.addLayer(mapLayers[layerName]); // Jika dicentang, tampilkan di peta
  } else {
    map.removeLayer(mapLayers[layerName]); // Jika tidak, hapus dari peta
  }
};
</script>

<style scoped>
/* Struktur Layout Utama (Flexbox) */
.map-layout { display: flex; flex-direction: column; height: 100vh; width: 100vw; overflow: hidden; background: #f0f4f4;}

/* Navbar Atas */
nav {
  height: 60px; flex-shrink: 0; background: white; display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px; box-shadow: 0 1px 5px rgba(0,0,0,0.1); z-index: 2000;
}
.nav-brand { font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; color: #1e8f82;}
.nav-links { display: flex; gap: 15px; list-style: none; padding: 0; margin: 0;}
.nav-links a { cursor: pointer; text-decoration: none; color: #666; padding: 8px 15px; border-radius: 20px; font-weight: 600; font-size: 14px;}
.nav-links a.active { color: #2ab5a5; border: 1.5px solid #2ab5a5; }

/* Pembagian Layar Kiri & Kanan */
.main-content { display: flex; flex: 1; height: calc(100vh - 60px); overflow: hidden; }

/* Sidebar Kiri */
.sidebar { 
  width: 320px; flex-shrink: 0; background: white; display: flex; flex-direction: column; 
  box-shadow: 2px 0 10px rgba(0,0,0,0.05); z-index: 1000; overflow-y: auto;
}
.sidebar-section { padding: 25px; border-bottom: 1px solid #eee; }
.sidebar-section h3 { color: #1e8f82; font-size: 18px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;}

/* Desain Checkbox & Legenda */
.layer-item { margin-bottom: 15px; }
.layer-item label { display: flex; align-items: center; gap: 10px; font-weight: bold; color: #333; cursor: pointer; font-size: 15px;}
.layer-item input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; accent-color: #2ab5a5;}
.legend { margin-left: 28px; margin-top: 8px; font-size: 13px; color: #777; display: flex; align-items: center; gap: 10px; background: #f9f9f9; padding: 8px 12px; border-radius: 6px;}
.legend-color { display: inline-block; width: 18px; height: 18px; border-radius: 3px; }

/* Box Gambar Bawah */
.image-section { flex: 1; }
.image-box { 
  background: #f4f7f6; border: 2px dashed #ccc; border-radius: 10px; 
  height: 200px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px;
}
.placeholder-text { font-size: 13px; color: #999; font-style: italic; }

/* Area Peta */
.map-container { flex: 1; z-index: 1; }

/* Sembunyikan atribusi leaflet yang panjang jika mau lebih bersih */
:deep(.leaflet-control-attribution) { display: none; }
</style>