<template>
  <div class="hbim-layout modern-dark">
    <div class="fixed-bg"></div>

    <nav class="map-navbar">
      <div class="logo" @click="$router.push('/')" style="cursor: pointer;">
        CANDI<span>SELOGRIYO</span>
      </div>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link :to="{ path: '/', query: { tab: 'about', sub: 'sejarah' } }">About</router-link></li>
        <li><router-link to="/map">Map WebGIS</router-link></li>
        <li><router-link to="/hbim" class="active">3D HBIM</router-link></li>
      </ul>
    </nav>

    <div class="main-content">
      
      <aside class="sidebar glass-panel">
        <div class="sidebar-section">
          <h3 class="section-title">Informasi Model 3D</h3>
          <p class="model-desc">
            Visualisasi Heritage Building Information Modeling (HBIM) Candi Selogriyo. 
            Gunakan mouse atau layar sentuh Anda untuk memutar, menggeser, dan memperbesar model secara interaktif.
          </p>
        </div>
        
        <div class="sidebar-section info-section">
          <h3 class="section-title">Metadata</h3>
          <ul class="metadata-list">
            <li><strong>Metode:</strong> Photogrammetry / TLS</li>
            <li><strong>Akurasi:</strong> &plusmn; 5 cm</li>
            <li><strong>Resolusi Tekstur:</strong> 4K UHD</li>
            <li><strong>Sistem Koordinat:</strong> WGS 84</li>
          </ul>
        </div>
      </aside>

      <div class="viewer-wrapper">
        <iframe 
        <iframe title="Selogriyo" 
            src="https://ion.cesium.com/stories/viewer/?id=7a12beb4-0646-46b1-9f87-a555b90331f4" 
            frameborder="0" 
            allow="fullscreen" 
            allowfullscreen="true" 
            webkitallowfullscreen="true" 
            mozallowfullscreen="true" 
            class="cesium-iframe">
        </iframe>
      </div>

    </div>
  </div>
</template>

<script setup>
// Tidak perlu banyak logika script di sini jika menggunakan iframe murni
</script>

<style scoped>
/* === THEME SETUP (Menyesuaikan map.vue) === */
.modern-dark {
  background-color: #0a0a0c;
  color: #ececec;
  font-family: 'Inter', sans-serif;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fixed-bg {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  z-index: -2; background-image: url('https://asset.kompas.com/crops/WmP-rjiGZWBAuHZ4ABwO-NCkzg0=/0x0:996x664/1200x800/data/photo/2022/07/27/62e1554e3d8e6.jpg');
  background-size: cover; background-position: center; filter: brightness(0.2) blur(5px);
}

/* === NAVBAR === */
.map-navbar {
  height: 70px; flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
  padding: 0 5vw; background: rgba(15, 15, 17, 0.85); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05); z-index: 1000;
}
.logo { font-size: 1.1rem; font-weight: 800; color: #fff; text-transform: uppercase; }
.logo span { color: #888; font-weight: 400; }
.nav-links { display: flex; gap: 20px; list-style: none; }
.nav-links a { text-decoration: none; color: #a0a0a0; font-size: 0.85rem; font-weight: 500; transition: 0.3s; }
.nav-links a.active, .nav-links a:hover { color: #fff; }

/* === MAIN CONTENT === */
.main-content { padding-top: 70px; display: flex; flex: 1; position: relative; overflow: hidden; }

/* === VIEWER WRAPPER (Kiri) === */
.viewer-wrapper { flex: 1; position: relative; background: #000; display: flex; }
.cesium-iframe { width: 100%; height: 100%; border: none; }

/* === SIDEBAR (Kanan) === */
.sidebar {
  width: 320px; height: 100%; background: rgba(10, 10, 12, 0.8); backdrop-filter: blur(30px);
  border-left: 1px solid rgba(255, 255, 255, 0.05); padding: 25px;
  display: flex; flex-direction: column; gap: 25px; overflow-y: auto; z-index: 100;
}
.section-title { font-size: 0.75rem; text-transform: uppercase; color: #888; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px; }
.model-desc { font-size: 0.9rem; color: #ccc; line-height: 1.6; text-align: justify; }
.metadata-list { list-style: none; padding: 0; font-size: 0.85rem; color: #aaa; }
.metadata-list li { margin-bottom: 12px; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
.metadata-list li strong { color: #2ab5a5; display: block; margin-bottom: 4px; font-size: 0.75rem; text-transform: uppercase; }
</style>