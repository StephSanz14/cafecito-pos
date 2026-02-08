import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HasRoleDirective } from '../../core/directives/hasrole.directive';
import { Customer } from '../../core/types/Customer';
import { CustomerService } from '../../core/services/customer/customer.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, HasRoleDirective, ReactiveFormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {
  private customerService: CustomerService;
  customers: Customer[] = [];
  loading: boolean = false;
  errorMsg: string = '';
  filteredCustomers: Customer[] = [];
  searchTerm = '';


  constructor(customerService: CustomerService, private fb: FormBuilder) {
    this.customerService = customerService;
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.errorMsg = '';

    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.filteredCustomers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'No se pudieron cargar los clientes. Intenta de nuevo.';
        this.loading = false;
      },
    });
  }

  filterCustomers(value: string): void {
  this.searchTerm = value.toLowerCase().trim();

  if (!this.searchTerm) {
    this.filteredCustomers = this.customers;
    return;
  }

  this.filteredCustomers = this.customers.filter(c =>
    c.name.toLowerCase().includes(this.searchTerm) ||
    c.phoneOrEmail.toLowerCase().includes(this.searchTerm)
  );
}


isModalOpen = false;
selectedCustomer: Customer | null = null;
modalLoading = false;
modalError = '';

openCustomerModal(customerId: string): void {
  this.isModalOpen = true;
  this.selectedCustomer = null;
  this.modalError = '';
  this.modalLoading = true;

  this.customerService.getCustomerById(customerId).subscribe({
    next: (customer) => {
      this.selectedCustomer = customer;
      this.modalLoading = false;
    },
    error: (err) => {
      console.error(err);
      this.modalError = 'No se pudo cargar el cliente.';
      this.modalLoading = false;
    },
  });
}

closeModal(): void {
  this.isModalOpen = false;
  this.selectedCustomer = null;
  this.modalError = '';
  this.modalLoading = false;
}


// Crear cliente modal
isCreateOpen = false;
createLoading = false;
createError = '';
createForm!: FormGroup;


openCreateModal(): void {
  this.isCreateOpen = true;
  this.createError = '';
  this.initCreateForm();
}

closeCreateModal(): void {
  this.isCreateOpen = false;
  this.createLoading = false;
  this.createError = '';
}


initCreateForm(): void {
  this.createForm = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ],
    ],
    phoneOrEmail: [
      '',
      [
        Validators.required,
        Validators.pattern(
          /^(\+\d{12}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/
        ),
      ],
    ],
  });
}


submitCreate(): void {
  this.createError = '';

  if (this.createForm.invalid) {
    this.createForm.markAllAsTouched();
    return;
  }

  this.createLoading = true;

  const { name, phoneOrEmail } = this.createForm.value;

  this.customerService
    .createCustomer({ name, phoneOrEmail })
    .subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadCustomers();
      },
      error: (err) => {
        console.error(err);
        this.createError =
          err?.error?.message || 'No se pudo crear el cliente. Intenta de nuevo.';
        this.createLoading = false;
      },
    });
}


}

