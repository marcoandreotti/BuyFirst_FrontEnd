import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ThemeService } from '@app/service/theme.service';
import { Login } from '@data/schema/login/login';
import { QuoteSolicitationService } from '@app/service/https/quote-solicitation.service';
import { QuoteSolDto } from '@data/dto/quote/quote-sol/quote-sol.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { QuoteSolProductDto } from '@data/dto/quote/quote-sol/quote-sol-product.dto';
import { QuoteSolProductRetryDto } from '@data/dto/quote/quote-sol/quote-sol-product-retry.dto';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { ModalSolOrderSummaryComponent } from '@modules/solicitation/component/modal-quote-sol-order-summary/modal-quote-sol-order-summary.component';
import { ModalQuoteSolPhaseComponent } from '@modules/solicitation/component/modal-quote-sool-phase-note/modal-quote-sool-phase-note.component';

@Component({
    selector: 'app-quote-solicitation-retry',
    templateUrl: './quote-solicitation-retry.component.html',
    styleUrls: ['./quote-solicitation-retry.component.scss'],
})

export class QuoteSolicitationRetryComponent implements OnInit {
    auth: Login;
    model: QuoteSolDto;
    editId: number = null;
    date: Date = new Date();
    isLoading: boolean = false;
    showActives: boolean = false;
    isEditing: boolean = false;

    productRetries: QuoteSolProductRetryDto[] = [];
    quoteSolProductSelected: number = 0;

    concatDeliveryAddres: string = "";
    modalDialog = new DialogGenericoFuncoes(this.dialog);

    constructor(
        private _auth: AuthService,
        private dialog: MatDialog,
        private themeService: ThemeService,
        private router: Router,
        private route: ActivatedRoute,
        private _service: QuoteSolicitationService
    ) {
        this.auth = this._auth.getState();
    }

    ngOnInit(): void {
        this.themeService.setBackRoute('solicitacoes');
        this.themeService.setTitle('Resultado Solicitações');

        this.route.paramMap.subscribe((params) => {
            this.editId = +params.get('id');
            let sub = this._service.consultingquotesolicitation(this.editId).subscribe((result) => {
                if (result.succeeded) {
                    this.model = result.data
                    const ad = this.model.deliveryAddress;
                    this.concatDeliveryAddres = `${ad.zipCode} - ${ad.location}/${ad.stateAcronym} - ${ad.street} ${ad.number ? ', ' + ad.number : ''}`;
                } else {

                }
                sub.unsubscribe();
            });
        });
    }

    onShowRetry(prod: QuoteSolProductDto) {
        prod.showProductRetries = !prod.showProductRetries;
        prod.showDeliveryAddresses = false;
    }

    onShowDeliveryAddresses(prod: QuoteSolProductDto) {
        prod.showDeliveryAddresses = !prod.showDeliveryAddresses;
        prod.showProductRetries = false;
    }

    onFirstRetry(prod: QuoteSolProductDto, ret: QuoteSolProductRetryDto) {
        this.getImputNote().then(e => {
            if (!e) {
                this.modalDialog.apresentaErro('Ação inválida', 'Preencha o motivo');
            } else {
                let newLst: QuoteSolProductRetryDto[] = [];
                var rate = prod.productRetries.length;
                ret.rate = rate;
                ret.winner = true;
                ret.phaseNote = e;
                newLst.push(ret);
                prod.productRetries.forEach((e) => {
                    rate--;
                    if (e.quoteSolProductRetryId != ret.quoteSolProductRetryId) {
                        e.winner = false;
                        e.rate = rate;
                        newLst.push(e);
                    }
                });
                prod.productRetries = newLst;
                this.isEditing = true;
            }
        });
    }

    onProdInactive(prod: QuoteSolProductDto) {
        console.log(prod);
        this.getImputNote().then((e: string) => {
            if (!e) {
                this.modalDialog.apresentaErro('Ação inválida', 'Preencha o motivo');
            } else {
                prod.phaseNote = e;
                prod.phase = 99;
                this.isEditing = true;
            }
        });
    }

    onProdActive(prod: QuoteSolProductDto) {
        this.getImputNote().then((e: string) => {
            if (!e) {
                this.modalDialog.apresentaErro('Ação inválida', 'Preencha o motivo');
            } else {
                prod.phaseNote = e;
                prod.phase = 20;
                this.isEditing = true;
            }
        });
    }

    onInactive(prod: QuoteSolProductDto, ret: QuoteSolProductRetryDto) {
        this.getImputNote().then((e: string) => {
            if (!e) {
                this.modalDialog.apresentaErro('Ação inválida', 'Preencha o motivo');
            } else {
                let newLst: QuoteSolProductRetryDto[] = [];
                var rate = prod.productRetries.length;
                let idx: number = 0;

                prod.productRetries.forEach((e) => {
                    if (e.quoteSolProductRetryId == ret.quoteSolProductRetryId) {
                        ret.winner = false;
                        ret.phase = 99;
                        ret.rate = 0;
                    } else {
                        e.winner = e.phase < 99 && idx == 0;
                        e.rate = rate;
                        newLst.push(e);
                        idx++;
                    }
                    rate--;
                });

                newLst.push(ret);
                prod.productRetries = newLst;
                this.isEditing = true;
                ret.phaseNote = e;
            }
        });
    }

    onActive(prod: QuoteSolProductDto, ret: QuoteSolProductRetryDto) {
        this.getImputNote().then((e: string) => {
            if (!e) {
                this.modalDialog.apresentaErro('Ação inválida', 'Preencha o motivo');
            } else {
                let newLst: QuoteSolProductRetryDto[] = [];
                var rate = prod.productRetries.length;
                let idx: number = 0;

                var lstActives = prod.productRetries.filter(e => e.phase < 99);
                if (lstActives && lstActives.length > 0) {
                    lstActives.forEach((e) => {
                        newLst.push(e);
                        rate--;
                        idx++;
                    });
                    ret.phase = 20;
                    newLst.push(ret);
                }

                var lstInactives = prod.productRetries.filter(e => e.phase == 99 && e.quoteSolProductRetryId != ret.quoteSolProductRetryId);
                if (lstInactives && lstInactives.length > 0) {
                    lstInactives.forEach((e) => { newLst.push(e); });
                }
                prod.productRetries = newLst;
                this.isEditing = true;

                ret.phaseNote = e;
            }
        });
    }

    onSaveAdjusts() {
        this.model.products.forEach(prod => {
            var rate: number = prod.productRetries?.length ?? 0;
            prod.productRetries.forEach(e => {
                rate = e.phase < 99 ? rate : 0;
                rate--;
            });
        });

        this._service.saveAdjusts(this.editId, this.model.products).subscribe((result) => {
            if (result.succeeded) {
                this.isEditing = false;
            }
        });
    }

    onRebuildRanking() {
        this.modalDialog.apresentaAvisoObs(
            'Refazer',
            'Tem certeza que deseja refazer o ranking?',
            'Ao refazer, todos os itens inclusive os descartados retornarão!',
            true,
            true,
            () => {
                this.modalDialog.dialog.closeAll();
            },
            () => {
                this.modalDialog.dialog.closeAll();

                let sub = this._service
                    .rebuildRanking(this.model.quoteSolId)
                    .subscribe((result) => {
                        if (result.succeeded) {
                            this.mensagemSucesso_rebuild();
                            this.isEditing = false;
                            sub.unsubscribe();
                        } else {
                            console.log(result.message);
                        }
                    });
            },
            'NÃO',
            'SIM'
        );
    }

    onInterruptWait() {
        this.modalDialog.apresentaAvisoObs(
            'Interromper',
            'Tem certeza que deseja interromper o retorno das cotações?',
            '[Irreversível!] Ao interromper, não receberá mais preços de outros fornecedores!',
            true,
            true,
            () => {
                this.modalDialog.dialog.closeAll();
            },
            () => {
                this.modalDialog.dialog.closeAll();

                let sub = this._service
                    .interruptWait(this.model.quoteSolId)
                    .subscribe((result) => {
                        if (result.succeeded) {
                            this.mensagemSucesso_interruptWait();
                            this.isEditing = false;
                            sub.unsubscribe();
                        } else {
                            console.log(result.message);
                        }
                    });
            },
            'NÃO',
            'SIM'
        );
    }

    //Order
    onOrderSummary() {
        const dialogRef = this.dialog.open(ModalSolOrderSummaryComponent, {
            data: this.model.quoteSolId,
        });

        dialogRef.afterClosed().subscribe((result: QuoteSolDto) => {
            if (result) {
            }
        });
    }

    //AUX
    calculateTimeDiff(dateSent) {
        let currentDate = new Date();
        dateSent = new Date(dateSent);

        return Math.floor((dateSent.getTime() - currentDate.getTime()) / 1000);
    }

    getImputNote(): string | any {
        return new Promise(resolve => {
            const dialogRef = this.dialog.open(ModalQuoteSolPhaseComponent);

            dialogRef.afterClosed().subscribe((result: string) => {
                if (result) {
                    resolve(result);
                } else {
                    resolve(null);
                }
            });
        });
    }

    mensagemSucesso_save() {
        this.modalDialog.apresentaSucesso(
            'Sucesso',
            `Ajustes salvos com sucesso!`,
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

    mensagemSucesso_rebuild() {
        this.modalDialog.apresentaSucesso(
            'Sucesso',
            `Ranking reconstruido com sucesso!`,
            false,
            true,
            null,
            () => {
                this.modalDialog.dialog.closeAll();
                this.ngOnInit();
            },
            null,
            'CONTINUAR'
        );
    }

    mensagemSucesso_interruptWait() {
        this.modalDialog.apresentaSucesso(
            'Sucesso',
            `Solicitações interrompidas com sucesso!`,
            false,
            true,
            null,
            () => {
                this.modalDialog.dialog.closeAll();
                this.ngOnInit();

                this.model.phase = 40;
            },
            null,
            'CONTINUAR'
        );
    }
}