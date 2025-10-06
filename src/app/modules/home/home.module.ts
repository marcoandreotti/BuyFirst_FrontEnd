import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ModalCompanyProblemComponent } from './component/modal-company-problem.component';
import { HomeRoutes } from './home-routing.module';
import { HomeComponent } from './page/home/home.component';


@NgModule({
  declarations: [HomeComponent, ModalCompanyProblemComponent],
  imports: [HomeRoutes, SharedModule, NgxChartsModule],
  exports: [ModalCompanyProblemComponent],

})
export class HomeModule {}
