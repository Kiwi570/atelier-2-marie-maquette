# Audit de la v2 (31 octobre 2026)

La v2 pose les 31 illustrations générées (Grok) à leur emplacement. Audit automatique (`node _audit/audit.mjs`, sans `--rapide`),
lancé en lots, toutes les tailles (320×568 à 2560×1440, téléphones et tablettes en tactile) et tous les modes
(normal, mode calme, sans WebGL, sans JavaScript).

## Ce qui a été lancé

- **Audit complet** (mesures, films, bords de l'écran, parcours, tient dans l'écran, fluidité, vitesse, captures) sur l'accueil,
  la boutique, les commandes groupées, L'atelier, les infos pratiques, le contact, les pages légales, la page 404
  et trois fiches (sac « Prénom », sweat patrouille, coquetier).
- **Ré-audit après corrections** (mesures, films, bords, tient dans l'écran, fluidité) sur l'accueil, la boutique,
  les commandes groupées et L'atelier, puis fluidité de l'accueil seule.
- **Regard neuf** : un second agent, qui n'avait pas vu la construction, a relu les captures (15 remarques) ;
  après corrections, ré-audit (mesures, films, bords, parcours, tient dans l'écran) de l'accueil, de L'atelier,
  de la boutique et des pages légales.
- **Mesures à toutes les tailles et dans tous les modes** sur les 48 autres fiches, les infos pratiques, le contact,
  les pages légales et la page 404.

## Résultat final

- Échecs restants : **0** ; à regarder : **0** (toutes les pages, toutes les tailles, tous les modes).
- Fluidité de l'accueil : 2 % d'images lentes sur ordinateur (molette, processeur ralenti 4 fois), 0 % au doigt sur téléphone.
- Ouverture sous 3 s depuis le premier octet sur les pages ré-auditées.

## Corrigé pendant l'audit

- Mention « Illustration générée » qui chevauchait une légende (savoir-faire sur téléphone) ou le titre (haut de L'atelier) : déplacée.
- Images du premier écran qui clignotaient au retour avant : décodées tout de suite.
- Épinglage et changement de page : le voile reste uni (la texture apparaissait d'un coup).
- Fluidité de l'accueil sur ordinateur (molette, processeur ralenti) : le lin animé se fige pendant le défilement,
  8 % d'images lentes ramenés à 2 %.
- Relecture des captures : fil décoratif retiré de dessus les illustrations, mention de l'ouverture éloignée des vraies photos
  de produits, machines de L'atelier sans images répétées, boutons et hauteur d'image de « À Kernascléden »,
  présentoir de la boutique remplacé, cadrage des pages légales.

## Relevé mais laissé tel quel

- Contenu de certaines illustrations (machine à broder de L'atelier, broderie trop proche de la couture, bobine dorée répétée) :
  à refaire dans Grok, liste dans le README.
- Mentions « à compléter » et notes à valider bien visibles (couleur garance) : voulu, elles disparaissent quand l'atelier a répondu.
- Fiches : la barre d'achat fixe passe par-dessus la suite du formulaire pendant le défilement (comportement voulu, le bouton reste à portée).

## Non lancé

- **Safari (WebKit)** ne peut pas s'installer dans l'environnement de construction. À vérifier dans Safari sur le Mac :
  ouverture (tambour, plongée dans le lin), changement de page et retour arrière, en-tête qui se cache et revient,
  sections épinglées, menu sur iPhone, images et mentions « Illustration générée ».

## Reste à fournir par l'atelier

- Trois vraies photos de l'atelier (Alix, la brodeuse, l'établi) : les illustrations ne montrent pas le vrai lieu.
- Les points à valider listés dans le README (prix et TVA, retours, horaires, frais d'envoi, SIRET…).
