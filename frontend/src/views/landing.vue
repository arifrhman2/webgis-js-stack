<template>
  <div class="landing-page">
    <nav>
      <div class="nav-brand" @click="activeTab = 'home'">
        <span class="ico">🏛️</span>
        <span>CANDI SELOGRIYO</span>
      </div>
      <ul class="nav-links">
        <li><a :class="{ active: activeTab === 'home' }" @click="activeTab = 'home'">🏠 Home</a></li>
        <li><a :class="{ active: activeTab === 'about' }" @click="activeTab = 'about'">ℹ️ About</a></li>
        <li><router-link to="/map">📍 Map</router-link></li>
        <li><a :class="{ active: activeTab === 'hbim' }" @click="activeTab = 'hbim'">✨ HBIM 3D</a></li>
        <li><a :class="{ active: activeTab === 'aboutus' }" @click="activeTab = 'aboutus'">👤 About Us</a></li>
      </ul>
    </nav>

    <div v-if="activeTab === 'home'" class="page-content">
      <section class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Selogriyo Temple</h1>
          <div class="hero-box">Selamat datang di <em>Web Experience</em></div>
        </div>
      </section>
    </div>

    <div v-if="activeTab === 'about'" class="page-content">
      <h2>Tentang Candi Selogriyo</h2>
    </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'

// Logic untuk tab internal di Landing Page
const activeTab = ref('home')
</script>

<style scoped>
/* Paste seluruh CSS dari file HTML aslimu di sini */
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200;
  display: flex;
  background: rgba(255,255,255,0.97);
}
/* ... CSS lainnya ... */
</style>