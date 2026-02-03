/* Objetivo
Si NO hay token → mandar a /login
Si SÍ hay token → dejar entrar al Shell (ventas/clientes/productos) */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token/token.service';

export const authGuard: CanActivateFn = () => {
  const tokenService = inject(TokenService); // Servicio para manejar tokens
  const router = inject(Router); // Servicio de navegación

  const token = tokenService.getToken();  // Obtener el token almacenado
  if (token) return true; // Si hay token, permitir acceso

  // Si no hay token, redirigir a la página de login

  router.navigate(['/login']);
  return false;
};
