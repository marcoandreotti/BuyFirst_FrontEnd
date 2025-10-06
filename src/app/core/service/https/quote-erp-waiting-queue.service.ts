import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { BfResponse } from '@data/schema/response';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QueueTotalsDto } from '@data/dto/queue/queue-totals.dto';
import { UnicQuoteProductWaitingQueueDto } from '@data/dto/queue/quote-product-waiting-queue.dto';
import { QuoteCapture } from '@data/dto/quote/quote-capture.dto';
import { QuoteErpBuyerGroupDto, QuoteErpProductGroupDto } from '@data/dto/quote/quote-erp-buyer-group.dto';

@Injectable()
export class QuoteErpWaitingQueueService {
  constructor(private http: HttpClient) {}

  private urlBase = `${environment.serverUrl}/QuoteErpWaitingQueue`;

  getAll(
    quoteCapture: number | null,
    buyerArgument: string | null,
    argument: string | null,
    initialDate: Date | null,
    endDate: Date | null,
    noMatch: boolean | false,
    pageNumber: number,
    pageSize: number
  ): Observable<BfResponse<QuoteErpProductGroupDto[]>> {
    let url = `${this.urlBase}?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (quoteCapture) {
      url += `&quoteCapture=${quoteCapture}`;
    }

    if (buyerArgument) {
      url += `&buyerArgument=${buyerArgument}`;
    }
    if (argument) {
      url += `&argument=${argument}`;
    }

    if (initialDate) {
      try {
        url += `&InitialDate=${initialDate.toISOString()}`;
      } catch {
        url += `&InitialDate=${initialDate}`;
      }
    }

    if (endDate) {
      try {
        url += `&EndDate=${endDate.toISOString()}`;
      } catch {
        url += `&EndDate=${endDate}`;
      }
    }

    if (noMatch) {
      url += `&noMatch=${noMatch}`;
    }

    return this.http.get<BfResponse<QuoteErpProductGroupDto[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getBuyerGroupErpWaitingQueue(
    quoteCapture: number | null,
    buyerArgument: string | null,
    argument: string | null,
    initialDate: Date | null,
    endDate: Date | null,
    noMatch: boolean | false,
    pageNumber: number,
    pageSize: number
  ): Observable<BfResponse<QuoteErpBuyerGroupDto[]>> {
    let url = `${this.urlBase}/getbuyergrouperpwaitingqueue?pageNumber=${pageNumber}&pageSize=${pageSize}`;

    if (quoteCapture) {
      url += `&quoteCapture=${quoteCapture}`;
    }

    if (buyerArgument) {
      url += `&buyerArgument=${buyerArgument}`;
    }
    if (argument) {
      url += `&argument=${argument}`;
    }

    if (initialDate) {
      try {
        url += `&InitialDate=${initialDate.toISOString()}`;
      } catch {
        url += `&InitialDate=${initialDate}`;
      }
    }

    if (endDate) {
      try {
        url += `&EndDate=${endDate.toISOString()}`;
      } catch {
        url += `&EndDate=${endDate}`;
      }
    }

    if (noMatch) {
      url += `&noMatch=${noMatch}`;
    }

    return this.http.get<BfResponse<QuoteErpBuyerGroupDto[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getUnicQuoteWaitingQueue(
    id: number
  ): Observable<BfResponse<UnicQuoteProductWaitingQueueDto>> {
    let url = `${this.urlBase}/getunicquotewaitingqueue?quoteProductWaitingQueueId=${id}`;

    return this.http.get<BfResponse<UnicQuoteProductWaitingQueueDto>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getQueueTotals(): Observable<BfResponse<QueueTotalsDto[]>> {
    let url = `${this.urlBase}/getqueuetotals/10`;

    return this.http.get<BfResponse<QueueTotalsDto[]>>(url).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getCsv(
    quoteCapture: number | null,
    buyerArgument: string | null,
    argument: string | null,
    initialDate: Date | null,
    endDate: Date | null
  ): string | any {
    let url = `${this.urlBase}/getcsv`;

    if (initialDate) {
      try {
        url += `?InitialDate=${initialDate.toISOString()}`;
      } catch {
        url += `?InitialDate=${initialDate}`;
      }
    }

    if (endDate) {
      try {
        url += `&EndDate=${endDate.toISOString()}`;
      } catch {
        url += `&EndDate=${endDate}`;
      }
    }

    if (quoteCapture) {
      url += `&quoteCapture=${quoteCapture}`;
    }

    if (buyerArgument) {
      url += `&buyerArgument=${buyerArgument}`;
    }
    if (argument) {
      url += `&argument=${argument}`;
    }

    this.http.get<BfResponse<string>>(url).subscribe((res) => {
      const binaryString = window.atob(res.data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; ++i) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      var fileURL = URL.createObjectURL(
        new Blob(['\ufeff', bytes], { type: 'text/csv;charset=utf-8;' })
      );
      // window.open(fileURL, '_self');

      const element = document.createElement('a');
      element.href = fileURL;
      element.download = `AtendimentoCotacao_${new Date().toLocaleDateString()}_${new Date().toLocaleTimeString()}.csv`;
      document.body.appendChild(element);
      element.click();
      element.remove();
    });
  }

  getQuoteCaptureSelectAll(): Observable<QuoteCapture[]> {
    let url = `${this.urlBase}/getquotecaptureenum`;

    return this.http.get<BfResponse<QuoteCapture[]>>(url).pipe(
      map((response) => {
        return response.data;
      })
    );
  }
}
