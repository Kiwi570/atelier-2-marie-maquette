/* Recherche dans l'en-tête : fenêtre, résultats en direct (sans accents, sans majuscules, pluriels confondus). */
import { fenetre } from './fenetre.js?v=1';
import { prixFr, correspond, modele, lireIndex } from './outils.js?v=1';

export function initRecherche() {
  const el = document.querySelector('[data-recherche]');
  if (!el) return;
  const champ = el.querySelector('[data-recherche-champ]'), ul = el.querySelector('[data-recherche-resultats]');
  const compte = el.querySelector('[data-recherche-compte]'), aucun = el.querySelector('[data-recherche-aucun]'), tout = el.querySelector('[data-recherche-tout]');
  const f = fenetre(el, { focusInitial: () => champ });
  document.querySelectorAll('[data-recherche-ouvrir]').forEach((b) => b.addEventListener('click', () => f.ouvrir(b)));
  let index = null;
  const maj = () => {
    index = index || lireIndex();
    const q = champ.value.trim();
    const res = q ? index.filter((p) => correspond(p.n + ' ' + p.m, q)) : [];
    ul.replaceChildren(...res.slice(0, 8).map((p) => {
      const li = document.createElement('li'), a = document.createElement('a'), img = document.createElement('img'), nom = document.createElement('span'), prix = document.createElement('strong');
      a.href = '/boutique/' + p.s; a.dataset.libelle = p.n;
      img.src = p.i; img.alt = ''; img.width = 56; img.height = 56; img.loading = 'lazy';
      nom.textContent = p.n; prix.textContent = prixFr(p.p);
      a.append(img, nom, prix); li.append(a); return li;
    }));
    compte.textContent = q ? modele(compte.dataset.modele, { n: res.length }) : '';
    aucun.hidden = !q || res.length > 0;
    tout.href = '/boutique' + (q ? '?q=' + encodeURIComponent(q) : '');
  };
  champ.addEventListener('input', maj);
  el.querySelector('form').addEventListener('submit', (e) => { e.preventDefault(); const a = ul.querySelector('a'); (a || tout).click(); });
}
