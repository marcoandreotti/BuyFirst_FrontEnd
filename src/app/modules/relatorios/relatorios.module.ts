import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { RelatoriosRoutes } from './relatorios-routing.module';



@NgModule({
  declarations: [],
  imports: [
    RelatoriosRoutes,
    SharedModule
  ]
})
export class RelatoriosModule { }
