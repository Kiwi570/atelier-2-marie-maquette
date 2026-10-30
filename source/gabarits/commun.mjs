/* Gabarit commun : head, en-tête (logo, navigation, recherche, panier, bouton), menu, recherche, panier en tiroir,
   pied de page, barre fixe du téléphone, voile et panneau d'ouverture (tambour à broder).
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README du socle). */
import { html, brut } from '../../outils/gabarit.mjs';
import { icone, indexRecherche, grokPresent, imageVersion } from './outils.mjs';

/* Fiche produit : la rubrique Boutique est signalée comme la section en cours dans la navigation. */
const rubrique = (c, k) => (c.page.gabarit === 'fiche' && k === 'boutique' ? 'aria-current="true"' : '');

/* Textures de lin (images Grok « texture-lin » et « texture-lin-marine ») : elles habillent le tambour de l'ouverture,
   le voile des changements de page et le pied de page dès qu'elles sont dans assets/images/grok/. */
function textures() {
  const t = [];
  if (grokPresent('texture-lin')) t.push(`--texture-lin:url("${imageVersion('grok/texture-lin', 1024)}")`);
  if (grokPresent('texture-lin-marine')) t.push(`--texture-lin-marine:url("${imageVersion('grok/texture-lin-marine', 1024)}")`);
  return t.length ? brut(` style='${t.join(';')}'`) : '';
}

const navigation = (c) => c.site.navigation.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));
const navDe = (c) => c.page.nav || c.libelle(c.page.cle);

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = p.titre || c.s(`pages.${cle}.titre`), description = p.description || c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const altPartage = p.partageAlt || c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`);
  const structure = p.structure || c.donnees.structure;
  const json = structure ? JSON.stringify(structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${altPartage}">
<meta name="twitter:card" content="summary_large_image">
${json ? html`<script type="application/ld+json">${brut(json)}</script>` : ''}
</head>`;
}

function entete(c) {
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" data-libelle="${c.libelle('accueil')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>
      <img class="entete-sceau" src="/assets/images/sceau-96.webp" alt="" width="96" height="96"><span class="entete-nom">${c.t('commun.logoNom1')} <em>${c.t('commun.logoNom2')}</em></span>
    </a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigation(c).filter((k) => k !== 'accueil' && k !== c.site.actionEntete.page).map((k) => html`<li>${c.lien(k, { classe: 'nav-lien', attrs: rubrique(c, k) })}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      <button type="button" class="entete-icone" data-recherche-ouvrir aria-controls="recherche" aria-expanded="false" aria-label="${c.s('commun.recherche.bouton')}">${icone('recherche')}</button>
      <button type="button" class="entete-icone entete-panier" data-panier-ouvrir aria-controls="panier" aria-expanded="false" aria-label="${c.s('commun.panier.bouton')}">${icone('panier')}<span class="pastille" data-panier-nombre hidden>0</span></button>
      <a class="bouton entete-bouton" href="${c.url(c.site.actionEntete.page)}" data-libelle="${c.libelle(c.site.actionEntete.page)}">${c.t('commun.actionEntete')}</a>
      <noscript><a class="menu-sans-js" href="#pied-nav" data-menu-bouton>${c.t('commun.menu')}</a></noscript>
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <ul>${navigation(c).map((k, i) => html`<li style="--i:${i}">${c.lien(k, { classe: 'menu-lien', attrs: rubrique(c, k) })}</li>`)}</ul>
  <div class="menu-bas">
    <p><a class="bouton" href="${c.url(c.site.actionEntete.page)}" data-libelle="${c.libelle(c.site.actionEntete.page)}">${c.t('commun.actionEntete')}</a></p>
    <p><a class="bouton bouton--contour" href="tel:${c.site.contact.telephoneLien}">${icone('telephone')} ${c.t('commun.appeler')} ${c.site.contact.telephone}</a></p>
    <p><a class="lien-simple" href="mailto:${c.site.contact.email}">${c.site.contact.email}</a></p>
    <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
  </div>
</div>`;
}

function recherche(c) {
  return html`<div id="recherche" class="fenetre fenetre--recherche" data-recherche data-recouvrement role="dialog" aria-modal="true" aria-labelledby="recherche-titre" hidden>
  <div class="fenetre-fond" data-fermer></div>
  <div class="fenetre-boite">
    <div class="fenetre-tete">
      <h2 id="recherche-titre" class="fenetre-titre">${c.t('commun.recherche.titre')}</h2>
      <button type="button" class="entete-icone" data-fermer aria-label="${c.s('commun.recherche.fermer')}">${icone('fermer')}</button>
    </div>
    <form class="recherche-form" action="${c.url('boutique')}" role="search">
      <label class="visuellement-cache" for="recherche-champ">${c.t('commun.recherche.champ')}</label>
      <input id="recherche-champ" name="q" type="search" autocomplete="off" placeholder="${c.s('commun.recherche.champ')}" data-recherche-champ>
      <p class="recherche-aide">${c.t('commun.recherche.aide')}</p>
    </form>
    <p class="recherche-compte" data-recherche-compte aria-live="polite" data-modele="${c.s('commun.recherche.resultats')}"></p>
    <ul class="recherche-resultats" data-recherche-resultats></ul>
    <p class="recherche-aucun" data-recherche-aucun hidden>${c.t('commun.recherche.aucun')}</p>
    <p><a class="lien-fleche" href="${c.url('boutique')}" data-recherche-tout data-libelle="${c.libelle('boutique')}">${c.t('commun.recherche.tout')} ${icone('fleche')}</a></p>
  </div>
  <script type="application/json" id="index-recherche">${brut(indexRecherche(c))}</script>
</div>`;
}

function panier(c) {
  return html`<div id="panier" class="fenetre fenetre--panier" data-panier data-recouvrement role="dialog" aria-modal="true" aria-labelledby="panier-titre" hidden>
  <div class="fenetre-fond" data-fermer></div>
  <aside class="fenetre-boite tiroir">
    <div class="fenetre-tete">
      <h2 id="panier-titre" class="fenetre-titre" data-panier-titre data-titre-panier="${c.s('commun.panier.titre')}" data-titre-commande="${c.s('commun.commande.titre')}">${c.t('commun.panier.titre')}</h2>
      <button type="button" class="entete-icone" data-fermer aria-label="${c.s('commun.panier.fermer')}">${icone('fermer')}</button>
    </div>
    <div class="tiroir-corps" data-panier-vue="liste">
      <p class="panier-vide" data-panier-vide>${c.t('commun.panier.vide')} <a href="${c.url('boutique')}" data-libelle="${c.libelle('boutique')}">${c.t('commun.panier.videAction')}</a></p>
      <ul class="panier-liste" data-panier-liste data-libelle-retirer="${c.s('commun.panier.retirer')}" data-libelle-quantite="${c.s('commun.panier.quantite')}"></ul>
    </div>
    <form class="tiroir-corps commande" data-panier-vue="commande" data-commande novalidate hidden>
      <p class="commande-deroule">${c.t('commun.commande.deroule')}</p>
      <ol class="etapes-points" aria-hidden="true"><li class="actif">${c.t('commun.commande.etape1')}</li><li>${c.t('commun.commande.etape2')}</li><li>${c.t('commun.commande.etape3')}</li></ol>
      <fieldset class="commande-etape" data-etape="1">
        <legend>${c.t('commun.commande.etape1')}</legend>
        <div class="champ"><label for="c-nom">${c.t('commun.commande.nom')}</label><input id="c-nom" name="nom" autocomplete="name" required></div>
        <div class="champ"><label for="c-email">${c.t('commun.commande.email')}</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
        <div class="champ"><label for="c-tel">${c.t('commun.commande.tel')}</label><input id="c-tel" name="tel" type="tel" autocomplete="tel" required></div>
      </fieldset>
      <fieldset class="commande-etape" data-etape="2" hidden>
        <legend>${c.t('commun.commande.modeLivraison')}</legend>
        <label class="choix-ligne"><input type="radio" name="livraison" value="envoi" checked> ${c.t('commun.commande.envoi')}</label>
        <label class="choix-ligne"><input type="radio" name="livraison" value="retrait"> ${c.t('commun.commande.retraitAtelier')}</label>
        <div class="champ" data-si-envoi><label for="c-adresse">${c.t('commun.commande.adresse')}</label><textarea id="c-adresse" name="adresse" rows="3" autocomplete="street-address" required></textarea></div>
      </fieldset>
      <fieldset class="commande-etape" data-etape="3" hidden>
        <legend>${c.t('commun.commande.paiement')}</legend>
        <label class="choix-ligne"><input type="radio" name="paiement" value="carte" checked> ${c.t('commun.commande.carte')}</label>
        <label class="choix-ligne"><input type="radio" name="paiement" value="paypal"> ${c.t('commun.commande.paypal')}</label>
        <label class="choix-ligne"><input type="radio" name="paiement" value="hors-ligne"> ${c.t('commun.commande.horsLigne')}</label>
        <p class="commande-note">${c.t('commun.commande.personnalise')}</p>
        <p class="mention-donnees">${c.tb('commun.commande.donnees')}</p>
      </fieldset>
      <p class="commande-boutons"><button type="button" class="bouton bouton--contour" data-commande-retour>${c.t('commun.commande.retour')}</button><button type="button" class="bouton" data-commande-suivant>${c.t('commun.commande.suivant')}</button><button type="submit" class="bouton" data-commande-valider hidden>${c.t('commun.commande.valider')}</button></p>
      <p class="message-envoi" data-commande-message role="status" tabindex="-1" hidden>${c.t('commun.commande.merci')}</p>
    </form>
    <div class="tiroir-pied" data-panier-pied>
      <p class="panier-total"><span>${c.t('commun.panier.sousTotal')}</span><strong data-panier-total aria-live="polite">0,00 €</strong></p>
      <p class="panier-note">${c.t('commun.tva')} · ${c.t('commun.panier.livraison')}</p>
      <p><button type="button" class="bouton bouton--large" data-panier-commander>${c.t('commun.panier.commander')}</button></p>
      <p class="panier-note">${c.t('commun.panier.simule')}</p>
    </div>
    <p class="visuellement-cache" aria-live="polite" data-panier-annonce data-modele-ajout="${c.s('commun.panier.ajoute')}" data-modele-retrait="${c.s('commun.panier.retire')}"></p>
  </aside>
</div>`;
}

function pied(c) {
  const k = c.site.contact;
  return html`<footer class="pied" id="pied">
  <div class="conteneur pied-grille">
    <div class="pied-marque">
      <p class="pied-nom"><img class="pied-sceau" src="/assets/images/sceau-192.webp" alt="" width="96" height="96" loading="lazy"><span>${c.t('commun.logoNom1')} <em>${c.t('commun.logoNom2')}</em></span></p>
      <p>${c.t('commun.pied.accroche')}</p>
      <p class="pied-delai">${c.t('commun.delai')} · ${c.t('commun.retrait')}</p>
    </div>
    <div>
      <p class="pied-titre">${c.t('commun.adresse')}</p>
      <ul class="pied-contact">
        <li><a href="tel:${k.telephoneLien}">${icone('telephone')} ${k.telephone}</a></li>
        <li><a href="mailto:${k.email}">${icone('email')} ${k.email}</a></li>
        <li><span class="pied-ligne">${icone('lieu')} ${k.adresse}</span></li>
        <li><span class="pied-ligne pied-doux">${c.t('commun.horaires')}</span></li>
        <li><a href="${k.facebook}" target="_blank" rel="noopener">${icone('facebook')} ${c.t('commun.facebookNom')}<span class="visuellement-cache"> (${c.t('commun.nouvelOnglet')})</span></a></li>
      </ul>
    </div>
    <nav id="pied-nav" aria-label="${c.s('commun.sommaire')}">
      <p class="pied-titre">${c.t('commun.sommaire')}</p>
      <ul>${navigation(c).map((k2) => html`<li>${c.lien(k2)}</li>`)}</ul>
    </nav>
    <div>
      <p class="pied-titre">${c.t('commun.pied.legal')}</p>
      <ul>
        <li>${c.lien('mentions-legales')}</li>
        <li>${c.lien('confidentialite')}</li>
        <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
        <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
      </ul>
    </div>
  </div>
  <div class="conteneur pied-bas"><p>${c.t('commun.maquette')}</p><p>${c.t('commun.tva')} · ©&nbsp;${brut(c.site.nom.replace(/ /g, '&nbsp;'))}</p></div>
</footer>`;
}

function barre(c) {
  return html`<div data-barre-fixe>
  <a class="bouton bouton--contour barre-appeler" href="tel:${c.site.contact.telephoneLien}">${icone('telephone')}<span>${c.t('commun.appeler')}</span></a>
  <a class="bouton barre-action" href="${c.url(c.site.actionEntete.page)}" data-libelle="${c.libelle(c.site.actionEntete.page)}">${c.t('commun.actionEntete')}</a>
  <button type="button" class="bouton bouton--contour barre-panier" data-panier-ouvrir aria-controls="panier" aria-expanded="false" aria-label="${c.s('commun.panier.bouton')}">${icone('panier')}<span data-panier-total-barre>0 €</span></button>
</div>`;
}

function voile(c) {
  return html`<div data-voile aria-hidden="true"><div class="voile-contenu"><span class="voile-cartouche"><img src="/assets/images/logo-320.webp" alt="" width="320" height="183"></span><span class="voile-couture"></span><span data-voile-libelle>${navDe(c)}</span></div></div>`;
}

/* Panneau d'ouverture : tambour à broder visible et entier dès la première image.
   Le nom se brode au point de chaînette (trait en pointillés doré découvert de gauche à droite), puis le lin couvre l'écran. */
function ouverture(c) {
  return html`<div class="ouverture-panneau" data-ouverture aria-hidden="true">
  <div class="tambour">
    <svg class="tambour-svg" viewBox="0 0 600 600" aria-hidden="true">
      <defs>
        <pattern id="tambour-lin" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#f2ece1"/><path d="M0 1.2h5M0 3.7h5" stroke="#e3d9c6" stroke-width=".9"/><path d="M1.2 0v5M3.7 0v5" stroke="#ebe2d2" stroke-width=".7"/></pattern>
        <clipPath id="tambour-avance"><rect class="tambour-avance" x="70" y="150" width="0" height="300"/></clipPath>
        <radialGradient id="tambour-bois" cx="50%" cy="50%" r="50%"><stop offset="88%" stop-color="#c9a272"/><stop offset="100%" stop-color="#a77f4f"/></radialGradient>
      </defs>
      <circle class="tambour-toile" cx="300" cy="300" r="246" fill="url(#tambour-lin)"/>
      ${grokPresent('texture-lin') ? html`<clipPath id="tambour-rond"><circle cx="300" cy="300" r="246"/></clipPath><image href="${imageVersion('grok/texture-lin', 1024)}" x="54" y="54" width="492" height="492" preserveAspectRatio="xMidYMid slice" clip-path="url(#tambour-rond)"/>` : ''}
      <circle cx="300" cy="300" r="262" fill="none" stroke="url(#tambour-bois)" stroke-width="22"/>
      <circle cx="300" cy="300" r="272" fill="none" stroke="#b58a58" stroke-width="3" opacity=".7"/>
      <rect x="282" y="20" width="36" height="22" rx="5" fill="#b58a58"/><circle cx="300" cy="16" r="9" fill="#d8b98a"/>
      <g class="tambour-nom" clip-path="url(#tambour-avance)">
        <text class="tambour-texte tambour-texte--points" x="300" y="318" text-anchor="middle">L’Atelier 2 Marie</text>
        <text class="tambour-texte tambour-texte--plein" x="300" y="318" text-anchor="middle">L’Atelier 2 Marie</text>
      </g>
      <text class="tambour-ligne" x="300" y="392" text-anchor="middle">${c.s('commun.introLigne')}</text>
      <g class="tambour-aiguille"><path d="M0 0 L4 -118" stroke="#d9dde3" stroke-width="3.2" stroke-linecap="round"/><ellipse cx="3.6" cy="-110" rx="1.6" ry="5" fill="none" stroke="#9aa3ad" stroke-width="1.2"/><path class="tambour-fil" d="M3.6 -110 C 30 -150, 60 -120, 90 -170" fill="none" stroke="#c8963e" stroke-width="2"/></g>
    </svg>
  </div>
</div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}"${c.site.curseur ? brut(' data-curseur') : ''}${textures()}>
${tete(c)}
<body id="haut" class="page-${c.page.gabarit || c.page.cle}">
${voile(c)}
${ouverture(c)}
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
${recherche(c)}
${panier(c)}
</body>
</html>`;
}
