/* Confidentialité et cookies : à compléter par l'atelier (RGPD), avec ce que fait réellement la maquette. */
import { html } from '../../outils/gabarit.mjs';
import { visuel } from '../gabarits/outils.mjs';

export const page = { cle: 'confidentialite', fichier: 'confidentialite', imagePartage: 'produits/serviettes-de-table-hermine-1-1280.webp', sansAction: true };

const sections = ['donnees', 'maquette', 'cookies'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court page-tete--bande" id="debut">
  <div class="page-tete-texte">
    <h1 class="page-titre">${c.t('confidentialite.titre')}</h1>
    <nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}" data-sans-transition>${c.t(`confidentialite.${s}.titre`)}</a></li>`)}</ul></nav>
  </div>
  ${visuel(c, { grok: 'legal-lin', motif: 'fil', alt: c.s('confidentialite.alt'), classe: 'page-tete-media', sizes: '100vw', priorite: true })}
</section>
<div class="texte-long texte-long--legal conteneur" data-sans-visuel>
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel><h2>${c.t(`confidentialite.${s}.titre`)}</h2><p>${c.t(`confidentialite.${s}.texte`)}</p></section>`)}
</div>
`;
