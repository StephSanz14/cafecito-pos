import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HasRoleDirective } from '../../core/directives/hasrole.directive';
import { ProductsService } from '../../core/services/products/products.service';
import { Product } from '../../core/types/Product';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, HasRoleDirective, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent implements OnInit {
  loading = false;
  errorMsg = '';

  products: Product[] = [];

  q = '';
  page = 1;
  limit = 20;
  total = 0;

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMsg = '';

    this.productsService.getProducts({ q: this.q, page: this.page, limit: this.limit }).subscribe({
      next: (res) => {
        this.products = res.data;
        this.total = res.total;
        this.page = res.page;
        this.limit = res.limit;

        // si vino mensaje (q sin resultados), puedes mostrarlo
        if (res.message) this.errorMsg = res.message;

        this.loading = false;
      },
      error: (err: unknown) => {
        this.errorMsg = this.getErrorMessage(err, 'No se pudieron cargar los productos.');
        this.loading = false;
      },
    });
  }

  //search input handler
  onSearchChange(value: string) {
    this.q = value;
    this.page = 1; // reinicia paginación al buscar
    this.loadProducts();
  }

  prevPage() {
    if (this.page <= 1) return;
    this.page--;
    this.loadProducts();
  }

  nextPage() {
    if (this.page >= this.totalPages) return;
    this.page++;
    this.loadProducts();
  }

  private getErrorMessage(err: unknown, fallback: string) {
    if (err instanceof HttpErrorResponse) {
      return err.error?.message || err.error?.error || fallback;
    }
    return fallback;
  }
}