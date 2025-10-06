import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueueTotalsDto } from '@data/dto/queue/queue-totals.dto';
import { FilterQuoteErpHistoricDto } from '@data/dto/quote/erp/filter-quote-erp-historic.dto';
import { QuoteErpHistoricDto } from '@data/dto/quote/quote-erp-historic.dto';
import { QuoteErpHistoricAnalytical } from '@data/dto/quote/quote-erp-historic-analytical.dto';
import { CompanyProblemDto } from '@data/dto/quote/erp/company-problem.dto';

@Injectable()
export class QuoteErpHistoricService {
  constructor(private http: HttpClient) { }

  private urlBase = `${environment.serverUrl}/QuoteErpHistoric`;

  getAll(filter: FilterQuoteErpHistoricDto): Observable<BfResponse<QuoteErpHistoricDto[]>> {
    let url = `${this.urlBase}/getall`;
    return this.http.post<BfResponse<QuoteErpHistoricDto[]>>(url, filter);
  }

  getCsv(filter: FilterQuoteErpHistoricDto): string | any {
    let url = `${this.urlBase}/getcsv`;

    this.http.post<BfResponse<string>>(url, filter).subscribe((res) => {
      const binaryString = window.atob(res.data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; ++i) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      var fileURL = URL.createObjectURL(
        new Blob(['\ufeff', bytes], { type: 'text/csv;charset=utf-8;' })
      );

      const element = document.createElement('a');
      element.href = fileURL;
      element.download = `Produtos_ERP_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.csv`;
      document.body.appendChild(element);
      element.click();
      element.remove();
    });
  }

  getAnalysisCsv(filter: FilterQuoteErpHistoricDto): string | any {
    let url = `${this.urlBase}/getanalysiscsv`;

    this.http.post<BfResponse<string>>(url, filter).subscribe((res) => {
      const binaryString = window.atob(res.data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; ++i) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      var fileURL = URL.createObjectURL(
        new Blob(['\ufeff', bytes], { type: 'text/csv;charset=utf-8;' })
      );

      const element = document.createElement('a');
      element.href = fileURL;
      element.download = `Analysis_ERP_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.csv`;
      document.body.appendChild(element);
      element.click();
      element.remove();
    });
  }

  getQueueTotals(): Observable<BfResponse<QueueTotalsDto[]>> {
    let url = `${this.urlBase}/getquoteerphistorictotals/10`;

    return this.http.get<BfResponse<QueueTotalsDto[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getQuoteErpHistoricCountProblem(): Observable<BfResponse<number>> {
    let url = `${this.urlBase}/getquoteerphistoriccountproblem`;
    return this.http.get<BfResponse<number>>(url);
  }

  getQuoteErpHistoricAnalytical(compnayId: number): Observable<QuoteErpHistoricAnalytical[]> {
    const url = `${this.urlBase}/getquoteerphistoricanalytical/${compnayId}`;
    return this.http.get<BfResponse<QuoteErpHistoricAnalytical[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  GetAllQuoteErpHistoricWithoutCodeSac(): Observable<BfResponse<CompanyProblemDto[]>> {
    const url = `${this.urlBase}/getallquoteerphistoricwithoutcodesac`;
    return this.http.get<BfResponse<CompanyProblemDto[]>>(url);
  }

  //CSV
  getDetailCompanyCodeSacCsv(companyCodeSac: number): string | any {
    let url = `${this.urlBase}/getdetailcompanycodesaccsv`;

    this.http.post<BfResponse<string>>(url, { companyCodeSac: companyCodeSac }).subscribe((res) => {
      const binaryString = window.atob(res.data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; ++i) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      var fileURL = URL.createObjectURL(
        new Blob(['\ufeff', bytes], { type: 'text/csv;charset=utf-8;' })
      );

      const element = document.createElement('a');
      element.href = fileURL;
      element.download = `Detail_CompanyCodeSac_${companyCodeSac}_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.csv`;
      document.body.appendChild(element);
      element.click();
      element.remove();
    });
  }
}