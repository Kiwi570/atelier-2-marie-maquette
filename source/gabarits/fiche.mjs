/* Fiche produit : un seul gabarit pour les 51 articles (pages source/pages/produit-*.mjs écrites par outils/fiches.mjs).
   Photos (vignettes, loupe, visionneuse avec un lien par photo), prix, choix et textes réels du site actuel,
   aperçu du texte brodé, ajout au panier, mention de rétractation adaptée, description de l'atelier. */
import { readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { html, brut } from '../../outils/gabarit.mjs';
import { prix, carteProduit, icone, trierTailles, joliTaille, urlProduit, imageVersion } from './outils.mjs';

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const catalogue = JSON.parse(readFileSync(join(racine, 'donnees/catalogue.json'), 'utf8'));
const site = JSON.parse(readFileSync(join(racine, 'donnees/site.json'), 'utf8'));
const trouver = (slug) => catalogue.produits.find((p) => p.slug === slug);
const prixTexte = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v).replace(/[  ]/g, ' ');

export function meta(slug) {
  const p = trouver(slug);
  const debut = (p.description[0] || '').replace(/[.:]$/, '');
  const description = `${p.nom} : ${prixTexte(p.prix)}. ${debut ? debut + '. ' : ''}Personnalisé par L’Atelier 2 Marie en Bretagne, fabrication en trois semaines environ.`;
  return {
    cle: `produit-${slug}`, fichier: `boutique/${slug}`, gabarit: 'fiche', ogType: 'product',
    titre: `${p.nom} : ${prixTexte(p.prix)} | L’Atelier 2 Marie`, description, nav: p.nom,
    partageAlt: `${p.nom}, ${prixTexte(p.prix)}`, accroche: p.nom, prixPartage: prixTexte(p.prix),
    imagePartage: p.images[0] ? imageVersion(p.images[0], 1280).replace('/assets/images/', '') : site.imagePartage,
    structure: {
      '@context': 'https://schema.org', '@type': 'Product', name: p.nom,
      description: p.description.join(' ') || p.nom,
      image: p.images.map((i) => site.adresse + imageVersion(i, 1280)),
      brand: { '@type': 'Brand', name: 'L’Atelier 2 Marie' },
      offers: { '@type': 'Offer', price: String(p.prix), priceCurrency: 'EUR', availability: 'https://schema.org/MadeToOrder', url: `${site.adresse}/boutique/${slug}`, seller: { '@type': 'Organization', name: 'L’Atelier 2 Marie' } },
    },
  };
}

export default function fiche(c, slug) {
  const cat = c.donnees.catalogue;
  const p = cat.produits.find((x) => x.slug === slug);
  const univ = cat.univers.filter((u) => p.univers.includes(u.cle));
  const techniques = cat.techniques.filter((t) => p.techniques.includes(t.cle)).map((t) => t.nom);
  /* Dans le même univers : d'abord l'univers principal, puis le nombre d'univers et d'occasions en commun. */
  const score = (x) => (x.univers[0] === p.univers[0] ? 4 : 0) + x.univers.filter((u) => p.univers.includes(u)).length * 2 + x.occasions.filter((o) => p.occasions.includes(o)).length;
  const memes = cat.produits.filter((x) => x.slug !== slug && x.univers.some((u) => p.univers.includes(u)))
    .map((x, i) => [x, score(x), i]).sort((a, b) => b[1] - a[1] || a[2] - b[2]).map(([x]) => x).slice(0, 4);
  const brode = p.techniques.includes('broderie');
  const id = (k) => `${slug}-${k}`.slice(0, 60);
  const personnalise = p.textes.length > 0;
  const choixCouleur = p.choix.find((o) => o.type === 'couleur');
  const ouverture = univ[0];

  return html`
<nav class="fil-ariane conteneur" aria-label="${c.s('fiche.fil')}"><ol>
  <li>${c.lien('boutique', { texte: c.t('fiche.boutique') })}</li>
  ${ouverture ? html`<li><a href="${c.url('boutique', '', 'univers=' + ouverture.cle)}" data-libelle="${c.libelle('boutique')}">${ouverture.nom}</a></li>` : ''}
  <li><span aria-current="page">${p.nom}</span></li>
</ol></nav>

<section class="fiche conteneur" id="debut" data-choix-manquant="${c.s('fiche.choixManquant')}" data-texte-manquant="${c.s('fiche.texteManquant')}" data-fiche="${slug}" data-nom="${p.nom}" data-prix="${p.prix}" data-image="${p.images[0] ? imageVersion(p.images[0], 640) : ''}">
  <div class="fiche-photos" data-photos>
    <div class="fiche-principale">
      ${p.images.map((img, i) => html`<a class="fiche-photo${i === 0 ? ' actif' : ''}" id="photo-${i + 1}" href="#photo-${i + 1}" data-photo="${i}" data-sans-transition aria-label="${c.s('fiche.agrandir')} (${c.s('fiche.photo', { n: i + 1, total: p.images.length })})"${i ? brut(' hidden') : ''}>
        ${c.media({ nom: img, alt: i === 0 ? p.nom : `${p.nom}, ${c.s('fiche.photo', { n: i + 1, total: p.images.length }).toLowerCase()}`, sizes: '(max-width: 900px) 100vw, 50vw', priorite: i === 0, classe: 'fiche-media', cadrage: '50% 50%' })}
      </a>`)}
      ${!p.images.length ? html`<div class="fiche-sans-photo" data-visuel role="img" aria-label="${p.nom}">${icone('aiguille')}<span>${c.t('commun.aCompleter')}</span></div>` : ''}
    </div>
    ${p.images.length > 1 ? html`<ul class="fiche-vignettes" aria-label="${c.s('fiche.visionneuse')}">${p.images.map((img, i) => html`<li><button type="button" class="vignette${i === 0 ? ' actif' : ''}" data-vignette="${i}" aria-label="${c.s('fiche.photo', { n: i + 1, total: p.images.length })}"${i === 0 ? brut(' aria-current="true"') : ''}>${c.media({ nom: img, alt: '', sizes: '90px', classe: 'vignette-media' })}</button></li>`)}</ul>` : ''}
  </div>

  <div class="fiche-infos" data-masque-barre>
    <p class="fiche-etiquettes">${p.nouveaute ? html`<span class="etiquette">${c.t('boutique.nouveaute')}</span>` : ''}${p.surCommande ? html`<span class="etiquette etiquette--contour">${c.t('boutique.surCommande')}</span>` : ''}${techniques.map((t) => html`<span class="etiquette etiquette--contour">${t}</span>`)}</p>
    <h1 class="fiche-titre" data-anime="gsap">${p.nom}</h1>
    <p class="fiche-prix" data-anime="gsap"><strong data-prix data-info-cle>${p.surDevis ? c.t('fiche.des', { prix: prix(p.prix) }) : prix(p.prix)}</strong><span class="fiche-tva">${c.t('commun.tva')}</span></p>
    ${p.surDevis ? html`<p class="fiche-devis">${c.t('fiche.surDevis')} ${c.lien('commandes-groupees', { ancre: 'devis', params: 'article=' + encodeURIComponent(p.nom), classe: 'lien-fleche', texte: html`${c.t('fiche.demanderDevis')} ${icone('fleche')}` })}</p>` : ''}
    <p class="fiche-delai">${icone('aiguille')} ${c.t('commun.delai')} · ${c.t('commun.retrait')}</p>

    <form class="fiche-form" id="${id('form')}" data-fiche-form novalidate>
      ${p.choix.map((o) => o.type === 'couleur'
        ? html`<fieldset class="fiche-choix" data-choix="${o.cle}" data-titre="${o.titre}"${o.obligatoire ? brut(' data-obligatoire') : ''}>
            <legend>${o.titre} <span class="fiche-oblig">(${o.obligatoire ? c.s('fiche.obligatoire') : c.s('fiche.facultatif')})</span> <span class="fiche-choix-valeur" data-valeur-affichee></span></legend>
            <div class="pastilles">${o.valeurs.map((v, i) => { const coche = o.defaut ? v.nom === o.defaut : !o.obligatoire && i === 0; const photo = p.couleurImages && p.couleurImages[v.nom] ? p.images.indexOf(p.couleurImages[v.nom]) : -1; return html`<label class="pastille-couleur" style="--c:${v.hex}" title="${v.nom}"><input type="radio" name="${o.cle}" value="${v.nom}"${coche ? brut(' checked') : ''}${photo >= 0 ? brut(` data-photo-couleur="${photo}"`) : ''}><span class="visuellement-cache">${v.nom}</span></label>`; })}</div>
          </fieldset>`
        : html`<div class="champ fiche-choix" data-choix="${o.cle}" data-titre="${o.titre}"${o.obligatoire ? brut(' data-obligatoire') : ''}>
            <label for="${id(o.cle)}">${o.titre} <span class="fiche-oblig">(${o.obligatoire ? c.s('fiche.obligatoire') : c.s('fiche.facultatif')})</span></label>
            <select id="${id(o.cle)}" name="${o.cle}"${o.obligatoire ? brut(' required') : ''}><option value="">${c.t('fiche.choisir')}</option>${(/taille/i.test(o.titre) ? trierTailles(o.valeurs) : o.valeurs).map((v) => html`<option value="${v.nom}">${/taille/i.test(o.titre) ? joliTaille(v.nom) : v.nom}</option>`)}</select>
          </div>`)}
      ${personnalise ? html`<div class="apercu${brode ? ' apercu--baton' : ''}" data-apercu aria-hidden="true">
          <p class="apercu-titre">${c.t('fiche.apercu')} <span>${c.t('fiche.apercuIndicatif')}</span></p>
          <svg viewBox="0 0 400 84" class="apercu-svg"><rect x="4" y="4" width="392" height="76" rx="10" class="apercu-cadre"/><text x="200" y="${brode ? 55 : 58}" text-anchor="middle" data-apercu-texte>${c.s('fiche.apercuVide')}</text></svg>
        </div>` : ''}
      ${p.textes.map((t, i) => html`<div class="champ fiche-texte" data-titre="${t.titre}">
          <label for="${id('t' + i)}">${t.titre} <span class="fiche-oblig">(${t.obligatoire ? c.s('fiche.obligatoire') : c.s('fiche.facultatif')})</span></label>
          <input id="${id('t' + i)}" name="${t.cle}" maxlength="80" autocomplete="off"${t.obligatoire ? brut(' required') : ''}${i === 0 ? brut(' data-apercu-source') : ''}>
        </div>`)}

    </form>
    <div class="fiche-achat">
      <div class="champ champ--quantite"><label for="${id('qte')}">${c.t('fiche.quantite')}</label><input id="${id('qte')}" name="quantite" form="${id('form')}" type="number" min="1" max="99" value="1" inputmode="numeric"></div>
      <button type="submit" form="${id('form')}" class="bouton bouton--large fiche-ajouter" data-action-principale>${icone('panier')} ${c.t('fiche.ajouter')}</button>
    </div>
    <p class="fiche-erreur" data-fiche-erreur role="alert" hidden></p>
    <p class="fiche-retour">${personnalise ? c.t('fiche.personnaliseRetour') : c.t('fiche.standardRetour')}</p>

    <div class="fiche-description">
      <h2>${c.t('fiche.descriptionSite')}</h2>
      ${p.description.length ? html`<ul>${p.description.map((l) => html`<li>${l}</li>`)}</ul>` : html`<p class="a-completer">${c.t('fiche.aCompleterFiche')}</p>`}
      <h2>${c.t('fiche.livraisonTitre')}</h2>
      <p>${c.t('fiche.livraisonTexte')}</p>
      <p>${c.t('fiche.question')} ${c.lien('contact', { ancre: 'ecrire', params: 'sujet=article&article=' + encodeURIComponent(p.nom), classe: 'lien-fleche', texte: html`${c.t('fiche.questionAction')} ${icone('fleche')}` })}</p>
    </div>
  </div>
</section>

${memes.length ? html`<section class="memes conteneur" id="meme-univers">
  <h2 class="titre-section" data-brode>${c.t('fiche.memeUnivers')}</h2>
  <div class="grille-produits grille-produits--4">${memes.map((x) => carteProduit(c, x))}</div>
</section>` : ''}

<div class="visionneuse" data-visionneuse data-recouvrement role="dialog" aria-modal="true" aria-label="${c.s('fiche.visionneuse')}" hidden>
  <button type="button" class="visionneuse-fermer entete-icone" data-visionneuse-fermer aria-label="${c.s('fiche.fermer')}">${icone('fermer')}</button>
  <button type="button" class="visionneuse-fleche visionneuse-fleche--g entete-icone" data-visionneuse-precedente aria-label="${c.s('fiche.precedente')}"${p.images.length < 2 ? brut(' hidden') : ''}>${icone('gauche')}</button>
  <figure class="visionneuse-cadre"><img alt="" loading="lazy" decoding="async"${p.images[0] ? brut(` src="${imageVersion(p.images[0], 1280)}"`) : ''} data-visionneuse-image><figcaption data-visionneuse-legende></figcaption></figure>
  <button type="button" class="visionneuse-fleche visionneuse-fleche--d entete-icone" data-visionneuse-suivante aria-label="${c.s('fiche.suivante')}"${p.images.length < 2 ? brut(' hidden') : ''}>${icone('droite')}</button>
  <script type="application/json" data-visionneuse-images>${brut(JSON.stringify(p.images.map((i) => imageVersion(i, 1280))))}</script>
</div>
`;
}
