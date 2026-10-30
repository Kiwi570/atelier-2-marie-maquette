/* L'Atelier 2 Marie — effets propres au projet. Le socle gère l'ouverture, les transitions, l'en-tête,
   le menu, le mode calme, les boucles, les mesures et les formulaires : ce fichier règle le reste. */
import { demarrer } from './socle/index.js?v=1';
import { initPanier } from './projet/panier.js?v=1';
import { initRecherche } from './projet/recherche.js?v=1';
import { initBoutique } from './projet/boutique.js?v=1';
import { initFiche } from './projet/fiche.js?v=1';
import { initDevis } from './projet/devis.js?v=1';
import { initDemo } from './projet/demo.js?v=1';
import { initLin } from './projet/lin.js?v=1';
import { preparerEffets, revelerPremierEcran, etatFinalEffets } from './projet/effets.js?v=1';

const gsap = window.gsap;
const essayer = (f) => { try { f(); } catch (err) { console.error('[atelier]', f.name, err); } };

/* Un toucher ou un clic qui passe l'intro ne doit pas suivre le lien placé dessous une fois le panneau retiré. */
let appuiPendantIntro = 0;
const pendantIntro = () => !document.documentElement.classList.contains('pret');
['pointerdown', 'touchstart'].forEach((t) => window.addEventListener(t, () => { if (pendantIntro()) appuiPendantIntro = performance.now(); }, { capture: true, passive: true }));
window.addEventListener('click', (e) => {
  if (appuiPendantIntro && performance.now() - appuiPendantIntro < 700) { e.preventDefault(); e.stopImmediatePropagation(); }
  appuiPendantIntro = 0;
}, { capture: true });

/* Les scènes épinglées ne le sont que sur grand écran et sans le mode calme : ailleurs, l'en-tête reste disponible. */
document.querySelectorAll('[data-epingle-des]').forEach((s) => {
  const calme = document.documentElement.classList.contains('calme');
  if (calme || !matchMedia(`(min-width: ${s.dataset.epingleDes}px)`).matches) { s.removeAttribute('data-entete-cache'); s.removeAttribute('data-plein-ecran'); }
});

demarrer({
  preparer() {
    [initPanier, initRecherche, initBoutique, initFiche, initDevis, initDemo, preparerEffets].forEach(essayer);
  },
  /* Intro (environ 2,2 s) : le tambour à broder est visible dès la première image ; l'aiguille brode
     « L'Atelier 2 Marie » au point de chaînette, puis on plonge dans le tambour : sa toile de lin couvre l'écran
     et la page apparaît. */
  jouer() {
    if (!gsap) return null;
    const panneau = document.querySelector('[data-ouverture]');
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    if (!panneau) return revelerPremierEcran(tl, 0);
    const tambour = panneau.querySelector('.tambour');
    const avance = panneau.querySelector('.tambour-avance'), aiguille = panneau.querySelector('.tambour-aiguille');
    const pointe = aiguille.querySelector('path');
    /* Rayon de la toile (246 sur 600 dans le dessin) et agrandissement qui lui fait couvrir le coin le plus éloigné. */
    const rt = tambour.getBoundingClientRect();
    const cx = rt.left + rt.width / 2, cy = rt.top + rt.height / 2;
    const rayonToile = (rt.width * 246) / 600;
    const zoom = (Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy)) / rayonToile) * 1.06;
    const bord = Math.hypot(innerWidth - cx, innerHeight / 4);
    tl.fromTo(avance, { attr: { width: 0 } }, { attr: { width: 470 }, duration: 1.05, ease: 'power1.inOut' }, 0.12)
      .fromTo(aiguille, { x: 70, y: 330 }, { x: 540, y: 330, duration: 1.05, ease: 'power1.inOut' }, 0.12)
      .fromTo(pointe, { y: 0 }, { y: -16, duration: 0.09, repeat: 11, yoyo: true, ease: 'sine.inOut' }, 0.12)
      .fromTo('.tambour-texte--plein', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.05)
      .fromTo('.tambour-ligne', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.1)
      .fromTo(aiguille, { opacity: 1 }, { opacity: 0, duration: 0.2 }, 1.18)
      .fromTo(tambour, { scale: 1 }, {
        scale: zoom, duration: 0.85, ease: 'power2.in',
        /* La bande de la barre de défilement prend la couleur du lin dès que la toile atteint le bord droit. */
        onUpdate() {
          if (rayonToile * gsap.getProperty(tambour, 'scale') >= bord) panneau.dataset.gouttiere = '#f2ece1';
          else delete panneau.dataset.gouttiere;
        },
      }, 1.32)
      .set(panneau, { backgroundColor: '#f2ece1', backgroundImage: 'none' }, 2.17)
      .to(panneau, { autoAlpha: 0, duration: 0.22, ease: 'power1.out' }, 2.17);
    revelerPremierEcran(tl, 2.02);
    return tl;
  },
  etatFinal() {
    etatFinalEffets();
    if (gsap) gsap.set(['[data-ouverture]', '.tambour'], { clearProps: 'all' });
    const o = document.querySelector('[data-ouverture]'); if (o) delete o.dataset.gouttiere;
  },
  arrivee() {
    revelerPremierEcran(null, 0.05);
  },
  pret: [document.fonts ? document.fonts.load('76px "Great Vibes"') : null].filter(Boolean),
});

/* Le lin animé démarre après l'ouverture (jamais pendant). */
window.addEventListener('socle:pret', () => essayer(initLin), { once: true });
