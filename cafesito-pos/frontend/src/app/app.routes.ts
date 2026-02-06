import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ✅ PUBLIC AREA (sin sidebar)
  {
    path: '',
    loadComponent: () =>
      import('../layout/publicshell/publicshell.component').then((c) => c.PublicShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'productos' },

      { path: 'productos', loadComponent: () => import('./pages/productos/productos.component').then(c => c.ProductosComponent), title: 'Productos' },
      { path: 'login', loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent), title: 'Login' },
      { path: 'register', loadComponent: () => import('./pages/register/register.component').then(c => c.RegisterComponent), title: 'Register' },
    ],
  },

  // ✅ APP AREA (con sidebar, protegida)
  {
    path: '',
    loadComponent: () =>
      import('../layout/shell/shell.component').then((c) => c.ShellComponent),
    canActivate: [authGuard],
    children: [
      { path: 'ventas', loadComponent: () => import('./pages/ventas/ventas.component').then(c => c.VentasComponent), title: 'Ventas', data: { roles: ['admin', 'seller'] }, canActivate: [roleGuard] },
      { path: 'clientes', loadComponent: () => import('./pages/clientes/clientes.component').then(c => c.ClientesComponent), title: 'Clientes', data: { roles: ['admin', 'seller'] }, canActivate: [roleGuard] },
    ],
  },

  { path: '**', redirectTo: 'productos' },
];
