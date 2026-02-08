import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';
import { ProductsListResponseSchema } from '../../types/Product';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.BACK_URL}/product`;

  getProducts(params: { q?: string; page?: number; limit?: number }) {
    return this.http
      .get<unknown>(`${this.baseUrl}/products`, {
        params: {
          q: (params.q ?? '').trim(),
          page: String(params.page ?? 1),
          limit: String(params.limit ?? 20),
        },
      })
      .pipe(map((res) => ProductsListResponseSchema.parse(res)));
  }

  createProduct(productData: { name: string; price: number; stock: number }) {
    return this.http.post(`${this.baseUrl}/products`, productData);
  }

  updateProduct(productId: string, productData: { name?: string; price?: number; stock?: number }) {
    return this.http.put(`${this.baseUrl}/products/${productId}`, productData);
  }

  deleteProduct(productId: string) {
    return this.http.delete(`${this.baseUrl}/products/${productId}`);
  }

  getProductById(productId: string) {
    return this.http.get(`${this.baseUrl}/products/${productId}`);
  }
}