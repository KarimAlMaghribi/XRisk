/**
 * Authentication Controller für xrisk Frontend
 * 
 * Verwaltet Login, Registrierung, OAuth und Benutzer-Session
 */

import { ApiClient, ApiError } from '../api/apiClient.js';
import {
  User,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  UpdateProfileResponse,
  AuthStatus,
  OAuthProvider,
} from '../types/auth.js';

export class AuthController extends ApiClient {
  private currentUser: User | null = null;
  private authStatusListeners: Array<(status: AuthStatus) => void> = [];

  constructor(baseUrl: string = '') {
    super(baseUrl);
  }

  /**
   * Registriert einen Listener für Auth-Status-Änderungen
   */
  onAuthStatusChange(listener: (status: AuthStatus) => void): () => void {
    this.authStatusListeners.push(listener);
    
    // Gibt eine Cleanup-Funktion zurück
    return () => {
      const index = this.authStatusListeners.indexOf(listener);
      if (index > -1) {
        this.authStatusListeners.splice(index, 1);
      }
    };
  }

  /**
   * Benachrichtigt alle Listener über Auth-Status-Aenderungen
   */
  private notifyAuthStatusChange(): void {
    const status: AuthStatus = {
      isAuthenticated: this.currentUser !== null,
      user: this.currentUser,
      isLoading: false,
    };

    this.authStatusListeners.forEach(listener => listener(status));
  }

  /**
   * Setzt den aktuellen Benutzer und benachrichtigt Listener
   */
  private setCurrentUser(user: User | null): void {
    this.currentUser = user;
    this.notifyAuthStatusChange();
  }

  /**
   * Gibt den aktuellen Authentifizierungs-Status zurück
   */
  getAuthStatus(): AuthStatus {
    return {
      isAuthenticated: this.currentUser !== null,
      user: this.currentUser,
      isLoading: false,
    };
  }

  /**
   * Gibt den aktuellen Benutzer zurück
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Prueft ob der Benutzer authentifiziert ist
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Login mit E-Mail und Passwort
   * 
   * @param credentials Login-Daten
   * @param redirectUrl Optional: URL für Redirect nach erfolgreichem Login
   * @returns Promise<void>
   * @throws ApiError bei Fehlern
   */
  async login(
    credentials: LoginRequest,
    redirectUrl?: string
  ): Promise<void> {
    try {
      const loginData: Record<string, string | boolean> = {
        email: credentials.email,
        password: credentials.password,
      };

      if (credentials.remember) {
        loginData.remember = credentials.remember;
      }

      // Login-Endpunkt verwendet Form-Data
      await this.postForm('/login', loginData);

      // Nach erfolgreichem Login, Benutzer-Daten abrufen
      await this.fetchCurrentUser();

      // Optional: Redirect durchführen
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Login fehlgeschlagen', 0);
    }
  }

  /**
   * Registrierung eines neuen Benutzers
   * 
   * @param data Registrierungs-Daten
   * @param redirectUrl Optional: URL für Redirect nach erfolgreicher Registrierung
   * @returns Promise<void>
   * @throws ApiError bei Fehlern
   */
  async register(
    data: RegisterRequest,
    redirectUrl?: string
  ): Promise<void> {
    try {
      const registerData: Record<string, string> = {
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
      };

      if (data.name) {
        registerData.name = data.name;
      }

      // Register-Endpunkt verwendet Form-Data
      await this.postForm('/register', registerData);

      try {
        await this.fetchCurrentUser();
      } catch {
      }

      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Registrierung fehlgeschlagen', 0);
    }
  }

  /**
   * Logout des aktuellen Benutzers
   * 
   * @param redirectUrl Optional: URL für Redirect nach Logout
   * @returns Promise<void>
   */
  async logout(redirectUrl?: string): Promise<void> {
    try {
      // Logout-Endpunkt
      await this.get('/logout');
    } catch (error) {
      // Auch bei Fehlern, lokalen State zurücksetzen
      console.error('Logout error:', error);
    } finally {
      // Lokalen State zurücksetzen
      this.setCurrentUser(null);

      // Optional: Redirect durchführen
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        window.location.href = '/login';
      }
    }
  }

  /**
   * Startet OAuth-Login Flow (Google oder Microsoft)
   * 
   * @param provider OAuth Provider ('google' oder 'microsoft')
   * @param redirectUrl Optional: URL für Redirect nach erfolgreichem OAuth-Login
   */
  startOAuthLogin(provider: OAuthProvider, redirectUrl?: string): void {
    const oauthUrl = `/login/${provider}`;
    
    // Speichere redirectUrl in sessionStorage für nach OAuth-Callback
    if (redirectUrl) {
      sessionStorage.setItem('oauth_redirect_url', redirectUrl);
    }

    // Redirect zu OAuth-Provider
    window.location.href = oauthUrl;
  }

  /**
   * Ruft die Daten des aktuellen Benutzers ab
   * 
   * @returns Promise<User>
   * @throws ApiError bei Fehlern (z.B. nicht authentifiziert)
   */
  async fetchCurrentUser(): Promise<User> {
    try {
      const user = await this.get<User>('/api/user/me');
      this.setCurrentUser(user);
      return user;
    } catch (error) {
      // Bei 401 (Unauthorized), setze User auf null
      if (error instanceof ApiError && error.statusCode === 401) {
        this.setCurrentUser(null);
      }
      throw error;
    }
  }

  /**
   * Aktualisiert das Benutzerprofil
   * 
   * @param data Profil-Daten (name und/oder password)
   * @returns Promise<User>
   * @throws ApiError bei Fehlern
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    try {
      const response = await this.put<UpdateProfileResponse>(
        '/api/user/profile',
        data
      );

      if (response.success && response.user) {
        this.setCurrentUser(response.user);
        return response.user;
      }

      throw new ApiError('Profil konnte nicht aktualisiert werden', 500);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Fehler beim Aktualisieren des Profils', 0);
    }
  }

  /**
   * Sendet eine Passwort-Reset-Anfrage
   * 
   * @param email E-Mail-Adresse
   * @returns Promise<void>
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await this.postForm('/forgot-password', { email });
    } catch (error) {
      // Auch bei Fehlern keine E-Mail preisgeben (Security)
      console.error('Password reset request error:', error);
    }
  }

  /**
   * Setzt ein neues Passwort mit Reset-Token
   * 
   * @param token Reset-Token aus E-Mail (wird als Query-Parameter übergeben)
   * @param password Neues Passwort
   * @param passwordConfirm Passwort-Bestätigung
   * @returns Promise<void>
   * @throws ApiError bei Fehlern
   */
  async resetPassword(
    token: string,
    password: string,
    passwordConfirm: string
  ): Promise<void> {
    try {
      // Token wird als Query-Parameter in der URL übergeben
      const endpoint = `/reset-password?token=${encodeURIComponent(token)}`;
      await this.postForm(endpoint, {
        password,
        password_confirm: passwordConfirm,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Passwort konnte nicht zurückgesetzt werden', 0);
    }
  }

  /**
   * Verifiziert eine E-Mail-Adresse mit Token
   * 
   * @param token Verifizierungs-Token aus E-Mail
   * @returns Promise<void>
   */
  async verifyEmail(token: string): Promise<void> {
    try {
      await this.get(`/verify-email?token=${encodeURIComponent(token)}`);
      
      // Nach Verifizierung, Benutzer-Daten aktualisieren
      if (this.currentUser) {
        await this.fetchCurrentUser();
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('E-Mail konnte nicht verifiziert werden', 0);
    }
  }

  /**
   * Sendet Verifizierungs-E-Mail erneut
   * 
   * @param email E-Mail-Adresse
   * @returns Promise<void>
   */
  async resendVerificationEmail(email: string): Promise<void> {
    try {
      await this.postForm('/resend-verification', { email });
    } catch (error) {
      // Auch bei Fehlern nicht die E-Mail preisgeben (Security)
      console.error('Resend verification email error:', error);
    }
  }

  /**
   * Initialisiert den Auth-Controller
   * Versucht den aktuellen Benutzer abzurufen, wenn eine Session existiert
   * 
   * @returns Promise<void>
   */
  async initialize(): Promise<void> {
    try {
      await this.fetchCurrentUser();
    } catch (error) {
      // Wenn kein Benutzer eingeloggt ist, ist das OK
      this.setCurrentUser(null);
    }
  }
}

