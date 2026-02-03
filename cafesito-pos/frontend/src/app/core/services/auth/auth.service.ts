import { environment } from '../../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import {
  LoginRequest,
  LoginResponseSchema,
  RegisterRequest,
  ExistsResponseSchema,
} from '../../types/Auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.BACK_URL;

  login(payload: LoginRequest) {
    return this.http
      .post<unknown>(`${this.baseUrl}/auth/login`, payload)
      .pipe(map((res) => LoginResponseSchema.parse(res)));
  }

  registerSeller(payload: RegisterRequest) {
    return this.http.post(`${this.baseUrl}/auth/register`, payload);
  }

  checkPhoneOrEmailExists(phoneOrEmail: string) {
    return this.http
      .get<unknown>(`${this.baseUrl}/auth/check-email`, {
        params: { phoneOrEmail: phoneOrEmail.trim() },
      })
      .pipe(map((res) => ExistsResponseSchema.parse(res).exists));
  }
}
