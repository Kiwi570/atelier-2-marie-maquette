/* Demande de devis en 4 étapes : déroulé annoncé, hauteur animée entre les étapes, récapitulatif en direct
   (estimation d'après les prix de la boutique, vérifiable : data-total), date au plus tôt avec le délai de fabrication.
   L'envoi final est géré par le socle (formulaire simulé, pas de double envoi). */
import { rafraichir } from '../socle/index.js?v=1';
import { prixFr, modele, calmeActif } from './outils.js?v=1';

export function initDevis() {
  const form = document.querySelector('[data-devis]');
  if (!form) return;
  const etapes = [...form.querySelectorAll('[data-devis-etape]')];
  const num = form.querySelector('[data-devis-num]');
  const suivant = form.querySelector('[data-devis-suivant]'), retour = form.querySelector('[data-devis-retour]'), envoyer = form.querySelector('[data-devis-envoyer]');
  const lignes = document.querySelector('[data-recap-lignes]'), totalEl = document.querySelector('[data-recap-total]'), vide = document.querySelector('[data-recap-vide]');
  const erreurArticles = form.querySelector('[data-devis-erreur-articles]');
  let n = 1;

  const recap = () => {
    const choisis = [...form.querySelectorAll('[data-devis-qte]')].map((q) => ({ q: Math.max(0, parseInt(q.value, 10) || 0), li: q.closest('[data-ligne-prix]') })).filter((x) => x.q > 0);
    const total = choisis.reduce((s, x) => s + x.q * parseFloat(x.li.dataset.lignePrix), 0);
    lignes.replaceChildren(...choisis.map((x) => {
      const li = document.createElement('li'), s = document.createElement('span'), b = document.createElement('strong');
      s.textContent = `${x.q} × ${x.li.dataset.nom}`; b.textContent = prixFr(x.q * parseFloat(x.li.dataset.lignePrix));
      li.append(s, b); return li;
    }));
    vide.hidden = choisis.length > 0;
    totalEl.textContent = total ? prixFr(total) : '—';
    document.querySelectorAll('[data-recap-total-barre]').forEach((b) => { b.textContent = total ? prixFr(total) : '—'; });
    totalEl.dataset.total = total.toFixed(2);
    return choisis.length;
  };

  const montrer = (anime = true) => {
    const avant = form.offsetHeight;
    etapes.forEach((e) => (e.hidden = +e.dataset.devisEtape !== n));
    num.textContent = modele(num.dataset.modele, { n });
    retour.hidden = n === 1; suivant.hidden = n === 4; envoyer.hidden = n !== 4;
    if (anime && !calmeActif() && form.animate) {
      const apres = form.offsetHeight;
      form.animate([{ height: avant + 'px' }, { height: apres + 'px' }], { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    if (anime) {
      const premier = etapes[n - 1].querySelector('input:not([type="radio"]), textarea, select, input[type="radio"]:checked');
      premier && premier.focus({ preventScroll: true });
      if (form.getBoundingClientRect().top < 0) form.scrollIntoView({ block: 'start', behavior: calmeActif() ? 'auto' : 'smooth' });
    }
    rafraichir();
  };

  const verifier = () => {
    if (n === 2 && !recap()) { erreurArticles.hidden = false; form.querySelector('[data-devis-qte]').focus(); return false; }
    erreurArticles.hidden = true;
    return true;
  };

  suivant.addEventListener('click', () => { if (verifier() && n < 4) { n++; montrer(); } });
  retour.addEventListener('click', () => { if (n > 1) { n--; montrer(); } });
  form.addEventListener('input', (e) => { if (e.target.matches('[data-devis-qte]')) { recap(); if (recap()) erreurArticles.hidden = true; } });
  form.addEventListener('keydown', (e) => { if (e.key === 'Enter' && n < 4 && e.target.tagName === 'INPUT' && e.target.type !== 'submit') { e.preventDefault(); suivant.click(); } });

  /* Date au plus tôt : aujourd'hui + délai de fabrication (heure de Paris). */
  const date = form.querySelector('[data-devis-date]'), aide = form.querySelector('[data-devis-date-aide]');
  if (date) {
    const jours = parseInt(date.dataset.delai, 10) || 21;
    const auj = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    const tot = new Date(auj.getFullYear(), auj.getMonth(), auj.getDate() + jours);
    const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const lisible = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(tot);
    aide.textContent = modele(aide.dataset.modele, { date: lisible });
    date.min = iso(new Date(auj.getFullYear(), auj.getMonth(), auj.getDate() + 1));
    date.addEventListener('change', () => { aide.textContent = date.value && date.value < iso(tot) ? aide.dataset.trop : modele(aide.dataset.modele, { date: lisible }); });
  }
  recap();
  montrer(false);
  /* Lien profond : ?article=sweat-patrouille préremplit une quantité. */
  const art = new URLSearchParams(location.search).get('article');
  const q = art && form.querySelector(`[data-devis-qte="${CSS.escape(art)}"]`);
  if (q) { q.value = 1; recap(); }
}
