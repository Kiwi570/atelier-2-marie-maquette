/* Fiche produit : vignettes, loupe (souris seulement, sur la photo marquée), visionneuse (un lien par photo,
   flèches, glissement, Échap), choix préremplis par l'adresse, aperçu du texte brodé, ajout au panier. */
import { fenetre } from './fenetre.js?v=1';
import { ajouter } from './panier.js?v=1';
import { broder } from './demo.js?v=1';
import { souris, calmeActif, modele } from './outils.js?v=1';

export function initFiche() {
  const fiche = document.querySelector('[data-fiche]');
  if (!fiche) return;
  const photos = [...fiche.querySelectorAll('[data-photo]')], vignettes = [...fiche.querySelectorAll('[data-vignette]')];
  const grandes = (() => { try { return JSON.parse(document.querySelector('[data-visionneuse-images]').textContent); } catch { return []; } })();
  let courante = 0;
  const montrer = (i) => {
    courante = (i + photos.length) % photos.length;
    photos.forEach((p, k) => { p.hidden = k !== courante; p.classList.toggle('actif', k === courante); });
    vignettes.forEach((v, k) => { v.classList.toggle('actif', k === courante); if (k === courante) v.setAttribute('aria-current', 'true'); else v.removeAttribute('aria-current'); });
  };
  vignettes.forEach((v) => v.addEventListener('click', () => montrer(+v.dataset.vignette)));

  /* Visionneuse */
  const vis = document.querySelector('[data-visionneuse]');
  const img = vis.querySelector('[data-visionneuse-image]'), leg = vis.querySelector('[data-visionneuse-legende]');
  const f = fenetre(vis, { surFermeture: () => { if (/^#photo-/.test(location.hash)) history.replaceState(history.state, '', location.pathname + location.search); } });
  const afficher = (i) => {
    courante = (i + grandes.length) % grandes.length;
    img.src = grandes[courante];
    const alt = photos[courante] && photos[courante].querySelector('img');
    img.alt = alt ? alt.alt : '';
    leg.textContent = `${courante + 1} / ${grandes.length}`;
    montrer(courante);
    history.replaceState(history.state, '', location.pathname + location.search + '#photo-' + (courante + 1));
  };
  photos.forEach((p, i) => p.addEventListener('click', (e) => { e.preventDefault(); afficher(i); f.ouvrir(p); }));
  vis.querySelector('[data-visionneuse-fermer]').addEventListener('click', () => f.fermer());
  vis.querySelector('[data-visionneuse-precedente]').addEventListener('click', () => afficher(courante - 1));
  vis.querySelector('[data-visionneuse-suivante]').addEventListener('click', () => afficher(courante + 1));
  vis.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') afficher(courante - 1); if (e.key === 'ArrowRight') afficher(courante + 1); });
  let x0 = null;
  vis.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  vis.addEventListener('touchend', (e) => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) afficher(courante + (dx < 0 ? 1 : -1)); x0 = null; });
  /* Lien direct vers une photo : #photo-2 ouvre la visionneuse sur cette photo. */
  const m = location.hash.match(/^#photo-(\d+)$/);
  if (m && grandes[+m[1] - 1]) setTimeout(() => { afficher(+m[1] - 1); f.ouvrir(photos[+m[1] - 1]); }, 300);

  /* Loupe : souris seulement, sur la photo affichée, éteinte à la sortie. */
  if (souris() && !calmeActif()) {
    const loupe = document.createElement('div');
    loupe.className = 'loupe'; loupe.setAttribute('aria-hidden', 'true'); loupe.setAttribute('data-audit-ignorer', '');
    document.body.appendChild(loupe);
    photos.forEach((p, i) => {
      p.setAttribute('data-loupe', '');
      p.addEventListener('pointerenter', () => { loupe.style.backgroundImage = `url("${grandes[i]}")`; loupe.classList.add('visible'); document.documentElement.setAttribute('data-loupe-active', ''); });
      p.addEventListener('pointerleave', () => { loupe.classList.remove('visible'); document.documentElement.removeAttribute('data-loupe-active'); });
      p.addEventListener('pointermove', (e) => {
        const r = p.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        loupe.style.transform = `translate(${e.clientX - 100}px, ${e.clientY - 100}px)`;
        loupe.style.left = '0px'; loupe.style.top = '0px';
        loupe.style.backgroundSize = `${r.width * 2.4}px ${r.height * 2.4}px`;
        loupe.style.backgroundPosition = `${-(px * r.width * 2.4 - 100)}px ${-(py * r.height * 2.4 - 100)}px`;
      });
    });
  }

  /* Formulaire : choix, aperçu, panier. */
  const form = fiche.querySelector('[data-fiche-form]');
  const erreur = fiche.querySelector('[data-fiche-erreur]');
  const apercu = fiche.querySelector('[data-apercu-texte]'), source = fiche.querySelector('[data-apercu-source]');
  const params = new URLSearchParams(location.search);
  /* Préremplissage depuis la démo de l'accueil ou un bouton contextuel. */
  const prenom = params.get('prenom');
  if (prenom) { const c = form.querySelector('input[name="prenom"]') || source; if (c) c.value = prenom; }
  const couleur = params.get('couleur');
  if (couleur) form.querySelectorAll('fieldset[data-choix] input[type="radio"]').forEach((r) => { if (r.name.startsWith('couleur') && r.value === couleur) { r.checked = true; if (r.dataset.photoCouleur && photos.length > 1 && !location.hash) montrer(+r.dataset.photoCouleur); } });
  /* La photo suit la couleur choisie quand l'atelier a une photo de cette couleur. */
  form.addEventListener('change', (e) => { const r = e.target; if (r.matches && r.matches('[data-photo-couleur]') && r.checked && photos.length > 1) montrer(+r.dataset.photoCouleur); });
  const fil = params.get('fil');
  if (fil) { const c = form.querySelector('input[name*="broderie"]'); if (c) c.value = fil; }
  const majValeurs = () => form.querySelectorAll('fieldset[data-choix]').forEach((fs) => { const r = fs.querySelector('input:checked'); const s = fs.querySelector('[data-valeur-affichee]'); if (s) s.textContent = r ? '· ' + r.value : ''; });
  const majApercu = (anime) => { if (!apercu || !source) return; apercu.textContent = source.value.trim() || apercu.dataset.vide || apercu.textContent; if (anime) broder(apercu); };
  if (apercu) apercu.dataset.vide = apercu.textContent;
  majValeurs(); majApercu(false);
  form.addEventListener('change', majValeurs);
  let t = 0;
  if (source) source.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => majApercu(true), 250); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    erreur.hidden = true;
    const choix = {};
    let manque = null;
    form.querySelectorAll('[data-choix]').forEach((bloc) => {
      const titre = bloc.dataset.titre;
      const champ = bloc.querySelector('select') || bloc.querySelector('input:checked');
      const v = champ ? champ.value : '';
      if (v) choix[titre] = v;
      else if (bloc.hasAttribute('data-obligatoire') && !manque) manque = { bloc, msg: modele(fiche.dataset.choixManquant, { titre }) };
    });
    form.querySelectorAll('.fiche-texte').forEach((bloc) => {
      const c = bloc.querySelector('input'), v = c.value.trim();
      if (v) choix[bloc.dataset.titre] = v;
      else if (c.required && !manque) manque = { bloc, msg: modele(fiche.dataset.texteManquant, { titre: bloc.dataset.titre }), champ: c };
      c.setAttribute('aria-invalid', c.required && !v ? 'true' : 'false');
    });
    if (manque) {
      erreur.textContent = manque.msg; erreur.hidden = false;
      const c = manque.champ || manque.bloc.querySelector('select, input'); c && c.focus();
      return;
    }
    const qte = Math.min(99, Math.max(1, parseInt(form.elements.quantite.value, 10) || 1));
    ajouter({ slug: fiche.dataset.fiche, nom: fiche.dataset.nom, prix: parseFloat(fiche.dataset.prix), image: fiche.dataset.image, choix, qte }, fiche.querySelector('.fiche-photo.actif img') || fiche.querySelector('.fiche-ajouter'));
  });
}
