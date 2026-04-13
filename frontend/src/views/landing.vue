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
        <li><router-link to="/map" class="map-link">🗺️ WebGIS</router-link></li>
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

    <div v-show="activeTab === 'about'" class="page-content about-section">
      
      <div class="about-header">
        <h2>Informasi Wisata</h2>
        <h1>Candi Selogriyo</h1>
      </div>

      <div class="about-nav">
        <button :class="{ active: aboutTab === 'sejarah' }" @click="aboutTab = 'sejarah'">Sejarah Candi</button>
        <button :class="{ active: aboutTab === 'pesona' }" @click="aboutTab = 'pesona'">Pesona Candi</button>
        <button :class="{ active: aboutTab === 'akses' }" @click="aboutTab = 'akses'">Akses</button>
        <button :class="{ active: aboutTab === 'fasilitas' }" @click="aboutTab = 'fasilitas'">Fasilitas</button>
        <button :class="{ active: aboutTab === 'qna' }" @click="aboutTab = 'qna'">QnA</button>
      </div>

      <div class="about-body">

        <div v-show="aboutTab === 'sejarah'" class="tab-content fade-in">
          <h3>Sejarah Candi Selogriyo: Peninggalan Arkeologis di Tengah Bukit</h3>
          <p>Candi Selogriyo, yang terletak di atas perbukitan di Jawa Tengah, merupakan peninggalan arkeologis yang menarik. Penemuan kembali candi ini pertama kali dilaporkan pada tahun 1835 oleh Hartman, Residen Kedu saat itu, dan didokumentasikan dalam buku ROC <em>(Rappoertan van de Oudheidkundige Commissie in Nederlandsch-Indië)</em> tahun 1912. Namun, karena lokasinya yang terpencil, temuan ini kurang mendapatkan perhatian hingga tahun 1876 ketika R.H. Freederich mengunjungi dan mendeskripsikan arca-arca yang ditemukan di sana.</p>
          <p>Dokumentasi yang lebih lengkap mengenai Candi Selogriyo, termasuk arsitektur dan seni arcanya, dapat ditemukan dalam buku monumental N.J. Krom berjudul "Inleiding tot de Hindoe-Javaansche Kunst" yang ditulis pada tahun 1923. Penelitian lebih lanjut dilakukan oleh Soekmono pada tahun 1955 untuk melengkapi data disertasinya mengenai peripih candi, di mana ia menemukan wadah-wadah peripih selama pemugaran.</p>
          
          <div class="image-gallery">
            <div class="image-item">
              <div class="placeholder-img">📷<br><span>Insert Image</span></div>
              <p class="caption">Foto-foto setelah pemugaran pertama kali (1955)</p>
            </div>
            <div class="image-item">
              <div class="placeholder-img">📷<br><span>Insert Image</span></div>
              <p class="caption">Kondisi sebelum longsor</p>
            </div>
          </div>

          <p>Pada saat ditemukan, kondisi Candi Selogriyo sudah runtuh dengan batu-batunya tidak lagi berada pada susunan aslinya dan banyak yang hilang. Pemugaran pertama kali dimulai pada tahun 1955 dan selesai pada tahun 1957. Karena banyak batu yang hilang, pemugaran hanya bisa merekonstruksi sebagian bangunan, yaitu batur (sub-basement), tubuh candi, dan sebagian atap tingkat pertama.</p>
          <p>Sayangnya, pada tanggal 1 Januari 1999, Candi Selogriyo mengalami musibah besar akibat hujan berkepanjangan yang menyebabkan tanah penyangga bangunan candi longsor. Hampir tiga perempat bagian candi runtuh ke dasar bukit bersama longsoran tanah, menyisakan hanya bagian dinding sisi barat. Peristiwa ini menimbulkan perdebatan mengenai cara terbaik untuk menyelamatkan dan memugar candi.</p>

          <div class="image-gallery trio">
            <div class="image-item">
              <div class="placeholder-img">📷<br><span>Insert Image</span></div>
              <p class="caption">Kondisi setelah longsor 1999</p>
            </div>
            <div class="image-item">
              <div class="placeholder-img">📷<br><span>Insert Image</span></div>
              <p class="caption">Penampang skema longsor</p>
            </div>
            <div class="image-item">
              <div class="placeholder-img">📷<br><span>Insert Image</span></div>
              <p class="caption">Rencana relokasi</p>
            </div>
          </div>

          <p>Ada pendapat yang mengusulkan untuk memindahkan candi ke lokasi lain mengingat tanah aslinya sudah tidak stabil. Namun, pandangan lain menekankan pentingnya menjaga keaslian lokasi candi sebagai bagian dari warisan budaya dan sejarah. Perdebatan ini mencerminkan tantangan dalam konservasi benda cagar budaya yang harus memperhatikan berbagai aspek termasuk nilai sejarah, estetika, sosial, ilmiah, dan asosiatif-simbolis.</p>
        </div>
        
        <div v-show="aboutTab === 'pesona'" class="tab-content fade-in">
          <h3>Pesona Wisata Cagar Budaya</h3>
          <p><strong>Sebuah candi yang tidak biasa dengan pemandangan perbukitan dan persawahan yang memukau</strong> bisa Anda temukan di lereng Gunung Sumbing, tepatnya di Dusun Campurejo, Desa Kembang Kuning, Kecamatan Windusari, Kabupaten Magelang, di bawah Bukit Giyanti dan Bukit Condong.</p>
          
          <div class="pesona-grid">
            <div class="pesona-card">
              <h4>Awal Masuk Kawasan</h4>
              <div class="placeholder-img small">📷</div>
              <p class="caption">Pemandangan awal sebelum menuju Candi</p>
              <p>Pengunjung akan disambut oleh suasana pedesaan yang asri dan tenang. Terdapat fasilitas dasar seperti tempat parkir, kios kecil, dan loket dengan staf yang ramah.</p>
            </div>
            <div class="pesona-card">
              <h4>Perjalanan Menuju Candi</h4>
              <div class="placeholder-img small">📷</div>
              <p class="caption">Pemandangan Perjalanan Menuju</p>
              <p>Trek wisata sudah dipaving dan melintasi sawah terasering yang hijau. Suara burung dan angin sepoi-sepoi dari pepohonan rindang menambah suasana alami.</p>
            </div>
            <div class="pesona-card">
              <h4>Tiba di Candi</h4>
              <div class="placeholder-img small">📷</div>
              <p class="caption">Spot rest stop pemandangan luas</p>
              <p>Candi berdiri kokoh di tengah alam yang hijau. Pengunjung dapat melihat detail arsitektur bercorak Hindu dengan relief artistik dan menikmati pemandangan lembah.</p>
            </div>
          </div>
        </div>

        <div v-show="aboutTab === 'akses'" class="tab-content fade-in">
          <h3>Akses Menuju Lokasi</h3>
          <p>Dari pusat kota Magelang, bisa mencapai Candi Selogriyo dengan berkendara selama 30-40 menit melewati area permukiman dan persawahan yang asri. Aksesnya terbilang menantang karena melalui jalur yang sempit dan menanjak (berupa jalan paving beton selebar 4 meter).</p>
          <ul class="info-list">
            <li>🚗 <strong>Pengguna Mobil:</strong> Hanya dapat membawa kendaraan sampai pada area parkir di sekitar permukiman warga.</li>
            <li>🏍️ <strong>Pengguna Motor:</strong> Dapat membawa kendaraan naik lebih jauh hingga ke area parkir yang lebih dekat dengan candi.</li>
          </ul>
        </div>

        <div v-show="aboutTab === 'fasilitas'" class="tab-content fade-in">
          <h3>Fasilitas Kawasan</h3>
          <p>Untuk menunjang kenyamanan pengunjung, beberapa fasilitas telah disediakan oleh pengelola:</p>
          <div class="fasilitas-tags">
            <span class="tag">🅿️ Parkir Mobil (Permukiman)</span>
            <span class="tag">🛵 Parkir Motor (Atas)</span>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Default tab
const activeTab = ref('home')
const aboutTab = ref('sejarah')

// Logika membaca URL saat halaman pertama kali dibuka
onMounted(() => {
  if (route.query.tab) {
    activeTab.value = route.query.tab // Otomatis buka tab About
  }
  if (route.query.sub) {
    aboutTab.value = route.query.sub // Otomatis arahkan ke sub-menu Sejarah
  }
})
</script>

<style 
src="../assets/landing.css" scoped>
</style>

