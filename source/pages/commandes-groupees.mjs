/* Commandes groupées : patrouilles, paroisses, écoles, entreprises. Réalisations réelles, étapes,
   demande de devis en 4 étapes avec récapitulatif fixe (estimation d'après les prix de la boutique). */
import { html, brut } from '../../outils/gabarit.mjs';
import { visuel, prix, icone, urlProduit } from '../gabarits/outils.mjs';

export const page = { cle: 'commandes-groupees', fichier: 'commandes-groupees', imagePartage: 'produits/polo-de-camp-5-1280.webp' };

export default (c) => {
  const cat = c.donnees.catalogue;
  const P = Object.fromEntries(cat.produits.map((p) => [p.slug, p]));
  const serie = ['sweat-patrouille', 'sweat-maitrise', 'polo-de-camp', 'lot-de-5-sac-de-camp-taille-louveteau-1-offert', 'lot-de-5-sac-taille-guide-1-offert-flexe', 'lot-de-7-sac-de-camp-1-offert', 'sweat-entreprise', 'tee-shirt-entreprise-flex'];
  const imagesSerie = {};
  const devis = ['sweat-patrouille', 'sweat-maitrise', 'polo-de-camp', 'lot-de-5-sac-de-camp-taille-louveteau-1-offert', 'lot-de-5-sac-taille-guide-1-offert-flexe', 'lot-de-7-sac-de-camp-1-offert', 'sweat-entreprise', 'tee-shirt-entreprise-flex', 'sweat-saint-michel', 'sweat-jeanne-d-arc'];
  return html`
<section class="page-tete page-tete--groupes" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre" data-anime="gsap">${c.t('groupes.sousTitre')}</p>
    <h1 class="page-titre" data-anime="gsap">${c.t('groupes.titre')}</h1>
    <p class="page-intro" data-anime="gsap">${c.t('groupes.texte')}</p>
    <p data-anime="gsap"><a class="bouton bouton--large" href="#devis" data-action-principale>${c.t('groupes.action')} ${icone('fleche')}</a> <span class="hero-info" data-info-cle>${icone('aiguille')} ${c.t('commun.delai')}</span></p>
  </div>
  <div class="page-tete-scene">
    ${visuel(c, { grok: 'groupes-ouverture', motif: 'fil', alt: '', classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 50vw', priorite: true, cadrage: '35% 60%' })}
    <div class="page-tete-photo">${c.media({ nom: 'produits/polo-de-camp-5', alt: c.s('groupes.alt'), sizes: '(max-width: 760px) 50vw, 18vw', priorite: true, classe: 'photo-posee' })}</div>
  </div>
</section>

<section class="serie conteneur" id="serie">
  <div class="section-tete">
    <h2 class="titre-section" data-brode>${c.t('groupes.serie.titre')}</h2>
    <p data-anime>${c.t('groupes.serie.texte')}</p>
  </div>
  <ul class="serie-grille">
    ${serie.map((s) => { const p = P[s]; return html`<li class="serie-carte" data-anime>
      <a href="${urlProduit(s)}" data-libelle="${p.nom}">
        ${c.media({ nom: imagesSerie[s] || p.images[0], alt: p.nom, sizes: '(max-width: 760px) 50vw, 25vw', classe: 'serie-media' })}
        <span class="serie-nom">${p.nom}</span>
        <strong class="serie-prix" data-prix>${prix(p.prix)}</strong>
      </a>
    </li>`; })}
  </ul>
</section>

<section class="etapes conteneur" id="etapes">
  <div class="section-tete"><h2 class="titre-section" data-brode>${c.t('groupes.etapes.titre')}</h2></div>
  <div class="etapes-grille">
    <ol class="etapes-liste" data-etapes-fil>
      <svg class="etapes-couture" viewBox="0 0 20 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M10 10 V 990" pathLength="1"/></svg>
      ${[1, 2, 3, 4].map((n) => html`<li data-anime><span class="etape-num" aria-hidden="true">${n}</span><h3>${c.t(`groupes.etapes.e${n}`)}</h3><p>${c.t(`groupes.etapes.e${n}Texte`)}</p></li>`)}
    </ol>
    ${visuel(c, { grok: 'groupes-etapes', motif: 'fil', alt: '', classe: 'etapes-media', sizes: '(max-width: 760px) 100vw, 36vw', ratio: '1 / 1' })}
  </div>
</section>

<section class="devis conteneur" id="devis">
  <div class="devis-tete">
    <div class="section-tete"><h2 class="titre-section" data-brode>${c.t('groupes.devis.titre')}</h2><p>${c.t('groupes.devis.intro')}</p></div>
    ${visuel(c, { grok: 'groupes-devis', motif: 'bobine', alt: '', classe: 'devis-tete-media', sizes: '(max-width: 900px) 100vw, 30vw', ratio: '16 / 9' })}
  </div>
  <div class="devis-grille">
    <form class="formulaire devis-form" data-formulaire data-devis data-message-texte="${c.s('groupes.devis.envoye')}" novalidate>
      <p class="devis-etape-num" data-devis-num aria-live="polite" data-modele="${c.s('groupes.devis.etape')}">${c.t('groupes.devis.etape', { n: 1 })}</p>
      <fieldset class="devis-etape" data-devis-etape="1">
        <legend>${c.t('groupes.devis.e1')}</legend>
        <p class="champ-titre" id="devis-type-titre">${c.t('groupes.devis.type')}</p>
        <div class="choix-cartes" role="radiogroup" aria-labelledby="devis-type-titre">
          ${['Scout', 'Paroisse', 'Entreprise', 'Famille'].map((t, i) => html`<label class="choix-carte"><input type="radio" name="type" value="${t.toLowerCase()}"${i === 0 ? brut(' checked') : ''}><span>${c.t('groupes.devis.type' + t)}</span></label>`)}
        </div>
        <div class="champ"><label for="d-groupe">${c.t('groupes.devis.nomGroupe')}</label><input id="d-groupe" name="groupe" autocomplete="organization"></div>
      </fieldset>
      <fieldset class="devis-etape" data-devis-etape="2" hidden>
        <legend>${c.t('groupes.devis.articles')}</legend>
        <ul class="devis-articles">
          ${devis.map((s) => { const p = P[s]; return html`<li class="devis-article" data-ligne-prix="${p.prix}" data-nom="${p.nom}">
            <span class="devis-article-nom">${p.nom} <strong data-prix>${prix(p.prix)}</strong></span>
            <label class="visuellement-cache" for="q-${s}">${c.s('groupes.devis.quantite', { nom: p.nom })}</label>
            <input id="q-${s}" name="q-${s}" type="number" min="0" max="999" value="0" inputmode="numeric" class="devis-qte" data-devis-qte="${s}">
          </li>`; })}
        </ul>
        <p class="champ-erreur" data-devis-erreur-articles hidden>${c.t('groupes.devis.aucunArticle')}</p>
        <p class="devis-total-barre" aria-hidden="true"><span>${c.t('groupes.devis.estimation')}</span><strong data-recap-total-barre>—</strong></p>
      </fieldset>
      <fieldset class="devis-etape" data-devis-etape="3" hidden>
        <legend>${c.t('groupes.devis.e3')}</legend>
        <div class="champ"><label for="d-texte">${c.t('groupes.devis.texte')}</label><textarea id="d-texte" name="texte" rows="3" placeholder="${c.s('groupes.devis.textePlaceholder')}"></textarea></div>
        <div class="champ"><label for="d-logo">${c.t('groupes.devis.logo')}</label><input id="d-logo" name="logo" type="file" accept="image/*,.pdf"><p class="champ-aide">${c.t('groupes.devis.logoAide')}</p></div>
        <p class="champ-titre" id="devis-tech-titre">${c.t('groupes.devis.technique')}</p>
        <div class="choix-cartes choix-cartes--3" role="radiogroup" aria-labelledby="devis-tech-titre">
          ${['Broderie', 'Flex', 'Conseil'].map((t, i) => html`<label class="choix-carte"><input type="radio" name="technique" value="${t.toLowerCase()}"${i === 2 ? brut(' checked') : ''}><span>${c.t('groupes.devis.technique' + t)}</span></label>`)}
        </div>
        <div class="champ"><label for="d-date">${c.t('groupes.devis.date')}</label><input id="d-date" name="date" type="date" data-devis-date data-delai="${c.site.delaiJours}"><p class="champ-aide" data-devis-date-aide data-modele="${c.s('groupes.devis.dateAide')}" data-trop="${c.s('groupes.devis.dateTrop')}"></p></div>
      </fieldset>
      <fieldset class="devis-etape" data-devis-etape="4" hidden>
        <legend>${c.t('groupes.devis.e4')}</legend>
        <div class="champ"><label for="d-nom">${c.t('groupes.devis.nom')}</label><input id="d-nom" name="nom" autocomplete="name" required></div>
        <div class="champ"><label for="d-email">${c.t('groupes.devis.email')}</label><input id="d-email" name="email" type="email" autocomplete="email" required></div>
        <div class="champ"><label for="d-tel">${c.t('groupes.devis.tel')}</label><input id="d-tel" name="tel" type="tel" autocomplete="tel"></div>
        <div class="champ"><label for="d-message">${c.t('groupes.devis.message')}</label><textarea id="d-message" name="message" rows="3"></textarea></div>
        <p class="mention-donnees">${c.tb('groupes.devis.donnees')}</p>
      </fieldset>
      <p class="devis-boutons">
        <button type="button" class="bouton bouton--contour" data-devis-retour hidden>${c.t('groupes.devis.retour')}</button>
        <button type="button" class="bouton" data-devis-suivant>${c.t('groupes.devis.suivant')}</button>
        <button type="submit" class="bouton" data-devis-envoyer hidden>${c.t('groupes.devis.envoyer')}</button>
      </p>
      <p data-message-envoi data-texte="${c.s('groupes.devis.envoye')}" role="status" tabindex="-1" hidden></p>
    </form>
    <aside class="devis-recap" aria-label="${c.s('groupes.devis.recap')}">
      <div class="devis-recap-boite">
        <p class="devis-recap-titre">${c.t('groupes.devis.recap')}</p>
        <p class="devis-recap-vide" data-recap-vide>${c.t('groupes.devis.recapVide')}</p>
        <ul class="devis-recap-lignes" data-recap-lignes></ul>
        <p class="devis-recap-total"><span>${c.t('groupes.devis.estimation')}</span><strong data-total="0" data-recap-total aria-live="polite">—</strong></p>
        <p class="devis-recap-note">${c.t('groupes.devis.estimationNote')}</p>
      </div>
    </aside>
  </div>
</section>

<section class="faq conteneur" id="faq">
  <div>
    <h2 class="titre-section" data-brode>${c.t('groupes.faq.titre')}</h2>
    ${c.donnees.faq.groupes.map((f) => html`<details class="faq-item" data-anime><summary>${f.q}</summary><div class="faq-reponse"><p>${f.r}</p></div></details>`)}
  </div>
  ${c.media({ nom: 'produits/polo-de-camp-4', alt: c.s('groupes.faqAlt'), classe: 'faq-media', sizes: '(max-width: 760px) 100vw, 35vw' })}
</section>

<section class="fin fin--simple" id="fin" data-sans-visuel>
  <div class="conteneur fin-boite" data-anime>
    <h2 class="titre-section">${c.t('groupes.fin.titre')}</h2>
    <p>${c.t('groupes.fin.texte')}</p>
    <p class="fin-actions"><a class="bouton bouton--large" href="tel:${c.site.contact.telephoneLien}">${icone('telephone')} ${c.site.contact.telephone}</a>${c.lien('contact', { ancre: 'ecrire', params: 'sujet=devis', classe: 'bouton bouton--contour bouton--large', texte: c.t('accueil.fin.action') })}</p>
  </div>
</section>
`;
};
