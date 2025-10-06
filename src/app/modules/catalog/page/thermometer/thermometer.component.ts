import { Component } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@app/service/auth.service";
import { CatalogsService } from "@app/service/https/catalogs.service";
import { ThemeService } from "@app/service/theme.service";
import { CatalogThermometerDto } from "@data/dto/catalogs/thermometer/catalog-thermometer.dto";
import { Login } from "@data/schema/login/login";
import { DialogGenericoFuncoes } from "@shared/component/dialog-generico/dialog-generico.funcoes";

@Component({
    selector: 'app-catalog-thermometer',
    templateUrl: './thermometer.component.html',
    styleUrls: ['./thermometer.component.scss'],
})
export class CatalogThermometerComponent {
    auth: Login;
    modalDialog = new DialogGenericoFuncoes(this.dialog);
    data$: CatalogThermometerDto;
    catalogId: number = 0;

    constructor(
        private _auth: AuthService,
        private dialog: MatDialog,
        private _service: CatalogsService,
        private router: Router,
        private route: ActivatedRoute,
        private themeService: ThemeService
    ) {
        this.auth = _auth.getState();
    }

    ngOnInit(): void {
        this.themeService.setBackRoute(null);
        this.themeService.setTitle('Analise catálogo');

        this.route.paramMap.subscribe((params) => {
            this.catalogId = +params.get('id');
            if (this.catalogId > 0) {
                let sub = this._service
                    .getThermometer(this.catalogId)
                    .subscribe((res) => {
                        if (res.succeeded) {
                            this.data$ = res.data;
                        } else {
                            this.modalDialog.apresentaErro('Erro', res.message);
                        }
                        sub.unsubscribe();
                    });
            }
        });
    }

    onOpenAnalysis(id: number) {
        const link = window.location.href.substring(0, window.location.href.indexOf('catalogos')) + `matcherp/analise/${id}`;
        this.router.navigate([]).then(result => { window.open(link); });
    }
}