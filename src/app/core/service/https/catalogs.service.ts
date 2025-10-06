import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs/Observable';
import { CatalogProduct } from '@data/schema/Catalogs/catalog-product';
import { Catalog } from '@data/schema/Catalogs/Catalog';
import { CatalogDto } from '@data/dto/catalogs/catalog.dto';
import { FishingPriceDto } from '@data/dto/fishing-price/fishing-price.dto';
import { FishingSearch } from '@data/dto/fishing-price/fishing-search.dto';
import { CatalogConfigRequestDto } from '@data/dto/catalogs/catalog-config-request.dto';
import { Sort } from '@angular/material/sort';
import { CatalogStatus } from '@data/schema/Catalogs/catalog-status';
import { map } from 'rxjs/operators';
import { CatalogThermometerDto } from '@data/dto/catalogs/thermometer/catalog-thermometer.dto';
import { SelectedEnumDto } from '@data/dto/quote/select-enum.dto';
import { CatalogProductDto } from '@data/dto/catalogs/catalog-product.dto';

@Injectable()
export class CatalogsService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/Catalog`;
  private urlProductsBase = `${environment.serverUrl}/CatalogProduct`;

  getAll(
    companyId: number,
    active: boolean | any,
    argument: string | any,
    pageNumber: number,
    pageSize: number,
    sort: Sort
  ): Observable<BfResponse<CatalogDto[]>> {
    let url = `${this.urlBase}?PageNumber=${pageNumber}&PageSize=${pageSize}&Sort.Direction=${sort.direction}&Sort.Active=${sort.active}`;

    if (companyId) {
      url += `&companyId=${companyId}`;
    }

    if (active != null) {
      url += `&Active=${active}`;
    }

    if (argument) {
      url += `&Argument=${argument}`;
    }

    return this.http.get<BfResponse<CatalogDto[]>>(url);
  }

  get(catalogId: number): Observable<BfResponse<Catalog>> {
    const url = `${this.urlBase}/${catalogId}`;
    return this.http.get<BfResponse<Catalog>>(url);
  }

  getThermometer(catalogId: number): Observable<BfResponse<CatalogThermometerDto>> {
    const url = `${this.urlBase}/thermometer?catalogId=${catalogId}`;
    return this.http.get<BfResponse<CatalogThermometerDto>>(url);
  }

  activeInactive(id: number) {
    const url = `${this.urlBase}/activeInactive/`;
    return this.http.post<BfResponse<any>>(url, { CatalogId: id });
  }

  add(model: Catalog) {
    const url = `${this.urlBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  save(model: Catalog) {
    const url = `${this.urlBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  delete(id: number) {
    const url = `${this.urlBase}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  updatestatus(model: CatalogConfigRequestDto) {
    const url = `${this.urlBase}/updatestatus`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  //Products
  getProducts(
    catalogId: number,
    active: boolean | any,
    argument: string | any,
    referenceCode: string | any,
    pageNumber: number,
    pageSize: number,
    sort: Sort
  ): Observable<BfResponse<CatalogProductDto[]>> {
    let url = `${this.urlProductsBase}?CatalogId=${catalogId}&PageNumber=${pageNumber}&PageSize=${pageSize}&Sort.Direction=${sort.direction}&Sort.Active=${sort.active}`;

    if (active != null) {
      url += `&Active=${active}`;
    }

    if (referenceCode) {
      url += `&ReferenceCode=${referenceCode}`;
    }

    if (argument) {
      url += `&Argument=${argument}`;
    }

    return this.http.get<BfResponse<CatalogProductDto[]>>(url);
  }

  getProduct(catalogProductId: number): Observable<BfResponse<CatalogProduct>> {
    const url = `${this.urlProductsBase}/${catalogProductId}`;
    return this.http.get<BfResponse<CatalogProduct>>(url);
  }

  activeInactiveCatalogProduct(id: number) {
    const url = `${this.urlProductsBase}/activeInactive/`;
    return this.http.post<BfResponse<any>>(url, { catalogProductId: id });
  }

  addProduct(model: CatalogProduct) {
    const url = `${this.urlProductsBase}`;
    return this.http.post<BfResponse<any>>(url, model);
  }

  saveProduct(model: CatalogProduct) {
    const url = `${this.urlProductsBase}`;
    return this.http.put<BfResponse<any>>(url, model);
  }

  deleteProduct(id: number) {
    const url = `${this.urlProductsBase}/${id}`;
    return this.http.delete<BfResponse<any>>(url);
  }

  uploadFile(formData: FormData | any): Observable<any> {
    let headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');

    const url = `${this.urlProductsBase}/import`;
    return this.http.post<BfResponse<CatalogDto>>(url, formData, {
      headers,
      responseType: 'json',
      reportProgress: true,
      observe: 'events',
    });
  }

  getCatalogProductType(): Observable<SelectedEnumDto[]> {
    const url = `${this.urlProductsBase}/getcatalogproducttypeenum`;
    return this.http.get<BfResponse<SelectedEnumDto[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
  
  //Status
  getCatalogStatus(catalogId: number): Observable<BfResponse<CatalogStatus>> {
    const url = `${this.urlBase}/getcatalogstatus/${catalogId}`;
    return this.http.get<BfResponse<CatalogStatus>>(url);
  }

  //Price
  fishingprices(
    search: FishingSearch
  ): Observable<BfResponse<FishingPriceDto[]>> {
    let url = `${this.urlBase}/fishingprices?PageNumber=${search.pageNumber}&PageSize=${search.pageSize}`;

    if (search.argument) {
      url += `&argument=${search.argument}`;
    }

    if (search.referenceCode) {
      url += `&referenceCode=${search.referenceCode}`;
    }

    if (search.onlyFavorites == true) {
      url += `&onlyFavorites=${search.onlyFavorites}`;
    }

    if (search.onlyShoppingCarts == true) {
      url += `&onlyShoppingCarts=${search.onlyShoppingCarts}`;
    }

    return this.http.get<BfResponse<FishingPriceDto[]>>(url);
  }
}
