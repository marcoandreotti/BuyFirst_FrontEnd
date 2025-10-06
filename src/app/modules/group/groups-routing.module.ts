import { Routes, RouterModule } from '@angular/router';
import { GroupRegisterComponent } from './page/register/register.component';
import { GroupsComponent } from './page/groups/groups.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
  },
  {
    path: 'cadastro',
    component: GroupRegisterComponent,
  },
  {
    path: 'cadastro/:id',
    component: GroupRegisterComponent,
  },
];

export const GroupsRoutes = RouterModule.forChild(routes);
