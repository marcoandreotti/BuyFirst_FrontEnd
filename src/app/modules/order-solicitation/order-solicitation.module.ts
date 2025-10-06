import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { ModalOrderSolComponent } from './component/modal-order-sol/modal-order-sol.component';
import { OrderSolicitationRoutes } from './order-solicitation-routing.module';
import { OrderSolicitationsComponent } from './page/order-solicitations/order-solicitations.component';

@NgModule({
    declarations: [
        OrderSolicitationsComponent,
        ModalOrderSolComponent,
    ],
    imports: [
        OrderSolicitationRoutes,
        MatTooltipModule,
        SharedModule
    ],
    exports: [],
    providers: [],
})

export class OrderSolicitationModule { }
