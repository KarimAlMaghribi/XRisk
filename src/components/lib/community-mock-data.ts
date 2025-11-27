/**
 * DEPRECATED: Bitte nutzen Sie /lib/database.ts
 * 
 * Diese Datei wird aus Kompatibilitätsgründen beibehalten,
 * leitet aber nur noch zur zentralen Datenbank weiter.
 */

import {
  riskDatabase,
  getRiskById,
  getAllRisks,
  getRisksByCreator,
  getRisksByTaker,
  getRisksByStatus,
  getUserFavoriteRisks,
  isRiskFavorited,
  addFavorite,
  removeFavorite,
  addView,
} from './database';

export const communityRisks = riskDatabase;
export {
  getRiskById,
  getAllRisks,
  getRisksByCreator as getRisksByUserId,
  getRisksByTaker,
  getRisksByStatus,
  getUserFavoriteRisks,
  isRiskFavorited,
  addFavorite,
  removeFavorite,
  addView,
};
