import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap } from 'rxjs';
import { TokenService } from '../services/token/token.service';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

export type ApiError = {
  message: string;
  status?: number;
  raw?: unknown;
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: unknown) => {
      console.error('[HTTP ERROR]', req.method, req.url, err);

      if (err instanceof HttpErrorResponse) {

        const isAuthError = err.status === 401 || err.status === 403;
        const isRefreshCall = req.url.includes('/refresh-token');

        // Si es 401 o 403 intentamos refresh
        if (isAuthError && !isRefreshCall) {

          const refreshToken = tokenService.getRefreshToken();

          if (!refreshToken) {
            tokenService.clear();
            router.navigate(['/login']);
            return throwError(() => err);
          }

          return authService.refreshToken(refreshToken).pipe(
            switchMap((res) => {

              // Guardamos nuevo access token
              tokenService.setAccessToken(res.token);

              // Reintentamos request original
              const retryReq: HttpRequest<any> = req.clone({
                setHeaders: { Authorization: `Bearer ${res.token}` },
              });

              return next(retryReq);
            }),
            catchError(() => {
              tokenService.clear();
              router.navigate(['/login']);
              return throwError(() => err);
            })
          );
        }

        const backend = err.error as any;

        const message =
          backend?.message ||
          backend?.error ||
          (typeof backend === 'string' ? backend : null) ||
          `Error HTTP ${err.status}`;

        const apiError: ApiError = {
          message,
          status: err.status,
          raw: backend ?? err,
        };

        return throwError(() => apiError);
      }

      return throwError(() => ({
        message: 'Ocurrió un error inesperado',
        raw: err,
      }));
    })
  );
};