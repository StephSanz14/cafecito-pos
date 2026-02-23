import { Injectable } from '@angular/core';
import type { Role } from '../../types/Auth';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'cafecito_token';
  private readonly ROLE_KEY = 'cafecito_role';
  private readonly REFRESH_KEY = 'cafecito_refresh';

  setSession(token: string, role: Role, refreshToken: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ROLE_KEY, role);
    localStorage.setItem(this.REFRESH_KEY, refreshToken);
  }

  setAccessToken(token: string) {
  localStorage.setItem(this.TOKEN_KEY, token);
}

  getToken() { return localStorage.getItem(this.TOKEN_KEY); }
  getRole() { return localStorage.getItem(this.ROLE_KEY) as Role | null; }
  getRefreshToken() { return localStorage.getItem(this.REFRESH_KEY); }

  clear() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ROLE_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

}