/* Infos pratiques : délais, livraison, retrait, paiement, prix, retours (version conforme à faire valider), FAQ.
   Barre de lecture et sommaire qui suit la lecture. */
import { html, brut } from '../../outils/gabarit.mjs';
import { visuel, icone } from '../gabarits/outils.mjs';

export const page = { cle: 'infos-pratiques', fichier: 'infos-pratiques', imagePartage: 'produits/lot-de-5-sac-de-camp-taille-louveteau-1-offert-1-1280.webp' };

const DESSINS = {
  delais: '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="44" class="d-trait"/><path d="M60 30 V60 L80 72" class="d-fil"/></svg>',
  livraison: '<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="22" y="38" width="76" height="52" rx="4" class="d-trait"/><path d="M22 60 H98 M60 38 V90" class="d-fil"/></svg>',
  retrait: '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 98 C 40 76 30 62 30 48 a30 30 0 0 1 60 0 C 90 62 80 76 60 98Z" class="d-trait"/><circle cx="60" cy="48" r="10" class="d-fil"/></svg>',
  paiement: '<svg viewBox="0 0 120 120" aria-hidden="true"><rect x="18" y="34" width="84" height="54" rx="6" class="d-trait"/><path d="M18 50 H102 M30 74 H58" class="d-fil"/></svg>',
  prix: '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M30 30 H70 L96 56 L62 90 L30 58 Z" class="d-trait"/><circle cx="48" cy="48" r="6" class="d-fil"/></svg>',
  retours: '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M86 46 A30 30 0 1 0 90 70" class="d-trait"/><path d="M86 28 V48 H66" class="d-fil"/></svg>',
  faq: '<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M24 30 H96 V78 H58 L40 94 V78 H24 Z" class="d-trait"/><path d="M50 46 a10 10 0 1 1 14 9 c-4 2-4 4-4 8 M60 70 v1" class="d-fil"/></svg>',
};
const dessin = (k) => html`<figure class="dessin-brode" data-visuel aria-hidden="true">${brut(DESSINS[k])}</figure>`;

export default (c) => {
  const sections = ['delais', 'livraison', 'retrait', 'paiement', 'prix', 'retours', 'faq'];
  return html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--bande" id="debut">
  <div class="page-tete-texte">
    <h1 class="page-titre" data-anime="gsap">${c.t('infos.titre')}</h1>
    <p class="page-intro" data-anime="gsap">${c.t('infos.texte')}</p>
    <p class="hero-info" data-info-cle data-anime="gsap">${icone('aiguille')} ${c.t('commun.delai')} · ${c.t('commun.retrait')}</p>
    <p data-anime="gsap">${c.lien('boutique', { classe: 'bouton', texte: c.t('atelier.fin.action'), attrs: 'data-action-principale' })}</p>
  </div>
  ${visuel(c, { grok: 'infos-ouverture', motif: 'colis', alt: c.s('infos.alt'), classe: 'page-tete-media', sizes: '100vw', priorite: true, cadrage: '70% 50%' })}
</section>

<div class="texte-long-grille conteneur">
  <nav class="sommaire-lateral" data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}" data-sans-transition>${c.t(`infos.${s}.titre`)}</a></li>`)}</ul></nav>
  <div class="texte-long">
    ${['delais', 'livraison', 'retrait', 'paiement', 'prix'].map((s) => html`<section id="${s}" class="info-bloc">
      ${dessin(s)}
      <div><h2>${c.t(`infos.${s}.titre`)}</h2><p>${c.t(`infos.${s}.texte`)}</p>
      ${s === 'paiement' ? html`<ul class="moyens">${['carte', 'paypal', 'horsLigne'].map((m) => html`<li>${c.t('infos.paiement.' + m)}</li>`)}</ul>` : ''}</div>
    </section>`)}
    <section id="retours" class="info-bloc">
      ${dessin('retours')}
      <div>
        <h2>${c.t('infos.retours.titre')}</h2>
        <p class="a-valider">${c.t('infos.retours.avertissement')}</p>
        <ol class="retours-liste">${[1, 2, 3, 4, 5].map((n) => html`<li>${c.t(`infos.retours.r${n}`)}</li>`)}</ol>
      </div>
    </section>
    <section id="faq" class="info-bloc info-bloc--faq">
      ${dessin('faq')}
      <div>
        <h2>${c.t('infos.faq.titre')}</h2>
        ${c.donnees.faq.infos.map((f) => html`<details class="faq-item"><summary>${f.q}</summary><div class="faq-reponse"><p>${f.r}</p></div></details>`)}
      </div>
    </section>
  </div>
</div>

<section class="fin fin--simple" id="fin" data-sans-visuel>
  <div class="conteneur fin-boite" data-anime>
    <h2 class="titre-section">${c.t('infos.fin.titre')}</h2>
    <p class="fin-actions">${c.lien('contact', { ancre: 'ecrire', classe: 'bouton bouton--large', texte: c.t('infos.fin.action') })}<a class="bouton bouton--contour bouton--large" href="tel:${c.site.contact.telephoneLien}">${icone('telephone')} ${c.site.contact.telephone}</a></p>
  </div>
</section>
`;
};
