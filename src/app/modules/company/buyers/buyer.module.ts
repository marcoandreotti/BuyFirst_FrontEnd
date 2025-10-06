import { CompaniesModule } from '../companies.module';
import { NgModule } from '@angular/core';
import { BuyersComponent } from './page/buyers/buyers.component';
import { BuyerRegisterComponent } from './page/register/register.component';
import { BuyerRoutes } from './buyer-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BuyerAnalysisComponent } from './page/buyer-analysis/buyer-analysis.component';

@NgModule({
  declarations: [BuyersComponent, BuyerRegisterComponent, BuyerAnalysisComponent],
  imports: [BuyerRoutes, CompaniesModule, SharedModule, MatTooltipModule],
})
export class BuyerModule {}
