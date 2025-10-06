import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { PaymentsRoutes } from './payments-routing.module';
import { PaymentComponent } from './page/payments/payments.component';
import { PaymentRegisterComponent } from './page/register/register.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalRegisterComponent } from './page/register/modal-register/modal-register.component';

@NgModule({
  declarations: [PaymentComponent, ModalRegisterComponent, PaymentRegisterComponent],
  imports: [
    PaymentsRoutes,
    MatTooltipModule,
    SharedModule,
    MatDialogModule
  ],
  providers: [],
})
export class PaymentsModule { }

