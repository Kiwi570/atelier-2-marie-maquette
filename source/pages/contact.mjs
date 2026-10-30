/* Contact : téléphone, e-mail, adresse, formulaire simulé (sujet et article préremplis par l'adresse), lieu. */
import { html, brut } from '../../outils/gabarit.mjs';
import { visuel, icone } from '../gabarits/outils.mjs';
import { carteBrodee } from './accueil.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'produits/porte-monnaie-flex-1-1280.webp' };

export default (c) => {
  const k = c.site.contact;
  const sujets = [['commande', 'sujetCommande'], ['personnalisation', 'sujetPersonnalisation'], ['devis', 'sujetDevis'], ['retrait', 'sujetRetrait'], ['article', 'sujetArticle'], ['autre', 'sujetAutre']];
  return html`
<section class="page-tete page-tete--contact" id="debut">
  <div class="page-tete-texte">
    <h1 class="page-titre" data-anime="gsap">${c.t('contact.titre')}</h1>
    <p class="page-intro" data-anime="gsap">${c.t('contact.texte')}</p>
    <ul class="contact-direct" data-anime="gsap">
      <li><a class="bouton bouton--large" href="tel:${k.telephoneLien}" data-action-principale>${icone('telephone')} ${k.telephone}</a></li>
      <li><a class="bouton bouton--contour bouton--large" href="mailto:${k.email}">${icone('email')} <span class="contact-email">${k.email}</span></a></li>
    </ul>
    <p class="hero-info" data-info-cle data-anime="gsap">${c.t('commun.messages')} ${c.t('commun.horaires')}</p>
  </div>
  ${visuel(c, { grok: 'contact-ouverture', motif: 'fil', alt: c.s('contact.alt'), classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 45vw', priorite: true, cadrage: '70% 50%' })}
</section>

<section class="contact-formulaire conteneur" id="ecrire">
  <div class="contact-grille">
    <form data-formulaire class="formulaire" action="#" novalidate>
      <h2 class="titre-section" data-brode>${c.t('contact.formulaire.titre')}</h2>
      <div class="champ"><label for="f-nom">${c.t('contact.formulaire.nom')}</label><input id="f-nom" name="nom" autocomplete="name" required></div>
      <div class="champ-duo">
        <div class="champ"><label for="f-email">${c.t('contact.formulaire.email')}</label><input id="f-email" name="email" type="email" autocomplete="email" required></div>
        <div class="champ"><label for="f-tel">${c.t('contact.formulaire.tel')}</label><input id="f-tel" name="tel" type="tel" autocomplete="tel"></div>
      </div>
      <div class="champ"><label for="f-sujet">${c.t('contact.formulaire.sujet')}</label>
        <select id="f-sujet" name="sujet" required><option value="" selected>${c.t('contact.formulaire.sujetChoisir')}</option>${sujets.map(([v, t]) => html`<option value="${v}">${c.t('contact.formulaire.' + t)}</option>`)}</select></div>
      <div class="champ"><label for="f-article">${c.t('contact.formulaire.article')}</label><input id="f-article" name="article" autocomplete="off"></div>
      <div class="champ"><label for="f-message">${c.t('contact.formulaire.message')}</label><textarea id="f-message" name="message" rows="6" required></textarea></div>
      <p class="mention-donnees">${c.tb('contact.formulaire.donnees')}</p>
      <button type="submit" class="bouton bouton--large">${c.t('contact.formulaire.envoyer')}</button>
      <p data-message-envoi data-texte="${c.s('contact.formulaire.envoye')}" role="status" tabindex="-1" hidden></p>
    </form>
    <aside class="contact-lieu">
      <h2 class="titre-section" data-brode>${c.t('contact.lieu.titre')}</h2>
      <p>${c.t('contact.lieu.texte')}</p>
      ${carteBrodee(c)}
      <p><a class="lien-fleche" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent(k.adresse)}" target="_blank" rel="noopener">${icone('lieu')} ${c.t('contact.itineraire')}<span class="visuellement-cache"> (${c.t('commun.nouvelOnglet')})</span></a></p>
      <p class="contact-reseaux"><span>${c.t('contact.reseaux')}</span> <a class="lien-fleche" href="${k.facebook}" target="_blank" rel="noopener">${icone('facebook')} ${c.t('commun.facebookNom')}<span class="visuellement-cache"> (${c.t('commun.nouvelOnglet')})</span></a></p>
    </aside>
  </div>
</section>
`;
};
