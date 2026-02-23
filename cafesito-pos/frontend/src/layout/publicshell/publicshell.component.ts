import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TokenService } from '../../app/core/services/token/token.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-public-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100">
      <header class="border-b border-zinc-800">
        <div class="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">

          <!-- Brand -->
          <div class="flex items-center gap-2 text-2xl font-bold text-amber-400">
            <i class="fa-solid fa-seedling text-xl"></i>
            <a routerLink="/productos">Cafecito POS</a>
          </div>

          <!-- Nav -->
          <nav class="flex items-center gap-3 text-sm">

            <a routerLink="/productos"
               class="text-zinc-300 hover:text-zinc-100">
              Productos
            </a>

            @if (hasSession()) {
              <!-- 🔐 SESIÓN ACTIVA -->
                 <div class="flex items-center gap-3">
              <a
                routerLink="/ventas"
                class="flex items-center gap-2 rounded-lg bg-amber-600 px-3 py-1.5
                       font-semibold text-zinc-950 hover:bg-amber-500 transition">
                <i class="fa-solid fa-cash-register"></i>
                Ventas
              </a>
               <button
               (click)="logout()"
               class="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5
               text-zinc-200 hover:bg-zinc-800 transition">
               Salir
               </button>
               </div>
            } @else {
              <!-- 👤 NO HAY SESIÓN -->
              <a routerLink="/login"
                 class="text-zinc-300 hover:text-zinc-100">
                Login
              </a>

              <a routerLink="/register"
                 class="rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-1
                        text-zinc-200 hover:bg-zinc-800">
                Registrarse
              </a>
            }

          </nav>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 py-6">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class PublicShellComponent {

  constructor(private router: Router) {}
  private tokenService = inject(TokenService);

  hasSession(): boolean {
    return !!this.tokenService.getToken();
  }

  logout(): void {
    this.tokenService.clear();
    this.router.navigate(['/productos']);
  }
}
