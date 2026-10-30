/* Mentions légales : fiche récapitulative à compléter, éditeur réel (relevé du site actuel), hébergeur, crédits.
   Barre de lecture et sommaire qui suit la lecture. */
import { html } from '../../outils/gabarit.mjs';
import { visuel } from '../gabarits/outils.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', imagePartage: 'produits/serviettes-de-tables-phare-2-1280.webp', sansAction: true };

const sections = ['fiche', 'editeur', 'hebergeur', 'credits', 'confidentialite'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court page-tete--bande" id="debut">
  <div class="page-tete-texte">
    <h1 class="page-titre">${c.t('mentions.titre')}</h1>
    <nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}" data-sans-transition>${c.t(`mentions.${s}.titre`)}</a></li>`)}</ul></nav>
  </div>
  ${visuel(c, { grok: 'legal-lin', motif: 'fil', alt: c.s('mentions.alt'), classe: 'page-tete-media', sizes: '100vw', priorite: true })}
</section>
<div class="texte-long texte-long--legal conteneur" data-sans-visuel>
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel${s === 'fiche' ? ' class="fiche-a-completer"' : ''}><h2>${c.t(`mentions.${s}.titre`)}</h2><p>${s === 'confidentialite' ? html`${c.lien('confidentialite', { classe: 'lien-fleche lien-ligne', texte: c.t('mentions.confidentialite.texte') })}` : c.t(`mentions.${s}.texte`)}</p></section>`)}
</div>
`;
