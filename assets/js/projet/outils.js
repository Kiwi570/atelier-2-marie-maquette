/* Outils communs aux modules du projet. */
export const prixFr = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v || 0).replace(/[ ]/g, ' ');
/* Recherche tolérante : sans accents, sans majuscules, singulier et pluriel confondus. */
export const normaliser = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’']/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
export const mots = (s) => normaliser(s).split(' ').filter(Boolean).map((m) => (m.length > 3 ? m.replace(/(s|x)$/, '') : m));
export function correspond(texte, requete) {
  const cibles = mots(texte);
  return mots(requete).every((m) => cibles.some((c) => c.startsWith(m)));
}
export const modele = (s, vars) => String(s || '').replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
export const calmeActif = () => document.documentElement.classList.contains('calme');
export const souris = () => matchMedia('(hover: hover) and (pointer: fine)').matches;
export function lireIndex() {
  try { return JSON.parse(document.getElementById('index-recherche').textContent); } catch { return []; }
}
