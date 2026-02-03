import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    //register route
    {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then((c) => c.RegisterComponent),
    title: 'Register',
  },
    //Login Route
    {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((c) => c.LoginComponent),
    title: 'Login',
  },

    //Shell Route app interna
    {
    path: '',
    loadComponent: () =>
      import('../layout/shell/shell.component').then((c) => c.ShellComponent),
      canActivate: [authGuard], // Aquí puedes agregar guards si es necesario
        children: [
           { path: '', pathMatch: 'full', redirectTo: 'ventas' },
           {path: 'ventas', loadComponent: () => 
              import('./pages/ventas/ventas.component').then((c) => c.VentasComponent),
              title: 'Ventas',
              data: { roles: ['admin', 'seller'] },
              canActivate: [roleGuard],
           },
           {path: 'clientes', loadComponent: () => 
              import('./pages/clientes/clientes.component').then((c) => c.ClientesComponent),
              title: 'Clientes',
              data: { roles: ['admin', 'seller'] },
              canActivate: [roleGuard],
           },
           {path: 'productos', loadComponent: () => 
              import('./pages/productos/productos.component').then((c) => c.ProductosComponent),
              title: 'Productos',
              data: { roles: ['admin', 'seller'] },
              canActivate: [roleGuard],
           },
        ],
  },
 // Fallback Route
    { path: '**', redirectTo: '' },
];
