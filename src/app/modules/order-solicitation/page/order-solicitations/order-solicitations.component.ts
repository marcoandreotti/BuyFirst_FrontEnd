import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '@app/service/theme.service';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Login } from '@data/schema/login/login';
import { PageEvent } from '@angular/material/paginator';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { FormRow } from '@shared/component/form/form';
import { OrderSolicitationService } from '@app/service/https/order-solicitation.service';
import { CompanyService } from '@app/service/https/company.service';
import { CompanyDto } from '@data/dto/companies/compnay.dto';
import { BfResponse } from '@data/schema/response';
import { OrderSolicitationDto } from '@data/dto/order/order-sol/order-solicitation.dto';
import { ModalOrderSolComponent } from '@modules/order-solicitation/component/modal-order-sol/modal-order-sol.component';

@Component({
    selector: 'app-order-solicitations',
    templateUrl: './order-solicitations.component.html',
    styleUrls: ['./order-solicitations.component.scss'],
})

export class OrderSolicitationsComponent implements OnInit {
    auth: Login;
    solicitations$: BfResponse<OrderSolicitationDto[]>;

    cols: GridColumn[] = [];
    displayedColumns: String[] = [];
    filters: FormRow[];
    lastFilter: any;
    modelIdentity: string = 'orderSolId';
    companyId: number;
    lastFilterTag: string = 'last_filter_solicitations';
    pageIndex: number = 0;
    pageSize: number = 25;
    sort: Sort = { active: 'expectedDate', direction: 'desc' };
    itemMenus: GridItemMenu[] = [];

    modalDialog = new DialogGenericoFuncoes(this.dialog);

    constructor(
        private _auth: AuthService,
        private dialog: MatDialog,
        private themeService: ThemeService,
        private _service: OrderSolicitationService,
        private _companyService: CompanyService,
        private router: Router
    ) {
        this.auth = this._auth.getState();
        this.lastFilter = this.getLastFilter();
    }

    ngOnInit(): void {
        this.themeService.setBackRoute(null);
        this.themeService.setTitle('Pedidos/Solicitações');

        this.prepareGrid();
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

        let sub = this._service
            .getAll(
                event?.startDate ?? null,
                event?.endDate ?? null,
                event?.companyId ?? null,
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
                    argument: null,
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
                argument: null,
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
        this.displayedColumns = ['orderSolId', 'openingDate', 'supplierDocument', 'supplierName', 'phaseDescription', 'quantityProducts', 'amount'];

        this.cols = [
            { name: 'orderSolId', title: 'Nro', showSort: true, show: true },
            { name: 'openingDate', title: 'Data', date: true, hour: false, showSort: true, show: true },
            { name: 'supplierDocument', title: 'CNPJ', showSort: true, show: true },
            { name: 'supplierName', title: 'Fornecedor', showSort: true, show: true },
            { name: 'phaseDescription', title: 'Situação', showSort: true, show: true },
            { name: 'quantityProducts', title: 'Produtos', decimal: true, decimalPrecision: 0, showSort: true, show: true },
            { name: 'amount', title: 'ValorTotal', decimal: true, decimalPrecision: 2, showSort: true, show: true }
        ];

        this.itemMenus = [
            {
                name: 'Exibir',
                icon: 'visibility',
                action: (row: OrderSolicitationDto) => {
                    const dialogRef = this.dialog.open(ModalOrderSolComponent, {
                        data: row.orderSolId,
                    });
            
                    dialogRef.afterClosed().subscribe((result) => {
                        if (result) { }
                    });
                },
            },
            {
                name: 'Confirmar Entrega',
                icon: 'local_shipping',
                action: (row: OrderSolicitationDto) => {
                    if (row.phase == 40 || row.phase >= 99) {
                        this.modalDialog.apresentaAviso('Aviso', `Ação não atendida, pedido ${row.phaseDescription}`);
                        return;
                    }
                    this.modalDialog.apresentaAviso(
                        'Confirma',
                        'Tem certeza que deseja confirmar a entrega?',
                        true,
                        true,
                        () => {
                            this.modalDialog.dialog.closeAll();
                        },
                        () => {
                            this.modalDialog.dialog.closeAll();
                            let sub = this._service
                                .confirmeddelivery(row.orderSolId)
                                .subscribe((result) => {
                                    if (result.succeeded) {
                                        this.mensagemSucesso_ConfirmedDelivery();
                                        sub.unsubscribe();
                                        this.filter(this.lastFilter);
                                    } else {
                                        console.log(result.message);
                                    }
                                });
                        },
                        'NÃO',
                        'SIM'
                    );
                },
            },
            {
                name: 'Cancelar',
                icon: 'cancel',
                action: (row: OrderSolicitationDto) => {
                    if (row.phase == 40 || row.phase >= 99) {
                        this.modalDialog.apresentaAviso('Aviso', `Ação não atendida, pedido ${row.phaseDescription}`);
                        return;
                    }
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
                            let sub = this._service
                                .delete(row.orderSolId)
                                .subscribe((result) => {
                                    if (result.succeeded) {
                                        this.mensagemSucesso_Delete();
                                        sub.unsubscribe();
                                        this.filter(this.lastFilter);
                                    } else {
                                        console.log(result.message);
                                    }
                                });
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

    mensagemSucesso_ConfirmedDelivery() {
        this.modalDialog.apresentaSucesso(
            'Sucesso',
            `Entrega do pedido confirmada com sucesso!`,
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