import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '@app/service/theme.service';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Login } from '@data/schema/login/login';
import { PageEvent } from '@angular/material/paginator';
import { QuoteSolicitationDto } from '@data/dto/quote/quote-sol/quote-solicitation.dto';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { FormRow } from '@shared/component/form/form';
import { QuoteSolicitationService } from '@app/service/https/quote-solicitation.service';
import { CompanyService } from '@app/service/https/company.service';
import { CompanyDto } from '@data/dto/companies/compnay.dto';
import { BfResponse } from '@data/schema/response';
import { SelectedEnumDto } from '@data/dto/quote/select-enum.dto';

@Component({
    selector: 'app-quote-solicitations',
    templateUrl: './quote-solicitations.component.html',
    styleUrls: ['./quote-solicitations.component.scss'],
})

export class QuoteSolicitationsComponent implements OnInit {
    auth: Login;
    solicitations$: BfResponse<QuoteSolicitationDto[]>;

    cols: GridColumn[] = [];
    displayedColumns: String[] = [];
    filters: FormRow[];
    lastFilter: any;
    modelIdentity: string = 'quoteSolId';
    companyId: number;
    lastFilterTag: string = 'last_filter_solicitations';
    pageIndex: number = 0;
    pageSize: number = 25;
    sort: Sort = { active: 'expectedDate', direction: 'desc' };
    topMenus: GridItemMenu[] = [];
    itemMenus: GridItemMenu[] = [];

    modalDialog = new DialogGenericoFuncoes(this.dialog);

    constructor(
        private _auth: AuthService,
        private dialog: MatDialog,
        private themeService: ThemeService,
        private _service: QuoteSolicitationService,
        private _companyService: CompanyService,
        private router: Router
    ) {
        this.auth = this._auth.getState();
        this.lastFilter = this.getLastFilter();
    }

    ngOnInit(): void {
        this.themeService.setBackRoute(null);
        this.themeService.setTitle('Solicitações de cotações');

        this.prepareGrid();
        this.PrepareTopMenus();
        this.PrepareFilters();

        this.filter(this.lastFilter);
    }

    onPageEvent(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;

        this.filter(this.lastFilter);
    }

    onFilter(event) {
        this.pageIndex = 0;

        this.filter(event);
    }

    filter(event) {
        if (event) {
            this.SaveLastFilter(event);
            this.lastFilter = event;
        } else {
            event = this.lastFilter;
        }

        var quoteSolSituations: number[] = null;
        if (event?.quoteSolSituations > 0) {
            quoteSolSituations = [];
            quoteSolSituations.push(event.quoteSolSituations);
        }

        let sub = this._service
            .getAll(
                event?.startDate ?? null,
                event?.endDate ?? null,
                event?.companyId ?? null,
                quoteSolSituations,
                true,
                event?.argument ?? null,
                this.pageIndex + 1,
                this.pageSize,
                this.sort
            )
            .subscribe((res) => {
                this.solicitations$ = res;
                sub.unsubscribe();
            });
    }

    changeSorter(event: Sort) {
        this.pageIndex = 0;

        this.sort = event;
        if (!this.sort.direction) this.sort.direction = 'asc';
        this.filter(this.lastFilter);
    }

    SaveLastFilter(filter: any) {
        if (filter) {
            localStorage.setItem(this.lastFilterTag, JSON.stringify(filter));
        } else {
            localStorage.setItem(
                this.lastFilterTag,
                JSON.stringify({
                    startDate: null,
                    endDate: null,
                    buyerId: this.companyId,
                    quoteSolSituations: null,
                    argument: null,
                    openingDate: true,
                    pageNumber: this.pageIndex + 1,
                    pageSize: this.pageSize,
                    sort: this.sort,
                })
            );
        }
    }

    getLastFilter() {
        var data = localStorage.getItem(this.lastFilterTag);

        if (data == null || data == 'undefined') {
            var filter = {
                startDate: null,
                endDate: null,
                buyerId: this.companyId,
                quoteSolSituations: null,
                argument: null,
                openingDate: true,
                pageNumber: this.pageIndex + 1,
                pageSize: this.pageSize,
                sort: this.sort,
            };
            localStorage.setItem(this.lastFilterTag, JSON.stringify(filter));

            return filter;
        } else {
            return JSON.parse(data);
        }
    }

    prepareGrid() {
        this.displayedColumns = ['quoteSolId', 'openingDate', 'expectedDate', 'buyerDocument', 'buyerName', 'phaseDescription', 'quantityProducts', 'quantityProductsRetry'];

        this.cols = [
            { name: 'quoteSolId', title: 'Nro', showSort: true, show: true },
            { name: 'openingDate', title: 'Data', date: true, hour: false, showSort: true, show: true },
            { name: 'expectedDate', title: 'Finaliza em', date: true, showSort: true, show: true },
            { name: 'buyerDocument', title: 'CNPJ', showSort: true, show: true },
            { name: 'buyerName', title: 'Empresa', showSort: true, show: true },
            { name: 'phaseDescription', title: 'Situação', showSort: true, show: true },
            { name: 'quantityProducts', title: 'Produtos', decimal: true, decimalPrecision: 0, showSort: true, show: true },
            { name: 'quantityProductsRetry', title: 'Retornos', decimal: true, decimalPrecision: 0, showSort: true, show: true }
        ];

        this.itemMenus = [
            {
                name: 'Exibir',
                icon: 'visibility',
                action: (row: QuoteSolicitationDto) => {
                    if (row.phase <= 10) {
                        this.router.navigate([this.router.url + `/solicitacao/${row.quoteSolId}`]);
                    } else if (row.phase > 10 && row.phase <= 40) {
                        this.router.navigate([this.router.url + `/cotacao/${row.quoteSolId}`]);
                    } else if (row.phase == 50) {
                        this.modalDialog.apresentaAviso('Aviso', 'Enconstrução... ***Pedido***');
                    } else {
                        this.modalDialog.apresentaAviso('Aviso', 'Enconstrução... ***Canceladas***');
                    }
                },
            },
            {
                name: 'Cancelar',
                icon: 'cancel',
                action: (row: QuoteSolicitationDto) => {
                    this.modalDialog.apresentaAviso(
                        'Cancelar',
                        'Tem certeza que deseja cancelar?',
                        true,
                        true,
                        () => {
                            this.modalDialog.dialog.closeAll();
                        },
                        () => {
                            this.modalDialog.dialog.closeAll();
                            if (row.phase > 40) {

                            } else {
                                let sub = this._service
                                    .delete(row.quoteSolId)
                                    .subscribe((result) => {
                                        if (result.succeeded) {
                                            this.mensagemSucesso_Delete();
                                            sub.unsubscribe();
                                            this.filter(this.lastFilter);
                                        } else {
                                            console.log(result.message);
                                        }
                                    });
                            }
                        },
                        'NÃO',
                        'SIM'
                    );
                },
            },
        ];
    }

    PrepareFilters() {
        this.filters = [{
            fields: [],
            submit: true,
            submitText: 'FILTRAR',
            size: 10
        }];

        if (this.auth.isBuyFirst || this.auth.companiesSelected.length > 1) {
            this.filters[0].fields.push({
                name: 'companyId',
                label: 'Empresa',
                placeholder: 'Empresa',
                size: 40,
                value: 'companyId',
                select: true,
                selectName: 'name',
                useSearch: true,
                required: false,
                useRemove: true,
                list: this._companyService.getListCompany(true),
                options: [{ name: 'name', search: true, text: true }],
                onChange: (value: CompanyDto) => {
                    if (value) {
                        this.companyId = value.companyId;
                    } else {
                        this.companyId = this.auth.companyId;
                    }
                },
            });
        }

        this.filters[0].fields = [...this.filters[0].fields.concat({
            name: 'argument',
            label: 'Argumento',
            placeholder: 'Argumento',
            size: (this.auth.isBuyFirst || this.auth.companiesSelected.length > 1) ? 30 : 70,
            value: 'argument',
        },
        {
            name: 'quoteSolSituations',
            label: 'Situação',
            placeholder: 'Situação',
            size: 22,
            value: 'id',
            select: true,
            selectName: 'name',
            useSearch: true,
            required: true,
            useRemove: true,
            list: this._service.getSituations(),
            options: [{ name: 'name', search: true, text: true }],
            onChange: (value: SelectedEnumDto) => {
            //   if (value) {
            //     this.productType = value.id;
            //   } else {
            //     this.productType = 0;
            //   }
            }
          },
          {
                name: 'startDate',
                label: 'Data inicial',
                placeholder: 'Data inicial',
                size: 15,
                value: 'startDate',
                date: true,
                useRemove: true,
            },
            {
                name: 'endDate',
                label: 'Data final',
                placeholder: 'Data final',
                size: 15,
                value: 'endDate',
                date: true,
                useRemove: true,
            })];
    }

    PrepareTopMenus() {
        if (!this.auth.isBuyFirst) {
            this.topMenus = [
                {
                    name: 'Nova solicitação',
                    icon: 'add',
                    action: (_onclick) => {
                        this.router.navigate([this.router.url + '/solicitacao']);
                    },
                }
            ];
        } else {
            this.topMenus = [];
        }
    }

    mensagemSucesso_Delete() {
        this.modalDialog.apresentaSucesso(
            'Sucesso',
            `Solicitação excluida com sucesso!`,
            false,
            true,
            null,
            () => {
                this.modalDialog.dialog.closeAll();
            },
            null,
            'CONTINUAR'
        );
    }

}