<template>
  <div class="dashboard-container">
    <nav class="dash-nav">
      <div class="brand">
        <span class="ico">🏛️</span> 
        <h3>Panel Pengelola Candi</h3>
      </div>
      <div class="user-menu">
        <span>Halo, Admin!</span>
        <button @click="handleLogout" class="btn-logout">Keluar</button>
      </div>
    </nav>

    <div class="dash-content">
      <div class="welcome-box">
        <h2>Selamat Datang di Ruang Kerja WebGIS</h2>
        <p>Di sini Anda dapat menambah, mengubah, atau menghapus data fasilitas dan zona kawasan Candi Selogriyo.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div style="font-size: 30px;">📍</div>
          <h3>Kelola Fasilitas</h3>
          <p>Tambah titik toilet, warung, dll.</p>
          <button class="btn-action">Buka Editor</button>
        </div>
        <div class="stat-card">
          <div style="font-size: 30px;">🛣️</div>
          <h3>Kelola Jalan & Akses</h3>
          <p>Perbarui rute dan jalur evakuasi.</p>
          <button class="btn-action">Buka Editor</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  // Hapus tiket JWT dari dompet browser
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  alert('Berhasil keluar!');
  router.push('/'); // Lempar kembali ke halaman depan
};
</script>

<style scoped>
.dashboard-container { min-height: 100vh; background: #f0f4f4; font-family: 'Nunito', sans-serif; }
.dash-nav { 
  background: #1e8f82; color: white; padding: 15px 40px; 
  display: flex; justify-content: space-between; align-items: center; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.brand { display: flex; align-items: center; gap: 10px; }
.user-menu { display: flex; align-items: center; gap: 20px; font-weight: bold; }
.btn-logout { background: #ff4d4d; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; font-weight: bold;}
.dash-content { padding: 40px; max-width: 1000px; margin: 0 auto; }
.welcome-box { background: white; padding: 30px; border-radius: 12px; margin-bottom: 30px; border-left: 6px solid #2ab5a5; }
.stats-grid { display: flex; gap: 20px; }
.stat-card { background: white; padding: 30px; border-radius: 12px; flex: 1; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.btn-action { margin-top: 15px; background: #2ab5a5; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; width: 100%; font-weight: bold;}
</style>