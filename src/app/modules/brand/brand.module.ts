import { BrandRegisterComponent } from './page/register/register.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { MatTooltipModule } from '@angular/material/tooltip';
import { BrandRoutes } from './brand-routing.module';
import { BrandComponent } from './page/brands/brands.component';

@NgModule({
  declarations: [BrandComponent, BrandRegisterComponent],
  imports: [
    BrandRoutes,
    MatTooltipModule,
    SharedModule,
  ],
  providers: [],
})
export class BrandModule { }

