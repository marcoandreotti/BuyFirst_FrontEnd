import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs/Observable';
import { ShoppingCart } from '@data/schema/shopping-cart/shopping-cart';

@Injectable()
export class ShoppingCartService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/ShoppingCart`;

  get(shoppingCartId: number): Observable<BfResponse<ShoppingCart>> {
    const url = `${this.urlBase}/${shoppingCartId}`;
    return this.http.get<BfResponse<ShoppingCart>>(url);
  }

  add(model: ShoppingCart) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  delete(id: number) {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  save(model: ShoppingCart) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  //Favorites

  addFavorite(
    productSupplierId: number
  ): Observable<BfResponse<any>> {
    var url = `${this.urlBase}/addfavorite`;
    return this.http.post<BfResponse<any>>(url, {
      productSupplierId: productSupplierId,
    });
  }

  deleteFavorite(
    productSupplierId: number
  ): Observable<BfResponse<boolean>> {
    var url = `${this.urlBase}/deletefavorite`;
    return this.http.post<BfResponse<any>>(url, {
      productSupplierId: productSupplierId,
    });
  }

  deleteAllFavorites(): Observable<BfResponse<boolean>> {
    var url = `${this.urlBase}/deleteallfavorites`;
    return this.http.post<BfResponse<any>>(url, {});
  }

  //ShoppingCarts

  addShoppingCart(
    productSupplierId: number,
    quantity: number | 0
  ): Observable<BfResponse<any>> {
    var url = `${this.urlBase}/addshoppingcart`;
    return this.http.post<BfResponse<any>>(url, {
      productSupplierId: productSupplierId,
      quantity: quantity,
    });
  }

  deleteShoppingCart(
    productSupplierId: number
  ): Observable<BfResponse<boolean>> {
    var url = `${this.urlBase}/deleteshoppingcart`;
    return this.http.post<BfResponse<any>>(url, {
      productSupplierId: productSupplierId,
    });
  }

  deleteAllShoppingCarts(): Observable<BfResponse<boolean>> {
    var url = `${this.urlBase}/deleteallshoppingcarts`;
    return this.http.post<BfResponse<any>>(url, {});
  }
}
