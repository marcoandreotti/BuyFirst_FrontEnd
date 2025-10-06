import { MatTooltipModule } from '@angular/material/tooltip';
import { ModalAddressComponent } from '@modules/company/components/modal-address/modal-address.component';
import { ModalConfigPaymentComponent } from '@modules/company/components/modal-config-payment/modal-config-payment.component';
import { ModalResponsibleComponent } from '@modules/company/components/modal-responsible/modal-responsible.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { CompanyRoutes } from './companies-routing.module';
import { CompanyCodeSacComponent } from './erp/company-code-sac/company-code-sac.component';

@NgModule({
  imports: [CompanyRoutes, SharedModule, MatTooltipModule],

  declarations: [
    ModalAddressComponent,
    ModalResponsibleComponent,
    ModalConfigPaymentComponent,
    CompanyCodeSacComponent,
  ],

  exports: [
    ModalAddressComponent,
    ModalResponsibleComponent,
    ModalConfigPaymentComponent,
  ],
})
export class CompaniesModule {
  constructor() {}
}
