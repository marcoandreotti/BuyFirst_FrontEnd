import { MobileService } from './../../core/service/mobile.service';
import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/service/auth.service';
import { AccountService } from '@app/service/https/account.service';
import { ThemeService } from '@app/service/theme.service';
import { Login } from '@data/schema/login/login';
import { Menu } from '@data/schema/usuarios/menu';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  expanded = false;
  submenu = {
    opened: false,
    pos: 0,
  };
  hoveredMenu;
  isDark$: Observable<boolean>;
  isOpened$: Observable<boolean>;
  @ViewChild('sub') sub: ElementRef;
  rotaAtual: string = '';

  menus: Menu[] = [];

  auth: Login;

  constructor(
    private authService: AuthService,
    private account: AccountService,
    private eRef: ElementRef,
    private router: Router,
    private themeService: ThemeService,
    private mobile: MobileService
  ) {
    this.auth = this.authService.getState();
    this.isDark$ = this.themeService.getDarkTheme();
    this.isOpened$ = this.themeService.isOpened();
    this.rotaAtual = this.router.url;

    this.PrepareMenu();
  }

  ngOnInit() { }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  goToRoute(rota: string) {
    this.themeService.closeMenu();
    this.router.navigate([rota]);
  }

  logOut() {
    this.authService.logOut();
    localStorage.clear();
  }

  expand() {
    this.submenu.opened = false;
    this.themeService.toggleMenu();
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.expanded = false;
      this.submenu.opened = false;
    }
  }

  abrirEmpresa() {
    this.router.navigateByUrl('empresa');
  }

  menuLeave(e, i) {
    this.hoveredMenu = null;
  }

  subLeave(e) {
    this.submenu.opened = false;
    this.hoveredMenu = null;
  }

  PrepareMenu() {
    if (this.auth.isBuyFirst) {
      this.menus.push({ nome: 'Dashboard', icone: 'dashboard', rota: 'home' });
    }
    // this.menus.push({ nome: 'Meu Carrinho', icone: 'shopping_cart', rota: 'detalhecarrinho' });
    // this.menus.push({ nome: 'Pesquisar', icone: 'manage_search', rota: 'pesquisar' });
    this.menus.push({ nome: 'Solicitações', icone: 'precision_manufacturing', rota: 'solicitacoes' });
    this.menus.push({ nome: 'Solicitações/Pedidos', icone: 'military_tech', rota: 'pedidossolicitacoes' });
    if (this.auth.isBuyFirst) {
      this.menus.push({ nome: 'Produtos', icone: 'qr_code_scanner', rota: 'produtos' });
      this.menus.push({ nome: 'Produtos p/Venda', icone: 'qr_code_2', rota: 'produtosfornecedor' });
      this.menus.push({ nome: 'Matches ERP', icone: 'psychology', rota: 'matcherp' });
      this.menus.push({ nome: 'Matches', icone: 'flaky', rota: 'matchs' });
      this.menus.push({ nome: 'Catálogos', icone: 'menu_book', rota: 'catalogos' });
      this.menus.push({ nome: 'Vendas', icone: 'attach_money', rota: 'vendas' });
      this.menus.push({ nome: 'Compradores', icone: 'account_box', rota: 'compradores' });
      this.menus.push({ nome: 'Fornecedores', icone: 'supervised_user_circle', rota: 'fornecedores' });
      this.menus.push({ nome: 'Usuários', icone: 'admin_panel_settings', rota: 'usuarios' });
      this.menus.push({ nome: 'Configurações', icone: 'settings_suggest', rota: 'configuracoes' });
    } else {
      
      if (this.auth.isSupplier) {
        this.menus.push({ nome: 'Produtos', icone: 'qr_code_2', rota: 'produtosfornecedor', });
        this.menus.push({ nome: 'Catálogos', icone: 'menu_book', rota: 'catalogos', });
        this.menus.push({ nome: 'Minhas Vendas', icone: 'attach_money', rota: 'vendas', });
        if (this.auth.companiesSelected.length > 1) {
          this.menus.push({ nome: 'Empresas', icone: 'supervised_user_circle', rota: 'fornecedores' });
        } else {
          this.menus.push({ nome: 'Dados da Empresa', icone: 'supervised_user_circle', rota: 'fornecedores/cadastro/' + this.auth.companyId, });
        }
      }
      if (this.auth.isBuyer) {
        // this.menus.push({ nome: 'Minhas Finanças', icone: 'attach_money', rota: 'vendas', });

        if (this.auth.companiesSelected.length > 1) {
          this.menus.push({ nome: 'Empresas', icone: 'account_box', rota: 'compradores' });
        } else {
          this.menus.push({ nome: 'Dados da Empresa', icone: 'supervised_user_circle', rota: 'compradores/cadastro/' + this.auth.companyId, });
        }
      }
    }
  }
}
