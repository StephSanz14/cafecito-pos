import { Component } from '@angular/core';
import { HasRoleDirective } from '../../core/directives/hasrole.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../core/types/Product';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, HasRoleDirective, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent {
  q='';

  products: Product[] = [
    {
      _id: '1',
      name: 'Café Americano',
      price: 35,
      stock: 25,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '2',
      name: 'Café Latte',
      price: 45,
      stock: 6,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: '3',
      name: 'Café Cortado',
      price: 40,
      stock: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  get filteredProducts(): Product[] {
    const query = this.q.trim().toLowerCase();
    if (!query) return this.products;
    return this.products.filter((p) => p.name.toLowerCase().includes(query));
  }
}
