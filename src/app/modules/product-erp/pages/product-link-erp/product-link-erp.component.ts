import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ProductErpService } from '@app/service/https/product-erp.service';
import { ProductsService } from '@app/service/https/products.service';
import { ThemeService } from '@app/service/theme.service';
import { FilterProductLinkErp } from '@data/dto/products/product-erp/link/filter-product-link-erp';
import { ProductLinkErpDto } from '@data/dto/products/product-erp/product-link-erp.dto';
import { FilterArgumentComplement } from '@data/util/filter-argument-complement';
import { ModalFilterProductErpComponent } from '@modules/product-erp/component/modal-filter-product-erp/modal-filter-product-erp.component';
import { ModalLinkProductErpComponent } from '@modules/product-erp/component/modal-link-product-erp/modal-link-product-erp.component';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { FormRow } from '@shared/component/form/form';

@Component({
    selector: 'app-product-link-erp',
    templateUrl: './product-link-erp.component.html',
    styleUrls: ['./product-link-erp.component.scss'],
})
export class ProductLinkErpComponent implements OnInit {
    rdoShowResult: string = '1';
    lstProds: ProductLinkErpDto[] = [];

    modelArgument: FilterArgumentComplement = new FilterArgumentComplement();
    argumentForm: FormGroup;
    formArgument: FormRow[] = [];

    lastFilterTag: string = 'last_filter_productlinkerp';
    totalRecords: number = 0;
    pageIndex: number = 0;
    pageSize: number = 300;
    sort: Sort = { active: 'default', direction: 'asc' };
    iconSort: string = 'south';
    showGotoPage: boolean = false;
    listPages$: any[] = [];
    existsSelected: boolean = false;
    showSupplierCodes: boolean = false;
    lastResultErrors: number[] = [];

    filterReq: FilterProductLinkErp;
    modalDialog = new DialogGenericoFuncoes(this.dialog);

    constructor(private dialog: MatDialog,
        private _service: ProductErpService,
        private _prodService: ProductsService,
        private themeService: ThemeService,
        private router: Router
    ) {
        this.getLastFilter();
    }

    ngOnInit(): void {
        this.themeService.setBackRoute(null);
        this.themeService.setTitle('Matches ERP x BuyFirst');

        this.pageIndex = 0;
        this.createFormArgument();
    }

    radioButtonChange($event) {
        this.filterReq.showResult = Number($event.value);
        this.filter();
    }

    onPageEvent(event: PageEvent) {
        this.showGotoPage = false;

        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;

        this.filter();
    }

    onSelectedRow(prod: ProductLinkErpDto) {
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

        this.modelArgument.argument = null;
        this.argumentForm.reset();

        this.filterReq = {
            pageNumber: this.pageIndex + 1,
            pageSize: this.pageSize,
            sort: this.sort,
            productId: null,
            argument: null,
            filter: [],
            showResult: Number(this.rdoShowResult)
        };
        this.filter();
    }

    onRefreshProds() {
        this.filter();
        this.lastResultErrors = [];
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

    onOpenAnalysis(prod: ProductLinkErpDto) {
        const link = window.location.href + `/analise/${prod.productId}`;
        this.router.navigate([]).then(result => { window.open(link); });
    }

    onExportCsv() {
        this._service.getCsv(this.filterReq);
    }

    onExportDetailCsv(productId: number) {
        this._service.GetDetailCsv(productId);
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
                        if (e.selected) return e.productId;
                    }).map(s => s.productId);
                    let sub = this._prodService.deleteAll(ids).subscribe(s => {
                        if (s.succeeded) {
                            if (s.data && s.data.length > 0) {
                                this.lastResultErrors = s.data;
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

    onGroupProducts() {
        if (this.existsSelected) {
            let lstSelecteds: ProductLinkErpDto[] = this.lstProds.filter((p) => p.selected);

            const dialogRef = this.dialog.open(ModalLinkProductErpComponent, {
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
        //Argument
        try {
            this.modelArgument = Object.assign(
                new FilterArgumentComplement(),
                this.argumentForm.getRawValue()
            );
        } catch (e) {
            console.log(e);
        }
        this.filterReq.argument = this.modelArgument.argument;

        if (this.filterReq) {
            this.SaveLastFilter();
        }

        this.filterReq.pageNumber = this.pageIndex + 1;
        this.filterReq.pageSize = this.pageSize;
        this.filterReq.sort = this.sort;

        let sub = this._service
            .getAll(this.filterReq)
            .subscribe((res) => {
                this.lstProds = res.data;
                this.totalRecords = res.totalRecords;
                this.CheckedAction();
                sub.unsubscribe();
            });
    }

    changeSorter(event: Sort) {
        this.pageIndex = 0;

        this.sort = event;
        if (!this.sort.direction) this.sort.direction = 'asc';
        this.filter();
        this.iconSort = this.sort.direction == 'asc' ? 'south' : 'north';
    }

    showModalFilter(column: string) {
        const dialogRef = this.dialog.open(ModalFilterProductErpComponent, {
            data: { column: column, data: this.filterReq }
        });

        dialogRef.afterClosed().subscribe((result: FilterProductLinkErp) => {
            if (result) {
                this.filterReq = result;
                this.changeSorter(result.sort);
            }
        });
    }

    SaveLastFilter() {
        if (this.filterReq) {
            localStorage.setItem(this.lastFilterTag, JSON.stringify(this.filterReq));
        } else {
            localStorage.setItem(
                this.lastFilterTag,
                JSON.stringify({
                    pageNumber: this.pageIndex + 1,
                    pageSize: this.pageSize,
                    sort: this.sort,
                    filter: [],
                    showResult: 3
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
                productId: null,
                argument: null,
                filter: [],
                showResult: 3
            };
            localStorage.setItem(this.lastFilterTag, JSON.stringify(this.filterReq));
        } else {
            this.filterReq = JSON.parse(data);
        }
        this.modelArgument.argument = this.filterReq.argument;
        this.rdoShowResult = this.filterReq.showResult.toString();
    }

    createFormArgument() {
        this.formArgument = [
            {
                fields: [
                    {
                        name: 'argument',
                        label: 'Outros argumentos',
                        placeholder: 'Códigos fornecedor ou referencias',
                        size: 100,
                        value: 'argument',
                    },
                ],
            }
        ];
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
}