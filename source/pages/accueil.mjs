/* Accueil : 10 écrans sur ordinateur, dans l'ordre où le visiteur cherche les informations :
   promesse et action, l'occasion du moment (Noël), les univers, les nouveautés, la personnalisation,
   le savoir-faire, le délai, les commandes groupées, l'atelier et les avis, le contact. */
import { html, brut } from '../../outils/gabarit.mjs';
import { visuel, prix, carteProduit, urlProduit, icone, etoiles } from '../gabarits/outils.mjs';

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'produits/sac-prenom-1-1280.webp' };

/* Carte de la Bretagne (4 départements, contour simplifié d'après les coordonnées réelles), Morbihan mis en valeur,
   point sur Kernascléden (47,99 N ; 3,32 O). Projection équirectangulaire à 48° de latitude. */
const CARTE_BRETAGNE = 'M506.6 74.7 L481.2 79.1 L455.7 58.9 L436.3 67.9 L413.8 74.7 L389.8 63.4 L364.4 72.4 L343.4 90.4 L331.4 106.1 L316.5 90.4 L309.0 70.2 L291.0 52.2 L282.0 34.2 L265.6 23.0 L246.1 27.5 L217.6 29.7 L198.2 38.7 L201.2 58.9 L187.7 61.2 L163.7 56.7 L147.3 65.7 L136.8 52.2 L103.8 63.4 L78.4 65.7 L49.9 81.4 L29.0 90.4 L18.5 108.4 L18.5 135.3 L41.0 139.8 L60.4 130.8 L84.4 137.6 L93.4 151.0 L70.9 153.3 L54.4 148.8 L41.0 155.5 L51.4 171.3 L49.9 182.5 L63.4 175.7 L85.9 178.0 L90.4 196.0 L70.9 200.5 L24.5 207.2 L52.9 213.9 L73.9 231.9 L78.4 261.1 L103.8 249.9 L117.3 245.4 L145.8 245.4 L163.7 261.1 L186.2 267.9 L204.2 270.1 L220.6 283.6 L238.6 288.1 L253.6 301.6 L264.1 333.0 L267.1 310.5 L291.0 317.3 L306.0 306.0 L319.5 299.3 L301.5 319.5 L321.0 328.5 L343.4 324.0 L362.9 330.8 L388.3 317.3 L403.3 306.0 L421.3 294.8 L455.7 283.6 L493.2 279.1 L523.1 265.6 L545.6 267.9 L568.0 245.4 L575.5 209.4 L580.0 171.3 L572.5 142.1 L571.0 108.4 L538.1 92.6 Z';
const CARTE_MORBIHAN = 'M204.2 270.1 L201.2 245.4 L193.7 220.7 L175.7 200.5 L184.7 178.0 L220.6 171.3 L258.1 173.5 L298.5 178.0 L331.4 189.2 L373.4 182.5 L395.8 200.5 L404.8 231.9 L418.3 265.6 L421.3 294.8 L403.3 306.0 L388.3 317.3 L362.9 330.8 L343.4 324.0 L321.0 328.5 L301.5 319.5 L319.5 299.3 L306.0 306.0 L291.0 317.3 L267.1 310.5 L264.1 333.0 L253.6 301.6 L238.6 288.1 L220.6 283.6 Z';
const KER = { x: 235.6, y: 218.4 };

export function carteBrodee(c) {
  return html`<figure class="carte-brodee" data-visuel role="img" aria-label="${c.s('accueil.atelier.carteAlt')}">
  <svg viewBox="0 0 600 354" aria-hidden="true">
    <path class="carte-trace" d="${brut(CARTE_BRETAGNE)}"/>
    <path class="carte-departement" d="${brut(CARTE_MORBIHAN)}"/>
    <circle class="carte-point-halo" cx="${KER.x}" cy="${KER.y}" r="16"/>
    <circle class="carte-point" cx="${KER.x}" cy="${KER.y}" r="7"/>
    <text class="carte-nom" x="${KER.x + 14}" y="${KER.y - 12}">${c.s('accueil.atelier.carteNom')}</text>
  </svg>
  <figcaption><strong>${c.t('accueil.atelier.carteTitre')}</strong><span>${c.t('accueil.atelier.carteTexte')}</span></figcaption>
</figure>`;
}

export function avis(c) {
  const date = (d) => new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(d));
  return html`<ul class="avis-liste">${c.donnees.avis.map((a) => html`<li class="avis" data-anime>
    ${etoiles(a.note)}
    <p class="avis-titre">${a.titre}</p>
    <blockquote><p>${a.texte}</p></blockquote>
    <p class="avis-auteur">${a.auteur} · <time datetime="${a.date}">${date(a.date)}</time></p>
  </li>`)}</ul>
  <p class="avis-source">${c.t('accueil.atelier.avisSource')}</p>`;
}

export default (c) => {
  const cat = c.donnees.catalogue;
  const P = Object.fromEntries(cat.produits.map((p) => [p.slug, p]));
  const noel = ['support-pour-boule-de-noel', 'santon-saint-charles-de-foucauld', 'bonnet-en-polaire', 'santon-saint-francois-d-assise', 'polaire', 'sweat-j-peux-pas-j-ai-puy-du-fou-1'];
  const detoureNoel = { 'support-pour-boule-de-noel': 'detoures/support-pour-boule-de-noel-1', 'santon-saint-charles-de-foucauld': 'detoures/santon-saint-charles-de-foucauld-1', 'bonnet-en-polaire': 'detoures/bonnet-en-polaire-1', 'santon-saint-francois-d-assise': 'detoures/santon-saint-francois-d-assise-1', 'polaire': 'detoures/polaire-1' };
  const imagesUnivers = { scout: 'produits/sweat-maitrise-3', religieux: 'produits/cierge-sacrement-1', puydufou: 'produits/sweat-j-peux-pas-j-ai-puy-du-fou-1', enfant: 'produits/porte-monnaie-flex-1', sacs: 'produits/sac-de-voyage-initiale-20l-1', maison: 'produits/serviettes-de-table-hermine-2', bijoux: 'produits/boucles-d-oreilles-1', bois: 'produits/support-pour-boule-de-noel-1', santons: 'produits/santon-saint-charles-de-foucauld-1', groupes: 'produits/polo-de-camp-3' };
  const cadragesUnivers = { scout: '60% 50%', puydufou: '50% 45%', santons: '62% 50%', bois: '50% 40%' };
  const nouveautes = ['serviettes-de-tables-phare', 'sweat-charette', 'tee-shirt-jpeux-pas-jai-puy-du-fou', 'boucles-d-oreilles-1'].map((s) => P[s]);
  const groupes = [['polo-de-camp', 'produits/polo-de-camp-3'], ['sweat-maitrise', 'produits/sweat-maitrise-1'], ['lot-de-5-sac-de-camp-taille-louveteau-1-offert', 'produits/lot-de-5-sac-de-camp-taille-louveteau-1-offert-1'], ['sweat-patrouille', 'produits/sweat-patrouille-1']];
  const couleursSac = [
    { cle: 'bleu marine', image: 'detoures/sac-initiale-brodee-1', hex: '#1f2a4a' }, { cle: 'rouge', image: 'detoures/sac-initiale-brodee-2', hex: '#c8282f' },
    { cle: 'noir', image: 'detoures/sac-initiale-brodee-3', hex: '#1b1b1d' }, { cle: 'rose', image: 'detoures/sac-initiale-brodee-4', hex: '#eb9bd8' },
  ];
  const fils = [{ cle: 'filBlanc', hex: '#efe8d6' }, { cle: 'filOr', hex: '#d4a548' }, { cle: 'filMarine', hex: '#1f2a4a' }, { cle: 'filRose', hex: '#d495a3' }];
  const etapesSF = ['broderie', 'decoupe', 'presse', 'couture'];
  const exemplesSF = { broderie: 'produits/pochette-brodee-1-1', decoupe: 'produits/porte-monnaie-flex-1', presse: 'produits/polo-de-camp-5', couture: 'produits/mes-livres-pour-la-messe-applique-1' };
  const grokSF = { broderie: 'savoir-faire-broderie', decoupe: 'savoir-faire-flex', presse: 'savoir-faire-presse', couture: 'savoir-faire-couture' };
  const motifsSF = { broderie: 'tambour', decoupe: 'fil', presse: 'colis', couture: 'bobine' };

  return html`
<section class="hero" id="debut" data-masque-barre>
  <div class="hero-texte">
    <h1 class="hero-titre" data-superpose>
      <span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre1')}</span></span>
      <span class="ligne-masque ligne-masque--script"><span class="hero-ligne hero-brode" data-anime="gsap">${c.t('accueil.hero.titre2')}<svg class="hero-couture" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true"><path d="M4 12 C 80 2, 160 18, 296 8" pathLength="1"/></svg></span></span>
      <span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre3')}</span></span>
    </h1>
    <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.texte')}</p>
    <p class="hero-actions" data-anime="gsap">
      <a class="bouton bouton--large" href="${c.url('boutique')}" data-libelle="${c.libelle('boutique')}" data-action-principale>${c.t('accueil.hero.action')} ${icone('fleche')}</a>
      <span class="hero-info" data-info-cle>${icone('aiguille')} ${c.t('accueil.hero.info')}</span>
    </p>
  </div>
  <div class="hero-scene" data-hero-scene>
    ${visuel(c, { grok: 'accueil-ouverture', motif: 'lin', alt: '', classe: 'hero-fond', sizes: '(max-width: 760px) 100vw, 55vw', priorite: true, cadrage: '30% 50%' })}
    <canvas class="hero-lin" data-lin aria-hidden="true" data-audit-ignorer></canvas>
    <svg class="hero-fil" viewBox="0 0 600 600" preserveAspectRatio="none" aria-hidden="true"><path d="M60 560 C 120 380, 300 470, 330 300 S 520 120, 560 40" pathLength="1"/></svg>
    <div class="hero-objet hero-objet--sac" data-anime="gsap">${c.media({ nom: 'detoures/sac-prenom-1', alt: c.s('accueil.hero.alt'), sizes: '(max-width: 760px) 80vw, 36vw', priorite: true, classe: 'media--detoure' })}</div>
    <div class="hero-objet hero-objet--sweat" data-anime="gsap">${c.media({ nom: 'detoures/sweat-patrouille-1', alt: c.s('accueil.hero.alt2'), sizes: '(max-width: 760px) 40vw, 20vw', classe: 'media--detoure' })}</div>
  </div>
</section>

<section class="noel" id="noel">
  ${visuel(c, { grok: 'accueil-noel', motif: 'lin', alt: '', classe: 'noel-fond', sizes: '100vw' })}
  <div class="conteneur noel-tete">
    <p class="surtitre" data-anime>${c.t('accueil.noel.surtitre')}</p>
    <h2 class="titre-section" data-brode>${c.t('accueil.noel.titre')}</h2>
    <p data-anime>${c.t('accueil.noel.texte')}</p>
  </div>
  <ul class="noel-suspendus conteneur" data-suspendus>
    ${noel.map((s, i) => { const p = P[s]; const det = detoureNoel[s]; return html`<li class="suspendu${det ? '' : ' suspendu--boule'}" style="--i:${i}" data-suspendu>
      <span class="suspendu-fil" aria-hidden="true"></span>
      <a class="suspendu-lien" href="${urlProduit(s)}" data-libelle="${p.nom}">
        ${c.media({ nom: det || p.images[0], alt: p.nom, sizes: '(max-width: 760px) 40vw, 14vw', classe: det ? 'media--detoure suspendu-media' : 'suspendu-media', cadrage: '50% 40%' })}
        <span class="suspendu-nom">${p.nom}</span>
        <strong class="suspendu-prix" data-prix>${prix(p.prix)}</strong>
      </a>
    </li>`; })}
  </ul>
  <p class="conteneur noel-action" data-anime><a class="bouton bouton--contour" href="${c.url('boutique', '', 'occasion=noel')}" data-libelle="${c.libelle('boutique')}">${c.t('accueil.noel.action')} ${icone('fleche')}</a></p>
</section>

<section class="univers ecran epingle" id="univers" data-entete-cache data-plein-ecran data-epingle-des="761">
  <div class="conteneur univers-tete">
    <h2 class="titre-section" data-brode>${c.t('accueil.univers.titre')}</h2>
    <p>${c.t('accueil.univers.texte')} <span class="glisser">${c.t('accueil.univers.glisser')}</span></p>
  </div>
  <div class="piste univers-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('accueil.univers.region')}">
    ${cat.univers.map((u) => html`<a class="ecusson" href="${c.url('boutique', '', 'univers=' + u.cle)}" data-libelle="${c.libelle('boutique')}">
      <span class="ecusson-cadre">${c.media({ nom: imagesUnivers[u.cle], alt: '', sizes: '(max-width: 760px) 70vw, 26vw', classe: 'ecusson-media', cadrage: cadragesUnivers[u.cle] || '50% 50%' })}
        <svg class="ecusson-couture" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="2.5" y="2.5" width="95" height="95" rx="5" pathLength="1"/></svg></span>
      <span class="ecusson-nom">${u.nom}</span>
      <span class="ecusson-infos"><span>${c.t('accueil.univers.articles', { n: u.nombre })}</span><strong data-prix>${c.t('accueil.univers.des', { prix: prix(u.desPrix) })}</strong></span>
    </a>`)}
  </div>
  <div class="galerie-progres" aria-hidden="true"><span></span></div>
</section>

<section class="nouveautes conteneur" id="nouveautes">
  <div class="section-tete">
    <h2 class="titre-section" data-brode>${c.t('accueil.nouveautes.titre')}</h2>
    <p data-anime>${c.t('accueil.nouveautes.texte')}</p>
  </div>
  <div class="grille-produits grille-produits--4">${nouveautes.map((p) => carteProduit(c, p, { sansNouveaute: true }))}</div>
  <p class="section-action" data-anime><a class="lien-fleche" href="${c.url('boutique')}" data-libelle="${c.libelle('boutique')}">${c.t('accueil.nouveautes.action')} ${icone('fleche')}</a></p>
</section>

<section class="demo" id="personnaliser" data-demo>
  <div class="conteneur demo-grille">
    <div class="demo-texte">
      <p class="surtitre" data-anime>${c.t('accueil.demo.surtitre')}</p>
      <h2 class="titre-section" data-brode>${c.t('accueil.demo.titre')}</h2>
      <p data-anime>${c.t('accueil.demo.texte')}</p>
      <form class="demo-form" data-demo-form action="${urlProduit('sac-prenom')}" data-libelle="${P['sac-prenom'].nom}">
        <fieldset class="demo-etape">
          <legend><span class="demo-num">1</span> ${c.t('accueil.demo.etape1')} <span class="demo-valeur" data-demo-valeur="couleur"></span></legend>
          <div class="pastilles">${couleursSac.map((s, i) => html`<label class="pastille-couleur" style="--c:${s.hex}"><input type="radio" name="couleur" value="${s.cle}"${i === 2 ? brut(' checked') : ''} data-image="${s.cle}"><span class="visuellement-cache">${s.cle}</span></label>`)}</div>
        </fieldset>
        <div class="demo-etape champ">
          <label for="demo-prenom"><span class="demo-num">2</span> ${c.t('accueil.demo.etape2')}</label>
          <input id="demo-prenom" name="prenom" maxlength="14" value="${c.s('accueil.demo.exemple')}" autocomplete="off" data-demo-prenom>
        </div>
        <fieldset class="demo-etape">
          <legend><span class="demo-num">3</span> ${c.t('accueil.demo.etape3')} <span class="demo-valeur" data-demo-valeur="fil"></span></legend>
          <div class="pastilles">${fils.map((f, i) => html`<label class="pastille-couleur pastille-couleur--fil" style="--c:${f.hex}"><input type="radio" name="fil" value="${c.s('accueil.demo.' + f.cle)}"${i === 0 ? brut(' checked') : ''} data-hex="${f.hex}"><span class="visuellement-cache">${c.t('accueil.demo.' + f.cle)}</span></label>`)}</div>
        </fieldset>
        <p class="demo-indicatif">${c.t('accueil.demo.indicatif')}</p>
        <p><button type="submit" class="bouton bouton--large">${c.t('accueil.demo.action')}</button></p>
      </form>
    </div>
    <div class="demo-visuel" data-demo-visuel aria-live="polite">
      ${couleursSac.map((s, i) => html`<div class="demo-sac${i === 2 ? ' actif' : ''}" data-sac="${s.cle}">${c.media({ nom: s.image, alt: c.s('accueil.demo.alt', { couleur: s.cle }), sizes: '(max-width: 760px) 90vw, 45vw', classe: 'media--detoure' })}</div>`)}
      <svg class="demo-broderie" viewBox="0 0 600 220" aria-hidden="true"><text x="300" y="150" text-anchor="middle" data-demo-texte>${c.s('accueil.demo.exemple')}</text></svg>
    </div>
  </div>
</section>

<section class="savoir-faire ecran epingle" id="savoir-faire" data-savoir-faire data-entete-cache data-plein-ecran data-epingle-des="901">
  <div class="conteneur sf-grille">
    <div class="sf-texte">
      <h2 class="titre-section" data-brode>${c.t('accueil.savoirFaire.titre')}</h2>
      <p class="sf-intro">${c.t('accueil.savoirFaire.texte')}</p>
      <ol class="sf-etapes" aria-label="${c.s('accueil.savoirFaire.region')}">
        ${etapesSF.map((e, i) => html`<li class="sf-etape${i === 0 ? ' actif' : ''}" data-sf-etape="${i}">
          <h3><span class="sf-num">0${i + 1}</span> ${c.t(`accueil.savoirFaire.${e}.titre`)}</h3>
          <p>${c.t(`accueil.savoirFaire.${e}.texte`)}</p>
        </li>`)}
      </ol>
    </div>
    <div class="sf-scene">
      ${etapesSF.map((e, i) => html`<div class="sf-plan${i === 0 ? ' actif' : ''}" data-sf-plan="${i}">
        ${visuel(c, { grok: grokSF[e], motif: motifsSF[e], alt: '', classe: 'sf-macro', sizes: '(max-width: 760px) 90vw, 30vw', ratio: '4 / 5' })}
        <figure class="sf-exemple">${c.media({ nom: exemplesSF[e], alt: c.s(`accueil.savoirFaire.${e}.exemple`).replace(/^Exemple : /, ''), sizes: '(max-width: 760px) 50vw, 16vw', classe: 'sf-exemple-media' })}<figcaption>${c.t(`accueil.savoirFaire.${e}.exemple`)}</figcaption></figure>
      </div>`)}
      <svg class="sf-effet" viewBox="0 0 400 500" aria-hidden="true" data-sf-effet>
        <path class="sf-point" d="M40 420 C 120 340, 160 380, 210 300 S 330 180, 360 90" pathLength="1"/>
      </svg>
    </div>
  </div>
</section>

<section class="delai conteneur" id="delai">
  <div class="section-tete">
    <h2 class="titre-section" data-brode>${c.t('accueil.delai.titre')}</h2>
  </div>
  <div class="delai-grille">
    <ol class="frise" data-frise>
      <svg class="frise-couture" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true"><path d="M10 10 H 990" pathLength="1"/></svg>
      ${[1, 2, 3].map((n) => html`<li class="frise-etape" data-anime>
        <span class="frise-point" aria-hidden="true">${n}</span>
        <h3>${c.t(`accueil.delai.etape${n}`)}</h3>
        <p>${c.t(`accueil.delai.etape${n}Texte`)}</p>
      </li>`)}
    </ol>
    ${visuel(c, { grok: 'accueil-delai', motif: 'colis', alt: '', classe: 'delai-media', sizes: '(max-width: 760px) 100vw, 40vw', cadrage: '70% 50%' })}
  </div>
  <p class="section-action" data-anime>${c.t('accueil.delai.question')} <a class="lien-fleche" href="tel:${c.site.contact.telephoneLien}">${icone('telephone')} ${c.site.contact.telephone}</a></p>
</section>

<section class="groupes-teaser" id="groupes">
  <div class="conteneur groupes-grille">
    <div class="groupes-texte">
      <h2 class="titre-section" data-brode>${c.t('accueil.groupes.titre')}</h2>
      <p data-anime>${c.t('accueil.groupes.texte')}</p>
      <p data-anime>${c.lien('commandes-groupees', { ancre: 'devis', classe: 'bouton bouton--large', texte: c.t('accueil.groupes.action') })}</p>
    </div>
    <ul class="eventail" data-eventail>
      ${groupes.map(([s, img], i) => { const p = P[s]; return html`<li class="eventail-carte" style="--i:${i}">
        <a href="${urlProduit(s)}" data-libelle="${p.nom}">${c.media({ nom: img, alt: p.nom, sizes: '(max-width: 760px) 45vw, 20vw', classe: 'eventail-media' })}<span class="eventail-legende">${p.nom}<strong data-prix>${prix(p.prix)}</strong></span></a>
      </li>`; })}
    </ul>
  </div>
</section>

<section class="atelier-teaser" id="atelier">
  <div class="conteneur atelier-grille">
    <div>
      <h2 class="titre-section" data-brode>${c.t('accueil.atelier.titre')}</h2>
      <figure class="citation" data-anime><blockquote><p>${c.t('accueil.atelier.citation')}</p></blockquote><figcaption>${c.t('accueil.atelier.auteur')}</figcaption></figure>
      <p data-anime>${c.lien('atelier', { classe: 'bouton bouton--contour', texte: c.t('accueil.atelier.action') })}</p>
    </div>
    ${carteBrodee(c)}
  </div>
  <div class="conteneur avis-bloc">
    <h3 class="avis-bloc-titre" data-anime>${c.t('accueil.atelier.avisTitre')}</h3>
    ${avis(c)}
  </div>
</section>

<section class="fin" id="contact-rapide">
  ${visuel(c, { grok: 'accueil-fin', motif: 'fil', alt: '', classe: 'fin-fond', sizes: '100vw' })}
  <div class="conteneur fin-boite" data-anime>
    <h2 class="titre-section">${c.t('accueil.fin.titre')}</h2>
    <p>${c.t('accueil.fin.texte')}</p>
    <p class="fin-actions">${c.lien('contact', { ancre: 'ecrire', classe: 'bouton bouton--large', texte: c.t('accueil.fin.action') })}<a class="bouton bouton--contour bouton--large" href="tel:${c.site.contact.telephoneLien}">${icone('telephone')} ${c.site.contact.telephone}</a></p>
  </div>
</section>
`;
};
