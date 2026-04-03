import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD12XA4akYEc-sPwRJRKTXqi45cOLbl3YA",
    authDomain: "vivaan-dhawan-fb4b3.firebaseapp.com",
    projectId: "vivaan-dhawan-fb4b3",
    storageBucket: "vivaan-dhawan-fb4b3.firebasestorage.app",
    messagingSenderId: "71786766432",
    appId: "1:71786766432:web:311fa210fdcde751066305",
    databaseURL: "https://vivaan-dhawan-fb4b3-default-rtdb.firebaseio.com"
};

const ADMIN_EMAIL = "admin@vivaan.com";

function clampIntPct(raw) {
    const n = parseInt(String(raw).trim(), 10);
    if (!Number.isFinite(n)) return 0;
    return Math.min(100, Math.max(0, n));
}

function safeShortText(raw, maxLen) {
    const s = String(raw ?? "").replace(/[\u0000-\u001F\u007F]/g, "").slice(0, maxLen);
    return s;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const loginBtn = document.getElementById("login-btn");
const loginSection = document.getElementById("login-section");
const editSection = document.getElementById("edit-section");
const passInput = document.getElementById("password");

loginBtn.addEventListener("click", () => {
    const password = passInput.value;
    loginBtn.textContent = "Logging in...";
    signInWithEmailAndPassword(auth, ADMIN_EMAIL, password)
        .then(() => {
            loginSection.hidden = true;
            editSection.hidden = false;
        })
        .catch((error) => {
            alert("Authentication Failed: " + error.message);
            loginBtn.textContent = "Secure Login";
        });
});

const saveBtn = document.getElementById("save-btn");
const statusMsg = document.getElementById("status-msg");

saveBtn.addEventListener("click", () => {
    saveBtn.textContent = "Pushing...";

    const payload = {
        peakOutput: String(clampIntPct(document.getElementById("peakOutput").value)),
        explosivePower: String(clampIntPct(document.getElementById("explosivePower").value)),
        enduranceBase: String(clampIntPct(document.getElementById("enduranceBase").value)),
        agilityReaction: String(clampIntPct(document.getElementById("agilityReaction").value)),
        pacePr: safeShortText(document.getElementById("pacePr").value, 32),
        vo2Max: safeShortText(document.getElementById("vo2Max").value, 24),
        ageGroup: safeShortText(document.getElementById("ageGroup").value, 48)
    };

    set(ref(db, "stats/"), payload)
        .then(() => {
            saveBtn.textContent = "Push to Live Website";
            statusMsg.classList.add("is-visible");
            setTimeout(() => statusMsg.classList.remove("is-visible"), 3000);
        })
        .catch((error) => {
            alert("Failed to save: " + error.message);
            saveBtn.textContent = "Push to Live Website";
        });
});
