import { Routes } from '@angular/router';

export const routes: Routes = [
    //register route
    {
    path: 'register',
    loadComponent: () =>
      import('../pages/register/register.component').then((c) => c.RegisterComponent),
    title: 'Register',
  },
    //Login Route
    {
    path: 'login',
    loadComponent: () =>
      import('../pages/login/login.component').then((c) => c.LoginComponent),
    title: 'Login',
  },

    //Shell Route app interna
    {
    path: '',
    loadComponent: () =>
      import('../layout/shell/shell.component').then((c) => c.ShellComponent),
        children: [
           { path: '', pathMatch: 'full', redirectTo: 'ventas' },
           {path: 'ventas', loadComponent: () => 
              import('../pages/ventas/ventas.component').then((c) => c.VentasComponent),
              title: 'Ventas',
              data: { roles: ['admin', 'seller'] },
           },
           {path: 'clientes', loadComponent: () => 
              import('../pages/clientes/clientes.component').then((c) => c.ClientesComponent),
              title: 'Clientes',
              data: { roles: ['admin', 'seller'] },
           },
           {path: 'productos', loadComponent: () => 
              import('../pages/productos/productos.component').then((c) => c.ProductosComponent),
              title: 'Productos',
              data: { roles: ['admin', 'seller'] },
           },
        ],
  },
 // Fallback Route
    { path: '**', redirectTo: '' },
];
