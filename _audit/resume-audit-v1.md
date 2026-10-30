# Audit de la v1 (30 octobre 2026)

Audit complet (`node _audit/audit.mjs`, sans `--rapide`) sur les 60 pages, lancé en quatre lots
(les 9 pages principales et la page 404, puis les 51 fiches en trois lots de 17), toutes les tailles
(320×568 à 2560×1440, téléphones et tablettes en tactile) et tous les modes (normal, mode calme, sans WebGL, sans JavaScript).

## Résultat final

- Échecs restants : **0** (les échecs relevés pendant l'audit ont été corrigés, puis les pages concernées remesurées à toutes les tailles).
- Non lancé : **Safari (WebKit)**, qui ne peut pas s'installer dans l'environnement de construction. À vérifier dans Safari sur le Mac :
  ouverture de chaque page (intro complète, rien qui clignote), changement de page (voile, retour arrière), défilement
  (en-tête qui se cache et revient, sections épinglées entières), menu sur iPhone, polices, images, formulaires et barre fixe du bas.

## Ce qui a été vérifié

- Mesures sur chaque page, chaque taille et chaque mode : débordements, textes sous 12 px, zones tactiles, textes coupés
  ou qui se chevauchent, éléments recouverts, accessibilité (axe-core), contrastes, premier écran (titre, bouton principal,
  information clé), images, visuels par section, console et ressources, typographie française.
- Films : ouverture de chaque page, transitions, retour arrière et avant, ancres, épinglages, bords de l'écran avec une barre
  de défilement classique.
- Parcours : intro (accélérée, passée, jamais rejouée au retour), menu, clavier, chaque lien et bouton, liens profonds,
  changements de hauteur, mode calme, et les parcours propres au projet (`_audit/parcours.mjs`) : panier (total, deux onglets,
  donnée abîmée), commande simulée, filtres et recherche de la boutique, visionneuse, devis (total vérifié par le calcul),
  démo du sac « Prénom » (lien prérempli).
- Fluidité (molette et doigt, processeur ralenti) : 0 à 2 % d'images lentes ; ouverture sous 3 s depuis le premier octet.

## Corrigé pendant l'audit

- Toucher pour passer l'intro qui ouvrait par erreur le lien placé dessous.
- Premier écran sur les petits téléphones, en paysage et sans JavaScript (accueil, fiches, L'atelier, boutique).
- Recouvrements et chevauchements (articles de Noël, visuel de la FAQ), contrastes, zones tactiles, débordement à 320 px.
- Champs des fiches au nom abîmé (« pr-nom »), en-tête qui revient quand on ajoute au panier sur téléphone.

## Complété dans le script d'audit

- Mode calme : quand l'en-tête est caché par le défilement, le bouton du pied de page est utilisé.
- Menu : la vérification attend la nouvelle page (le changement de page part après le voile).
