import { Routes, RouterModule } from '@angular/router';
import { UsuariosCadastroComponent } from './page/cadastro/cadastro.component';
import { UsuariosComponent } from './page/usuarios/usuarios.component';

const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent
  },
  {
    path: 'cadastro',
    component: UsuariosCadastroComponent
  },
  {
    path: 'cadastro/:id',
    component: UsuariosCadastroComponent
  }
];

export const UsuariosRoutes = RouterModule.forChild(routes);
