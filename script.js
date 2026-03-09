/* ============================================
   VIVAAN DHAWAN PORTFOLIO — SCRIPT
   Web3 aesthetic + existing effects
   ============================================ */

/* ===== 1. CLICK SPARK ===== */
(function () {
    const canvas = document.getElementById('sparkCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let sparks = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Spark {
        constructor(x, y) {
            this.x = x; this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.life = 1;
            this.decay = Math.random() * 0.03 + 0.02;
            this.size = Math.random() * 2.5 + 0.5;
            this.hue = Math.random() > 0.5 ? 0 : 220;
            this.sat = Math.random() > 0.5 ? 0 : 30;
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            this.vy += 0.04;
            this.life -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life * 0.8;
            ctx.fillStyle = this.sat === 0
                ? `rgba(255,255,255,${this.life})`
                : `hsl(220, 60%, 80%)`;
            ctx.shadowColor = 'rgba(255,255,255,0.6)';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    document.addEventListener('click', (e) => {
        for (let i = 0; i < 10; i++) sparks.push(new Spark(e.clientX, e.clientY));
    });

    // Touch support for sparks on mobile
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        for (let i = 0; i < 8; i++) sparks.push(new Spark(touch.clientX, touch.clientY));
    }, { passive: true });

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sparks = sparks.filter(s => s.life > 0);
        sparks.forEach(s => { s.update(); s.draw(); });
        requestAnimationFrame(loop);
    }
    loop();
})();


/* ===== 2. GLASS SURFACE — MOUSE LIGHT ===== */
(function () {
    document.querySelectorAll('.glass-surface').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r = el.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;
            el.style.setProperty('--glass-x', x + '%');
            el.style.setProperty('--glass-y', y + '%');
        });
    });
})();


/* ===== 3. THREE.JS GLOBE ===== */
(function () {
    const canvas = document.getElementById('globeCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // White wireframe globe for the monochrome aesthetic
    const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 60, 60),
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.05 })
    );
    scene.add(globe);

    const core = new THREE.Mesh(
        new THREE.SphereGeometry(1.18, 60, 60),
        new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.85 })
    );
    scene.add(core);

    const dotCount = 4000;
    const positions = new Float32Array(dotCount * 3);
    for (let i = 0; i < dotCount; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = 2 * Math.PI * Math.random();
        const r = 1.205;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({
        color: 0xffffff, size: 0.008, transparent: true, opacity: 0.35, sizeAttenuation: true
    }));
    scene.add(dots);

    const atmos = new THREE.Mesh(
        new THREE.SphereGeometry(1.3, 64, 64),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.03, side: THREE.BackSide })
    );
    scene.add(atmos);

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.38, 0.005, 16, 200),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })
    );
    ring.rotation.x = Math.PI / 2.2;
    ring.rotation.z = 0.15;
    scene.add(ring);

    function animate() {
        requestAnimationFrame(animate);
        const s = 0.0015;
        globe.rotation.y += s;
        core.rotation.y += s;
        dots.rotation.y += s;
        atmos.rotation.y += s * 0.5;
        ring.rotation.z += 0.0003;
        renderer.render(scene, camera);
    }
    animate();

    function onResize() {
        if (!canvas.clientWidth || !canvas.clientHeight) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
    window.addEventListener('resize', onResize);
})();


/* ===== 4. UI INTERACTIONS ===== */
document.addEventListener('DOMContentLoaded', () => {

    // ── Scroll Reveal (Intersection Observer — slide up 40px + fade) ──
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                // Stagger based on index within parent
                const siblings = [...e.target.parentElement.querySelectorAll('.reveal')];
                const idx = siblings.indexOf(e.target);
                e.target.style.transitionDelay = (idx * 0.07) + 's';
                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => revealObs.observe(el));


    // ── Smooth scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            e.preventDefault();
            const t = document.querySelector(href);
            if (t) {
                t.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu
                document.getElementById('navbar').classList.remove('open');
            }
        });
    });


    // ── Navbar scroll state ──
    const nav = document.getElementById('navbar');
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                nav.classList.toggle('scrolled', window.scrollY > 60);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });


    // ── Hamburger toggle ──
    const ham = document.getElementById('hamburger');
    if (ham) {
        ham.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (nav.classList.contains('open') && !nav.contains(e.target)) {
            nav.classList.remove('open');
        }
    });


    // ── Pill button hover — dynamic streak follow ──
    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const streak = btn.querySelector('.pill-btn__streak');
            if (streak) streak.style.left = (x - 40) + '%';
        });
    });


    // ── Ticker pause on hover ──
    const track = document.querySelector('.ticker-track');
    if (track) {
        track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
        track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    }


    // ── Glass card tilt micro-interaction (desktop only) ──
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = `translateY(-4px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

});
