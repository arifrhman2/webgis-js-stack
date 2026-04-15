<template>
  <div class="map-layout modern-dark">
    <div class="fixed-bg"></div>

    <nav :class="{ scrolled: true }">
      <div class="logo" @click="$router.push('/')" style="cursor: pointer;">
        CANDI<span>SELOGRIYO</span>
      </div>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link :to="{ path: '/', query: { tab: 'about', sub: 'sejarah' } }">About</router-link></li>
        <li><router-link to="/map" class="active">Map WebGIS</router-link></li>
      </ul>
    </nav>

    <div class="main-content">
      <aside class="sidebar glass-panel">
        
        <div class="sidebar-section">
          <h3 class="section-title">Pilih Basemap</h3>
          <div class="basemap-grid">
            <div 
              v-for="(label, type) in basemapOptions" 
              :key="type"
              class="basemap-card" 
              :class="{ active: activeBasemap === type }"
              @click="changeBasemap(type)"
            >
              <div class="basemap-thumb" :class="type + '-thumb'"></div>
              <span>{{ label }}</span>
            </div>
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="section-title">Layer Peta</h3>
          <div class="layer-list">
            <div class="layer-item-wrapper" v-for="(val, key) in layersConfig" :key="key">
              <label class="custom-checkbox">
                <input type="checkbox" v-model="layersState[key]" @change="toggleLayer(key)" />
                <span class="checkmark"></span>
                <span class="layer-label">{{ val.label }}</span>
              </label>
              <div class="legend-box fade-in" v-if="layersState[key]">
                <div class="legend-indicator" :style="{ background: val.color, border: val.border }"></div>
                <span>{{ val.legend }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-section visual-section">
          <h3 class="section-title">Visual / Gambar</h3>
          <div class="image-display-container">
            <div v-if="!lokasiTerpilih.gambar" class="placeholder-text">
              Pilih fitur pada peta untuk memuat data visual
            </div>
            <div v-else class="image-wrapper fade-in">
              <img :src="lokasiTerpilih.gambar" alt="Preview" />
              <div class="image-caption">{{ lokasiTerpilih.nama }}</div>
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

// Fix Leaflet Default Icon
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

// State
const activeBasemap = ref('osm');
const layersState = reactive({ area: true, jalan: true, fasum: true });
const lokasiTerpilih = reactive({ nama: '', gambar: '' });

const basemapOptions = { osm: 'Jalanan', satellite: 'Satelit', topo: 'Topografi' };
const layersConfig = {
  area: { label: 'Zona Kawasan', legend: 'Area Poligon', color: '#ffbd3399', border: '2px solid #ff7800' },
  jalan: { label: 'Jalan & Akses', legend: 'Garis Rute', color: '#007bff', border: 'none' },
  fasum: { label: 'Fasilitas Umum', legend: 'Titik Lokasi', color: '#fff', border: '1px solid #ccc' }
};

let map = null;
const mapLayers = {};
const basemapLayers = {};

const fotoFasilitas = {
  "Loket Entrance": "https://via.placeholder.com/400x300/1e1e22/ececec?text=Loket+Entrance",
  "Toilet": "https://via.placeholder.com/400x300/1e1e22/ececec?text=Toilet"
};

onMounted(() => {
  map = L.map('map', { zoomControl: false }).setView([-7.4, 110.2], 14);
  L.control.zoom({ position: 'topright' }).addTo(map);

  // Basemaps
  basemapLayers.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  basemapLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
  basemapLayers.topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
  basemapLayers.osm.addTo(map);

  // GeoJSON Layers Setup
  initGeoLayers();
});

const initGeoLayers = () => {
  mapLayers.area = L.geoJSON(null, {
    style: { color: "#ff7800", weight: 2, fillColor: "#ffbd33", fillOpacity: 0.3 },
  }).addTo(map);

  mapLayers.jalan = L.geoJSON(null, {
    style: { color: "#007bff", weight: 3, opacity: 0.8 }
  }).addTo(map);

  mapLayers.fasum = L.geoJSON(null, {
    onEachFeature: (feature, layer) => {
      const nama = feature.properties.nama_fasum || 'Fasilitas';
      layer.on('click', () => {
        lokasiTerpilih.nama = nama;
        lokasiTerpilih.gambar = fotoFasilitas[nama] || 'https://via.placeholder.com/400x300/1e1e22/ececec?text=No+Image';
      });
    }
  }).addTo(map);

  // Load Data
  fetch('http://localhost:3000/api/candi/area').then(r => r.json()).then(d => { mapLayers.area.addData(d); map.fitBounds(mapLayers.area.getBounds()); });
  fetch('http://localhost:3000/api/candi/jalan').then(r => r.json()).then(d => mapLayers.jalan.addData(d));
  fetch('http://localhost:3000/api/candi/fasum').then(r => r.json()).then(d => mapLayers.fasum.addData(d));
};

const changeBasemap = (type) => {
  Object.values(basemapLayers).forEach(l => map.removeLayer(l));
  basemapLayers[type].addTo(map);
  activeBasemap.value = type;
};

const toggleLayer = (name) => {
  layersState[name] ? map.addLayer(mapLayers[name]) : map.removeLayer(mapLayers[name]);
};
</script>

<style
src="../assets/map.css"
</style>