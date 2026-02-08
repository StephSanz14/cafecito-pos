import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role } from '../types/Auth';
import { TokenService } from '../services/token/token.service';

export const roleGuard: CanActivateFn = (route) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const allowedRoles = (route.data?.['roles'] as Role[] | undefined) ?? [];

  // Si no se definieron roles en la ruta, la dejamos pasar
  if (allowedRoles.length === 0) return true;

  const userRole = tokenService.getRole();

  // Si no hay rol (no logueado o storage vacío), manda a login
  if (!userRole) {
    router.navigate(['/login']);
    return false;
  }

  // Si el rol está permitido, entra
  if (allowedRoles.includes(userRole)) return true;

  // Si no está permitido, lo mandamos a una ruta segura
  router.navigate(['/ventas']);
  return false;
};
