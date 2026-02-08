import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HasRoleDirective } from '../../core/directives/hasrole.directive';
import { ProductsService } from '../../core/services/products/products.service';
import { Product } from '../../core/types/Product';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, HasRoleDirective, FormsModule, ReactiveFormsModule],
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

  // ====== MODALES ======
isCreateOpen = false;
isEditOpen = false;
isDeleteOpen = false;

editing: Product | null = null;
deleting: Product | null = null;

// ====== REACTIVE FORMS ======
private fb = new FormBuilder();

createForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
  price: [0, [Validators.required, Validators.min(0.01)]],
  stock: [0, [Validators.required, Validators.min(0)]],
});

editForm = this.fb.group({
  name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
  price: [0, [Validators.required, Validators.min(0.01)]],
  stock: [0, [Validators.required, Validators.min(0)]],
});

// ====== CREATE ======
openCreate() {
  this.errorMsg = '';
  this.createForm.reset({ name: '', price: 0, stock: 0 });
  this.isCreateOpen = true;
}

closeCreate() {
  this.isCreateOpen = false;
}

submitCreate() {
  this.errorMsg = '';
  this.createForm.markAllAsTouched();
  if (this.createForm.invalid) return;

  const v = this.createForm.getRawValue();
  this.loading = true;

  this.productsService.createProduct({
    name: String(v.name).trim(),
    price: Number(v.price),
    stock: Number(v.stock),
  }).subscribe({
    next: () => {
      this.closeCreate();
      this.loadProducts();
      this.loading = false;
    },
    error: (err: unknown) => {
      this.errorMsg = this.getErrorMessage(err, 'No se pudo crear el producto.');
      this.loading = false;
    },
  });
}

// ====== EDIT ======
openEdit(p: Product) {
  this.errorMsg = '';
  this.editing = p;

  this.editForm.reset({
    name: p.name ?? '',
    price: p.price ?? 0,
    stock: p.stock ?? 0,
  });

  this.isEditOpen = true;
}

closeEdit() {
  this.isEditOpen = false;
  this.editing = null;
}

submitEdit() {
  if (!this.editing?.id) return;

  this.errorMsg = '';
  this.editForm.markAllAsTouched();
  if (this.editForm.invalid) return;

  const v = this.editForm.getRawValue();
  this.loading = true;

  this.productsService.updateProduct(this.editing.id, {
    name: String(v.name).trim(),
    price: Number(v.price),
    stock: Number(v.stock),
  }).subscribe({
    next: () => {
      this.closeEdit();
      this.loadProducts();
      this.loading = false;
    },
    error: (err: unknown) => {
      this.errorMsg = this.getErrorMessage(err, 'No se pudo actualizar el producto.');
      this.loading = false;
    },
  });
}

// ====== DELETE ======

productDelete(p: Product) {
  if (!p.id) return;

  this.loading = true;

  this.productsService.deleteProduct(p.id).subscribe({
    next: () => {
      // si borras el último de la página, retrocede 1
      if (this.products.length === 1 && this.page > 1) this.page--;

      this.loadProducts();
      this.loading = false;
    },
    error: (err: unknown) => {
      this.errorMsg = this.getErrorMessage(err, 'No se pudo eliminar el producto.');
      this.loading = false;
    },
  });
}
}