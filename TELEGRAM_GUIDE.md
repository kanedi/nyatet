# Panduan Integrasi Telegram Bot

Fitur ini memungkinkan Aplikasi Nyatet untuk mengirimkan **Laporan Harian** secara otomatis ke akun Telegram Anda (khusus Admin & Super Admin).

## 1. Membuat Bot Telegram

Jika Anda belum memiliki bot, ikuti langkah ini:

1.  Buka aplikasi Telegram.
2.  Cari akun bernama **@BotFather** (pastikan yang ada centang biru).
3.  Klik **Start** atau ketik `/start`.
4.  Ketik perintah `/newbot` untuk membuat bot baru.
5.  Ikuti petunjuk untuk memberi nama bot dan username (berakhiran `bot`, misal `NyatetDailyBot`).
6.  Setelah sukses, BotFather akan memberikan **HTTP API Token**.
    -   Contoh: `123456789:ABCDefGhiJklMnoPqrStuVwxYz`
    -   **Simpan Token ini!** Jangan bagikan ke orang lain.

## 2. Konfigurasi Sistem (Server)

Anda perlu menambahkan token bot ke dalam sistem Nyatet.

1.  Buka file `.env` di server/komputer host aplikasi.
2.  Tambahkan baris berikut:
    ```env
    TELEGRAM_BOT_TOKEN="paste_token_anda_disini"
    ```
    *Ganti `paste_token_anda_disini` dengan token dari BotFather.*
3.  Restart aplikasi (wajib, agar konfigurasi terbaca).

## 3. Menghubungkan Akun (Dashboard)

Setiap Admin yang ingin menerima laporan harus mendaftarkan Telegram ID mereka.

1.  Buka Telegram, cari akun **@userinfobot** (atau bot lain serupa).
2.  Klik **Start**. Bot akan membalas dengan info profil Anda.
3.  Salin angka pada bagian **Id** (misal: `987654321`).
4.  Login ke Dashboard Nyatet sebagai **Super Admin**.
5.  Masuk ke menu **User Management**.
6.  Edit user yang ingin dihubungkan (klik ikon pensil).
7.  Masukkan ID tadi ke kolom **Telegram ID**.
8.  Simpan.

## 4. Cara Menggunakan (Memicu Laporan)

Laporan tidak dikirim otomatis oleh aplikasi *per detik*, melainkan oleh **Cron Job** (penjadwalan) eksternal.

### Test Manual
Untuk mengetes apakah bot berfungsi:
1.  Buka terminal/browser.
2.  Akses URL: `http://localhost:3000/api/cron/daily-report` (sesuaikan domain jika sudah online).
3.  Jika sukses, Anda akan menerima pesan di Telegram berisi ringkasan penjualan hari ini.

### Setting Otomatis (Cron Job)
Agar laporan dikirim setiap malam (misal jam 21:00), setting scheduler di server:

**Linux / macOS:**
1.  Buka terminal, ketik `crontab -e`.
2.  Tambahkan baris:
    ```bash
    0 21 * * * curl http://localhost:3000/api/cron/daily-report >> /dev/null 2>&1
    ```

**Windows:**
-   Gunakan **Task Scheduler** untuk menjalankan script `curl` atau membuka URL tersebut pada waktu tertentu.
