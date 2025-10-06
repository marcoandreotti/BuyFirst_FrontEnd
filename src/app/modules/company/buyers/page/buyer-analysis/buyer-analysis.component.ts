import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { ThemeService } from '@app/service/theme.service';
import { AuthService } from '@app/service/auth.service';
import { Login } from '@data/schema/login/login';

@Component({
    selector: 'app-buyer-analysis',
    templateUrl: './buyer-analysis.component.html',
    styleUrls: ['./buyer-analysis.component.scss'],
})
export class BuyerAnalysisComponent {
    modalDialog = new DialogGenericoFuncoes(this.dialog);
    auth: Login;
    loading: boolean = true;

    constructor(
        private _auth: AuthService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private themeService: ThemeService,
    ) { }

    ngOnInit(): void {
        this.themeService.setTitle('Analise Comprador x BuyFirst');

        this.auth = this._auth.getState();
        if (!this.auth.isBuyFirst) {
            this.themeService.setBackRoute(null);
        } else {
            this.themeService.setBackRoute('compradores');
        }

        this.route.paramMap.subscribe((params) => {
        });
    }
}