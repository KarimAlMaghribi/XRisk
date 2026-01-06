/**
 * TypeScript Types für xrisk Authentication API
 */

/**
 * Benutzer-Interface basierend auf der API-Response
 */
export interface User {
  id: number;
  user_uuid: string;
  email: string;
  name: string;
  oauth_provider: string | null;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  last_login: string | null;
}

/**
 * Login-Request-Daten
 */
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

/**
 * Registrierungs-Request-Daten
 */
export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
  name?: string;
}

/**
 * Profil-Update-Request-Daten
 */
export interface UpdateProfileRequest {
  name?: string;
  password?: string;
}

/**
 * API-Response für Profil-Update
 */
export interface UpdateProfileResponse {
  success: boolean;
  user: User;
}

/**
 * API-Fehler-Response
 */
export interface ApiError {
  error: string;
  message?: string;
}

/**
 * Authentifizierungs-Status
 */
export interface AuthStatus {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

/**
 * OAuth Provider Typen
 */
export type OAuthProvider = 'google' | 'microsoft';

