import { Component, OnInit } from '@angular/core';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { FormRow } from '@shared/component/form/form';
import { ThemeService } from '@app/service/theme.service';
import { BfResponse } from '@data/schema/response';
import { AccountService } from '@app/service/https/account.service';
import { PageEvent } from '@angular/material/paginator';
import { UserDTO } from '@data/dto/accounts/user.dto';
import { ReplaySubject } from 'rxjs';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
})
export class UsuariosComponent implements OnInit {
  compnayType: string = '0';

  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  filters: FormRow[];
  itemMenus: GridItemMenu[] = [];
  lastFilter: any;
  lastFilterTag: string = 'last_filter_usuarios';
  modelIdentity: string = 'id';
  pageIndex: number = 0;
  pageSize: number = 25;
  situacao$: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  usuarios$: BfResponse<UserDTO[]>;

  modalDialog = new DialogGenericoFuncoes(this.dialog);

  constructor(
    private dialog: MatDialog,
    private themeService: ThemeService,
    private _service: AccountService  ) {
    this.PrepareGridUserApp();
    this.PrepareFilter();
  }

  pageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex + 1;

    this.filter(this.lastFilter);
  }

  public onCompanyTypeChange(val: string) {
    this.pageIndex = 0;
    this.compnayType = val;

    this.filter(this.lastFilter);
  }

  ngOnInit(): void {
    this.themeService.setBackRoute(null);
    this.themeService.setTitle('Usuarios');

    this.lastFilter = JSON.parse(localStorage.getItem(this.lastFilterTag));
    if (this.lastFilter != null) {
      this.filter(this.lastFilter);
    } else {
      let sub = this._service
        .getAll(
          null,
          Number(this.compnayType),
          null,
          this.pageIndex + 1,
          this.pageSize
        )
        .subscribe((res) => {
          this.usuarios$ = res;
          sub.unsubscribe();
        });
    }
  }

  onFilter(event: any) {
    this.pageIndex = 0;
    this.filter(event);
  }

  filter(event) {
    localStorage.setItem(this.lastFilterTag, JSON.stringify(event));
    this.lastFilter = event;
    let sub = this._service
      .getAll(
        event?.argument ?? null,
        Number(this.compnayType),
        !event || !event.lockoutEnabled ? null : event.lockoutEnabled == '1',
        this.pageIndex + 1,
        this.pageSize
      )
      .subscribe((res) => {
        this.usuarios$ = res;
        sub.unsubscribe();
      });
  }

  onPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.filter(this.lastFilter);
  }

  PrepareGridUserApp() {
    this.displayedColumns = [
      'firstName',
      'lastName',
      'userName',
      'email',
      'lockoutEnabled',
    ];

    let activeValue = {};
    activeValue['true'] = 'Desbloqueado';
    activeValue['false'] = 'Bloqueado';

    this.cols = [
      { name: 'firstName', title: 'Nome', show: true },
      { name: 'lastName', title: 'Sobrenome', show: true },
      { name: 'userName', title: 'Apelido', show: true },
      { name: 'email', title: 'E-mail', show: true },
      {
        name: 'lockoutEnabled',
        title: 'Situação',
        show: true,
        value: activeValue,
      },
    ];

    this.itemMenus = [
      {
        name: 'Bloquear/Desbloquear',
        icon: 'lock',
        action: (row: UserDTO) => {
          let sub = this._service.activeInactive(row.id).subscribe((result) => {
            if (result.succeeded) {
              this.mensagemSucesso_Active(!row.lockoutEnabled);
              row.lockoutEnabled = !row.lockoutEnabled;
              sub.unsubscribe();
            } else {
              console.log(result.message);
            }
          });
        },
      },
      {
        name: 'Redefinir Senha',
        icon: 'lock_reset',
        action: (row: UserDTO) => {
          let sub = this._service
            .forgotPassword(row.email)
            .subscribe((result) => {
              if (result.succeeded) {
                this.mensagemSucesso_Forgot();
                sub.unsubscribe();
              } else {
                console.log(result.message);
              }
            });
        },
      },
    ];
  }

  PrepareFilter() {
    this.situacao$.next([
      { id: '1', description: 'Desbloqueados' },
      { id: '2', description: 'Bloqueados' },
    ]);

    this.filters = [
      {
        fields: [
          {
            name: 'argument',
            label: 'Pesquisar',
            placeholder: 'Pesquisar',
            size: 50,
            value: 'argument',
          },
          {
            name: 'lockoutEnabled',
            label: 'Bloqueados ou não',
            placeholder: 'Bloqueados ou não',
            size: 25,
            value: 'id',
            select: true,
            selectName: 'description',
            useSearch: false,
            required: false,
            useRemove: true,
            list: this.situacao$,
          },
        ],
        submit: true,
        submitText: 'FILTRAR',
        size: 10,
      },
    ];
  }

  //AUX
  mensagemSucesso_Forgot() {
    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Redifinição de senha enviada`,
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
      },
      null,
      'CONTINUAR'
    );
  }

  mensagemSucesso_Active(active: boolean) {
    const text = !active ? 'bloqueado' : 'desbloqueado';

    this.modalDialog.apresentaSucesso(
      'Sucesso',
      `Usuário ${text} com sucesso!`,
      false,
      true,
      null,
      () => {
        this.modalDialog.dialog.closeAll();
      },
      null,
      'CONTINUAR'
    );
  }
}
