const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors()); // Mengizinkan akses dari frontend Vue
app.use(express.json());

// Konfigurasi koneksi ke PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Endpoint untuk mengambil Area Candi
app.get('/api/candi/area', async (req, res) => {
    try {
        // PERUBAHAN DI SINI: Gunakan ST_Transform(geom, 4326)
        const query = `
            SELECT *, ST_AsGeoJSON(ST_Transform(geom, 4326)) as geojson 
            FROM zona_kawasan_ar 
            WHERE geom IS NOT NULL
        `;
        const { rows } = await pool.query(query);

        const features = rows.map(row => {
            const { geojson, geom, ...properties } = row; 
            return {
                type: 'Feature',
                geometry: JSON.parse(geojson),
                properties: properties 
            };
        });

        res.json({
            type: 'FeatureCollection',
            features: features
        });

    } catch (err) {
        console.error("Error database:", err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
});

// ==========================================
// 2. ENDPOINT UNTUK GARIS (JALAN KAWASAN)
// ==========================================
app.get('/api/candi/jalan', async (req, res) => {
    try {
        const query = `
            SELECT *, ST_AsGeoJSON(ST_Transform(geom, 4326)) as geojson 
            FROM jalan_kawasan 
            WHERE geom IS NOT NULL
        `;
        const { rows } = await pool.query(query);

        const features = rows.map(row => {
            const { geojson, geom, ...properties } = row; 
            return { type: 'Feature', geometry: JSON.parse(geojson), properties };
        });

        res.json({ type: 'FeatureCollection', features });
    } catch (err) {
        console.error("Error jalan:", err);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// ==========================================
// 3. ENDPOINT UNTUK TITIK (FASUM POIN)
// ==========================================
app.get('/api/candi/fasum', async (req, res) => {
    try {
        // Catatan: Karena nama tabelmu diawali huruf kapital (Fasum...), 
        // kita bungkus dengan tanda kutip ganda "" agar PostgreSQL tidak bingung.
        const query = `
            SELECT *, ST_AsGeoJSON(ST_Transform(geom, 4326)) as geojson 
            FROM "Fasum_kawasan_point" 
            WHERE geom IS NOT NULL
        `;
        const { rows } = await pool.query(query);

        const features = rows.map(row => {
            const { geojson, geom, ...properties } = row; 
            return { type: 'Feature', geometry: JSON.parse(geojson), properties };
        });

        res.json({ type: 'FeatureCollection', features });
    } catch (err) {
        console.error("Error fasum:", err);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// ==========================================
// 4. API REGISTER (Untuk buat akun pertama kali)
// ==========================================
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Enkripsi password (di-acak/hash 10 kali putaran)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan ke database PostgreSQL
        const query = `
            INSERT INTO users (username, password, role) 
            VALUES ($1, $2, $3) RETURNING id, username, role
        `;
        // Secara default (jika role kosong), jadikan dia 'user' biasa
        const values = [username, hashedPassword, role || 'user'];
        const { rows } = await pool.query(query, values);

        res.status(201).json({ message: "Registrasi berhasil!", user: rows[0] });
    } catch (err) {
        console.error("Error register:", err);
        // Error kode 23505 adalah kode PostgreSQL jika username sudah terdaftar
        if (err.code === '23505') { 
            return res.status(400).json({ error: "Username sudah dipakai, coba yang lain!" });
        }
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
});

// ==========================================
// 5. API LOGIN (Untuk masuk & dapatkan tiket)
// ==========================================
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Cari user di database
        const { rows } = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
        if (rows.length === 0) {
            return res.status(400).json({ error: "Username tidak ditemukan!" });
        }
        const user = rows[0];

        // 2. Cek apakah password cocok dengan yang ada di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Password salah!" });
        }

        // 3. Buat "Gelang Tiket" (Token JWT)
        // Tiket ini mencatat siapa yang login dan apa jabatannya (role)
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Tiket akan hangus/kadaluarsa dalam 1 hari
        );

        // 4. Berikan tiket ke pengunjung (Vue.js)
        res.json({
            message: "Login berhasil!",
            token: token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (err) {
        console.error("Error login:", err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
});

// Fungsi Satpam untuk mengecek Tiket (Token)
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: "Akses ditolak, tiket tidak ada!" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next(); // Lanjutkan ke dapur kalau tiket asli
    } catch (err) {
        res.status(401).json({ error: "Tiket kadaluarsa atau palsu!" });
    }
};

// --- PENERAPANNYA ---

// API GET (Ambil Data) -> Biarkan publik, tidak perlu Satpam ✅
app.get('/api/candi/fasum', async (req, res) => { ... });

// API POST (Tambah Data) -> WAJIB lapor Satpam dulu 🔒
app.post('/api/candi/fasum', verifyToken, async (req, res) => {
    // Hanya yang punya token yang bisa sampai ke baris kode ini
});

// Menyalakan Server Node.js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});