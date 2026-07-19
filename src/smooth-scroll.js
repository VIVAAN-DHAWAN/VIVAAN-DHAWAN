import Lenis from 'lenis';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!prefersReducedMotion.matches) {
    const lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.1,
        anchors: false
    });

    function frame(time) {
        lenis.raf(time);
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);

    window.portfolioScroll = {
        to(target, options = {}) {
            lenis.scrollTo(target, {
                duration: 1.2,
                offset: -80,
                ...options
            });
        }
    };
}
