/* ================================================
   TIVORA ELECTRONICS — konva-effects.js
   Canvas animations using Konva.js
   Inspired by Sansui scroll transition style
================================================ */

(function () {
    'use strict';

    /* ── helpers ─────────────────────────────── */
    const rand = (min, max) => Math.random() * (max - min) + min;
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    /* ══════════════════════════════════════════
       1. HERO — floating red particle field
       Parallax-shifts on mouse move / scroll
    ══════════════════════════════════════════ */
    function initHeroParticles() {
        const container = document.getElementById('hero-canvas');
        if (!container) return;

        const W = container.offsetWidth || window.innerWidth;
        const H = container.offsetHeight || window.innerHeight;

        const stage = new Konva.Stage({ container: 'hero-canvas', width: W, height: H });
        const layer = new Konva.Layer();
        stage.add(layer);

        const PARTICLES = 60;
        const particles = [];

        /* ── create circles ── */
        for (let i = 0; i < PARTICLES; i++) {
            const big = Math.random() < 0.15;
            const r = big ? rand(6, 14) : rand(1.5, 5);
            const alpha = big ? rand(0.04, 0.1) : rand(0.06, 0.22);

            const c = new Konva.Circle({
                x: rand(0, W), y: rand(0, H),
                radius: r,
                fill: `rgba(230,57,70,${alpha})`,
                shadowColor: 'rgba(230,57,70,0.4)',
                shadowBlur: big ? 20 : 0,
                listening: false,
            });

            // Store velocity
            c._vx = rand(-0.25, 0.25);
            c._vy = rand(-0.18, 0.18);
            c._baseX = c.x();
            c._baseY = c.y();
            c._pxOff = 0; // parallax offset
            c._pyOff = 0;
            c._parallaxStrength = rand(10, 40) * (big ? 1.8 : 1);

            layer.add(c);
            particles.push(c);
        }

        /* ── add subtle grid lines ── */
        for (let i = 0; i < 6; i++) {
            layer.add(new Konva.Line({
                points: [i * (W / 5), 0, i * (W / 5), H],
                stroke: 'rgba(230,57,70,0.025)', strokeWidth: 1, listening: false,
            }));
            layer.add(new Konva.Line({
                points: [0, i * (H / 5), W, i * (H / 5)],
                stroke: 'rgba(230,57,70,0.025)', strokeWidth: 1, listening: false,
            }));
        }

        layer.draw();

        /* ── animate ── */
        const anim = new Konva.Animation((frame) => {
            const t = frame.time / 1000;
            particles.forEach((c, idx) => {
                // Drift
                let nx = c._baseX + Math.sin(t * 0.4 + idx) * 18 + c._pxOff;
                let ny = c._baseY + Math.cos(t * 0.35 + idx * 1.3) * 12 + c._pyOff;

                // Wrap edges
                nx = ((nx % W) + W) % W;
                ny = ((ny % H) + H) % H;

                c.x(nx);
                c.y(ny);
            });
        }, layer);
        anim.start();

        /* ── mouse parallax ── */
        let mx = 0, my = 0;
        window.addEventListener('mousemove', e => {
            mx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
            my = (e.clientY / window.innerHeight - 0.5) * 2;
            particles.forEach(c => {
                c._pxOff = -mx * c._parallaxStrength;
                c._pyOff = -my * c._parallaxStrength * 0.6;
            });
        }, { passive: true });

        /* ── resize ── */
        new ResizeObserver(() => {
            const nw = container.offsetWidth;
            const nh = container.offsetHeight;
            stage.width(nw); stage.height(nh);
        }).observe(container);
    }

    /* ══════════════════════════════════════════
       2. TECHNOLOGY SECTION — pulsing ring orb
       Appears on the right of the section
    ══════════════════════════════════════════ */
    function initTechCanvas() {
        const container = document.getElementById('tech-canvas');
        if (!container) return;

        const W = container.offsetWidth || 400;
        const H = container.offsetHeight || 500;
        const cx = W * 0.55, cy = H * 0.5;

        const stage = new Konva.Stage({ container: 'tech-canvas', width: W, height: H });
        const layer = new Konva.Layer();
        stage.add(layer);

        /* ── concentric rings ── */
        const RINGS = 7;
        const rings = [];
        for (let i = 0; i < RINGS; i++) {
            const radius = 40 + i * 42;
            const alpha = 0.18 - i * 0.02;
            const ring = new Konva.Circle({
                x: cx, y: cy,
                radius,
                stroke: `rgba(230,57,70,${Math.max(0.03, alpha)})`,
                strokeWidth: i === 0 ? 2 : 1,
                fill: 'transparent',
                listening: false,
            });
            layer.add(ring);
            rings.push({ shape: ring, baseR: radius });
        }

        /* ── centre glowing dot ── */
        const core = new Konva.Circle({
            x: cx, y: cy, radius: 10,
            fill: 'rgba(230,57,70,0.85)',
            shadowColor: '#e63946', shadowBlur: 30, listening: false,
        });
        layer.add(core);

        /* ── orbiting dots ── */
        const orbiters = [];
        for (let i = 0; i < 5; i++) {
            const d = new Konva.Circle({
                x: cx, y: cy, radius: rand(2, 4.5),
                fill: 'rgba(230,57,70,0.6)',
                shadowColor: '#e63946', shadowBlur: 8, listening: false,
            });
            layer.add(d);
            orbiters.push({ shape: d, orbitR: rand(60, 250), speed: rand(0.3, 0.9), phase: rand(0, Math.PI * 2) });
        }

        layer.draw();

        const anim = new Konva.Animation((frame) => {
            const t = frame.time / 1000;

            /* Breathe rings */
            rings.forEach((r, i) => {
                const scale = 1 + Math.sin(t * 0.8 + i * 0.5) * 0.03;
                r.shape.radius(r.baseR * scale);
            });

            /* Pulse core */
            const pulse = 1 + Math.sin(t * 2) * 0.3;
            core.shadowBlur(30 * pulse);
            core.radius(9 + pulse * 2);

            /* Move orbiters */
            orbiters.forEach(o => {
                const angle = t * o.speed + o.phase;
                o.shape.x(cx + Math.cos(angle) * o.orbitR);
                o.shape.y(cy + Math.sin(angle) * o.orbitR * 0.5);
            });
        }, layer);

        /* ── Show only when section in view ── */
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) anim.start();
                else anim.stop();
            });
        }, { threshold: 0.1 });
        const techSec = document.getElementById('tech');
        if (techSec) io.observe(techSec);
        else anim.start();

        /* resize */
        new ResizeObserver(() => {
            const nw = container.offsetWidth;
            const nh = container.offsetHeight;
            stage.width(nw); stage.height(nh);
        }).observe(container);
    }

    /* ══════════════════════════════════════════
       3. SOUND SECTION — live Konva waveform
       Smooth animated audio bar visualiser
    ══════════════════════════════════════════ */
    function initSoundWaveform() {
        const container = document.getElementById('sound-canvas');
        if (!container) return;

        const W = container.offsetWidth || 400;
        const H = 140;
        container.style.height = H + 'px';

        const stage = new Konva.Stage({ container: 'sound-canvas', width: W, height: H });
        const layer = new Konva.Layer();
        stage.add(layer);

        const BAR_COUNT = 28;
        const barW = Math.floor((W - (BAR_COUNT - 1) * 5) / BAR_COUNT);
        const gap = 5;
        const bars = [];
        const phases = Array.from({ length: BAR_COUNT }, (_, i) => rand(0, Math.PI * 2));
        const speeds = Array.from({ length: BAR_COUNT }, (_, i) => rand(0.8, 2.2));

        for (let i = 0; i < BAR_COUNT; i++) {
            const x = i * (barW + gap);
            /* gradient fill via Konva fillLinearGradientColorStops */
            const bar = new Konva.Rect({
                x, y: H, width: barW, height: 0,
                cornerRadius: [3, 3, 0, 0],
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: 0, y: -H },
                fillLinearGradientColorStops: [0, 'rgba(230,57,70,0.9)', 1, 'rgba(230,57,70,0.2)'],
                listening: false,
            });
            layer.add(bar);
            bars.push(bar);
        }

        /* mirror (reflection) bars */
        const mirrorBars = [];
        for (let i = 0; i < BAR_COUNT; i++) {
            const x = i * (barW + gap);
            const mb = new Konva.Rect({
                x, y: H, width: barW, height: 0,
                cornerRadius: [0, 0, 3, 3],
                fillLinearGradientStartPoint: { x: 0, y: 0 },
                fillLinearGradientEndPoint: { x: 0, y: H },
                fillLinearGradientColorStops: [0, 'rgba(230,57,70,0.25)', 1, 'rgba(230,57,70,0)'],
                listening: false,
            });
            layer.add(mb);
            mirrorBars.push(mb);
        }

        /* baseline */
        layer.add(new Konva.Line({
            points: [0, H, W, H],
            stroke: 'rgba(230,57,70,0.25)', strokeWidth: 1, listening: false,
        }));

        layer.draw();

        let active = false;
        const anim = new Konva.Animation((frame) => {
            const t = frame.time / 1000;
            for (let i = 0; i < BAR_COUNT; i++) {
                const raw = (Math.sin(t * speeds[i] + phases[i]) + 1) / 2;
                /* Envelope: centre bars taller */
                const env = Math.sin((i / (BAR_COUNT - 1)) * Math.PI);
                const h = clamp(raw * env * (H - 8) + 8, 6, H - 4);
                bars[i].y(H - h);
                bars[i].height(h);
                // reflections at 30%
                const mh = h * 0.3;
                mirrorBars[i].height(mh);
            }
        }, layer);

        /* Only animate when sound section is visible */
        const soundSec = document.querySelector('.sound') || document.querySelector('#sound');
        if (soundSec) {
            const io2 = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    if (e.isIntersecting) { anim.start(); active = true; }
                    else { anim.stop(); active = false; }
                });
            }, { threshold: 0.2 });
            io2.observe(soundSec);
        } else {
            anim.start();
        }

        /* resize */
        new ResizeObserver(() => {
            const nw = container.offsetWidth;
            stage.width(nw);
        }).observe(container);
    }

    /* ══════════════════════════════════════════
       4. SCROLL-DRIVEN HERO CANVAS FADE
       Particles fade + compress on scroll down
    ══════════════════════════════════════════ */
    function initHeroScrollEffect() {
        const heroCanvas = document.getElementById('hero-canvas');
        if (!heroCanvas) return;
        window.addEventListener('scroll', () => {
            const hero = document.getElementById('home');
            if (!hero) return;
            const pct = clamp(window.scrollY / hero.offsetHeight, 0, 1);
            heroCanvas.style.opacity = 1 - pct * 0.8;
            heroCanvas.style.transform = `translateY(${pct * -30}px)`;
        }, { passive: true });
    }

    /* ══════════════════════════════════════════
       BOOT — wait for Konva to be available
    ══════════════════════════════════════════ */
    function boot() {
        if (typeof Konva === 'undefined') {
            setTimeout(boot, 80);
            return;
        }
        initHeroParticles();
        initTechCanvas();
        initSoundWaveform();
        initHeroScrollEffect();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

})();
