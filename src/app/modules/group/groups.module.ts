import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '@shared/shared.module';
import { GroupsRoutes } from './groups-routing.module';
import { GroupRegisterComponent } from './page/register/register.component';
import { GroupsComponent } from './page/groups/groups.component';

@NgModule({
  declarations: [GroupsComponent, GroupRegisterComponent],
  imports: [GroupsRoutes, SharedModule, MatTooltipModule],
})
export class GroupsModule {}
