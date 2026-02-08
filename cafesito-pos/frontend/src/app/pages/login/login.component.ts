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
  console.log('LOGIN RES =>', res);
  console.log('token?', res?.token);
  console.log('refreshToken?', res?.refreshToken);
  console.log('role?', res?.role);

  this.token.setSession(res.token, res.role, res.refreshToken);

  console.log('LS token after set =>', localStorage.getItem('cafecito_token'));
  console.log('LS refresh after set =>', localStorage.getItem('cafecito_refresh'));
  console.log('LS role after set =>', localStorage.getItem('cafecito_role'));

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
