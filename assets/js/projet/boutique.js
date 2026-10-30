/* Boutique : filtres (univers, occasion, technique), recherche et tri gardés dans l'adresse de la page.
   Passage en fondu sans moment vide, rubriques vides grisées, positions recalculées après filtrage. */
import { rafraichir, aller } from '../socle/index.js?v=1';
import { correspond, modele, lireIndex, calmeActif } from './outils.js?v=1';

export function initBoutique() {
  const zone = document.querySelector('[data-boutique]');
  if (!zone) return;
  const grille = zone.querySelector('[data-grille]');
  const cartes = [...grille.querySelectorAll('[data-produit]')];
  const ordreInitial = cartes.slice();
  const index = Object.fromEntries(lireIndex().map((p) => [p.s, p.n + ' ' + p.m]));
  const compte = zone.querySelector('[data-boutique-compte]'), aucun = zone.querySelector('[data-boutique-aucun]');
  const effacer = [...document.querySelectorAll('[data-filtres-effacer]')];
  const q = document.querySelector('[data-boutique-q]');
  const selects = Object.fromEntries([...zone.querySelectorAll('[data-filtre-select]')].map((s) => [s.dataset.filtreSelect, s]));
  const etat = { univers: '', occasion: '', technique: '', tri: '', q: '' };
  const params = new URLSearchParams(location.search);
  Object.keys(etat).forEach((k) => (etat[k] = params.get(k) || ''));

  const passe = (c, sauf) => (sauf === 'univers' || !etat.univers || c.dataset.univers.split(' ').includes(etat.univers))
    && (sauf === 'occasion' || !etat.occasion || c.dataset.occasions.split(' ').includes(etat.occasion))
    && (sauf === 'technique' || !etat.technique || c.dataset.techniques.split(' ').includes(etat.technique))
    && (!etat.q || correspond(index[c.dataset.produit] || c.dataset.nom, etat.q));

  function appliquer({ fondu = true, defiler = false } = {}) {
    const visibles = cartes.filter((c) => passe(c));
    const tri = etat.tri;
    const ordre = (tri ? [...ordreInitial].sort((a, b) => tri === 'prix-croissant' ? a.dataset.prix - b.dataset.prix
      : tri === 'prix-decroissant' ? b.dataset.prix - a.dataset.prix : (+b.dataset.nouveaute) - (+a.dataset.nouveaute)) : ordreInitial);
    const finir = () => {
      ordre.forEach((c) => grille.appendChild(c));
      cartes.forEach((c) => { c.classList.toggle('masque', !visibles.includes(c)); c.classList.remove('sortie'); });
      compte.textContent = modele(visibles.length > 1 ? compte.dataset.modele : compte.dataset.modeleUn, { n: visibles.length });
      aucun.hidden = visibles.length > 0;
      document.querySelectorAll('[data-filtre]').forEach((b) => {
        const g = b.dataset.filtre, v = b.dataset.valeur;
        b.setAttribute('aria-pressed', String(etat[g] === v));
        if (v) {
          const n = cartes.filter((c) => passe(c, g) && (g === 'univers' ? c.dataset.univers : c.dataset.occasions).split(' ').includes(v)).length;
          const s = b.querySelector('[data-puce-n]'); if (s) s.textContent = n;
          b.classList.toggle('vide', n === 0);
        }
      });
      Object.entries(selects).forEach(([k, s]) => (s.value = etat[k]));
      if (q && q.value !== etat.q) q.value = etat.q;
      effacer.forEach((e) => (e.hidden = !(etat.univers || etat.occasion || etat.technique || etat.q || etat.tri)));
      const p = new URLSearchParams();
      Object.entries(etat).forEach(([k, v]) => v && p.set(k, v));
      history.replaceState(history.state, '', location.pathname + (p.toString() ? '?' + p : '') + location.hash);
      rafraichir();
      if (defiler) {
        const haut = zone.getBoundingClientRect().top;
        if (haut < 0) aller(zone, { instant: calmeActif() });
      }
    };
    if (!fondu || calmeActif()) { finir(); return; }
    cartes.forEach((c) => !c.classList.contains('masque') && c.classList.add('sortie'));
    setTimeout(finir, 220);
  }

  zone.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filtre]');
    if (!b) return;
    const g = b.dataset.filtre, v = b.dataset.valeur;
    etat[g] = etat[g] === v ? '' : v;
    appliquer({ defiler: true });
  });
  Object.entries(selects).forEach(([k, s]) => s.addEventListener('change', () => { etat[k] = s.value; appliquer({ defiler: true }); }));
  effacer.forEach((b) => b.addEventListener('click', () => { Object.keys(etat).forEach((k) => (etat[k] = '')); appliquer({ defiler: true }); }));
  if (q) {
    let t = 0;
    q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { etat.q = q.value.trim(); appliquer(); }, 180); });
    q.form.addEventListener('submit', (e) => { e.preventDefault(); etat.q = q.value.trim(); appliquer({ defiler: true }); });
  }
  appliquer({ fondu: false });
}
