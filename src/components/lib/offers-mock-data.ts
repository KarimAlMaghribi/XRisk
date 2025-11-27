/**
 * DEPRECATED: Bitte nutzen Sie /lib/database.ts
 * 
 * Diese Datei wird aus Kompatibilitätsgründen beibehalten,
 * leitet aber nur noch zur zentralen Datenbank weiter.
 */

import {
  offers as offerDatabase,
  getOfferById,
  getOffersByRisk,
  getOffersByUser,
  getPendingOffersByRisk,
} from './database';

export const offers = offerDatabase;
export {
  getOfferById,
  getOffersByRisk,
  getOffersByUser,
  getPendingOffersByRisk,
};
