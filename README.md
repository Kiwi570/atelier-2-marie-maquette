# Maquette L’Atelier 2 Marie

Maquette du nouveau site de L’Atelier 2 Marie (Kernascléden, Morbihan) : direction « Fil d’or », site complet,
51 fiches produits générées depuis le catalogue réel du site actuel (prix, descriptions, options et photos).

Adresse prévue : https://atelier-2-marie-maquette.vercel.app

## Travailler sur la maquette

1. Modifier les données dans `donnees/` (textes : `donnees/textes/fr.json` ; articles : `donnees/catalogue.json` ;
   FAQ : `donnees/faq.json` ; avis : `donnees/avis.json` ; réglages : `donnees/site.json`).
2. `node outils/generer.mjs` : écrit une fiche source par article (`outils/fiches.mjs`), puis toutes les pages.
   Ne jamais modifier à la main les pages générées (`index.html`, `boutique/*.html`…).
3. `node outils/images-partage.mjs` : images de partage 1200×630 de chaque page.
4. `node _audit/audit.mjs` : audit complet avant chaque livraison (`--rapide` seulement pendant la construction).
   Résumé de l’audit de la v1 : `_audit/resume-audit-v1.md`.

Images : `python3 outils/images.py recu/lot.json` (réglages `garder`, `alpha`, `largeurs`, `ratioMobile` ajoutés pour ce projet).
Produits détourés : `python3 outils/detourer.py <isnet-general-use.onnx> recu/detoures <photos…>`
(modèle à télécharger depuis github.com/danielgatis/rembg/releases, version v0.0.0 ; non livré).
Les images Grok vont dans `assets/images/grok/` : elles remplacent d’elles-mêmes les visuels dessinés en code
(`source/gabarits/outils.mjs`, fonction `visuel`), avec la mention « Illustration générée ».

Polices : Fraunces, Instrument Sans et Great Vibes, hébergées avec le site en WOFF (licence SIL OFL, fichiers dans
`assets/polices/`). Le WOFF2 n’a pas pu être produit dans l’environnement de construction : à convertir en WOFF2 pour
le site final (gain d’environ 30 %).

## Emplacements des images Grok

Chaque image du document Grok a sa place réservée : tant qu’elle manque, un dessin en code (lin, fil, bobine, colis) occupe l’emplacement. Il suffit de déposer l’image convertie en WebP dans `assets/images/grok/` sous le nom ci-dessous (`<nom>-<largeur>.webp`), puis de relancer `node outils/generer.mjs`.

| Image | Page | Emplacement | Format |
|---|---|---|---|
| `accueil-ouverture` | Accueil | Fond de l’ouverture, sous la photo du produit (ordinateur) | 16:9 |
| `accueil-ouverture-mobile` | Accueil | Fond de l’ouverture (téléphone) | 9:16 |
| `accueil-noel` | Accueil | Section « Noël », fond derrière les articles suspendus (ordinateur) | 16:9 |
| `accueil-noel-mobile` | Accueil | Section « Noël » (téléphone) | 4:5 |
| `savoir-faire-broderie` | Accueil et L’atelier | Le savoir-faire : la broderie | 4:5 |
| `savoir-faire-flex` | Accueil et L’atelier | Le savoir-faire : la découpe du flex | 4:5 |
| `savoir-faire-couture` | Accueil et L’atelier | Le savoir-faire : la couture | 4:5 |
| `savoir-faire-presse` | Accueil et L’atelier | Le savoir-faire : la presse à chaud | 4:5 |
| `accueil-delai` | Accueil | Section « Trois semaines, de la commande à l’envoi » (ordinateur) | 16:9 |
| `accueil-delai-mobile` | Accueil | Section « Trois semaines » (téléphone) | 4:5 |
| `accueil-fin` | Accueil | Fond de la section « Contact » en fin de page | 16:9 |
| `boutique-ouverture` | Boutique | Fond de l’ouverture (ordinateur) | 16:9 |
| `boutique-ouverture-mobile` | Boutique | Fond de l’ouverture (téléphone) | 9:16 |
| `boutique-faq` | Boutique | Section FAQ courte | 4:5 |
| `groupes-ouverture` | Commandes groupées | Fond de l’ouverture, derrière la photo du sweat (ordinateur) | 16:9 |
| `groupes-ouverture-mobile` | Commandes groupées | Fond de l’ouverture (téléphone) | 9:16 |
| `groupes-etapes` | Commandes groupées | Section « Comment ça se passe » | 4:5 |
| `groupes-devis` | Commandes groupées | Section « Devis », à côté du formulaire | 4:5 |
| `atelier-ouverture` | L’atelier | Fond de l’ouverture (ordinateur) | 16:9 |
| `atelier-ouverture-mobile` | L’atelier | Fond de l’ouverture (téléphone) | 9:16 |
| `atelier-campagne` | L’atelier | Section « À Kernascléden » | 16:9 |
| `infos-ouverture` | Infos pratiques | Fond de l’ouverture (ordinateur) | 16:9 |
| `infos-ouverture-mobile` | Infos pratiques | Fond de l’ouverture (téléphone) | 9:16 |
| `contact-ouverture` | Contact | Fond de l’ouverture (ordinateur) | 16:9 |
| `contact-ouverture-mobile` | Contact | Fond de l’ouverture (téléphone) | 9:16 |
| `legal-lin` | Mentions légales, Confidentialité et cookies | Image de tête (ordinateur) | 16:9 |
| `legal-lin-mobile` | Mentions légales, Confidentialité et cookies | Image de tête (téléphone) | 9:16 |
| `404-fil-casse` | Page 404 | Image de tête (ordinateur) | 16:9 |
| `404-fil-casse-mobile` | Page 404 | Image de tête (téléphone) | 4:5 |
| `texture-lin` | Tout le site | Toile du tambour de l’ouverture et cartouche du voile de transition | 1:1 |
| `texture-lin-marine` | Tout le site | Fond de l’ouverture, du voile de transition et du pied de page | 1:1 |

Les images de l’accueil (« accueil-ouverture ») servent aussi de toile au lin animé (ordinateur, souris).

## Ce qui est simulé

- Panier, commande en 3 étapes, formulaires de contact et de devis : rien n’est envoyé ni payé, et l’écran le dit.
- Aperçus de broderie (démo du sac « Prénom », aperçu du texte sur les fiches) : indicatifs.
- Estimation du devis : calculée avec les prix de la boutique, indicative.

## À retirer à la mise en ligne définitive

- La consigne `noindex` : balise robots dans `source/gabarits/commun.mjs` et en-tête `X-Robots-Tag` dans `vercel.json`.
- Les simulations : panier et commande, formulaires (à brancher sur la vraie boutique et la vraie messagerie).
- Les mentions « à compléter », une fois les informations fournies (fiche récapitulative dans les mentions légales).
- La mention « maquette » du pied de page.

## À garder

- La mention « Illustration générée » sur chaque image créée par intelligence artificielle (dossier `assets/images/grok/`).

## Points à faire valider par l’atelier

- **Prix** : affichés comme prix à payer, avec « TVA non applicable, art. 293 B du CGI » (micro-entreprise : régime de franchise à confirmer).
- **Politique de retour** : version conforme au Code de la consommation proposée sur la page Infos pratiques (le texte actuel exclut à tort les soldes et tous les articles faits main, et limite les réclamations à 48 h).
- **Adresse** : 24 Kerchopine (le site actuel donne aussi « 24 Kerfort » dans ses données pour Google).
- **Horaires** : contradictoires sur le site actuel (« Lun.–Ven. 7 h–22 h », « du lundi au samedi de 9 h à 20 h ») : aucun horaire affiché.
- **Presse à chaud** : citée sur Boutique des Familles, pas sur le site : présentée « à confirmer ».
- **Date de création** : « 2024 » sur le site, photos signées 2020, boutique Boutique des Familles depuis 2023.
- **Photos de sacs vierges** : semblent venir du catalogue du fournisseur, utilisées comme nuancier ; droits à confirmer.
- **Univers ajoutés** : « Maison et table » et « Entreprises et groupes » rangent les 7 articles sans univers.
- **Marque « Puy du Fou »** : reprise telle quelle dans un univers et des noms d’articles (marque déposée).
- **Avis** : les deux avis viennent de Boutique des Familles, cités avec leur source.
- **Fiches vides** : « Coquetier » (7 €) et « Lot de 7 sacs de camp + 1 offert » (70 €) n’ont pas de fiche sur le site actuel.
- **Coquetier** : un champ « Prénom » (facultatif) a été ajouté, la photo montrant des coquetiers aux prénoms.
- **Sac « Prénom »** : la photo « Amaury » (anses beiges) et les 4 photos de couleurs (modèle du fournisseur, anses claires ou noires) ne montrent pas le même sac : quel modèle est vendu ? La démo de l’accueil et l’aperçu des fiches brodées écrivent en lettres bâton, comme le sac « Amaury » ; couleurs de fil proposées dans la démo (blanc cassé, doré, bleu marine, vieux rose) à confirmer.
- **Tailles** : le choix de la taille est rendu obligatoire sur les vêtements (facultatif sur le site actuel).
- **Descriptions** : quelques tournures reprises sans changer le sens (« Sweat capuche unisexe flexés dos » devient « Sweat à capuche unisexe, motif en flex au dos », « me contacter » devient « écrivez à l’atelier »…).
- **Articles d’entreprise** : sweat et tee-shirt affichés « dès 40 € » et « dès 18 € », avec un lien vers le devis (le site actuel dit « tarif en fonction du logo et du nombre »). La photo « Puydufouphotography » est floue et porte le nom d’une autre entreprise : à remplacer si possible.
- **Fiches presque identiques** : sweats « J’peux pas j’ai Puy du Fou » brodé et flex, lots de sacs louveteau et guide, sept paires de boucles d’oreilles en bois (numérotées d’après leurs cartons, n° 2 à 8) : elles pourraient devenir une seule fiche avec un choix (technique, taille du lot, modèle).
- **Noël** : la maquette conseille de commander « avant la fin novembre » (délai de trois semaines plus l’envoi) : date à confirmer.
- **Logo** : l’en-tête et le pied de page utilisent la rose du logo en médaillon avec le nom écrit en typographie, plus lisible en petit ; le logo complet apparaît pendant les changements de page.
- **Photos de l’atelier** : la page « L’atelier » gagnerait trois vraies photos (Alix, les mains sur la brodeuse, l’établi) : une image générée ne peut pas montrer le vrai atelier.

## Défauts du site actuel signalés

Profils de membres (noms de clients) lisibles publiquement ; politique de cookies restée en texte modèle Wix ; mentions
légales sans hébergeur ; page « Nouvelle page » vide et « Programme de fidélité » indisponible ; sept articles nommés
« Boucles d’oreilles » ; pastilles de couleur « bleu marine » et « bordeaux » affichées en noir ; prix « Hors TVA ».
