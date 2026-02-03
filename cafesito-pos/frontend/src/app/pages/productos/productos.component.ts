import { Component } from '@angular/core';
import { HasRoleDirective } from '../../core/directives/hasrole.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, HasRoleDirective],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {

}
