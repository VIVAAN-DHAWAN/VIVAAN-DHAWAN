import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD12XA4akYEc-sPwRJRKTXqi45cOLbl3YA",
    authDomain: "vivaan-dhawan-fb4b3.firebaseapp.com",
    projectId: "vivaan-dhawan-fb4b3",
    storageBucket: "vivaan-dhawan-fb4b3.firebasestorage.app",
    messagingSenderId: "71786766432",
    appId: "1:71786766432:web:311fa210fdcde751066305",
    databaseURL: "https://vivaan-dhawan-fb4b3-default-rtdb.firebaseio.com"
};

function clampPct(n) {
    if (!Number.isFinite(n)) return null;
    return Math.min(100, Math.max(0, Math.round(n)));
}

function parsePct(raw) {
    if (raw == null) return null;
    const n = typeof raw === "number" ? raw : parseFloat(String(raw).trim());
    return clampPct(n);
}

function safeText(raw, maxLen) {
    if (raw == null) return null;
    const s = String(raw).replace(/[\u0000-\u001F\u007F]/g, "").slice(0, maxLen);
    return s.length ? s : null;
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const statsRef = ref(db, 'stats/');

    onValue(statsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const peak = parsePct(data.peakOutput);
        if (peak != null) {
            const valEl = document.getElementById('stat-ring-val');
            const ringFill = document.getElementById('stat-ring-fill');
            if (valEl) valEl.textContent = String(peak);
            if (ringFill) {
                const offset = 264 - (264 * (peak / 100));
                ringFill.style.strokeDashoffset = String(offset);
            }
        }

        const explosive = parsePct(data.explosivePower);
        if (explosive != null) {
            const txt = document.getElementById('stat-explosive-txt');
            const bar = document.getElementById('stat-explosive-bar');
            if (txt) txt.textContent = explosive + '%';
            if (bar) bar.style.width = explosive + '%';
        }

        const endurance = parsePct(data.enduranceBase);
        if (endurance != null) {
            const txt = document.getElementById('stat-endurance-txt');
            const bar = document.getElementById('stat-endurance-bar');
            if (txt) txt.textContent = endurance + '%';
            if (bar) bar.style.width = endurance + '%';
        }

        const agility = parsePct(data.agilityReaction);
        if (agility != null) {
            const txt = document.getElementById('stat-agility-txt');
            const bar = document.getElementById('stat-agility-bar');
            if (txt) txt.textContent = agility + '%';
            if (bar) bar.style.width = agility + '%';
        }

        const pace = safeText(data.pacePr, 32);
        if (pace) {
            const el = document.getElementById('stat-pace');
            if (el) el.textContent = pace;
        }
        const vo2 = safeText(data.vo2Max, 24);
        if (vo2) {
            const el = document.getElementById('stat-vo2');
            if (el) el.textContent = vo2;
        }
        const age = safeText(data.ageGroup, 48);
        if (age) {
            const el = document.getElementById('stat-age');
            if (el) el.textContent = age;
        }
    });
});
