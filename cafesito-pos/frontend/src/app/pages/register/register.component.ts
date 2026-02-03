import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { RegisterRequestSchema } from '../../core/types/Auth';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  name = '';
  phoneOrEmail = '';
  password = '';
  error = '';
  loading = false;

  // opcional: para mostrar "ya existe"
  existsMsg = '';

  onSubmit() {
    this.error = '';
    this.existsMsg = '';

    const parsed = RegisterRequestSchema.safeParse({
      name: this.name,
      phoneOrEmail: this.phoneOrEmail,
      password: this.password,
    });

    if (!parsed.success) {
      this.error = parsed.error.issues[0]?.message || 'Datos inválidos';
      return;
    }

    this.loading = true;
    this.auth.registerSeller(parsed.data).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo registrar';
        this.loading = false;
      },
    });
  }

  // ✅ opcional: validar existencia al salir del input
  onBlurCheck() {
    const v = this.phoneOrEmail.trim();
    if (!v) return;

    this.auth.checkPhoneOrEmailExists(v).subscribe({
      next: (exists) => {
        this.existsMsg = exists ? 'Ese correo/teléfono ya está registrado' : '';
      },
      error: () => {
        // si falla, no bloquees el registro, solo no muestres msg
        this.existsMsg = '';
      },
    });
  }
}

