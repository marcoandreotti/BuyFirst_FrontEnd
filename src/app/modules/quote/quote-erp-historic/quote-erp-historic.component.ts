import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ThemeService } from '@app/service/theme.service';
import { FormRow } from '@shared/component/form/form';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormGroup } from '@angular/forms';
import { QuoteErpHistoricService } from '@app/service/https/quote-erp-historic.service';
import { QuoteErpHistoricDto } from '@data/dto/quote/quote-erp-historic.dto';
import { Sort } from '@angular/material/sort';
import { FilterQuoteErpHistoricDto } from '@data/dto/quote/erp/filter-quote-erp-historic.dto';
import { ProductsService } from '@app/service/https/products.service';
import { FilterQuoteErpModel } from '@data/dto/quote/erp/filter-quote-erp-model';
import { ModalFilterQuoteErpComponent } from '../component/modal-filter-quote-erp/modal-filter-quote-erp.component';
import { ModalLinkQuoteErpComponent } from '../component/modal-link-quote-erp/modal-link-quote-erp.component';

@Component({
    selector: 'app-quote-erp-historic',
    templateUrl: './quote-erp-historic.component.html',
    styleUrls: ['./quote-erp-historic.component.scss'],
    providers: [DatePipe],
})
export class QuoteErpHistoricComponent implements OnInit {
    lstProds: QuoteErpHistoricDto[] = [];
    rdoShowResult: string = '1';

    lastFilterTag: string = 'last_filter_quote_erp_historic';
    totalRecords: number = 0;
    pageIndex: number = 0;
    pageSize: number = 300;
    sort: Sort = { active: 'default', direction: 'asc' };
    iconSort: string = 'south';
    showGotoPage: boolean = false;
    listPages$: any[] = [];
    existsSelected: boolean = false;

    modelSerarch: FilterQuoteErpModel = new FilterQuoteErpModel();
    searchForm: FormGroup;
    formSearch: FormRow[] = [];

    filterReq: FilterQuoteErpHistoricDto;
    modalDialog = new DialogGenericoFuncoes(this.dialog);

    constructor(private dialog: MatDialog,
        private themeService: ThemeService,
        private _service: QuoteErpHistoricService,
        private _productService: ProductsService,
        private route: ActivatedRoute,
        private router: Router) {
        this.getLastFilter();
        this.createFormSerach();
    }

    ngOnInit(): void {
        this.themeService.setBackRoute(null);
        this.themeService.setTitle('Cotações diárias');

        this.pageIndex = 0;
        this.filter();
    }

    radioButtonChange($event) {
        this.rdoShowResult = $event.value;
    }

    onPageEvent(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;

        this.filter();
    }

    onSelectedRow(prod: QuoteErpHistoricDto) {
        prod.selected = !prod.selected;
        this.CheckedAction();
    }

    onSelectAll() {
        this.lstProds.forEach((e) => {
            e.selected = true;
        });
        this.existsSelected = true;
    }

    onClearAll() {
        this.pageIndex = 0;

        this.filterReq = {
            pageNumber: this.pageIndex + 1,
            pageSize: this.pageSize,
            sort: this.sort,
            startDate: this.modelSerarch.startDate,
            endDate: this.modelSerarch.endDate,
            companyCodeSac: null,
            productErpCode: null,
            productId: null,
            productArguments: [],
            buyerArguments: [],

        };
        this.filter();
    }

    onRefreshProds() {
        this.filter();
    }

    onSort(active: string) {
        if (this.sort.active == active) {
            this.sort.direction = this.sort.direction == 'asc' ? 'desc' : 'asc';
        } else {
            this.sort.active = active;
            this.sort.direction = 'asc';
        }

        this.changeSorter(this.sort);
    }

    onAscendant(active: string) {
        if (this.sort.active != active || this.sort.direction != 'asc') {
            this.sort.active = active;
            this.sort.direction = 'asc';
            this.changeSorter(this.sort);
        }
    }

    onDescendant(active: string) {
        if (this.sort.active != active || this.sort.direction != 'desc') {
            this.sort.active = active;
            this.sort.direction = 'desc';
            this.changeSorter(this.sort);
        }
    }

    onClickShowGotoPage() {
        this.showGotoPage = true;
        var totalRegister = this.pageSize;

        let lstPages: any[] = [];
        var arrayLength = Number((this.totalRecords / totalRegister).toPrecision(1));
        let indexOff: number = 1;
        for (let index = 1; index < arrayLength; index++) {
            lstPages.push({ id: index - 1, description: `${indexOff} - ${index * totalRegister}` });
            indexOff += totalRegister;
        }

        this.listPages$ = lstPages;
    }

    onUpdateManualPage($event) {
        this.pageIndex = $event;
        this.onPageEvent({
            previousPageIndex: $event - 1,
            pageIndex: $event,
            pageSize: this.pageSize,
            length: this.totalRecords,
        });
    }

    onOpenAnalysis(prod: QuoteErpHistoricDto) {
        const link = window.location.href.replace('cotacao/erp', 'matcherp') + `/analise/${prod.productId}`;
        this.router.navigate([]).then(result => { window.open(link); });
    }

    onOpenAnalysisGroup(companyCodeSac: number) {
        const link = window.location.href.replace('cotacao/erp', `compradores/analise/${companyCodeSac}`);
        this.router.navigate([]).then(result => { window.open(link); });
    }

    onActive(row) {
        let sub = this._productService
            .activeInactive(row.productId)
            .subscribe((result) => {
                if (result.succeeded) {
                    this.mensagemSucesso_Active(!row.active);
                    row.active = !row.active;
                    sub.unsubscribe();
                } else {
                    console.log(result.message);
                }
            });
    }

    onRemoveItems() {
        let modal = this.modalDialog.apresentaAvisoObs(
            'Cuidado!',
            'Tem certeza que deseja excluir definitivamente?',
            'Serão removidos os produtos e os matches com os compradores, caso não houver relacionamentos com outras operações da aplicação!',
            true,
            true,
            () => {
                modal.close();
            },
            () => {
                if (this.existsSelected) {
                    let ids: number[] = this.lstProds.filter(function (e) {
                        if (e.selected && e.productId > 0) return e.productId;
                    }).map(s => s.productId);
                    let sub = this._productService.deleteAll(ids).subscribe(s => {
                        if (s.succeeded) {
                            if (s.data && s.data.length > 0) {
                                this.filter();
                                this.mensagemSucesso_Excluir_ex();
                            } else {
                                this.mensagemSucesso_Excluir();
                            }
                        } else {
                            this.modalDialog.apresentaErro('Erro', s.message);
                        }
                        sub.unsubscribe();
                    })
                    modal.close();
                } else {
                    modal.close();
                    this.modalDialog.apresentaErro('Erro', 'Não há item(ns) selecionado(s)!');
                }
            },
            'NÃO',
            'SIM'
        );
    }

    onExportCsv() {
        this._service.getCsv(this.filterReq);
    }

    onExportAnalysisCsv(){
        this._service.getAnalysisCsv(this.filterReq);
    }

    onGroupProducts() {
        if (this.existsSelected) {
            let lstSelecteds: QuoteErpHistoricDto[] = this.lstProds.filter((p) => p.selected).map((x) => {
                return {
                    externalApplicationId: x.externalApplicationId,
                    companyCodeSac: x.companyCodeSac,
                    productErpCode: x.productErpCode,
                    productName: x.productName,
                    unitOfMeasureAcronym: x.unitOfMeasureAcronym,
                    productId: x.productId,
                    averageQuantity: x.averageQuantity,
                    averagePrice: x.averagePrice,
                    quantitySend: x.quantitySend,
                    quantityBuyer: x.quantityBuyer,
                    quantityQuote: x.quantityQuote,
                    quantitySupplier: x.quantitySupplier,
                    quantityCatalog: x.quantityCatalog,
                    foundOrder: x.foundOrder,
                    foundRegion: x.foundRegion,
                    selected: x.selected,
                    matchError: false
                };
            });

            const dialogRef = this.dialog.open(ModalLinkQuoteErpComponent, {
                data: lstSelecteds
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                    this.mensagemSucesso_Match();
                }
            });
        }
    }

    filter() {
        if (this.searchForm && !this.searchForm.valid) {
            this.searchForm.markAsPending();
            this.modalDialog.apresentaErro('Erro', 'Preencha o período');
        } else {
            try {
                if (this.searchForm != undefined) {
                    Object.assign(
                        this.modelSerarch,
                        this.searchForm.getRawValue()
                    );
                }
            } catch (e) {
                console.log(e);
            }
            this.filterReq.startDate = this.modelSerarch.startDate;
            this.filterReq.endDate = this.modelSerarch.endDate;

            this.filterReq.pageNumber = this.pageIndex + 1;
            this.filterReq.pageSize = this.pageSize;
            this.filterReq.sort = this.sort;

            if (this.filterReq) {
                this.SaveLastFilter();
            }

            let sub = this._service
                .getAll(this.filterReq)
                .subscribe((res) => {
                    this.lstProds = res.data;
                    this.totalRecords = res.totalRecords;
                    this.CheckedAction();
                    sub.unsubscribe();
                });
        }
    }

    changeSorter(event: Sort) {
        this.pageIndex = 0;

        this.sort = event;
        if (!this.sort.direction) this.sort.direction = 'asc';
        this.filter();
        this.iconSort = this.sort.direction == 'asc' ? 'south' : 'north';
    }

    SaveLastFilter() {
        localStorage.setItem(this.lastFilterTag, JSON.stringify(null));

        if (this.filterReq) {
            localStorage.setItem(this.lastFilterTag, JSON.stringify(this.filterReq));
        } else {
            localStorage.setItem(
                this.lastFilterTag,
                JSON.stringify({
                    pageNumber: this.pageIndex + 1,
                    pageSize: this.pageSize,
                    sort: this.sort,
                    startDate: null,
                    endDate: null,
                    companyCodeSac: null,
                    productErpCode: null,
                    productId: null,
                    productArguments: [],
                    buyerArguments: []
                })
            );
        }
    }

    getLastFilter() {
        var data = localStorage.getItem(this.lastFilterTag);

        if (data == null || data == 'undefined') {
            this.filterReq = {
                pageNumber: this.pageIndex + 1,
                pageSize: this.pageSize,
                sort: this.sort,
                startDate: null,
                endDate: null,
                companyCodeSac: null,
                productErpCode: null,
                productId: null,
                productArguments: [],
                buyerArguments: []
            };
            localStorage.setItem(this.lastFilterTag, JSON.stringify(this.filterReq));
        } else {
            this.filterReq = JSON.parse(data);
        }

        this.sort = this.filterReq.sort;

        this.modelSerarch.startDate = this.filterReq.startDate;
        this.modelSerarch.endDate = this.filterReq.endDate;
    }

    createFormSerach() {
        this.formSearch = [
            {
                fields: [
                    {
                        name: 'startDate',
                        label: 'Data inicial',
                        placeholder: 'Data inicial',
                        size: 50,
                        value: 'startDate',
                        required: true,
                        date: true,
                        useRemove: true,
                    },
                    {
                        name: 'endDate',
                        label: 'Data final',
                        placeholder: 'Data final',
                        size: 50,
                        value: 'endDate',
                        required: true,
                        date: true,
                    },
                ],
            }
        ];
    }

    showModalFilter(column: string) {
        const dialogRef = this.dialog.open(ModalFilterQuoteErpComponent, {
            data: { column: column, data: this.filterReq }
        });

        dialogRef.afterClosed().subscribe((result: FilterQuoteErpHistoricDto) => {
            if (result) {
                this.filterReq = result;
                this.changeSorter(result.sort);
            }
        });
    }

    //AUX
    CheckedAction() {
        this.existsSelected = this.lstProds.some(function (p) {
            return p.selected === true;
        });
    }

    clearSelected() {
        this.lstProds.filter((e) => e.selected).forEach((p) => {
            p.selected = false;
        });
    }

    mensagemSucesso_Active(active: boolean) {
        const text = active ? 'ativo' : 'inativo';

        this.modalDialog.apresentaSucesso(
            'Sucesso',
            `Produto ${text} com sucesso!`,
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

    mensagemSucesso_Excluir() {
        this.modalDialog.apresentaSucesso(
            'Sucesso',
            `Foram excluidos itens!`,
            false,
            true,
            null,
            () => {
                this.modalDialog.dialog.closeAll();
                this.filter();
            },
            null,
            'CONTINUAR'
        );
    }

    mensagemSucesso_Excluir_ex() {
        this.modalDialog.apresentaAvisoObs(
            'Acho que apagou!?',
            'Há registros com relacionamentos em outras operações na aplicação',
            'Os itens sem relacionamentos, foram excluidos com sucesso!',
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

    mensagemSucesso_Match() {
        this.modalDialog.apresentaSucesso(
            'Sucesso',
            `Match criado com sucesso!`,
            false,
            true,
            null,
            () => {
                this.modalDialog.dialog.closeAll();
                this.filter();
            },
            null,
            'CONTINUAR'
        );
    }

}
