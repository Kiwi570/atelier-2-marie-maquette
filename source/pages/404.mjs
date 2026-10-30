/* Page 404 : « Fil cassé », aux couleurs de l'atelier, avec son image. */
import { html } from '../../outils/gabarit.mjs';
import { visuel } from '../gabarits/outils.mjs';

export const page = { cle: '404', fichier: '404', langues: ['fr'], partage: false };

export default (c) => html`
<section class="page-tete introuvable" id="debut">
  <div class="page-tete-texte">
    <h1 class="page-titre" data-anime="gsap">${c.t('introuvable.titre')}</h1>
    <p class="page-intro" data-anime="gsap">${c.t('introuvable.texte')}</p>
    <p class="fin-actions" data-anime="gsap">${c.lien('accueil', { classe: 'bouton bouton--large', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })}${c.lien('boutique', { classe: 'bouton bouton--contour bouton--large', texte: c.t('introuvable.boutique') })}</p>
  </div>
  ${visuel(c, { grok: '404-fil-casse', motif: 'bobine', alt: c.s('introuvable.alt'), classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 45vw', priorite: true })}
</section>
`;
