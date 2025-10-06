import { Routes, RouterModule } from '@angular/router';
import { PersonalDataComponent } from './page/personal-data.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalDataComponent
  },
];

export const PersonalDataRoutes = RouterModule.forChild(routes);
