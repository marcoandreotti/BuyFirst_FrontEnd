import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { CompaniesModule } from '../companies.module';
import { SupplierRegisterComponent } from './page/register/register.component';
import { SuppliersComponent } from './page/suppliers/suppliers.component';
import { SupplierRoutes } from './supplier-routing.module';

@NgModule({
  declarations: [SuppliersComponent, SupplierRegisterComponent],
  imports: [SupplierRoutes, CompaniesModule, SharedModule, MatTooltipModule],
})
export class SupplierModule {}
