<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <span class="ico">🏛️</span>
        <h2>Selogriyo WebGIS</h2>
        <p>{{ isRegister ? 'Buat akun baru' : 'Silakan masuk ke akun Anda' }}</p>
      </div>

      <form @submit.prevent="handleAuth">
        <div class="form-group">
          <label>Username</label>
          <input v-model="form.username" type="text" placeholder="Masukkan username" required />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="Masukkan password" required />
        </div>

        <button type="submit" class="btn-auth" :disabled="loading">
          {{ loading ? 'Mohon tunggu...' : (isRegister ? 'Daftar Sekarang' : 'Masuk') }}
        </button>
      </form>

      <p class="toggle-text">
        {{ isRegister ? 'Sudah punya akun?' : 'Belum punya akun?' }}
        <span @click="isRegister = !isRegister">{{ isRegister ? 'Login di sini' : 'Daftar di sini' }}</span>
      </p>

      <router-link to="/" class="back-home">⬅️ Kembali ke Beranda</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isRegister = ref(false);
const loading = ref(false);
const form = ref({ username: '', password: '' });

const handleAuth = async () => {
  loading.value = true;
  const endpoint = isRegister.value ? 'register' : 'login';
  
  try {
    const response = await fetch(`http://localhost:3000/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Terjadi kesalahan');

    if (isRegister.value) {
      alert("Registrasi Berhasil! Silakan Login.");
      isRegister.value = false;
    } else {
      // Simpan "Gelang Tiket" ke dompet browser (LocalStorage)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      alert("Login Berhasil!");
      router.push('/admin'); // Pindah ke Dashboard karena dia admin
    }
  } catch (err) {
    alert(err.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #e0f7f5, #b8d4c8);
}
.login-card {
  background: white; padding: 40px; border-radius: 15px; width: 100%; max-width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: center;
}
.login-header h2 { color: #1e8f82; margin: 10px 0; }
.form-group { text-align: left; margin-bottom: 20px; }
.form-group label { display: block; font-size: 14px; font-weight: bold; margin-bottom: 5px; }
input { width: 100%; padding: 12px; border: 1.5px solid #ddd; border-radius: 8px; box-sizing: border-box; }
.btn-auth {
  width: 100%; padding: 12px; background: #2ab5a5; color: white; border: none;
  border-radius: 8px; font-weight: bold; cursor: pointer; transition: 0.3s;
}
.btn-auth:hover { background: #1e8f82; }
.toggle-text { margin-top: 20px; font-size: 14px; }
.toggle-text span { color: #1e8f82; cursor: pointer; font-weight: bold; }
.back-home { display: block; margin-top: 20px; font-size: 13px; color: #888; text-decoration: none; }
</style>