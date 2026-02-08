import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HasRoleDirective } from '../../core/directives/hasrole.directive';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, HasRoleDirective],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent {

}
