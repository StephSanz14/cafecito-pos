import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TokenService } from '../../core/services/token/token.service';
import { LoginRequestSchema } from '../../core/types/Auth';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly token = inject(TokenService);
  private readonly router = inject(Router);

  phoneOrEmail = '';
  password = '';
  error = '';
  loading = false;

  onSubmit() {
    this.error = '';

    //validar input con zod antes de llamar backend
    const parsed = LoginRequestSchema.safeParse({
      phoneOrEmail: this.phoneOrEmail,
      password: this.password,
    });

    if (!parsed.success) {
      this.error = parsed.error.issues[0]?.message || 'Datos inválidos';
      return;
    }

    this.loading = true;

    this.auth.login(parsed.data).subscribe({
      next: (res) => {
        //uardar sesión
        this.token.setSession(res.token, res.role, res.refreshToken);
        // ir al shell
        this.router.navigate(['/ventas']);
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo iniciar sesión';
        this.loading = false;
      },
    });
  }
}
