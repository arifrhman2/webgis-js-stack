<template>
  <div class="map-layout modern-dark">
    <div class="fixed-bg"></div>
    <canvas id="fluid-bg" ref="canvasRef"></canvas>

    <nav class="map-navbar">
      <div class="logo" @click="$router.push('/')" style="cursor: pointer;">
        CANDI<span>SELOGRIYO</span>
      </div>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link :to="{ path: '/', query: { tab: 'about', sub: 'sejarah' } }">About</router-link></li>
        <li><router-link to="/map" class="active">Map WebGIS</router-link></li>
        <li><router-link to="/hbim">3D HBIM</router-link></li>
      </ul>
    </nav>

    <div class="main-content">
      <aside class="sidebar glass-panel" :class="{ 'closed': !isSidebarOpen }">
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

      <div class="map-wrapper">
        <button class="toggle-sidebar-btn" @click="toggleSidebar" :title="isSidebarOpen ? 'Sembunyikan Sidebar' : 'Tampilkan Sidebar'">
          <span :class="{ 'rotate': !isSidebarOpen }">◀</span>
        </button>

        <div id="map" class="map-container"></div>
        
        <div class="floating-basemap-switcher">
          <div class="basemap-grid">
            <div 
              v-for="(label, type) in basemapOptions" :key="type"
              class="basemap-card" :class="{ active: activeBasemap === type }"
              @click="changeBasemap(type)"
            >
              <div class="basemap-thumb" :class="type + '-thumb'"></div>
              <span>{{ label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, reactive, ref, nextTick } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const canvasRef = ref(null);
let animationFrameId = null;
const isSidebarOpen = ref(true);
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

const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
  window.addEventListener('resize', resize); resize();

  class Blob {
    constructor() {
      this.x = Math.random() * w; this.y = Math.random() * h; this.r = Math.random() * 200 + 100;
      this.vx = (Math.random() - 0.5) * 0.4; this.vy = (Math.random() - 0.5) * 0.4;
      this.color = 'rgba(40, 40, 45, 0.4)';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -this.r || this.x > w + this.r) this.vx *= -1;
      if (this.y < -this.r || this.y > h + this.r) this.vy *= -1;
    }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = this.color; ctx.fill(); }
  }
  const blobs = Array.from({ length: 5 }, () => new Blob());
  const animate = () => {
    ctx.clearRect(0, 0, w, h);
    blobs.forEach(b => { b.update(); b.draw(); });
    animationFrameId = requestAnimationFrame(animate);
  };
  animate();
};

onMounted(() => {
  map = L.map('map', { zoomControl: false }).setView([-7.4, 110.2], 14);
  L.control.zoom({ position: 'bottomleft' }).addTo(map);

  basemapLayers.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
  basemapLayers.satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}');
  basemapLayers.topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
  basemapLayers.osm.addTo(map);

  initGeoLayers();
  initCanvas();
});

const initGeoLayers = () => {
  mapLayers.area = L.geoJSON(null, { style: { color: "#ff7800", weight: 2, fillColor: "#ffbd33", fillOpacity: 0.3 } }).addTo(map);
  mapLayers.jalan = L.geoJSON(null, { style: { color: "#007bff", weight: 3, opacity: 0.8 } }).addTo(map);
  mapLayers.fasum = L.geoJSON(null, {
    onEachFeature: (f, l) => {
      const n = f.properties.nama_fasum || 'Fasilitas';
      l.on('click', () => { lokasiTerpilih.nama = n; lokasiTerpilih.gambar = fotoFasilitas[n] || 'https://via.placeholder.com/400x300/1e1e22/ececec?text=No+Image'; });
    }
  }).addTo(map);

  fetch('http://localhost:3000/api/candi/area').then(r => r.json()).then(d => { mapLayers.area.addData(d); map.fitBounds(mapLayers.area.getBounds()); });
  fetch('http://localhost:3000/api/candi/jalan').then(r => r.json()).then(d => mapLayers.jalan.addData(d));
  fetch('http://localhost:3000/api/candi/fasum').then(r => r.json()).then(d => mapLayers.fasum.addData(d));
};

const changeBasemap = (t) => { Object.values(basemapLayers).forEach(l => map.removeLayer(l)); basemapLayers[t].addTo(map); activeBasemap.value = t; };
const toggleLayer = (n) => layersState[n] ? map.addLayer(mapLayers[n]) : map.removeLayer(mapLayers[n]);
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; setTimeout(() => map && map.invalidateSize(), 350); };

onBeforeUnmount(() => { if (animationFrameId) cancelAnimationFrame(animationFrameId); });
</script>

<style scoped>
/* === THEME SETUP === */
.modern-dark {
  background-color: #0a0a0c;
  color: #ececec;
  font-family: 'Inter', sans-serif;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column; /* NAVBAR DI ATAS, CONTENT DI BAWAH */
  overflow: hidden;
}

/* === BACKGROUNDS === */
.fixed-bg {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  z-index: -2; background-image: url('https://asset.kompas.com/crops/WmP-rjiGZWBAuHZ4ABwO-NCkzg0=/0x0:996x664/1200x800/data/photo/2022/07/27/62e1554e3d8e6.jpg');
  background-size: cover; background-position: center; filter: brightness(0.2) blur(5px);
}
#fluid-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; opacity: 0.3; pointer-events: none; }

/* === NAVBAR (Fixed dihapus agar tidak overlay) === */
.map-navbar {
  height: 54px; 
  display: flex; 
  align-items: center; 
  justify-content: space-between;
  padding: 0 5vw; 
  background: rgba(15, 15, 17, 0.85); 
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
  z-index: 1000;
  flex-shrink: 0; /* Mencegah navbar mengecil */
}
.logo { font-size: 1.1rem; font-weight: 800; color: #fff; text-transform: uppercase; }
.logo span { color: #888; font-weight: 400; }
.nav-links { display: flex; gap: 20px; list-style: none; }
.nav-links a { text-decoration: none; color: #a0a0a0; font-size: 0.85rem; font-weight: 500; transition: 0.3s; }
.nav-links a.active, .nav-links a:hover { color: #fff; }

/* === MAIN CONTENT LAYOUT === */
.main-content { 
  display: flex; 
  padding-top: 54px; /* Memberi ruang untuk navbar */
  flex: 1; /* Mengambil sisa layar di bawah navbar */
  position: relative;
  overflow: hidden; 
}

/* === SIDEBAR === */
.sidebar {
  width: 320px;
  height: 100%; /* Mengisi penuh tinggi main-content */
  background: rgba(10, 10, 12, 0.8);
  backdrop-filter: blur(30px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  z-index: 100;
  transition: all 0.3s ease;
}
.sidebar.closed { margin-left: -320px; opacity: 0; }
.section-title { font-size: 0.75rem; text-transform: uppercase; color: #888; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }

/* === MAP AREA === */
.map-wrapper { flex: 1; position: relative; }
.map-container { width: 100%; height: 100%; background: #000; }

.toggle-sidebar-btn {
  position: absolute; top: 300px; left: 0px; z-index: 1001;
  background: rgba(20, 20, 25, 0.8); backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1); color: white;
  width: 17px; height: 35px; border-radius: 6px; cursor: pointer;
}
.toggle-sidebar-btn span { transition: 0.3s; display: block; }
.toggle-sidebar-btn span.rotate { transform: rotate(180deg); }

/* === FLOATING BASEMAP === */
.floating-basemap-switcher {
  position: absolute; bottom: 25px; right: 25px; z-index: 1001;
  background: rgba(15, 15, 17, 0.8); backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1); padding: 12px; border-radius: 12px;
}
.basemap-grid { display: flex; gap: 10px; }
.basemap-card { cursor: pointer; text-align: center; width: 65px; }
.basemap-thumb { height: 40px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 5px; background-size: cover; }
.basemap-card span { font-size: 0.6rem; color: #aaa; font-weight: 600; }
.basemap-card.active .basemap-thumb { border-color: #2ab5a5; }

.osm-thumb { background-image: url('https://a.tile.openstreetmap.org/14/8641/5691.png'); }
.satellite-thumb { background-image: url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/14/9110/12918'); }
.topo-thumb { background-image: url('https://a.tile.opentopomap.org/14/8641/5691.png'); }

/* === LAYER ITEMS & CHECKBOX === */
.layer-list { 
  display: flex; 
  flex-direction: column; 
  gap: 20px; /* Memberikan jarak antar menu layer */
}
.layer-item-wrapper {
  display: flex;
  flex-direction: column;
}

/* Custom Checkbox */
.custom-checkbox { 
  display: flex; 
  align-items: center; 
  cursor: pointer; 
  font-size: 0.9rem; 
  color: #ececec;
}
.custom-checkbox input { display: none; }
.checkmark { 
  height: 18px; 
  width: 18px; 
  background: rgba(255,255,255,0.05); 
  border: 1px solid rgba(255,255,255,0.2); 
  border-radius: 4px; 
  margin-right: 12px; 
  transition: 0.2s;
}
.custom-checkbox input:checked ~ .checkmark { 
  background: #2ab5a5; 
  border-color: #2ab5a5; 
}

/* Kotak Legenda (Perbaikan Posisi) */
.legend-box { 
  margin-left: 30px; /* Menggeser teks legenda agar sejajar dengan teks checkbox */
  margin-top: 8px; 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  font-size: 0.75rem; 
  color: #aaa; 
}
.legend-indicator { 
  width: 14px; 
  height: 14px; 
  border-radius: 3px; 
  display: inline-block; 
  flex-shrink: 0;
}

/* Visual Container */
.image-display-container { background: rgba(0,0,0,0.4); border-radius: 12px; height: 200px; overflow: hidden; position: relative; }
.image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
.image-caption { position: absolute; bottom: 0; width: 100%; padding: 10px; background: rgba(0,0,0,0.8); font-size: 0.8rem; }

/* Leaflet Override */
:deep(.leaflet-control-zoom) { margin: 15px !important; border: none !important; }
:deep(.leaflet-control-zoom-in), :deep(.leaflet-control-zoom-out) { 
  background: rgba(25, 25, 30, 0.8) !important; color: white !important; backdrop-filter: blur(10px); 
  border: 1px solid rgba(255,255,255,0.1) !important; 
}
</style>