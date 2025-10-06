import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedModule } from '@shared/shared.module';
import { PersonalDataComponent } from './page/personal-data.component';
import { PersonalDataRoutes } from './personal-data-routing.module';

@NgModule({
  declarations: [PersonalDataComponent],
  imports: [PersonalDataRoutes, SharedModule, MatTooltipModule],
})
export class PersonalDataModule {}
