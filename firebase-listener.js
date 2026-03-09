import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD12XA4akYEc-sPwRJRKTXqi45cOLbl3YA",
    authDomain: "vivaan-dhawan-fb4b3.firebaseapp.com",
    projectId: "vivaan-dhawan-fb4b3",
    storageBucket: "vivaan-dhawan-fb4b3.firebasestorage.app",
    messagingSenderId: "71786766432",
    appId: "1:71786766432:web:311fa210fdcde751066305",
    databaseURL: "https://vivaan-dhawan-fb4b3-default-rtdb.asia-southeast1.firebasedatabase.app" // Attempting standard URL structure, but usually provided by Firebase - we'll let user verify.
};

// Handle varying region database URLs
const dbUrlMatch = firebaseConfig.projectId + "-default-rtdb";
firebaseConfig.databaseURL = `https://${firebaseConfig.projectId}-default-rtdb.firebaseio.com`;

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', () => {
    const statsRef = ref(db, 'stats/');

    onValue(statsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        // Peak Output
        if (data.peakOutput) {
            const valEl = document.getElementById('stat-ring-val');
            const ringFill = document.getElementById('stat-ring-fill');
            if (valEl) valEl.innerText = data.peakOutput;
            if (ringFill) {
                // 264 is the total dash array. Percent remaining = 264 - (264 * (percent / 100))
                const offset = 264 - (264 * (data.peakOutput / 100));
                ringFill.style.strokeDashoffset = offset;
            }
        }

        // Explosive Power
        if (data.explosivePower) {
            const txt = document.getElementById('stat-explosive-txt');
            const bar = document.getElementById('stat-explosive-bar');
            if (txt) txt.innerText = data.explosivePower + '%';
            if (bar) bar.style.width = data.explosivePower + '%';
        }

        // Endurance
        if (data.enduranceBase) {
            const txt = document.getElementById('stat-endurance-txt');
            const bar = document.getElementById('stat-endurance-bar');
            if (txt) txt.innerText = data.enduranceBase + '%';
            if (bar) bar.style.width = data.enduranceBase + '%';
        }

        // Agility
        if (data.agilityReaction) {
            const txt = document.getElementById('stat-agility-txt');
            const bar = document.getElementById('stat-agility-bar');
            if (txt) txt.innerText = data.agilityReaction + '%';
            if (bar) bar.style.width = data.agilityReaction + '%';
        }

        // Bottom Metrics
        if (data.pacePr) {
            const el = document.getElementById('stat-pace');
            if (el) el.innerText = data.pacePr;
        }
        if (data.vo2Max) {
            const el = document.getElementById('stat-vo2');
            if (el) el.innerText = data.vo2Max;
        }
        if (data.ageGroup) {
            const el = document.getElementById('stat-age');
            if (el) el.innerText = data.ageGroup;
        }
    });
});
