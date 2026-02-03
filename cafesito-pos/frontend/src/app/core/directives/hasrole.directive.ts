import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { TokenService } from '../services/token/token.service';
import type { Role } from '../../core/types/Auth';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  private viewContainer = inject(ViewContainerRef); // Acceso al contenedor de vistas
  private templateRef = inject(TemplateRef<unknown>); // Referencia a la plantilla
  private tokenService = inject(TokenService); // Servicio para obtener el rol del usuario

  @Input() set appHasRole(allowedRoles: Role[]) {
    this.viewContainer.clear(); // Limpia la vista antes de renderizar

    const userRole = this.tokenService.getRole(); // Obtiene el rol del usuario actual
    const canRender =
      !!userRole && allowedRoles.includes(userRole); // Verifica si el rol del usuario está en la lista de roles permitidos

    if (canRender) {
      this.viewContainer.createEmbeddedView(this.templateRef); // Renderiza la plantilla si el rol es permitido
    }
  }
}
