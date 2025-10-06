import { RegionRegisterComponent } from './page/register/register.component';
import { RegionsComponent } from './page/regions/regions.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { RegionRoutes } from './regions-routing.module';


@NgModule({
  declarations: [RegionsComponent, RegionRegisterComponent],
  imports: [
    RegionRoutes,
    MatTooltipModule,
    SharedModule,
  ],
  providers: [],
})
export class RegionsModule { }

