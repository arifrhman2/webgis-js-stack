const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

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

// Menyalakan Server Node.js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});