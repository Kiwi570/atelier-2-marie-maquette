/* Fenêtres du projet (recherche, panier, visionneuse) : ouverture depuis un bouton, Échap et fond pour fermer,
   focus gardé dedans puis rendu au bouton, page bloquée derrière, bande de la barre de défilement suivie. */
import { bloquerDefilement, debloquerDefilement, suivre, lacher } from '../socle/index.js?v=2';

const ouvertes = [];

function focusables(el) {
  return [...el.querySelectorAll('a[href], button:not([disabled]), input:not([type="hidden"]):not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])')]
    .filter((x) => x.offsetParent !== null && !x.closest('[hidden]'));
}

export function fenetre(el, { surOuverture, surFermeture, focusInitial } = {}) {
  let retour = null;
  const id = el.id || Math.random().toString(36).slice(2);
  const boutons = () => document.querySelectorAll(`[aria-controls="${id}"]`);
  const api = {
    ouverte: false,
    ouvrir(depuis) {
      if (api.ouverte) return;
      api.ouverte = true;
      retour = depuis || document.activeElement;
      el.hidden = false;
      boutons().forEach((b) => b.setAttribute('aria-expanded', 'true'));
      bloquerDefilement('fenetre-' + id);
      suivre(el, 400);
      ouvertes.push(api);
      surOuverture && surOuverture();
      requestAnimationFrame(() => { const f = (focusInitial && focusInitial()) || focusables(el)[0]; f && f.focus({ preventScroll: true }); });
    },
    fermer({ rendreFocus = true } = {}) {
      if (!api.ouverte) return;
      api.ouverte = false;
      el.hidden = true;
      boutons().forEach((b) => b.setAttribute('aria-expanded', 'false'));
      debloquerDefilement('fenetre-' + id);
      lacher(el);
      ouvertes.splice(ouvertes.indexOf(api), 1);
      surFermeture && surFermeture();
      if (rendreFocus && retour && retour.focus) retour.focus({ preventScroll: true });
    },
  };
  el.addEventListener('click', (e) => { if (e.target.closest('[data-fermer]')) api.fermer(); });
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.preventDefault(); api.fermer(); return; }
    if (e.key !== 'Tab') return;
    const f = focusables(el);
    if (!f.length) return;
    const i = f.indexOf(document.activeElement);
    if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
    else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
  });
  return api;
}
