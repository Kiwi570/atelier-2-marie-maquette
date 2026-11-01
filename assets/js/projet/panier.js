/* Panier simulé : une seule source (localStorage), identique dans tous les onglets (événement storage),
   donnée abîmée nettoyée au chargement sans bloquer le site, tiroir avec commande en 3 étapes, panier vidé
   après la commande simulée, montants et changements annoncés aux lecteurs d'écran. */
import { fenetre } from './fenetre.js?v=2';
import { prixFr, modele, calmeActif } from './outils.js?v=2';

const CLE = 'a2m:panier';
let liste = [];
let tiroir = null;
const $ = (s, r = document) => r.querySelector(s);

const valide = (l) => l && typeof l.slug === 'string' && typeof l.nom === 'string' && typeof l.prix === 'number' && isFinite(l.prix) && Number.isInteger(l.qte) && l.qte >= 1 && l.qte <= 99;

function lire() {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return [];
    const v = JSON.parse(brut);
    if (!Array.isArray(v)) throw new Error('panier abîmé');
    const ok = v.filter(valide);
    if (ok.length !== v.length) localStorage.setItem(CLE, JSON.stringify(ok));
    return ok;
  } catch {
    try { localStorage.removeItem(CLE); } catch {}
    return [];
  }
}
function ecrire() { try { localStorage.setItem(CLE, JSON.stringify(liste)); } catch {} rendre(); }
export const total = () => liste.reduce((s, l) => s + l.prix * l.qte, 0);
const nombre = () => liste.reduce((s, l) => s + l.qte, 0);

function annoncer(cle, nom) {
  const a = $('[data-panier-annonce]');
  if (!a) return;
  a.textContent = '';
  setTimeout(() => { a.textContent = modele(a.dataset[cle], { nom }) + ' · ' + prixFr(total()); }, 60);
}

function rendre() {
  const n = nombre();
  document.querySelectorAll('[data-panier-nombre]').forEach((p) => { p.textContent = n; p.hidden = n === 0; });
  document.querySelectorAll('[data-panier-total]').forEach((t) => { t.textContent = prixFr(total()); t.dataset.total = total().toFixed(2); });
  document.querySelectorAll('[data-panier-total-barre]').forEach((t) => { t.textContent = n ? prixFr(total()) : '0 €'; });
  const ul = $('[data-panier-liste]');
  if (!ul) return;
  const vide = $('[data-panier-vide]'), pied = $('[data-panier-pied]');
  vide.hidden = liste.length > 0;
  pied.hidden = liste.length === 0;
  const libRetirer = ul.dataset.libelleRetirer, libQte = ul.dataset.libelleQuantite;
  ul.replaceChildren(...liste.map((l, i) => {
    const li = document.createElement('li');
    li.className = 'panier-ligne';
    const choix = Object.entries(l.choix || {}).filter(([, v]) => v).map(([k, v]) => `${k} : ${v}`).join(' · ');
    li.innerHTML = `<img alt="" width="72" height="72" loading="lazy">
      <div><p class="panier-ligne-nom"></p><p class="panier-ligne-choix"></p>
      <div class="panier-ligne-bas"><span class="panier-qte" role="group"><button type="button" data-moins aria-label="−">−</button><output></output><button type="button" data-plus aria-label="+">+</button></span>
      <strong></strong><button type="button" class="lien panier-retirer" data-retirer></button></div></div>`;
    li.querySelector('img').src = typeof l.image === 'string' && l.image.startsWith('/assets/') ? l.image : '/assets/images/favicon.png';
    li.querySelector('.panier-ligne-nom').textContent = l.nom;
    li.querySelector('.panier-ligne-choix').textContent = choix;
    li.querySelector('.panier-ligne-choix').hidden = !choix;
    li.querySelector('output').textContent = l.qte;
    li.querySelector('.panier-qte').setAttribute('aria-label', `${libQte} : ${l.nom}`);
    li.querySelector('[data-moins]').setAttribute('aria-label', `${libQte} − 1 : ${l.nom}`);
    li.querySelector('[data-plus]').setAttribute('aria-label', `${libQte} + 1 : ${l.nom}`);
    li.querySelector('strong').textContent = prixFr(l.prix * l.qte);
    const r = li.querySelector('[data-retirer]');
    r.textContent = libRetirer; r.setAttribute('aria-label', `${libRetirer} : ${l.nom}`);
    li.querySelector('[data-moins]').addEventListener('click', () => { if (l.qte > 1) { l.qte--; ecrire(); annoncer('modeleAjout', l.nom); } else retirer(i); });
    li.querySelector('[data-plus]').addEventListener('click', () => { if (l.qte < 99) { l.qte++; ecrire(); annoncer('modeleAjout', l.nom); } });
    r.addEventListener('click', () => retirer(i));
    return li;
  }));
}

function retirer(i) {
  const [l] = liste.splice(i, 1);
  ecrire();
  if (l) annoncer('modeleRetrait', l.nom);
  const f = $('[data-panier-liste] button') || $('[data-panier] [data-fermer].entete-icone');
  f && f.focus({ preventScroll: true });
}

/* Vol de l'article vers le panier, le long d'un fil (désactivé en mode calme). */
function vol(depuis, image) {
  /* L'en-tête revient pour montrer le panier qui se remplit (il se recache au prochain défilement vers le bas). */
  const entete = document.querySelector('[data-entete]');
  const cache = document.documentElement.classList.contains('entete-cache');
  document.documentElement.classList.remove('entete-cache');
  if (calmeActif() || !depuis || !image) return;
  const cible = [...document.querySelectorAll('[data-panier-ouvrir]')].find((b) => b.offsetParent !== null && b.getBoundingClientRect().width > 0);
  if (!cible) return;
  const a = depuis.getBoundingClientRect(), b0 = cible.getBoundingClientRect();
  const decal = cache && entete && entete.contains(cible) ? entete.offsetHeight : 0;
  const b = { left: b0.left, top: b0.top + decal, width: b0.width, height: b0.height };
  const img = document.createElement('img');
  img.src = image; img.alt = ''; img.className = 'vol'; img.setAttribute('aria-hidden', 'true'); img.setAttribute('data-audit-ignorer', '');
  document.body.appendChild(img);
  const x0 = a.left + a.width / 2 - 32, y0 = a.top + a.height / 2 - 32, x1 = b.left + b.width / 2 - 32, y1 = b.top + b.height / 2 - 32;
  const pas = 14, images = [];
  for (let k = 0; k <= pas; k++) {
    const t = k / pas, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t - Math.sin(Math.PI * t) * 140;
    images.push({ transform: `translate(${x}px, ${y}px) scale(${1 - t * 0.6})`, opacity: k === pas ? 0 : 1 });
  }
  img.style.left = '0px'; img.style.top = '0px';
  img.animate(images, { duration: 800, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'forwards' }).finished.then(() => img.remove(), () => img.remove());
  const p = cible.querySelector('.pastille') || cible;
  setTimeout(() => p.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 380 }), 760);
}

export function ajouter(article, depuis) {
  const cle = JSON.stringify(article.choix || {});
  const existant = liste.find((l) => l.slug === article.slug && JSON.stringify(l.choix || {}) === cle);
  if (existant) existant.qte = Math.min(99, existant.qte + (article.qte || 1));
  else liste.push({ ...article, qte: Math.min(99, Math.max(1, article.qte || 1)) });
  ecrire();
  vol(depuis, article.image);
  annoncer('modeleAjout', article.nom);
}

function commande() {
  const form = $('[data-commande]');
  if (!form) return;
  const vueListe = $('[data-panier-vue="liste"]'), pied = $('[data-panier-pied]'), titre = $('[data-panier-titre]');
  const etapes = [...form.querySelectorAll('[data-etape]')], points = [...form.querySelectorAll('.etapes-points li')];
  const suivant = form.querySelector('[data-commande-suivant]'), retour = form.querySelector('[data-commande-retour]'), valider = form.querySelector('[data-commande-valider]');
  const message = form.querySelector('[data-commande-message]');
  let n = 1;
  const montrer = () => {
    etapes.forEach((e) => (e.hidden = +e.dataset.etape !== n));
    points.forEach((p, i) => p.classList.toggle('actif', i < n));
    suivant.hidden = n === 3; valider.hidden = n !== 3;
    const f = etapes[n - 1].querySelector('input, textarea, select'); f && f.focus({ preventScroll: true });
  };
  const ouvrirCommande = () => {
    vueListe.hidden = true; pied.hidden = true; form.hidden = false; message.hidden = true;
    form.querySelectorAll('fieldset, .commande-boutons').forEach((x) => (x.style.display = ''));
    titre.textContent = titre.dataset.titreCommande; n = 1; montrer();
  };
  const fermerCommande = () => { form.hidden = true; vueListe.hidden = false; titre.textContent = titre.dataset.titrePanier; rendre(); };
  const adresse = form.querySelector('[data-si-envoi]');
  form.addEventListener('change', (e) => {
    if (e.target.name === 'livraison') { const envoi = e.target.value === 'envoi'; adresse.hidden = !envoi; adresse.querySelector('textarea').required = envoi; }
  });
  const verifier = () => {
    let ok = true, premier = null;
    etapes[n - 1].querySelectorAll('[required]').forEach((c) => {
      const v = c.value.trim();
      const bon = v && (c.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) && (c.type !== 'tel' || v.replace(/\D/g, '').length >= 9);
      c.setAttribute('aria-invalid', bon ? 'false' : 'true');
      if (!bon) { ok = false; premier = premier || c; }
    });
    if (premier) premier.focus();
    return ok;
  };
  document.querySelector('[data-panier-commander]').addEventListener('click', ouvrirCommande);
  suivant.addEventListener('click', () => { if (verifier()) { n++; montrer(); } });
  retour.addEventListener('click', () => { if (n === 1) fermerCommande(); else { n--; montrer(); } });
  let envoyee = false;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (envoyee || !verifier()) return;
    envoyee = true;
    valider.disabled = true;
    liste = []; ecrire();
    form.querySelectorAll('fieldset, .commande-boutons').forEach((x) => (x.style.display = 'none'));
    message.hidden = false; message.focus();
    setTimeout(() => { envoyee = false; valider.disabled = false; }, 600);
  });
  tiroir.fermerCommande = fermerCommande;
}

export function initPanier() {
  liste = lire();
  const el = document.querySelector('[data-panier]');
  if (!el) return;
  tiroir = fenetre(el, { surFermeture: () => tiroir.fermerCommande && tiroir.fermerCommande() });
  document.querySelectorAll('[data-panier-ouvrir]').forEach((b) => b.addEventListener('click', () => tiroir.ouvrir(b)));
  window.addEventListener('storage', (e) => { if (e.key === CLE || e.key === null) { liste = lire(); rendre(); } });
  commande();
  rendre();
}
export const ouvrirPanier = (depuis) => tiroir && tiroir.ouvrir(depuis);
