/* Effets « Fil d'or » : titres cousus, fil d'or continu, objets qui flottent, articles de Noël suspendus,
   univers en galerie horizontale, savoir-faire en 4 temps, frise cousue, éventail, carte brodée,
   cartes qui s'inclinent, boutons magnétiques. Tout est coupé en mode calme (état final directement). */
import { boucle, etat } from '../socle/index.js?v=1';
import { calmeActif, souris } from './outils.js?v=1';

const gsap = () => window.gsap;
const ST = () => window.ScrollTrigger;
const tous = (s, r = document) => [...r.querySelectorAll(s)];

/* Révélation d'un tracé cousu (pointillés) : par découpe, de gauche à droite. */
export const reveler = (el, opts = {}) => gsap().fromTo(el, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'power2.inOut', duration: 1.2, ...opts });

function titresCousus() {
  const titres = tous('.titre-section[data-brode]');
  if (!titres.length) return;
  if (calmeActif()) { titres.forEach((t) => t.classList.add('brode')); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('brode'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -12% 0px' });
  titres.forEach((t) => io.observe(t));
}

/* Fil d'or continu le long de la marge gauche, cousu au fil de la lecture (grand écran seulement). */
function filContinu() {
  if (calmeActif() || !ST() || innerWidth < 1280 || !document.querySelector('main section')) return;
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'fil-continu'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('data-audit-ignorer', '');
  svg.setAttribute('viewBox', '0 0 44 1000'); svg.setAttribute('preserveAspectRatio', 'none');
  const p = document.createElementNS(ns, 'path');
  p.setAttribute('d', 'M22 0 C 8 120, 36 220, 22 330 S 6 560, 24 680 S 38 880, 20 1000');
  svg.appendChild(p);
  document.body.appendChild(svg);
  gsap().fromTo(svg, { clipPath: 'inset(0% 0% 100% 0%)' }, {
    clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
    scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: 0.4 },
  });
}

/* Objets de l'ouverture : ils flottent doucement et suivent un peu la souris. */
function heroVivant() {
  const scene = document.querySelector('[data-hero-scene]');
  if (!scene || calmeActif()) return;
  const objets = tous('.hero-objet .media', scene);
  let mx = 0, my = 0, cx = 0, cy = 0;
  if (souris()) {
    scene.addEventListener('pointermove', (e) => { const r = scene.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; });
    scene.addEventListener('pointerleave', () => { mx = 0; my = 0; });
  }
  boucle(scene, (dt, t) => {
    const k = 1 - Math.exp(-dt * 4);
    cx += (mx - cx) * k; cy += (my - cy) * k;
    objets.forEach((o, i) => {
      const prof = i === 0 ? 14 : 26;
      o.style.transform = `translate3d(${(cx * prof).toFixed(2)}px, ${(Math.sin(t * (0.9 + i * .25) + i) * 6 + cy * prof).toFixed(2)}px, 0) rotate(${(Math.sin(t * .6 + i) * (i ? 1.6 : .6)).toFixed(2)}deg)`;
    });
  });
}

/* Articles de Noël suspendus : pendules amortis, relancés par le défilement et le survol. */
function suspendus() {
  const ul = document.querySelector('[data-suspendus]');
  if (!ul || calmeActif()) return;
  const items = tous('[data-suspendu]', ul).map((el, i) => ({ el, a: (i % 2 ? 1 : -1) * 4, v: 0 }));
  let dernierY = scrollY;
  window.addEventListener('scroll', () => {
    const dy = scrollY - dernierY; dernierY = scrollY;
    items.forEach((it, i) => { it.v += Math.max(-30, Math.min(30, dy)) * (i % 2 ? .35 : -.3); });
  }, { passive: true });
  items.forEach((it) => it.el.addEventListener('pointerenter', () => { it.v += 60; }));
  boucle(ul, (dt) => {
    items.forEach((it) => {
      const acc = -28 * it.a - 2.2 * it.v;
      it.v += acc * dt; it.a += it.v * dt;
      it.a = Math.max(-10, Math.min(10, it.a));
      it.el.style.setProperty('--angle', `${it.a.toFixed(2)}deg`);
    });
  });
}

/* Univers : galerie horizontale épinglée sur ordinateur, coutures qui se dessinent à l'entrée de chaque écusson. */
function universEpingle() {
  const section = document.querySelector('.univers');
  const piste = section && section.querySelector('.univers-piste');
  if (!piste || calmeActif() || !ST()) return;
  ST().matchMedia({
    '(min-width: 761px)': () => {
      piste.removeAttribute('tabindex');
      const distance = () => Math.max(0, piste.scrollWidth - window.innerWidth);
      const barre = section.querySelector('.galerie-progres span');
      const tween = gsap().fromTo(piste, { x: 0 }, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top top', end: () => '+=' + distance(), pin: true, anticipatePin: 1, scrub: 1, invalidateOnRefresh: true,
          onUpdate: (s) => barre && (barre.style.transform = `scaleX(${s.progress})`),
        },
      });
      tous('.ecusson-couture', piste).forEach((c) => reveler(c, { duration: .9, scrollTrigger: { trigger: c.closest('.ecusson'), containerAnimation: tween, start: 'left 92%', toggleActions: 'play none none none' } }));
      return () => piste.setAttribute('tabindex', '0');
    },
    '(max-width: 760px)': () => {
      tous('.ecusson-couture', piste).forEach((c) => reveler(c, { duration: .9, scrollTrigger: { trigger: c, start: 'top 85%', toggleActions: 'play none none none' } }));
    },
  });
}

/* Savoir-faire : scène épinglée en 4 temps (ordinateur), la couture dorée avance d'un geste à l'autre. */
function savoirFaire() {
  const section = document.querySelector('[data-savoir-faire]');
  if (!section || calmeActif() || !ST()) return;
  const etapes = tous('[data-sf-etape]', section), plans = tous('[data-sf-plan]', section), effet = section.querySelector('[data-sf-effet]');
  let courant = -1;
  const activer = (i) => {
    if (i === courant) return; courant = i;
    etapes.forEach((e, k) => e.classList.toggle('actif', k === i));
    plans.forEach((p, k) => p.classList.toggle('actif', k === i));
  };
  ST().matchMedia({
    '(min-width: 901px)': () => {
      const st = ST().create({
        trigger: section, start: 'top top', end: '+=260%', pin: true, anticipatePin: 1,
        onUpdate: (s) => { activer(Math.min(3, Math.floor(s.progress * 4))); if (effet) effet.style.clipPath = `inset(0% ${(100 - Math.min(1, s.progress * 1.05) * 100).toFixed(1)}% 0% 0%)`; },
      });
      activer(0);
      return () => { st.kill(); etapes.forEach((e) => e.classList.remove('actif')); plans.forEach((p) => p.classList.add('actif')); courant = -1; };
    },
  });
}

/* Frise des 3 semaines et étapes des commandes groupées : la couture se dessine au défilement. */
function coutures() {
  if (calmeActif() || !ST()) return;
  tous('.frise-couture, .etapes-couture').forEach((svg) => {
    const vertical = svg.classList.contains('etapes-couture');
    gsap().fromTo(svg, { clipPath: vertical ? 'inset(0% 0% 100% 0%)' : 'inset(0% 100% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: svg.parentElement, start: 'top 75%', end: 'bottom 55%', scrub: 0.5 },
    });
  });
  tous('.carte-brodee svg').forEach((svg) => {
    reveler(svg, { duration: 1.6, scrollTrigger: { trigger: svg, start: 'top 80%', toggleActions: 'play none none none' } });
    const halo = svg.querySelector('.carte-point-halo');
    if (halo) gsap().fromTo(halo, { scale: .6, opacity: .9, transformOrigin: '50% 50%' }, { scale: 2.2, opacity: 0, duration: 1.4, repeat: 2, ease: 'power1.out', delay: 1.2, scrollTrigger: { trigger: svg, start: 'top 80%', toggleActions: 'play none none none' } });
  });
}

/* Éventail des réalisations de groupe : les cartes s'ouvrent à l'arrivée de la section. */
function eventail() {
  const ul = document.querySelector('[data-eventail]');
  if (!ul || calmeActif() || !ST()) return;
  ST().matchMedia({
    '(min-width: 901px)': () => {
      gsap().fromTo(ul, { '--ouvert': 0 }, { '--ouvert': 1, duration: 1.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: ul, start: 'top 75%', toggleActions: 'play none none none' } });
    },
  });
}

/* Cartes produits qui s'inclinent en 3D et boutons magnétiques (souris seulement). */
function survols() {
  if (calmeActif() || !souris()) return;
  document.addEventListener('pointermove', (e) => {
    const lien = e.target.closest && e.target.closest('.produit-lien');
    if (lien) {
      const r = lien.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      lien.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateZ(0)`;
    }
    const b = e.target.closest && e.target.closest('.bouton--large');
    if (b && !b.closest('.fenetre')) {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * .12).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * .18).toFixed(1)}px)`;
    }
  }, { passive: true });
  document.addEventListener('pointerout', (e) => {
    const lien = e.target.closest && e.target.closest('.produit-lien');
    if (lien && !lien.contains(e.relatedTarget)) lien.style.transform = '';
    const b = e.target.closest && e.target.closest('.bouton--large');
    if (b && !b.contains(e.relatedTarget)) b.style.transform = '';
  }, { passive: true });
}

/* FAQ : ouverture et fermeture animées sans à-coup. */
function faq() {
  tous('.faq-item').forEach((d) => {
    const s = d.querySelector('summary'), r = d.querySelector('.faq-reponse');
    if (!s || !r) return;
    s.addEventListener('click', (e) => {
      if (calmeActif() || !r.animate) return;
      e.preventDefault();
      if (d.open) {
        const h = r.offsetHeight;
        r.animate([{ height: h + 'px' }, { height: '0px' }], { duration: 280, easing: 'cubic-bezier(.4,0,.2,1)' }).finished.then(() => { d.open = false; }, () => { d.open = false; });
      } else {
        d.open = true;
        const h = r.offsetHeight;
        r.animate([{ height: '0px' }, { height: h + 'px' }], { duration: 320, easing: 'cubic-bezier(.22,1,.36,1)' });
      }
    });
  });
}

export function preparerEffets() {
  titresCousus();
  faq();
  if (!gsap()) return;
  filContinu();
  heroVivant();
  suspendus();
  universEpingle();
  savoirFaire();
  coutures();
  eventail();
  survols();
}

/* Premier écran : ce qui apparaît après l'intro ou pendant que le voile se retire. */
export function revelerPremierEcran(tl, debut = 0) {
  const g = gsap();
  const premier = document.querySelector('main > section, main > nav + section');
  if (!g || !premier) return tl;
  const t = tl || g.timeline();
  const lignes = tous('.hero-ligne', premier);
  if (lignes.length) t.fromTo(lignes, { yPercent: 108, opacity: 1 }, { yPercent: 0, opacity: 1, duration: .8, stagger: .1, ease: 'power3.out' }, debut);
  const couture = premier.querySelector('.hero-couture');
  if (couture) t.add(reveler(couture, { duration: .7 }), debut + .45);
  const fil = premier.querySelector('.hero-fil');
  if (fil) t.add(reveler(fil, { duration: 1.1 }), debut + .1);
  const objets = tous('.hero-objet', premier);
  if (objets.length) t.fromTo(objets, { y: 40, opacity: 0, scale: .96 }, { y: 0, opacity: 1, scale: 1, duration: .9, stagger: .12, ease: 'power3.out' }, debut + .1);
  const autres = tous('[data-anime="gsap"]', document.querySelector('main')).filter((el) => !el.classList.contains('hero-ligne') && !el.classList.contains('hero-objet'));
  if (autres.length) t.fromTo(autres, { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .08, ease: 'power3.out' }, debut + .15);
  return t;
}

export function etatFinalEffets() {
  const g = gsap();
  if (!g) return;
  g.set('[data-anime="gsap"], .hero-ligne, .hero-objet', { clearProps: 'transform,opacity' });
  g.set('.hero-couture, .hero-fil', { clearProps: 'clipPath' });
  tous('.titre-section[data-brode]').forEach((t) => t.classList.add('brode'));
}

export { etat };
