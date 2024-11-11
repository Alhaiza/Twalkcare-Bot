# Twalkcare

**Twalkcare** adalah bot WhatsApp yang dirancang untuk memberikan informasi dan layanan terkait kesehatan kepada pengguna. Dibangun dengan Node.js, Twalkcare membantu pengguna dengan berbagai perintah seputar kesehatan seperti pengingat, pemantauan, informasi penyakit, dan edukasi kesehatan.

## Fitur Utama

- **Pengingat Kesehatan:** Mengingatkan pengguna tentang jadwal obat, olahraga, dan pemeriksaan kesehatan.
- **Pemantauan Kesehatan:** Memantau data vital seperti tekanan darah, kadar gula darah, dan lainnya.
- **Informasi Penyakit:** Memberikan informasi lengkap tentang berbagai penyakit.
- **Konsultasi Gejala:** Menyediakan panduan awal untuk gejala kesehatan umum.
- **Edukasi Kesehatan Umum:** Tips dan saran untuk menjaga kesehatan secara menyeluruh.

## Persyaratan

- **Node.js** (versi terbaru)
- **npm** (biasanya sudah ada dengan Node.js)
- **Akun WhatsApp**
- **API Key Gemini AI** (untuk mengaktifkan kemampuan AI bot)

## Instalasi

1. **Clone** repositori ini:

   ```bash
   git clone https://github.com/Alhaiza/Twalkcare.git
   cd Twalkcare
   ```

2. **Instal** dependensi dengan npm:

   ```bash
   npm install
   ```

3. **Tambahkan API Key** ke .env file: Buat file .env di root proyek Anda dan tambahkan baris berikut:

   ```bash
   GOOGLE_API_KEY=Your_Gemini_AI_API_Key
   ```

4. **Inisialisasi Bot**:
   ```bash
   node bot.js
   ```
