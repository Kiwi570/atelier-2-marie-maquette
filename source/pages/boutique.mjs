/* Boutique : tous les articles, filtres (univers, occasion, technique), recherche et tri gardés dans l'adresse.
   Sans JavaScript, tous les articles restent affichés. */
import { html, brut } from '../../outils/gabarit.mjs';
import { visuel, prix, carteProduit, icone } from '../gabarits/outils.mjs';

export const page = { cle: 'boutique', fichier: 'boutique', imagePartage: 'produits/sweat-maitrise-1-1280.webp' };

export default (c) => {
  const cat = c.donnees.catalogue;
  const prixs = cat.produits.map((p) => p.prix).filter((v) => v != null);
  const puce = (groupe, cle, nom, n) => html`<button type="button" class="puce" data-filtre="${groupe}" data-valeur="${cle}" aria-pressed="false">${nom}${n != null ? html` <span class="puce-n" data-puce-n>${n}</span>` : ''}</button>`;
  return html`
<section class="page-tete page-tete--boutique" id="debut">
  <div class="page-tete-texte">
    <h1 class="page-titre" data-anime="gsap">${c.t('boutique.titre')}</h1>
    <p class="page-intro" data-anime="gsap">${c.t('boutique.texte', { n: cat.produits.length, min: prix(Math.min(...prixs)), max: prix(Math.max(...prixs)) })}</p>
    <form class="boutique-recherche" role="search" data-anime="gsap" data-boutique-recherche>
      <label for="boutique-q">${c.t('boutique.recherche')}</label>
      <span class="boutique-recherche-champ">${icone('recherche')}<input id="boutique-q" name="q" type="search" placeholder="${c.s('boutique.rechercheChamp')}" autocomplete="off" data-boutique-q></span>
    </form>
    <p class="hero-actions" data-anime="gsap"><a class="bouton bouton--large" href="#articles" data-action-principale>${c.t('boutique.voirTout', { n: cat.produits.length })} ${icone('bas')}</a><span class="hero-info" data-info-cle>${icone('aiguille')} ${c.t('commun.delai')}</span></p>
  </div>
  ${visuel(c, { grok: 'boutique-ouverture-mobile', motif: 'bobine', alt: '', classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 30vw', priorite: true, cadrage: '50% 42%' })}
</section>

<section class="boutique conteneur" id="articles" data-boutique>
  <h2 class="visuellement-cache">${c.t('boutique.filtresTitre')}</h2>
  <div class="filtres" data-filtres>
    <div class="filtres-rangee" role="group" aria-label="${c.s('boutique.univers')}">
      <span class="filtres-titre">${c.t('boutique.univers')}</span>
      <div class="puces">${puce('univers', '', c.s('boutique.tout'))}${cat.univers.map((u) => puce('univers', u.cle, u.nom, u.nombre))}</div>
    </div>
    <div class="filtres-rangee" role="group" aria-label="${c.s('boutique.occasions')}">
      <span class="filtres-titre">${c.t('boutique.occasions')}</span>
      <div class="puces">${cat.occasions.map((o) => puce('occasion', o.cle, o.nom, o.nombre))}</div>
    </div>
    <div class="filtres-rangee filtres-rangee--choix">
      <div class="champ champ--ligne"><label for="f-technique">${c.t('boutique.technique')}</label>
        <select id="f-technique" data-filtre-select="technique"><option value="">${c.t('boutique.techniqueToutes')}</option>${cat.techniques.map((t) => html`<option value="${t.cle}">${t.nom}</option>`)}</select></div>
      <div class="champ champ--ligne"><label for="f-tri">${c.t('boutique.tri')}</label>
        <select id="f-tri" data-filtre-select="tri"><option value="">${c.t('boutique.triPertinence')}</option><option value="prix-croissant">${c.t('boutique.triPrixCroissant')}</option><option value="prix-decroissant">${c.t('boutique.triPrixDecroissant')}</option><option value="nouveautes">${c.t('boutique.triNouveautes')}</option></select></div>
      <button type="button" class="lien filtres-effacer" data-filtres-effacer hidden>${c.t('boutique.effacer')}</button>
    </div>
  </div>
  <p class="boutique-compte" data-boutique-compte aria-live="polite" data-modele="${c.s('boutique.compte')}" data-modele-un="${c.s('boutique.compteUn')}">${c.t('boutique.compte', { n: cat.produits.length })}</p>
  <div class="grille-produits" data-grille>${cat.produits.map((p, i) => carteProduit(c, p, { priorite: i < 4 }))}</div>
  <p class="boutique-aucun" data-boutique-aucun hidden>${c.t('boutique.aucun')} <button type="button" class="lien" data-filtres-effacer>${c.t('boutique.effacer')}</button></p>
</section>

<section class="bandeau-serie conteneur" id="serie">
  ${c.media({ nom: 'produits/lot-de-5-sac-de-camp-taille-louveteau-1-offert-2', alt: c.s('boutique.serie.alt'), classe: 'bandeau-serie-media', sizes: '(max-width: 760px) 100vw, 35vw' })}
  <div>
    <h2 class="titre-section" data-brode>${c.t('boutique.serie.titre')}</h2>
    <p data-anime>${c.t('boutique.serie.texte')}</p>
    <p data-anime>${c.lien('commandes-groupees', { ancre: 'devis', classe: 'bouton', texte: c.t('boutique.serie.action') })}</p>
  </div>
</section>

<section class="faq conteneur" id="faq">
  <div>
    <h2 class="titre-section" data-brode>${c.t('boutique.faq.titre')}</h2>
    ${c.donnees.faq.boutique.map((f) => html`<details class="faq-item" data-anime><summary>${f.q}</summary><div class="faq-reponse"><p>${f.r}</p></div></details>`)}
    <p class="section-action" data-anime>${c.lien('infos-pratiques', { classe: 'lien-fleche', texte: html`${c.libelle('infos-pratiques')} ${icone('fleche')}` })}</p>
  </div>
  ${visuel(c, { grok: 'boutique-faq', motif: 'bobine', alt: '', classe: 'faq-media', sizes: '(max-width: 760px) 100vw, 35vw', ratio: '4 / 5' })}
</section>
`;
};
