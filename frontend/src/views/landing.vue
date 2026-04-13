<template>
  <div class="landing-page">
    <nav>
      <a class="nav-brand" @click="activeTab = 'home'">
        <span class="ico">🏛️</span>
        <span>CANDI SELOGRIYO</span>
      </a>
      <ul class="nav-links">
        <li><a :class="{ active: activeTab === 'home' }" @click="activeTab = 'home'">🏠 Home</a></li>
        <li><a :class="{ active: activeTab === 'about' }" @click="activeTab = 'about'">ℹ️ About</a></li>
        <li><router-link to="/map" class="map-link">📍 Map WebGIS</router-link></li>
      </ul>
    </nav>

    <div v-show="activeTab === 'home'" class="page-content">
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Selogriyo Temple</h1>
          <div class="hero-box">Selamat datang di <em>Web Experience</em></div>
        </div>
      </section>
      
      <section class="explore">
        <h2 class="sec-title">Let's Explore More!</h2>
        <div class="cards">
          <div class="card">
            <div class="card-ph ci1">🏛️</div>
            <div class="card-body">
              <h3 class="card-title">WISATA CANDI</h3>
              <p style="color:#666; font-size: 14px; text-align: center; margin-bottom: 15px;">Pelajari sejarah dan keindahan alam Candi Selogriyo.</p>
              <button class="btn" @click="activeTab = 'about'">Pelajari Sejarah</button>
            </div>
          </div>
          <div class="card">
            <div class="card-ph ci2">🗺️</div>
            <div class="card-body">
              <h3 class="card-title">PETA KAWASAN</h3>
              <p style="color:#666; font-size: 14px; text-align: center; margin-bottom: 15px;">Peta interaktif dengan fasilitas spasial lengkap.</p>
              <button class="btn" @click="$router.push('/map')">Buka Peta Interaktif</button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-show="activeTab === 'about'" class="page-content" style="padding: 120px 50px; text-align: center; min-height: 100vh;">
      <h2 style="font-size: 32px; color: #1e8f82; margin-bottom: 20px;">Sejarah Candi Selogriyo</h2>
      <p style="max-width: 800px; margin: 0 auto; line-height: 1.8; color: #444;">
        Candi Selogriyo, yang terletak di atas perbukitan di Jawa Tengah, merupakan peninggalan arkeologis yang menarik. Penemuan kembali candi ini pertama kali dilaporkan pada tahun 1835. Candi ini memiliki gaya arsitektur Hindu Kedu yang khas dengan ornamen arca dewa-dewi di setiap sisinya.
      </p>
      <button class="btn" style="width: 200px; margin-top: 30px;" @click="activeTab = 'home'">Kembali ke Home</button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('home')
</script>

<style scoped>
/* Desain minimalis agar web-mu langsung rapi */
nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 200;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px; height: 60px; background: rgba(255,255,255,0.97);
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
}
.nav-brand { font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; color: #1e8f82;}
.nav-links { display: flex; gap: 15px; list-style: none; padding: 0; margin: 0;}
.nav-links a { cursor: pointer; text-decoration: none; color: #666; padding: 8px 15px; border-radius: 20px; font-weight: 600; font-size: 14px;}
.nav-links a.active, .map-link:hover { color: #2ab5a5; border: 1.5px solid #2ab5a5; }

.hero { 
  height: 100vh; display: flex; align-items: center; justify-content: center; 
  background: linear-gradient(135deg, #b8d4c8, #8fc0aa); text-align: center; 
}
.hero-title { font-size: 80px; font-weight: bold; margin-bottom: 20px; color: #1a1a1a; }
.hero-box { display: inline-block; background: rgba(255,255,255,0.8); padding: 15px 30px; border-radius: 10px; font-weight: bold; }

.explore { padding: 80px 50px; background: #fff; }
.sec-title { text-align: center; font-size: 32px; color: #1e8f82; margin-bottom: 50px; }
.cards { display: flex; gap: 30px; justify-content: center; flex-wrap: wrap; }
.card { width: 320px; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); overflow: hidden; background: #fff;}
.card-ph { height: 200px; display: flex; align-items: center; justify-content: center; font-size: 60px;}
.ci1 { background: linear-gradient(160deg, #7aaa7a, #3d6b4a); }
.ci2 { background: linear-gradient(160deg, #3a6a4a, #1e4a2e); }
.card-body { padding: 25px; display: flex; flex-direction: column; }
.card-title { text-align: center; margin-bottom: 10px; color: #2c2c2c; }
.btn { width: 100%; padding: 12px; background: #2ab5a5; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn:hover { background: #1e8f82; }
</style>