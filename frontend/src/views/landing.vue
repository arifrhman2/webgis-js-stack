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
      </ul>
    </nav>

    <div v-show="activeTab === 'home'" class="tab-fade">
      
      <section id="home-hero">
        <div class="badge reveal">Digital Temple</div>
        <h1 class="reveal delay-1">Candi Selogriyo</h1>
        <p class="hero-desc reveal delay-2">Menyelaraskan data geospasial dengan model arsitektur 3D candi bersejarah</p>
        <div class="reveal delay-2" style="display: flex; justify-content: center; gap: 15px;">
          <button @click="$router.push('/map')" class="btn">Mulai Eksplorasi</button>
          <button @click="activeTab = 'about'" class="btn btn-outline">Dokumentasi</button>
        </div>
      </section>

      <section id="webgis">
        <div class="glass-panel content-grid reveal">
          <div class="text-content">
            <h2>WebGIS</h2>
            <p>Visualisasi spasial. Jelajahi peta interaktif Candi Selogriyo dengan fitur layer dinamis, rute akses, dan titik fasilitas umum secara presisi.</p>
            <div><button @click="$router.push('/map')" class="btn" style="padding: 10px 24px; font-size: 0.85rem;">Buka Peta Interaktif</button></div>
          </div>
          <div class="visual-container">
            <div class="gallery-item reveal"><img src="C:\Users\arifr\Pictures\Screenshots\Screenshot 2026-04-15 110711.png" alt="WebGIS Map"></div>
          </div>
        </div>
      </section>

      <section id="hbim">
        <div class="glass-panel content-grid reverse reveal">
          <div class="text-content">
            <h2>3D HBIM Viewer</h2>
            <p>Penampil lanskap candi dan model warisan yang elegan. Render struktur historis langsung di dalam browser dengan dukungan integrasi metadata secara mendalam.</p>
            <div><button class="btn btn-outline" style="padding: 10px 24px; font-size: 0.85rem; margin-left: 0;">Segera Hadir</button></div>
          </div>
          <div class="visual-container">
            <span style="font-size: 80px;">🏛️</span>
          </div>
        </div>
      </section>

    </div>

    <div v-show="activeTab === 'about'" class="tab-fade">
      <section id="about-page">
        <div class="glass-panel about-glass">
          
          <div class="about-header reveal">
            <h2>Informasi Wisata & Cagar Budaya</h2>
            <h1>Candi Selogriyo</h1>
          </div>

          <div class="about-nav reveal delay-1">
            <button :class="{ active: aboutTab === 'sejarah' }" @click="aboutTab = 'sejarah'">Sejarah</button>
            <button :class="{ active: aboutTab === 'pesona' }" @click="aboutTab = 'pesona'">Pesona</button>
            <button :class="{ active: aboutTab === 'akses' }" @click="aboutTab = 'akses'">Akses</button>
            <button :class="{ active: aboutTab === 'fasilitas' }" @click="aboutTab = 'fasilitas'">Fasilitas</button>
            <button :class="{ active: aboutTab === 'qna' }" @click="aboutTab = 'qna'">QnA</button>
          </div>

          <div class="about-body reveal delay-2">

            <div v-show="aboutTab === 'sejarah'" class="tab-content fade-in">
              <h3>Sejarah Candi Selogriyo: Peninggalan Arkeologis di Tengah Bukit</h3>
              <p>Candi Selogriyo, yang terletak di atas perbukitan di Jawa Tengah, merupakan peninggalan arkeologis yang menarik. Penemuan kembali candi ini pertama kali dilaporkan pada tahun 1835 oleh Hartman, Residen Kedu saat itu, dan didokumentasikan dalam buku ROC <em>(Rappoertan van de Oudheidkundige Commissie in Nederlandsch-Indië)</em> tahun 1912.</p>
              
              <div class="image-gallery">
                <div class="image-item">
                  <div class="placeholder-img">📷</div>
                  <p class="caption">Foto setelah pemugaran pertama kali (1955)</p>
                </div>
                <div class="image-item">
                  <div class="placeholder-img">📷</div>
                  <p class="caption">Kondisi sebelum longsor</p>
                </div>
              </div>

              <p>Sayangnya, pada tanggal 1 Januari 1999, Candi Selogriyo mengalami musibah besar akibat hujan berkepanjangan yang menyebabkan tanah penyangga bangunan candi longsor. Hampir tiga perempat bagian candi runtuh ke dasar bukit bersama longsoran tanah.</p>

              <div class="image-gallery trio">
                <div class="image-item"><div class="placeholder-img">📷</div><p class="caption">Kondisi setelah longsor 1999</p></div>
                <div class="image-item"><div class="placeholder-img">📷</div><p class="caption">Penampang skema longsor</p></div>
                <div class="image-item"><div class="placeholder-img">📷</div><p class="caption">Rencana relokasi awal</p></div>
              </div>
            </div>
            
            <div v-show="aboutTab === 'pesona'" class="tab-content fade-in">
              <h3>Pesona Wisata Cagar Budaya</h3>
              <p><strong>Sebuah candi yang tidak biasa dengan pemandangan perbukitan dan persawahan yang memukau</strong> bisa Anda temukan di lereng Gunung Sumbing, tepatnya di Dusun Campurejo, Desa Kembang Kuning, Kecamatan Windusari, Kabupaten Magelang.</p>
              
              <div class="pesona-grid">
                <div class="pesona-card">
                  <h4>Awal Masuk Kawasan</h4>
                  <div class="placeholder-img small">📷</div>
                  <p>Pengunjung akan disambut oleh suasana pedesaan yang asri dan tenang. Terdapat fasilitas dasar seperti tempat parkir dan loket.</p>
                </div>
                <div class="pesona-card">
                  <h4>Perjalanan Menuju Candi</h4>
                  <div class="placeholder-img small">📷</div>
                  <p>Trek wisata sudah dipaving dan melintasi sawah terasering yang hijau. Suara burung dan angin sepoi-sepoi menambah suasana alami.</p>
                </div>
                <div class="pesona-card">
                  <h4>Tiba di Candi</h4>
                  <div class="placeholder-img small">📷</div>
                  <p>Candi berdiri kokoh di tengah alam yang hijau. Pengunjung dapat melihat detail arsitektur bercorak Hindu dengan relief artistik.</p>
                </div>
              </div>
            </div>

            <div v-show="aboutTab === 'akses'" class="tab-content fade-in">
              <h3>Akses Menuju Lokasi</h3>
              <p>Dari pusat kota Magelang, bisa mencapai Candi Selogriyo dengan berkendara selama 30-40 menit melewati area permukiman dan persawahan yang asri. Aksesnya terbilang menantang karena melalui jalur yang sempit dan menanjak.</p>
              <ul class="info-list">
                <li>🚗 <strong>Pengguna Mobil:</strong> Hanya dapat membawa kendaraan sampai pada area parkir di sekitar permukiman warga.</li>
                <li>🏍️ <strong>Pengguna Motor:</strong> Dapat membawa kendaraan naik lebih jauh hingga ke area parkir yang lebih dekat dengan candi.</li>
              </ul>
            </div>

            <div v-show="aboutTab === 'fasilitas'" class="tab-content fade-in">
              <h3>Fasilitas Kawasan</h3>
              <p>Untuk menunjang kenyamanan pengunjung, beberapa fasilitas telah disediakan oleh pengelola:</p>
              <div class="fasilitas-tags">
                <span class="tag">🅿️ Parkir Mobil</span>
                <span class="tag">🛵 Parkir Motor</span>
                <span class="tag">🕌 Masjid/Musholla</span>
                <span class="tag">🎫 Loket Entrance</span>
                <span class="tag">🛖 Gazebo Panorama</span>
                <span class="tag">🚻 Toilet</span>
              </div>
            </div>

            <div v-show="aboutTab === 'qna'" class="tab-content fade-in">
              <h3>Tanya Jawab (QnA)</h3>
              <div class="qna-box">
                <h4>⏰ Kapan saja Candi Selogriyo dibuka untuk wisata?</h4>
                <p>Buka setiap hari mulai pukul 08.00 - 16.00 WIB.</p>
              </div>
              <div class="qna-box">
                <h4>🎟️ Berapa harga tiket masuk?</h4>
                <p>Wisatawan Domestik: Rp 7.000 <br> Wisatawan Mancanegara: Rp 25.000</p>
              </div>
            </div>

          </div>
        </div>
      </section>
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

// Fungsi Menangani Scroll (Blur Image & Navbar)
const handleScroll = () => {
  const scrollPos = window.scrollY;
  isScrolled.value = scrollPos > 50;

  // Kalkulasi efek blur (max 12px)
  const fadePoint = window.innerHeight * 0.6; 
  let blurValue = scrollPos > fadePoint ? 12 : (scrollPos / fadePoint) * 12;
  bgFilter.value = `brightness(0.35) blur(${blurValue}px)`;
};

// Animasi Canvas Fluid Background
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
      this.x = Math.random() * width; 
      this.y = Math.random() * height; 
      this.r = Math.random() * 300 + 150; 
      this.vx = (Math.random() - 0.5) * 0.3; 
      this.vy = (Math.random() - 0.5) * 0.3;
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
    blobs.forEach(blob => { blob.update(); blob.draw(); });
    animationFrameId = requestAnimationFrame(animateBg);
  };
  animateBg();
};

// Observer untuk Animasi Fade-in (Reveal)
const initObserver = () => {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => { 
      if (entry.isIntersecting) { 
        entry.target.classList.add('active'); 
        obs.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.15 });

  // Beri sedikit delay agar Vue selesai merender DOM
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.active)').forEach(el => observer.observe(el));
  }, 100);
};

onMounted(() => {
  // Cek jika datang dari Map Peta (Query URL)
  if (route.query.tab) activeTab.value = route.query.tab;
  if (route.query.sub) aboutTab.value = route.query.sub;

  // Pasang Listener
  window.addEventListener('scroll', handleScroll);
  
  // Jalankan Animasi
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
src="../assets/landing.css" scoped>
</style>