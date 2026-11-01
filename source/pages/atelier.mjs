/* L'atelier : l'histoire (phrase réelle du site actuel), les machines, les techniques comparées, le lieu. */
import { html } from '../../outils/gabarit.mjs';
import { visuel, icone } from '../gabarits/outils.mjs';

export const page = { cle: 'atelier', fichier: 'atelier', imagePartage: 'produits/serviettes-de-table-hermine-2-1280.webp' };

export default (c) => {
  const machines = [['brodeuse', 'savoir-faire-broderie', 'tambour'], ['decoupe', 'savoir-faire-flex', 'fil'], ['couture', 'savoir-faire-couture', 'bobine']];
  const techniques = [['broderie', 'produits/sweat-saint-michel-1'], ['flex', 'produits/sweat-patrouille-1'], ['vinyle', 'produits/cierge-sacrement-1'], ['applique', 'produits/mes-livres-pour-la-messe-applique-1']];
  return html`
<section class="page-tete page-tete--plein" id="debut">
  <div class="page-tete-texte">
    <h1 class="page-titre" data-anime="gsap">${c.t('atelier.titre')}</h1>
    <p class="page-intro" data-anime="gsap">${c.t('atelier.texte')}</p>
    <p data-anime="gsap">${c.lien('boutique', { classe: 'bouton bouton--large', texte: html`${c.t('atelier.fin.action')} ${icone('fleche')}`, attrs: 'data-action-principale' })} <span class="hero-info" data-info-cle>${icone('lieu')} ${c.site.contact.adresse}</span></p>
  </div>
  ${visuel(c, { grok: 'atelier-ouverture', motif: 'bobine', alt: c.s('atelier.alt'), classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 50vw', priorite: true, cadrage: '60% 50%' })}
</section>

<section class="histoire conteneur" id="histoire">
  <div class="histoire-grille">
    ${c.media({ nom: 'produits/bougie-famille-1', alt: c.s('atelier.histoire.alt'), classe: 'histoire-media', sizes: '(max-width: 760px) 100vw, 40vw', cadrage: '50% 45%' })}
    <div>
      <h2 class="titre-section" data-brode>${c.t('atelier.histoire.titre')}</h2>
      <figure class="citation citation--grande" data-anime><blockquote><p>${c.t('atelier.histoire.citation')}</p></blockquote><figcaption>${c.t('atelier.histoire.auteur')}</figcaption></figure>
      <p data-anime>${c.t('atelier.histoire.texte')}</p>
    </div>
  </div>
</section>

<section class="machines conteneur" id="machines">
  <div class="section-tete"><h2 class="titre-section" data-brode>${c.t('atelier.machines.titre')}</h2><p data-anime>${c.t('atelier.machines.texte')}</p></div>
  <ul class="machines-grille">
    ${machines.map(([k, , motif]) => html`<li class="machine" data-anime>
      ${visuel(c, { motif, alt: '', classe: 'machine-media', sizes: '(max-width: 760px) 100vw, 25vw', ratio: '4 / 5' })}
      <h3>${c.t(`atelier.machines.${k}`)}</h3>
      <p>${c.t(`atelier.machines.${k}Texte`)}</p>
    </li>`)}
  </ul>
  <p class="machines-note" data-anime>${icone('aiguille')} ${c.t('atelier.machines.presseTexte')}</p>
</section>

<section class="techniques conteneur" id="techniques">
  <div class="section-tete"><h2 class="titre-section" data-brode>${c.t('atelier.techniques.titre')}</h2><p data-anime>${c.t('atelier.techniques.texte')}</p></div>
  <div class="techniques-liste">
    ${techniques.map(([k, img]) => html`<article class="technique" data-anime>
      ${c.media({ nom: img, alt: c.s(`atelier.techniques.${k}Exemples`), classe: 'technique-media', sizes: '(max-width: 760px) 40vw, 14vw' })}
      <div>
        <h3>${c.t(`atelier.techniques.${k}`)}</h3>
        <dl><dt>${c.t('atelier.techniques.colonneRendu')}</dt><dd>${c.t(`atelier.techniques.${k}Rendu`)}</dd><dt>${c.t('atelier.techniques.colonneExemples')}</dt><dd>${c.t(`atelier.techniques.${k}Exemples`)}</dd></dl>
      </div>
    </article>`)}
  </div>
</section>

<section class="lieu conteneur" id="lieu">
  <div class="lieu-grille">
    <div>
      <h2 class="titre-section" data-brode>${c.t('atelier.lieu.titre')}</h2>
      <p data-anime>${c.t('atelier.lieu.texte')}</p>
      <p class="fin-actions" data-anime>${c.lien('boutique', { classe: 'bouton bouton--large', texte: c.t('atelier.fin.action') })}<a class="bouton bouton--contour bouton--large" href="tel:${c.site.contact.telephoneLien}">${icone('telephone')} ${c.site.contact.telephone}</a></p>
    </div>
    ${visuel(c, { grok: 'atelier-campagne', motif: 'fil', alt: c.s('atelier.lieu.alt'), classe: 'lieu-media', sizes: '(max-width: 760px) 100vw, 45vw', ratio: '4 / 5', cadrage: '72% 55%' })}
  </div>
</section>

`;
};
