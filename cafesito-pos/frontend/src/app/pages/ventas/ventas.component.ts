import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductsService } from '../../core/services/products/products.service';
import { Product } from '../../core/types/Product';
import { SaleService } from '../../core/services/sales/sale.service';
import type { PaymentMethod, SaleResponse } from '../../core/types/Sale';
import { CustomerService } from '../../core/services/customer/customer.service';



type CartItem = {
  productId: string;     
  name: string;
  unitPrice: number;
  stock: number;
  qty: number;
};

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css',
})


export class VentasComponent implements OnInit {

  private fb = new FormBuilder();
  customerForm = this.fb.group({
  phoneOrEmail: [
    '',
    [
      Validators.maxLength(100),
      Validators.pattern(/^(\+\d{12}|[^\s@]+@[^\s@]+\.[^\s@]+)$/),
    ],
  ],
});

  // ====== Estado general (igual que productos) ======
  loading = false;
  errorMsg = '';

  // ====== Productos (igual que productos) ======
  products: Product[] = [];
  q = '';
  page = 1;
  limit = 20;
  total = 0;

  get customerInputError(): string {
  const c = this.customerForm.controls.phoneOrEmail;
  if (!c.touched || !c.errors) return '';

  if (c.errors['pattern']) {
    return 'Formato inválido. Tel: + y 13 caracteres (ej: +524499773850) o Email: nombre@dominio.com';
  }
  if (c.errors['maxlength']) return 'Demasiado largo.';
  return 'Dato inválido.';
}

  get totalPages() {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  // ====== Venta actual ======
  cart: CartItem[] = [];
  customerId = '';
  paymentMethod: PaymentMethod = 'cash';

  // ====== Ticket ======
  paying = false;
  ticketOpen = false;
  lastSale: SaleResponse | null = null;

  // ====== Customer ======
  customerQuery = '';
  selectedCustomerId: string | null = null;
  selectedCustomerName= '';
  customerNotFound = false;

  constructor(
    private productsService: ProductsService,
    private salesService: SaleService,
    private customerService: CustomerService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // ====== Buscar cliente por ID (GET /customer/search?q=) ======
  findCustomer() {
  this.customerForm.markAllAsTouched();
  if (this.customerForm.invalid) return;

  const q = String(this.customerForm.value.phoneOrEmail || '').trim();

  this.customerNotFound = false;
  this.selectedCustomerId = null;
  this.selectedCustomerName = '';

  this.customerService.lookupCustomer(q).subscribe({
    next: (customer) => {
      this.selectedCustomerId = customer.id;
      this.selectedCustomerName = customer.name;
      this.customerNotFound = false;
    },
    error: () => {
      this.customerNotFound = true;
      this.selectedCustomerId = null;
      this.selectedCustomerName = '';
    },
  });
}

  // ====== GET PRODUCTS (mismo patrón) ======
  loadProducts(): void {
    this.loading = true;
    this.errorMsg = '';

    this.productsService.getProducts({ q: this.q, page: this.page, limit: this.limit }).subscribe({
      next: (res) => {
        this.products = res.data;
        this.total = res.total;
        this.page = res.page;
        this.limit = res.limit;

        // si backend manda message cuando q no encuentra resultados
        if (res.message) this.errorMsg = res.message;

        this.loading = false;
      },
      error: (err: unknown) => {
        this.errorMsg = this.getErrorMessage(err, 'No se pudieron cargar los productos.');
        this.loading = false;
      },
    });
  }

  onSearchChange(value: string) {
    this.q = value ?? '';
    this.page = 1;
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

  // ====== Carrito ======
  addToCart(p: Product) {
    if (!p.id) {
      this.errorMsg = 'Este producto no tiene id.';
      return;
    }

    const stock = p.stock ?? 0;
    if (stock <= 0) {
      this.errorMsg = `No hay stock para "${p.name}".`;
      return;
    }

    const existing = this.cart.find((x) => x.productId === p.id);
    if (existing) {
      if (existing.qty + 1 > stock) {
        this.errorMsg = `Stock insuficiente para "${p.name}".`;
        return;
      }
      existing.qty += 1;
      return;
    }

    this.cart.push({
      productId: p.id,
      name: p.name ?? 'Producto',
      unitPrice: p.price ?? 0,
      stock,
      qty: 1,
    });
  }

  inc(it: CartItem) {
    if (it.qty + 1 > it.stock) return;
    it.qty += 1;
  }

  dec(it: CartItem) {
    it.qty -= 1;
    if (it.qty <= 0) this.cart = this.cart.filter((x) => x.productId !== it.productId);
  }

  clearSale() {
    this.cart = [];
    this.customerId = '';
    this.paymentMethod = 'cash';
    this.errorMsg = '';

    this.selectedCustomerId = null;
    this.selectedCustomerName = '';
    this.customerQuery = '';
    this.customerNotFound = false;
  }

  get subtotal() {
    return this.cart.reduce((acc, it) => acc + it.unitPrice * it.qty, 0);
  }

  // ====== Cobrar (POST /sale/sales) ======
  pay() {
    this.errorMsg = '';

    if (this.cart.length === 0) {
      this.errorMsg = 'Agrega al menos un producto a la venta.';
      return;
    }

    this.paying = true;

    this.salesService.createSale({
      customerId: this.selectedCustomerId ?? undefined, 
      paymentMethod: this.paymentMethod,
      items: this.cart.map((it) => ({
        productId: it.productId,
        quantity: it.qty,
      })),
    }).subscribe({
      next: (sale) => {
        this.lastSale = sale;
        this.ticketOpen = true;

        // limpia venta al éxito
        this.clearSale();
        this.paying = false;
      },
      error: (err: unknown) => {
        this.errorMsg = this.getErrorMessage(err, 'No se pudo registrar la venta.');
        this.paying = false;
      },
    });
  }

  clearCustomer() {
    this.selectedCustomerId = null;
    this.selectedCustomerName = '';
    this.customerQuery = '';
    this.customerNotFound = false;
    this.customerForm.reset({phoneOrEmail: ''});
  }
  closeTicket() {
    this.ticketOpen = false;
    this.lastSale = null;
  }

  // ====== Error helper (igual que productos) ======
  private getErrorMessage(err: unknown, fallback: string) {
    if (err instanceof HttpErrorResponse) {
      return err.error?.message || err.error?.error || fallback;
    }
    return fallback;
  }
}