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
        
        <div class="sidebar-section basemap-section">
          <h3>Pilih Basemap</h3>
          <div class="basemap-grid">
            <div 
              class="basemap-card" 
              :class="{ active: activeBasemap === 'osm' }"
              @click="changeBasemap('osm')"
            >
              <div class="basemap-thumb osm-thumb"></div>
              <span>Jalanan</span>
            </div>
            
            <div 
              class="basemap-card" 
              :class="{ active: activeBasemap === 'satellite' }"
              @click="changeBasemap('satellite')"
            >
              <div class="basemap-thumb sat-thumb"></div>
              <span>Satelit</span>
            </div>

            <div 
              class="basemap-card" 
              :class="{ active: activeBasemap === 'topo' }"
              @click="changeBasemap('topo')"
            >
              <div class="basemap-thumb topo-thumb"></div>
              <span>Topografi</span>
            </div>
          </div>
        </div>

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
import { onMounted, reactive, ref } from 'vue';
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

// State untuk Basemap Switcher
const activeBasemap = ref('osm');

// Objek untuk menyimpan referensi layer
const basemapLayers = {};
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

  // 1. Definisi Pilihan Basemap
  basemapLayers.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  });

  basemapLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });

  basemapLayers.topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)'
  });

  // Set default basemap ke OSM
  basemapLayers.osm.addTo(map);

  // 2. Buat Layer Kosong terlebih dahulu dan masukkan ke objek mapLayers
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
      
      // Buat Popup seperti biasa
      layer.bindPopup(`<b>${namaFasum}</b>`); 
      
      // Tambahkan aksi klik (Click Event)
      layer.on('click', () => {
        // Update variabel reaktif dengan nama dan cari fotonya di kamus
        lokasiTerpilih.nama = namaFasum;
        lokasiTerpilih.gambar = fotoFasilitas[namaFasum] || 'https://via.placeholder.com/400x300?text=Foto+Tidak+Tersedia'; 
      });
    }
  }).addTo(map);

  // 3. Ambil Data dari API Backend
  fetch('http://localhost:3000/api/candi/area')
    .then(r => r.json())
    .then(d => { 
        mapLayers.area.addData(d); 
        mapLayers.area.bringToBack(); 
        if(d.features?.length) map.fitBounds(mapLayers.area.getBounds()); 
    })
    .catch(e=>console.log(e));
  
  fetch('http://localhost:3000/api/candi/jalan')
    .then(r => r.json())
    .then(d => { 
        mapLayers.jalan.addData(d); 
        mapLayers.jalan.bringToFront(); 
    })
    .catch(e=>console.log(e));
  
  fetch('http://localhost:3000/api/candi/fasum')
    .then(r => r.json())
    .then(d => { 
        mapLayers.fasum.addData(d); 
    })
    .catch(e=>console.log(e));
});

// Fungsi untuk mengganti Basemap
const changeBasemap = (type) => {
  if (!map) return;

  // Hapus semua basemap yang ada dari peta
  Object.values(basemapLayers).forEach(layer => map.removeLayer(layer));
  
  // Tambahkan basemap yang dipilih
  basemapLayers[type].addTo(map);
  activeBasemap.value = type;
};

// Fungsi yang dipanggil saat checkbox Layer di-klik
const toggleLayer = (layerName) => {
  if (!map || !mapLayers[layerName]) return;
  
  if (layersState[layerName]) {
    map.addLayer(mapLayers[layerName]); // Jika dicentang, tampilkan di peta
  } else {
    map.removeLayer(mapLayers[layerName]); // Jika tidak, hapus dari peta
  }
};
</script>

<style 
src="../assets/map.css" scoped>
</style>