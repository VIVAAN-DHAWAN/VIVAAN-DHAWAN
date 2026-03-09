/* ============================================
   VIVAAN DHAWAN PORTFOLIO — SCRIPT
   Web3 aesthetic + Glass Pill Nav + Scroll Reveal
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
        }
        update() {
            this.x += this.vx; this.y += this.vy;
            this.vy += 0.04;
            this.life -= this.decay;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.life * 0.8;
            ctx.fillStyle = `rgba(255,255,255,${this.life})`;
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
                const siblings = [...e.target.parentElement.querySelectorAll('.reveal')];
                const idx = siblings.indexOf(e.target);
                e.target.style.transitionDelay = (idx * 0.07) + 's';
                e.target.classList.add('visible');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => revealObs.observe(el));


    // ── Glass Pill Nav — Sliding Indicator ──
    const pillNav = document.getElementById('pillNavWrap');
    const indicator = document.getElementById('pillIndicator');
    const pillLinks = document.querySelectorAll('.pill-link');

    function moveIndicator(link) {
        if (!pillNav || !indicator || !link) return;
        const navRect = pillNav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        indicator.style.left = (linkRect.left - navRect.left) + 'px';
        indicator.style.width = linkRect.width + 'px';
    }

    // Initialize indicator on the active link
    const initialActive = pillNav ? pillNav.querySelector('.pill-link.active') : null;
    if (initialActive) {
        // Set initial width without transition
        indicator.style.transition = 'none';
        moveIndicator(initialActive);
        // Re-enable transition after a tick
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                indicator.style.transition = '';
            });
        });
    }

    // Click handler — with scroll lock to prevent fighting
    let scrollLocked = false;
    let scrollLockTimer = null;

    pillLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Lock scroll-based tracking so it doesn't override the click
            scrollLocked = true;
            if (scrollLockTimer) clearTimeout(scrollLockTimer);
            scrollLockTimer = setTimeout(() => { scrollLocked = false; }, 900);

            pillLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            moveIndicator(link);

            const href = link.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.getElementById('navbar').classList.remove('open');
            }
        });
    });

    // Recalculate on resize
    window.addEventListener('resize', () => {
        const active = pillNav ? pillNav.querySelector('.pill-link.active') : null;
        if (active) moveIndicator(active);
    });


    // ── Scroll-based active section tracking ──
    const sections = document.querySelectorAll('section[id]');
    let scrollTicking = false;

    function updateActiveSection() {
        // Don't update if user just clicked a nav link (let smooth scroll finish)
        if (scrollLocked) return;

        const scrollY = window.scrollY + 200;
        let currentSection = 'home';

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollY >= top && scrollY < top + height) {
                currentSection = section.getAttribute('id');
            }
        });

        const activeLink = pillNav ? pillNav.querySelector(`.pill-link[data-section="${currentSection}"]`) : null;
        if (activeLink && !activeLink.classList.contains('active')) {
            pillLinks.forEach(l => l.classList.remove('active'));
            activeLink.classList.add('active');
            moveIndicator(activeLink);
        }
    }

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                updateActiveSection();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });


    // ── Smooth scroll for all anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        // Skip pill-link clicks (already handled above)
        if (a.classList.contains('pill-link')) return;

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
                document.getElementById('navbar').classList.remove('open');
            }
        });
    });


    // ── Navbar scroll state ──
    const nav = document.getElementById('navbar');
    let navTicking = false;
    window.addEventListener('scroll', () => {
        if (!navTicking) {
            requestAnimationFrame(() => {
                nav.classList.toggle('scrolled', window.scrollY > 60);
                navTicking = false;
            });
            navTicking = true;
        }
    }, { passive: true });


    // ── Hamburger toggle ──
    const ham = document.getElementById('hamburger');
    if (ham) {
        ham.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }
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


    // ── Glass card mouse-follow light + tilt (desktop only) ──
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.glass-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width) * 100;
                const y = ((e.clientY - r.top) / r.height) * 100;
                // Set CSS custom properties for the radial gradient light
                card.style.setProperty('--card-x', x + '%');
                card.style.setProperty('--card-y', y + '%');
                // Tilt effect
                const tiltX = (e.clientX - r.left) / r.width - 0.5;
                const tiltY = (e.clientY - r.top) / r.height - 0.5;
                card.style.transform = `translateY(-4px) rotateX(${-tiltY * 3}deg) rotateY(${tiltX * 3}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

});
