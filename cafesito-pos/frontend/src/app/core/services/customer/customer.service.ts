import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Customer } from '../../types/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private baseUrl = `${environment.BACK_URL}/customer`;

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
  return this.http
    .get<{ data: Customer[] }>(`${this.baseUrl}/customers`)
    .pipe(
      map(response =>
        response.data.map(customer => ({
          ...customer,
          id: customer.id,
          name: customer.name.toUpperCase(),
          phoneOrEmail: customer.phoneOrEmail.toLowerCase(),
        }))
      )
    );
}

  getCustomerById(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/customers/${customerId}`).pipe(
      map(customer => ({
        ...customer,
        name: (customer.name ?? '').toUpperCase(),
        id: customer.id, 
        phoneOrEmail: customer.phoneOrEmail.toLowerCase(),
        purchasesCount: customer.purchasesCount,
      }))
    );
  } 


  createCustomer(customerData: { name: string; phoneOrEmail: string}): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/customers`, customerData);
  }
}


