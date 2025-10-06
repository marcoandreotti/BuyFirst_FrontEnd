import { CadastroUnitOfMeasureComponent } from './page/cadastro/cadastro-unit-of-measure.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { UnitOfMeasureRoutes } from './unit-of-measure-routing.module';
import { UnitOfMeasureComponent } from './page/unit-of-measure/unit-of-measure.component';


@NgModule({
  declarations: [UnitOfMeasureComponent, CadastroUnitOfMeasureComponent],
  imports: [
    UnitOfMeasureRoutes,
    MatTooltipModule,
    SharedModule,
  ],
  providers: [],
})
export class UnitOfMeasureModule { }

