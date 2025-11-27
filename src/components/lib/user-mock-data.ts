/**
 * DEPRECATED: Bitte nutzen Sie /lib/database.ts
 * 
 * Diese Datei wird aus Kompatibilitätsgründen beibehalten,
 * leitet aber nur noch zur zentralen Datenbank weiter.
 */

import { 
  userDatabase, 
  getUserById, 
  getAllUsers,
  getUserDisplayName 
} from './database';

export const users = userDatabase;
export { getUserById, getAllUsers, getUserDisplayName };
