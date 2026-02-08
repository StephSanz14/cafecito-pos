import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();

   // Si no hay token, manda normal (productos públicos, login, etc.)
  if (!token) return next(req);

  // Si ya trae Authorization, no lo duplicamos
  if (req.headers.has('Authorization')) return next(req);
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },

  });
  console.log('authInterceptor running', token);
  return next(authReq);
};
