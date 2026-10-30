/* Démo de l'accueil : couleur du sac, prénom et couleur du fil, en aperçu sur le sac.
   Le bouton mène à la fiche du sac avec les choix déjà faits (paramètres dans l'adresse). */
import { partir } from '../socle/index.js?v=1';
import { calmeActif } from './outils.js?v=1';

export function broder(texte) {
  if (!texte || calmeActif() || !texte.animate) return;
  texte.getAnimations().forEach((a) => a.cancel());
  texte.animate([{ strokeDashoffset: 260, fillOpacity: 0 }, { strokeDashoffset: 0, fillOpacity: 0, offset: .7 }, { strokeDashoffset: 0, fillOpacity: 1 }], { duration: 1100, easing: 'ease-out' });
}

export function initDemo() {
  const demo = document.querySelector('[data-demo]');
  if (!demo) return;
  const form = demo.querySelector('[data-demo-form]'), texte = demo.querySelector('[data-demo-texte]'), champ = demo.querySelector('[data-demo-prenom]');
  const sacs = [...demo.querySelectorAll('[data-sac]')], svg = demo.querySelector('.demo-broderie');
  let t = 0;
  const maj = (anime) => {
    const couleur = form.querySelector('[name="couleur"]:checked'), fil = form.querySelector('[name="fil"]:checked');
    sacs.forEach((s) => s.classList.toggle('actif', couleur && s.dataset.sac === couleur.value));
    if (fil) svg.style.setProperty('--fil', fil.dataset.hex);
    demo.querySelectorAll('[data-demo-valeur]').forEach((v) => { const r = form.querySelector(`[name="${v.dataset.demoValeur}"]:checked`); v.textContent = r ? '· ' + r.value : ''; });
    texte.textContent = champ.value.trim() || champ.defaultValue;
    texte.style.fontSize = '';
    try { const l = texte.getBBox().width; if (l > 540) texte.style.fontSize = (88 * 540 / l).toFixed(1) + 'px'; } catch {}
    if (anime) { clearTimeout(t); t = setTimeout(() => broder(texte), 120); }
  };
  form.addEventListener('change', () => maj(true));
  champ.addEventListener('input', () => maj(true));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const p = new URLSearchParams(new FormData(form));
    const url = new URL(form.getAttribute('action') + '?' + p.toString(), location.href);
    partir(url, form.dataset.libelle || '');
  });
  maj(false);
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { broder(texte); io.disconnect(); } }), { threshold: .5 });
  io.observe(svg);
}
