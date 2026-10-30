/* Aides propres au projet, utilisées par les pages et le gabarit commun.
   - visuel() : image Grok si elle est arrivée, sinon visuel brodé dessiné en code (jamais de cadre vide).
   - prix(), carteProduit(), icone(), etoiles()… */
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, brut } from '../../outils/gabarit.mjs';

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/* Chemin de la plus grande version disponible d'une image, sans dépasser la largeur voulue. */
export function imageVersion(nom, voulue = 1280) {
  const d = join(racine, 'assets/images', dirname(nom));
  const base = nom.split('/').pop();
  if (!existsSync(d)) return `/assets/images/${nom}-${voulue}.webp`;
  const ws = readdirSync(d).map((f) => f.match(new RegExp('^' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '-(\\d+)\\.webp$'))).filter(Boolean).map((m) => +m[1]).sort((a, b) => a - b);
  const w = ws.filter((x) => x <= voulue).pop() || ws[0];
  return `/assets/images/${nom}-${w}.webp`;
}

export const prix = (v) => (v == null ? '' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v).replace(/[  ]/g, ' '));

/* Une image Grok est-elle arrivée ? (assets/images/grok/<nom>-<largeur>.webp) */
export function grokPresent(nom) {
  const d = join(racine, 'assets/images/grok');
  return existsSync(d) && readdirSync(d).some((f) => f.startsWith(nom + '-') && /-\d+\.webp$/.test(f) && !f.startsWith(nom + '-mobile'));
}

/* Motifs de remplacement, dessinés en code, dans la direction « Fil d'or ». */
const MOTIFS = {
  lin: (id) => `<rect width="100%" height="100%" fill="url(#lin-${id})"/>`,
  fil: (id) => `<rect width="100%" height="100%" fill="url(#lin-${id})"/><path d="M-20 180 C 120 60, 260 300, 420 150 S 700 40, 860 200" fill="none" stroke="#c8963e" stroke-width="3" stroke-dasharray="14 9" stroke-linecap="round"/><circle cx="520" cy="118" r="54" fill="none" stroke="#1c2a44" stroke-opacity=".18" stroke-width="10"/>`,
  bobine: (id) => `<rect width="100%" height="100%" fill="url(#lin-${id})"/><g transform="translate(400 225)"><rect x="-60" y="-90" width="120" height="16" rx="6" fill="#b08a5a"/><rect x="-60" y="74" width="120" height="16" rx="6" fill="#b08a5a"/><rect x="-46" y="-74" width="92" height="148" fill="#c8963e"/><g stroke="#a87a2e" stroke-width="2" opacity=".7">${Array.from({ length: 14 }, (_, i) => `<line x1="-46" y1="${-70 + i * 10.5}" x2="46" y2="${-66 + i * 10.5}"/>`).join('')}</g><path d="M46 20 C 140 40, 180 140, 330 110" fill="none" stroke="#c8963e" stroke-width="3"/></g>`,
  tambour: (id) => `<rect width="100%" height="100%" fill="url(#lin-${id})"/><g transform="translate(400 225)"><circle r="150" fill="#f4eee3"/><circle r="150" fill="none" stroke="#c9a272" stroke-width="16"/><circle r="160" fill="none" stroke="#b58a58" stroke-width="2" opacity=".7"/><rect x="-14" y="-182" width="28" height="18" rx="4" fill="#b58a58"/><path d="M-70 30 C -30 -40, 30 60, 70 -20" fill="none" stroke="#c8963e" stroke-width="5" stroke-dasharray="10 6" stroke-linecap="round"/><path d="M70 -20 L 120 -95" stroke="#9aa3ad" stroke-width="3" stroke-linecap="round"/></g>`,
  colis: (id) => `<rect width="100%" height="100%" fill="url(#lin-${id})"/><g transform="translate(400 230)"><rect x="-150" y="-100" width="300" height="200" rx="6" fill="#c9a77c"/><path d="M-150 -10 H150 M-10 -100 V100" stroke="#c8963e" stroke-width="7"/><path d="M-10 -10 c -40 -50 -80 -10 -40 10 M-10 -10 c 40 -50 80 -10 40 10" fill="none" stroke="#c8963e" stroke-width="6"/></g>`,
};

let compteurMotifs = 0;
/* Visuel d'une section : image Grok (avec la mention, posée par c.media) ou motif dessiné en code. */
export function visuel(c, { grok, motif = 'fil', alt = '', classe = '', sizes = '100vw', priorite = false, cadrage, cadrageMobile, ratio }) {
  if (grok && grokPresent(grok)) return c.media({ nom: `grok/${grok}`, alt, classe, sizes, priorite, cadrage, cadrageMobile, ratio });
  const id = 'm' + (++compteurMotifs);
  const role = alt ? html` role="img" aria-label="${alt}"` : brut(' aria-hidden="true"');
  return html`<figure class="media media--motif ${classe}" data-visuel${role}${ratio ? brut(` style="aspect-ratio:${ratio}"`) : ''}>
  ${brut(`<svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><pattern id="lin-${id}" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="#ebe3d4"/><path d="M0 1.5h6M0 4.5h6" stroke="#ddd2bf" stroke-width="1"/><path d="M1.5 0v6M4.5 0v6" stroke="#e4dac8" stroke-width=".8"/></pattern></defs>${(MOTIFS[motif] || MOTIFS.fil)(id)}</svg>`)}
</figure>`;
}

export const ICONES = {
  recherche: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5 21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  panier: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  fermer: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  fleche: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h13m-5-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  gauche: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bas: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 5v13M6 12l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  droite: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  telephone: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 3.5 9 3l1.6 4.2-2 1.4a12 12 0 0 0 6.8 6.8l1.4-2L21 15l-.5 2.4A3 3 0 0 1 17.6 20C10 20 4 14 4 6.4a3 3 0 0 1 2.6-2.9Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  email: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  lieu: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9.5" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 8h3V4.5h-3a4 4 0 0 0-4 4V11H7.5v3.5H10V21h3.5v-6.5H16l.5-3.5h-3V8.8c0-.5.3-.8.5-.8Z" fill="currentColor"/></svg>',
  etoile: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z" fill="currentColor"/></svg>',
  aiguille: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 20 19.5 4.5a1.6 1.6 0 0 1 2.2 2.2L6.2 22.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="19.6" cy="5.4" rx="1.4" ry=".55" transform="rotate(-45 19.6 5.4)" fill="none" stroke="currentColor" stroke-width="1"/></svg>',
};
export const icone = (nom, classe = 'icone') => brut(`<span class="${classe}" aria-hidden="true">${ICONES[nom]}</span>`);

export const etoiles = (n) => brut(`<span class="etoiles" role="img" aria-label="${n} étoiles sur 5">${Array.from({ length: 5 }, (_, i) => `<span class="${i < n ? 'pleine' : ''}">${ICONES.etoile}</span>`).join('')}</span>`);

export const urlProduit = (slug) => `/boutique/${slug}`;

/* Ordre des tailles : enfants d'abord, puis adultes. */
const ORDRE_TAILLES = ['2/3 ans', '3/4 ans', '5/6 ans', '7/8ans', '9/11ans', '12/13ans', '12/14ans', 'XS', 'S', 'S/M', 'M', 'L', 'L/XL', 'XL', 'XXL', '2XL', '3XL'];
export function trierTailles(valeurs) {
  const rang = (v) => { const i = ORDRE_TAILLES.indexOf(v.nom.trim()); return i < 0 ? 99 : i; };
  return [...valeurs].sort((a, b) => rang(a) - rang(b));
}
export const joliTaille = (t) => t.replace(/(\d)ans\b/, '$1 ans').replace(/^XXL$/, '2XL');

/* Carte produit (boutique, accueil, même univers). */
export function carteProduit(c, p, { sizes = '(max-width: 760px) 50vw, 25vw', priorite = false, classe = '', sansNouveaute = false } = {}) {
  const image = p.images[0];
  const etiquettes = [p.nouveaute && !sansNouveaute ? c.s('boutique.nouveaute') : null, p.surCommande ? c.s('boutique.surCommande') : null].filter(Boolean);
  const techniques = (c.donnees.catalogue.techniques || []).filter((t) => p.techniques.includes(t.cle)).map((t) => t.nom);
  return html`<article class="produit ${classe}" data-produit="${p.slug}" data-prix="${p.prix}" data-univers="${p.univers.join(' ')}" data-occasions="${p.occasions.join(' ')}" data-techniques="${p.techniques.join(' ')}" data-nouveaute="${p.nouveaute ? '1' : '0'}" data-nom="${p.nom}">
  <a class="produit-lien" href="${urlProduit(p.slug)}" data-libelle="${p.nom}">
    <span class="produit-cadre">
      ${image ? c.media({ nom: image, alt: p.nom, sizes, priorite, classe: 'produit-media', cadrage: '50% 50%' }) : ''}
      ${p.textes.length ? html`<span class="produit-prenom" aria-hidden="true">${c.t('boutique.prenomSurvol')}</span>` : ''}
      ${etiquettes.length ? html`<span class="produit-etiquettes">${etiquettes.map((e) => html`<span class="etiquette">${e}</span>`)}</span>` : ''}
    </span>
    <span class="produit-texte">
      <span class="produit-nom">${p.nom}</span>
      <span class="produit-bas"><strong class="produit-prix" data-prix>${p.surDevis ? c.t('fiche.des', { prix: prix(p.prix) }) : prix(p.prix)}</strong>${techniques.length ? html`<span class="produit-technique">${techniques.join(' · ')}</span>` : ''}</span>
    </span>
  </a>
</article>`;
}

/* Index de recherche (noms, univers, techniques), écrit dans chaque page. */
export function indexRecherche(c) {
  const cat = c.donnees.catalogue;
  const nomU = Object.fromEntries([...cat.univers, ...cat.occasions].map((u) => [u.cle, u.nom]));
  const nomT = Object.fromEntries(cat.techniques.map((t) => [t.cle, t.nom]));
  return JSON.stringify(cat.produits.map((p) => ({
    s: p.slug, n: p.nom, p: p.prix, i: p.images[0] ? imageVersion(p.images[0], 640) : '',
    m: [...p.univers.map((u) => nomU[u]), ...p.occasions.map((u) => nomU[u]), ...p.techniques.map((t) => nomT[t]), ...(p.description || [])].join(' '),
  }))).replace(/</g, '\\u003c');
}
