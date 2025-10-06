import { Component, OnInit } from '@angular/core';
import { ThemeService } from '@app/service/theme.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CompanyService } from '@app/service/https/company.service';
import { CompanyCodeSacDto, CompanyErpDto } from '@data/dto/companies/erp/company-code-sac.dto';
import { QuoteErpHistoricAnalytical } from '@data/dto/quote/quote-erp-historic-analytical.dto';
import { QuoteErpHistoricService } from '@app/service/https/quote-erp-historic.service';

@Component({
    selector: 'app-company-code-sac',
    templateUrl: './company-code-sac.component.html',
    styleUrls: ['./company-code-sac.component.scss'],
    providers: [DatePipe],
})
export class CompanyCodeSacComponent implements OnInit {
    model: CompanyCodeSacDto = null;
    modelCompany: CompanyErpDto = null;

    lstProds: QuoteErpHistoricAnalytical[] = [];

    companyCodeSac: number = null;
    showQuotesOnly: boolean = false;
    showQuoteProdsOnly: boolean = false;
    loading: boolean = false;

    constructor(private dialog: MatDialog,
        private themeService: ThemeService,
        private _service: CompanyService,
        private _quoteHistoricservice: QuoteErpHistoricService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit(): void {
        this.themeService.setBackRoute(null);

        this.route.paramMap.subscribe((params) => {
            this.companyCodeSac = +params.get('id');
            if (this.companyCodeSac > 0) {
                this.themeService.setTitle(`Detalhe do grupo ${this.companyCodeSac}`);
                let sub = this._service.getAllCompaniesByCodeSac(this.companyCodeSac).subscribe((result) => {
                    this.model = result;
                    sub.unsubscribe();
                });
            }
        });
    }

    onShowQuotesOnly() {
        this.showQuotesOnly = !this.showQuotesOnly;
    }

    onShowQuoteProdsOnly() {
        this.showQuoteProdsOnly = !this.showQuoteProdsOnly;
    }

    onExpandedCompany(comp: CompanyErpDto) {
        this.modelCompany = comp;

        this.loading = true;
        let sub = this._quoteHistoricservice.getQuoteErpHistoricAnalytical(comp.companyId).subscribe((result) => {
            this.lstProds = result;
            sub.unsubscribe();
            this.loading = false;
        });
    }

    onContractCompany() {
        this.modelCompany = null;
    }

    onOpenAnalysis(productId: number): string {
        return window.location.href.substring(0, window.location.href.indexOf('#')) + `#/matcherp/analise/${productId}`;
    }

    onExportCsv() {
        this._quoteHistoricservice.getDetailCompanyCodeSacCsv(this.companyCodeSac);
    }
}