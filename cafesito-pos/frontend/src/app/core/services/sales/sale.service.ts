import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';
import { CreateSaleRequest, SaleResponseSchema } from '../../types/Sale';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private readonly baseUrl = `${environment.BACK_URL}/sale`;

  constructor(private http: HttpClient) { }

   createSale(payload: CreateSaleRequest) {
    return this.http
      .post<unknown>(`${this.baseUrl}/sales`, payload)
      .pipe(map(res => SaleResponseSchema.parse(res)));
  }

  getSaleById(id: string) {
    return this.http
      .get<unknown>(`${this.baseUrl}/sales/${id}`)
      .pipe(map(res => SaleResponseSchema.parse(res)));
  }

}
