#!/usr/bin/env node
/* Écrit une page source par article (source/pages/produit-<slug>.mjs) à partir de donnees/catalogue.json.
   Lancé tout seul par outils/generer.mjs (étape « avant ») : un article ajouté au catalogue a sa fiche,
   un article retiré perd la sienne. Les pages produites utilisent le gabarit source/gabarits/fiche.mjs. */
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { produits } = JSON.parse(readFileSync(join(racine, 'donnees/catalogue.json'), 'utf8'));
const dossier = join(racine, 'source/pages');
const voulues = new Set(produits.map((p) => `produit-${p.slug}.mjs`));
for (const f of readdirSync(dossier)) if (f.startsWith('produit-') && !voulues.has(f)) unlinkSync(join(dossier, f));
for (const p of produits) {
  writeFileSync(join(dossier, `produit-${p.slug}.mjs`), `/* Fiche produit écrite par outils/fiches.mjs : ne pas modifier à la main. */
import fiche, { meta } from '../gabarits/fiche.mjs';

export const page = meta('${p.slug}');
export default (c) => fiche(c, '${p.slug}');
`);
}
console.log(`${produits.length} fiches produits prêtes.`);
