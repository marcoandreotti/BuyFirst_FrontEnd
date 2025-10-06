import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { ModalSolOrderSummaryComponent } from './component/modal-quote-sol-order-summary/modal-quote-sol-order-summary.component';
import { ModalSolProductAddressesComponent } from './component/modal-quote-sol-product-addresses/modal-quote-sol-product-addresses.component';
import { ModalSolProductComponent } from './component/modal-quote-sol-product/modal-quote-sol-product.component';
import { ModalQuoteSolPhaseComponent } from './component/modal-quote-sool-phase-note/modal-quote-sool-phase-note.component';
import { UploadSolProductsComponent } from './component/upload-sol-products/upload-sol-products.component';
import { QuoteSolicitationRetryComponent } from './page/quote-solicitation-retry/quote-solicitation-retry.component';
import { QuoteSolicitationWizardComponent } from './page/quote-solicitation-wizard/quote-solicitation-wizard.component';
import { QuoteSolicitationsComponent } from './page/quote-solicitations/quote-solicitations.component';
import { SolicitationRoutes } from './solicitation-routing.module';

@NgModule({
    declarations: [
        QuoteSolicitationsComponent,
        QuoteSolicitationWizardComponent,
        QuoteSolicitationRetryComponent,
        UploadSolProductsComponent,
        ModalSolProductAddressesComponent,
        ModalSolOrderSummaryComponent,
        ModalQuoteSolPhaseComponent,
        ModalSolProductComponent
    ],
    imports: [
        SolicitationRoutes,
        MatTooltipModule,
        SharedModule
    ],
    exports: [],
    providers: [],
})

export class SolicitationModule { }
