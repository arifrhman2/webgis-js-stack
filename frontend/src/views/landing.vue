<template>
  <div class="modern-landing">
    
    <div class="fixed-bg" :style="{ filter: bgFilter }"></div>
    <canvas id="fluid-bg" ref="canvasRef"></canvas>

    <nav :class="{ scrolled: isScrolled }">
      <div class="logo" @click="activeTab = 'home'" style="cursor: pointer;">
        CANDI<span>SELOGRIYO</span>
      </div>
      <ul class="nav-links">
        <li><a href="#" :class="{ active: activeTab === 'home' }" @click.prevent="activeTab = 'home'">Home</a></li>
        <li><a href="#" :class="{ active: activeTab === 'about' }" @click.prevent="activeTab = 'about'">About</a></li>
        <li><router-link to="/map">Map WebGIS</router-link></li>
        <li><router-link to="/hbim">3D HBIM</router-link></li>
      </ul>
    </nav>

    <div v-show="activeTab === 'home'" class="tab-fade">
      <section id="home-hero">
        <div class="badge reveal">Digital Temple</div>
        <h1 class="reveal delay-1">Candi Selogriyo</h1>
        <p class="hero-desc reveal delay-2">Menyelaraskan data geospasial dengan model arsitektur 3D candi bersejarah. Presisi data dalam genggaman.</p>
        <div class="reveal delay-2" style="display: flex; justify-content: center; gap: 15px;">
          <button @click="$router.push('/map')" class="btn">Mulai Eksplorasi</button>
          <button @click="activeTab = 'about'" class="btn btn-outline">Dokumentasi</button>
        </div>
      </section>

      <section id="webgis">
        <div class="glass-panel content-grid reveal">
          <div class="text-content">
            <h2>WebGIS Engine</h2>
            <p>Visualisasi spasial. Jelajahi peta interaktif Candi Selogriyo dengan fitur layer dinamis, rute akses, dan titik fasilitas umum secara presisi.</p>
            <div><button @click="$router.push('/map')" class="btn" style="padding: 10px 24px; font-size: 0.85rem;">Buka Peta Interaktif</button></div>
          </div>
          <div class="visual-container"><span style="font-size: 80px;">🗺️</span></div>
        </div>
      </section>

      <section id="hbim">
        <div class="glass-panel content-grid reverse reveal" style="margin-bottom: 100px;">
          <div class="text-content">
            <h2>3D HBIM Viewer</h2>
            <p>Penampil lanskap candi dan model warisan yang elegan. Render struktur historis langsung di dalam browser dengan dukungan integrasi metadata secara mendalam.</p>
            <div><button @click="$router.push('/hbim')" class="btn" style="padding: 10px 24px; font-size: 0.85rem;">Buka 3D HBIM</button></div>
          </div>
          <div class="visual-container"><span style="font-size: 80px;">🏛️</span></div>
        </div>
      </section>
    </div>

    <div v-show="activeTab === 'about'" class="tab-fade page-wrapper">
      
      <header id="about-header" class="fade-in-up">
        <div class="badge">Eksplorasi Wisata</div>
        <h1>Harmoni Warisan</h1>
        <p>Menjelajahi dokumentasi spasial Candi Selogriyo. Integrasi data historis, topografi alam.</p>
      </header>

      <div class="about-nav fade-in-up delay-1">
        <button :class="{ active: aboutTab === 'sejarah' }" @click="aboutTab = 'sejarah'">Sejarah</button>
        <button :class="{ active: aboutTab === 'pesona' }" @click="aboutTab = 'pesona'">Pesona Candi</button>
        <button :class="{ active: aboutTab === 'akses' }" @click="aboutTab = 'akses'">Akses Lokasi</button>
        <button :class="{ active: aboutTab === 'fasilitas' }" @click="aboutTab = 'fasilitas'">Fasilitas</button>
        <button :class="{ active: aboutTab === 'qna' }" @click="aboutTab = 'qna'">QnA</button>
      </div>

      <div class="about-body">

        <div v-show="aboutTab === 'sejarah'" class="fade-in-up">
          <div class="glass-panel history-panel">
            <div class="history-text">
              <h3>Peninggalan Arkeologis di Tengah Bukit</h3>
              <p>Candi Selogriyo, yang terletak di atas perbukitan di Jawa Tengah, merupakan peninggalan arkeologis yang menarik. Penemuan kembali candi ini pertama kali dilaporkan pada tahun 1835 oleh Hartman, Residen Kedu saat itu, dan didokumentasikan dalam buku ROC (Rappoertan van de Oudheidkundige Commissie in Nederlandsch-Indië) tahun 1912. Namun, karena lokasinya yang terpencil, temuan ini kurang mendapatkan perhatian hingga tahun 1876 ketika R.H. Freederich mengunjungi dan mendeskripsikan arca-arca yang ditemukan di sana.</p>
              <p>Pada tanggal 1 Januari 1999, musibah besar terjadi. Hujan berkepanjangan menyebabkan tanah penyangga longsor, membawa runtuh hampir tiga perempat bagian candi ke dasar bukit. Perdebatan pun muncul antara merelokasi candi atau mempertahankan keaslian lokasinya sebagai warisan budaya.</p>
              <p>Pada tanggal 1 Januari 1999, musibah besar terjadi. Hujan berkepanjangan menyebabkan tanah penyangga longsor, membawa runtuh hampir tiga perempat bagian candi ke dasar bukit. Perdebatan pun muncul antara merelokasi candi atau mempertahankan keaslian lokasinya sebagai warisan budaya.</p>
              <p>Pada tanggal 1 Januari 1999, musibah besar terjadi. Hujan berkepanjangan menyebabkan tanah penyangga longsor, membawa runtuh hampir tiga perempat bagian candi ke dasar bukit. Perdebatan pun muncul antara merelokasi candi atau mempertahankan keaslian lokasinya sebagai warisan budaya.</p>

            </div>
            <div class="history-images">
              <img src="https://images.unsplash.com/photo-1596404550005-0158dc035ee5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Pemugaran 1955">
              <img src="https://images.unsplash.com/photo-1620216599723-95244588e151?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Pasca Longsor 1999" style="margin-top: 40px;">
              <img src="https://images.unsplash.com/photo-1596404550005-0158dc035ee5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Pemugaran 1955">
              <img src="https://images.unsplash.com/photo-1620216599723-95244588e151?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Pasca Longsor 1999" style="margin-top: 40px;">
              <img src="https://images.unsplash.com/photo-1596404550005-0158dc035ee5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Pemugaran 1955">
              <img src="https://images.unsplash.com/photo-1620216599723-95244588e151?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Pasca Longsor 1999" style="margin-top: 40px;">
            </div>
          </div>
        </div>
        
        <div v-show="aboutTab === 'pesona'" class="fade-in-up">
          <h2 class="section-title">Pesona Wisata Cagar Budaya</h2>
          <p style="text-align: center; color: #aaa; margin-bottom: 40px; max-width: 700px; margin-inline: auto;">
            Sebuah candi yang tidak biasa dengan pemandangan perbukitan dan persawahan yang memukau di lereng Gunung Sumbing.
          </p>
          <div class="gallery-grid">
            <div class="gallery-item">
              <img src="https://images.unsplash.com/photo-1596404551139-497746193798?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Awal Masuk">
              <div class="gallery-overlay">
                <h3>Awal Masuk Kawasan</h3>
                <p>Disambut suasana pedesaan yang asri dan tenang dengan fasilitas dasar.</p>
              </div>
            </div>
            <div class="gallery-item delay-1">
              <img src="https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Perjalanan">
              <div class="gallery-overlay">
                <h3>Perjalanan Menuju Candi</h3>
                <p>Melintasi sawah terasering hijau dan pepohonan rindang nan sejuk.</p>
              </div>
            </div>
            <div class="gallery-item delay-2">
              <img src="https://images.unsplash.com/photo-1616035824982-f5f142b781a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Tiba di Candi">
              <div class="gallery-overlay">
                <h3>Kemegahan Candi</h3>
                <p>Berdiri kokoh di tengah alam hijau dengan arsitektur corak Hindu.</p>
              </div>
            </div>
          </div>
        </div>

        <div v-show="aboutTab === 'akses'" class="fade-in-up">
          <h2 class="section-title">Rute & Aksesibilitas</h2>
          <p style="text-align: center; color: #aaa; margin-bottom: 40px; max-width: 700px; margin-inline: auto;">
            Dari pusat kota Magelang, berkendara 30-40 menit melewati permukiman dan persawahan. Jalur sempit dan menanjak dengan jalan paving beton 4 meter.
          </p>
          <div class="facilities-grid" style="grid-template-columns: 1fr 1fr; max-width: 900px; margin: 0 auto;">
            <div class="glass-panel facility-card">
              <div class="icon-text">🚗 MOBIL</div>
              <h3>Parkir Permukiman</h3>
              <p>Hanya dapat membawa kendaraan sampai pada area parkir di sekitar permukiman warga. Dilanjutkan dengan berjalan kaki (tracking) menikmati pemandangan alam.</p>
            </div>
            <div class="glass-panel facility-card">
              <div class="icon-text">🏍️ MOTOR</div>
              <h3>Parkir Atas</h3>
              <p>Kendaraan roda dua dapat dibawa naik lebih jauh hingga ke area parkir yang berlokasi jauh lebih dekat dengan kompleks candi utama.</p>
            </div>
          </div>
        </div>

        <div v-show="aboutTab === 'fasilitas'" class="fade-in-up">
          <h2 class="section-title">Infrastruktur Kawasan</h2>
          <div class="facilities-grid">
            <div class="glass-panel facility-card">
              <div class="icon-text">01</div><h3>Pusat Informasi & Loket</h3><p>Area penyambutan tamu dan pembelian tiket masuk resmi.</p>
            </div>
            <div class="glass-panel facility-card">
              <div class="icon-text">02</div><h3>Area Ibadah</h3><p>Masjid dan Musholla terdekat yang dapat diakses pengunjung.</p>
            </div>
            <div class="glass-panel facility-card">
              <div class="icon-text">03</div><h3>Gazebo Panorama</h3><p>Titik istirahat untuk menikmati hamparan sawah dan lembah.</p>
            </div>
            <div class="glass-panel facility-card">
              <div class="icon-text">04</div><h3>Sanitasi (Toilet)</h3><p>Fasilitas kebersihan umum yang terawat di area strategis.</p>
            </div>
            <div class="glass-panel facility-card" style="grid-column: span 2;">
              <div class="icon-text">05</div><h3>Zona Parkir Terpadu</h3><p>Pembagian area parkir roda empat di bawah (permukiman) dan roda dua di area atas untuk menjaga kondusivitas jalur tracking.</p>
            </div>
          </div>
        </div>

        <div v-show="aboutTab === 'qna'" class="fade-in-up">
          <h2 class="section-title">Pertanyaan Umum</h2>
          <div class="facilities-grid" style="grid-template-columns: 1fr;">
            <div class="glass-panel facility-card" style="display: flex; gap: 20px; align-items: flex-start;">
              <div class="icon-text" style="margin-bottom: 0;">⏰ WAKTU</div>
              <div>
                <h3>Kapan Candi Selogriyo dibuka untuk wisata?</h3>
                <p>Kawasan cagar budaya ini buka setiap hari, mulai pukul <strong>08.00 hingga 16.00 WIB</strong>.</p>
              </div>
            </div>
            <div class="glass-panel facility-card" style="display: flex; gap: 20px; align-items: flex-start;">
              <div class="icon-text" style="margin-bottom: 0;">🎟️ TIKET</div>
              <div>
                <h3>Berapa harga tiket masuk resmi kawasan?</h3>
                <p>Wisatawan Domestik: <strong>Rp 7.000</strong> <br> Wisatawan Mancanegara: <strong>Rp 25.000</strong></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// State Tabs
const activeTab = ref('home');
const aboutTab = ref('sejarah');

// State Scroll & Blur
const isScrolled = ref(false);
const bgFilter = ref('brightness(0.35) blur(0px)');
const canvasRef = ref(null);
let animationFrameId = null;

// Handle Scroll for Blur & Navbar
const handleScroll = () => {
  const scrollPos = window.scrollY;
  isScrolled.value = scrollPos > 50;
  
  // Efek blur dinamis maksimal 12px
  const fadePoint = window.innerHeight * 0.6; 
  let blurValue = scrollPos > fadePoint ? 12 : (scrollPos / fadePoint) * 12;
  bgFilter.value = `brightness(0.35) blur(${blurValue}px)`;
};

// Canvas Fluid Background Animation
const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  class Blob {
    constructor() {
      this.x = Math.random() * width; this.y = Math.random() * height; 
      this.r = Math.random() * 300 + 150; 
      this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
      const tones = ['rgba(40, 40, 45, 0.6)', 'rgba(60, 60, 65, 0.4)', 'rgba(20, 20, 25, 0.8)'];
      this.color = tones[Math.floor(Math.random() * tones.length)];
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -this.r || this.x > width + this.r) this.vx *= -1;
      if (this.y < -this.r || this.y > height + this.r) this.vy *= -1;
    }
    draw() { 
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); 
      ctx.fillStyle = this.color; ctx.fill(); 
    }
  }

  const blobs = Array.from({ length: 4 }, () => new Blob());
  const animateBg = () => {
    ctx.clearRect(0, 0, width, height);
    blobs.forEach(b => { b.update(); b.draw(); });
    animationFrameId = requestAnimationFrame(animateBg);
  };
  animateBg();
};

// Intersection Observer for Reveal Animation
const initObserver = () => {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => { 
      if (entry.isIntersecting) { 
        entry.target.classList.add('active'); 
        obs.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.15 });

  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.active)').forEach(el => observer.observe(el));
  }, 100);
};

onMounted(() => {
  if (route.query.tab) activeTab.value = route.query.tab;
  if (route.query.sub) aboutTab.value = route.query.sub;

  window.addEventListener('scroll', handleScroll);
  
  nextTick(() => {
    initCanvas();
    initObserver();
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
});
</script>

<style
src="../assets/landing.css"
</style>