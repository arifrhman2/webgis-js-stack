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

<style scoped>
/* === THEME SETUP === */
.modern-dark {
  background-color: #0a0a0c;
  color: #ececec;
  font-family: 'Inter', sans-serif;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fixed-bg {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 0; pointer-events: none;
  background-image: url('https://asset.kompas.com/crops/WmP-rjiGZWBAuHZ4ABwO-NCkzg0=/0x0:996x664/1200x800/data/photo/2022/07/27/62e1554e3d8e6.jpg');
  background-size: cover; background-position: center;
  filter: brightness(0.2) blur(5px);
}

/* === NAVBAR (Glass) === */
nav {
  height: 70px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 5vw; background: rgba(63, 63, 68, 0.7); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05); z-index: 1000;
}
.logo { font-size: 1.1rem; font-weight: 800; color: #fff; letter-spacing: 1px; }
.logo span { color: #888; font-weight: 400; }
.nav-links { display: flex; gap: 20px; list-style: none; }
.nav-links a { text-decoration: none; color: #a0a0a0; font-size: 0.85rem; font-weight: 500; transition: 0.3s; }
.nav-links a.active, .nav-links a:hover { color: #fff; }

/* === MAIN CONTENT LAYOUT === */
.main-content { display: flex; flex: 1; z-index: 1; overflow: hidden; }

/* === SIDEBAR (Modern Glass) === */
.sidebar {
  width: 340px; background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(30px);
  border-right: 1px solid rgba(255, 255, 255, 0.08); padding: 30px;
  display: flex; flex-direction: column; gap: 30px; overflow-y: auto;
}
.section-title { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; color: #888; margin-bottom: 15px; font-weight: 700; }

/* Basemap Switcher */
.basemap-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.basemap-card { cursor: pointer; text-align: center; transition: 0.3s; }
.basemap-thumb { height: 45px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 8px; background-size: cover; }
.basemap-card span { font-size: 0.65rem; color: #aaa; }
.basemap-card.active .basemap-thumb { border-color: #fff; box-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
.basemap-card.active span { color: #fff; }

.osm-thumb { background-image: url('https://a.tile.openstreetmap.org/14/8641/5691.png'); }
.satellite-thumb { background-image: url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/9110/12918'); }
.topo-thumb { background-image: url('https://a.tile.opentopomap.org/14/8641/5691.png'); }

/* Layer Items */
.layer-list { display: flex; flex-direction: column; gap: 18px; }
.custom-checkbox { display: flex; align-items: center; cursor: pointer; font-size: 0.9rem; position: relative; }
.custom-checkbox input { position: absolute; opacity: 0; cursor: pointer; }
.checkmark { height: 18px; width: 18px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; margin-right: 12px; }
.custom-checkbox:hover input ~ .checkmark { border-color: #fff; }
.custom-checkbox input:checked ~ .checkmark { background: #fff; }
.legend-box { margin-left: 30px; margin-top: 8px; display: flex; align-items: center; gap: 10px; font-size: 0.75rem; color: #888; }
.legend-indicator { width: 14px; height: 14px; border-radius: 3px; }

/* Visual Container */
.image-display-container { background: rgba(0,0,0,0.3); border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); height: 220px; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.placeholder-text { font-size: 0.8rem; color: #555; text-align: center; padding: 20px; font-style: italic; }
.image-wrapper img { width: 100%; height: 220px; object-fit: cover; }
.image-caption { position: absolute; bottom: 0; width: 100%; padding: 12px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); font-size: 0.85rem; }

/* Map Area */
.map-container { flex: 1; background: #0a0a0c; }
:deep(.leaflet-bar) { border: none !important; box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important; }
:deep(.leaflet-bar a) { background: rgba(30, 30, 35, 0.8) !important; color: #fff !important; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05) !important; }
:deep(.leaflet-control-attribution) { background: transparent !important; color: #444 !important; }

.fade-in { animation: fadeIn 0.4s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>