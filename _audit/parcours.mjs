/* Parcours propres à L'Atelier 2 Marie : panier (ajout, deux onglets, donnée abîmée, commande simulée),
   filtres et recherche de la boutique (adresse gardée, rubriques vides grisées), visionneuse d'une fiche,
   devis groupé (total vérifié par le calcul, total visible), démo du sac « Prénom » (lien prérempli). */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  const fiche = '/boutique/sweat-patrouille';

  /* 1. Panier : ajout depuis une fiche, total juste, même panier dans deux onglets, donnée abîmée nettoyée. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + fiche, { waitUntil: 'load' });
      await attendrePret(page);
      await page.fill('input[name="nom-de-la-patrouille"]', 'Cerf');
      await page.fill('input[name="couleur-du-sweat-et-du-motif"]', 'marron, motif blanc');
      await page.fill('input[name="quantite"]', '2');
      await page.click('.fiche-ajouter');
      await attendre(900);
      const total = await page.evaluate(() => parseFloat(document.querySelector('[data-panier-total]').dataset.total));
      if (Math.abs(total - 60) > 0.005) R.echec('panier', `total ${total} au lieu de 60`, { page: fiche, taille: '390×844' });
      else R.ok('panier : total');
      const autre = await ctx.newPage();
      await autre.goto(BASE + '/boutique', { waitUntil: 'load' });
      await attendrePret(autre);
      const n = await autre.evaluate(() => document.querySelector('[data-panier-nombre]').textContent);
      if (n !== '2') R.echec('panier', `l’autre onglet affiche ${n} article(s) au lieu de 2`, { page: '/boutique' });
      else R.ok('panier : deux onglets');
      /* Retrait dans le premier onglet : le second suit (événement storage). */
      await page.click('header [data-panier-ouvrir]');
      await attendre(300);
      await page.click('[data-panier-liste] [data-retirer]');
      await attendre(400);
      const n2 = await autre.evaluate(() => document.querySelector('[data-panier-nombre]').hidden);
      if (!n2) R.echec('panier', 'le second onglet ne suit pas le retrait', { page: '/boutique' });
      await page.keyboard.press('Escape');
      await attendre(300);
      const ferme = await page.evaluate(() => document.querySelector('[data-panier]').hidden && document.activeElement && document.activeElement.matches('[data-panier-ouvrir]'));
      if (!ferme) R.echec('panier', 'Échap ne ferme pas le tiroir ou le focus ne revient pas au bouton', { page: fiche, taille: '390×844' });
      await page.evaluate(() => localStorage.setItem('a2m:panier', '{abîmé'));
      await page.reload({ waitUntil: 'load' });
      if ((await attendrePret(page)) === 'jamais-pret') R.echec('panier', 'une donnée abîmée bloque le site', { page: fiche });
      const propre = await page.evaluate(() => localStorage.getItem('a2m:panier'));
      if (propre && propre.includes('abîmé')) R.echec('panier', 'la donnée abîmée n’est pas nettoyée', { page: fiche });
      else R.ok('panier : donnée abîmée');
    } finally { await ctx.close(); }
  }

  /* 2. Commande simulée : 3 étapes, panier vidé, message. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/boutique/support-pour-boule-de-noel', { waitUntil: 'load' });
      await attendrePret(page);
      await page.click('.fiche-ajouter');
      await attendre(900);
      await page.click('header [data-panier-ouvrir]');
      await attendre(300);
      await page.click('[data-panier-commander]');
      await page.fill('#c-nom', 'Test Maquette'); await page.fill('#c-email', 'test@exemple.fr'); await page.fill('#c-tel', '0600000000');
      await page.click('[data-commande-suivant]');
      await page.check('input[name="livraison"][value="retrait"]');
      await page.click('[data-commande-suivant]');
      await page.click('[data-commande-valider]');
      await page.click('[data-commande-valider]', { force: true }).catch(() => {});
      await attendre(400);
      const r = await page.evaluate(() => ({ msg: !document.querySelector('[data-commande-message]').hidden, vide: !localStorage.getItem('a2m:panier') || localStorage.getItem('a2m:panier') === '[]' }));
      if (!r.msg || !r.vide) R.echec('commande', `message ${r.msg ? 'affiché' : 'absent'}, panier ${r.vide ? 'vidé' : 'non vidé'}`, { page: '/boutique/support-pour-boule-de-noel' });
      else R.ok('commande simulée');
    } finally { await ctx.close(); }
  }

  /* 3. Boutique : filtre gardé dans l'adresse, nombre juste, rubrique vide grisée, recherche sans accents. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/boutique?univers=santons', { waitUntil: 'load' });
      await attendrePret(page);
      const r = await page.evaluate(() => ({ n: document.querySelectorAll('[data-produit]:not(.masque)').length, presse: document.querySelector('[data-filtre="univers"][data-valeur="santons"]').getAttribute('aria-pressed') }));
      if (r.n !== 2 || r.presse !== 'true') R.echec('filtres', `univers santons : ${r.n} article(s), bouton ${r.presse}`, { page: '/boutique' });
      else R.ok('filtres : adresse');
      await page.click('[data-filtre="occasion"][data-valeur="foi"]');
      await attendre(500);
      const vide = await page.evaluate(() => ({ aucun: !document.querySelector('[data-boutique-aucun]').hidden, url: location.search }));
      if (!vide.aucun || !vide.url.includes('occasion=foi')) R.echec('filtres', 'sélection vide mal signalée ou absente de l’adresse', { page: '/boutique' });
      await page.goto(BASE + '/boutique?q=noel', { waitUntil: 'load' });
      await attendrePret(page);
      const n = await page.evaluate(() => document.querySelectorAll('[data-produit]:not(.masque)').length);
      if (n < 1) R.echec('recherche', '« noel » sans accent ne trouve rien', { page: '/boutique' });
      else R.ok('recherche sans accents');
    } finally { await ctx.close(); }
  }

  /* 4. Visionneuse : lien direct vers une photo, flèches, Échap, focus rendu. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/boutique/tablier-jardin-de-versailles#photo-3', { waitUntil: 'load' });
      await attendrePret(page);
      await attendre(600);
      const ouverte = await page.evaluate(() => !document.querySelector('[data-visionneuse]').hidden && document.querySelector('[data-visionneuse-legende]').textContent);
      if (!ouverte || !String(ouverte).startsWith('3')) R.echec('visionneuse', `le lien #photo-3 n’ouvre pas la photo 3 (${ouverte})`, { page: '/boutique/tablier-jardin-de-versailles' });
      await page.keyboard.press('ArrowRight');
      const quatre = await page.evaluate(() => document.querySelector('[data-visionneuse-legende]').textContent);
      if (!quatre.startsWith('4')) R.echec('visionneuse', 'la flèche droite ne passe pas à la photo suivante', { page: '/boutique/tablier-jardin-de-versailles' });
      await page.keyboard.press('Escape');
      const fermee = await page.evaluate(() => document.querySelector('[data-visionneuse]').hidden);
      if (!fermee) R.echec('visionneuse', 'Échap ne ferme pas la visionneuse', { page: '/boutique/tablier-jardin-de-versailles' });
      else R.ok('visionneuse');
    } finally { await ctx.close(); }
  }

  /* 5. Devis : total égal à la somme des lignes, visible pendant la saisie, pas d'étape sans article. */
  {
    const { ctx, page } = await contexte({ taille: T('390×844') });
    try {
      await page.goto(BASE + '/commandes-groupees#devis', { waitUntil: 'load' });
      await attendrePret(page);
      await page.click('[data-devis-suivant]');
      await page.click('[data-devis-suivant]');
      const bloque = await page.evaluate(() => !document.querySelector('[data-devis-erreur-articles]').hidden);
      if (!bloque) R.echec('devis', 'on passe l’étape des articles sans rien choisir', { page: '/commandes-groupees', taille: '390×844' });
      await page.fill('[data-devis-qte="sweat-patrouille"]', '8');
      await page.fill('[data-devis-qte="polo-de-camp"]', '8');
      await attendre(200);
      const r = await page.evaluate(() => {
        const lignes = [...document.querySelectorAll('[data-devis-qte]')].map((q) => (parseInt(q.value, 10) || 0) * parseFloat(q.closest('[data-ligne-prix]').dataset.lignePrix));
        const t = document.querySelector('[data-recap-total]');
        const rr = t.getBoundingClientRect();
        return { attendu: lignes.reduce((a, b) => a + b, 0), affiche: parseFloat(t.dataset.total), visible: rr.bottom > 0 && rr.top < innerHeight };
      });
      if (Math.abs(r.attendu - r.affiche) > 0.005 || r.affiche !== 384) R.echec('devis', `total ${r.affiche} au lieu de ${r.attendu}`, { page: '/commandes-groupees' });
      else R.ok('devis : total');
    } finally { await ctx.close(); }
  }

  /* 6. Démo de l'accueil : le bouton ouvre la fiche du sac avec le prénom et la couleur déjà choisis. */
  {
    const { ctx, page } = await contexte({ taille: T('1366×768') });
    try {
      await page.goto(BASE + '/#personnaliser', { waitUntil: 'load' });
      await attendrePret(page);
      await page.fill('[data-demo-prenom]', 'Louise');
      await page.check('[data-demo-form] input[name="couleur"][value="rose"]', { force: true });
      await Promise.all([page.waitForURL(/sac-prenom/, { timeout: 8000 }), page.click('[data-demo-form] [type="submit"]')]);
      await attendrePret(page);
      const r = await page.evaluate(() => ({ prenom: document.querySelector('input[name="prenom"]').value, rose: document.querySelector('input[type="radio"][value="rose"]').checked }));
      if (r.prenom !== 'Louise' || !r.rose) R.echec('lien prérempli', `fiche du sac : prénom « ${r.prenom} », rose ${r.rose}`, { page: '/' });
      else R.ok('démo : lien prérempli');
    } finally { await ctx.close(); }
  }
}
