import { SubGroup } from '@data/schema/products/sub-groups/sub-group';
import { Group } from '@data/schema/products/groups/group';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '@app/service/theme.service';
import { FormRow } from '@shared/component/form/form';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { BfResponse } from '@data/schema/response';
import { GroupService } from '@app/service/https/group.service';
import { SubGroupService } from '@app/service/https/subgroup.service';

@Component({
  selector: 'app-group-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class GroupRegisterComponent {
  modalDialog = new DialogGenericoFuncoes(this.dialog);

  model: Group;
  editId: number | any;
  groupForm: FormGroup;
  formRowGroup: FormRow[] = [];

  subgroup$: BfResponse<SubGroup[]>;
  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  itemMenus: GridItemMenu[] = [];
  topMenus: GridItemMenu[] = [];
  subGroupEditId: number | any;
  subgroupForm: FormGroup;
  formRowSubgroup: FormRow[] = [];
  modelSubgroup: SubGroup = new SubGroup();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private _serviceGroup: GroupService,
    private _serviceSubGroup: SubGroupService
  ) {
    this.modelSubgroup = new SubGroup();
    this.PrepareGridSubGroup();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.editId = +params.get('id');
      this.themeService.setBackRoute('grupos');

      if (this.editId > 0) {
        this.themeService.setTitle('Editando Grupo');
        //Group
        let sub = this._serviceGroup.get(this.editId).subscribe((res) => {
          this.model = res.data;
          sub.unsubscribe();
        });
        //SubGroup
        let subSubGroup = this._serviceSubGroup
          .getAll(this.editId)
          .subscribe((res) => {
            this.subgroup$ = res;
            subSubGroup.unsubscribe();
          });
      } else {
        this.themeService.setTitle('Novo Grupo');
      }
      this.createForm();
      this.createformRowSubgroup();
    });
  }

  save() {
    if (!this.groupForm.valid) {
      this.groupForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      if (!this.editId) {
        this.model = Object.assign(new Group(), this.groupForm.getRawValue());
        this.model.groupId = this.editId;
        this.model.active = true;

        this._serviceGroup.add(this.model).subscribe((result) => {
          if (!result.succeeded) {
            this.modalDialog.apresentaErro('Erro', result.message);
          } else {
            this.editId = result.data;
            this.mensagemSucesso();
          }
        });
      } else {
        let active = this.model.active;
        let model: Group = Object.assign(
          this.model,
          this.groupForm.getRawValue()
        );
         model.groupId = this.editId;
         model.active = active;
        this._serviceGroup.save(model).subscribe((result) => {
          if (!result.succeeded) {
            this.modalDialog.apresentaErro('Erro', result.message);
          } else {
            this.mensagemSucesso();
          }
        });
      }
    }
  }

  formSubgroupSubmit() {
    if (!this.subgroupForm.valid) {
      this.subgroupForm.markAsPending();
      this.modalDialog.apresentaErro('Erro', 'Preencha os campos obrigatórios');
    } else {
      if (!this.subGroupEditId) {
        let active = this.modelSubgroup.active;
        this.modelSubgroup = Object.assign(
          new SubGroup(),
          this.subgroupForm.getRawValue()
        );

        this.modelSubgroup.groupId = this.editId;
        this.modelSubgroup.subGroupId = this.subGroupEditId;
        this.modelSubgroup.active = active;

        this._serviceSubGroup.add(this.modelSubgroup).subscribe((result) => {
          if (!result.succeeded) {
            this.modalDialog.apresentaErro('Erro', result.message);
          } else {
            this.mensagemSucessoSubGroup();
            this.subGroupEditId = result.data;
          }
        });
      } else {
        let model: SubGroup = Object.assign(
          this.modelSubgroup,
          this.subgroupForm.getRawValue()
        );
        model.groupId = this.editId;
        model.subGroupId = this.subGroupEditId;
        model.active = true;

        this._serviceSubGroup.save(model).subscribe((result) => {
          if (!result.succeeded) {
            this.modalDialog.apresentaErro('Erro', result.message);
          } else {
            this.mensagemSucessoSubGroup();
          }
        });
      }
    }
  }

  createForm() {
    this.formRowGroup = [
      {
        fields: [
          {
            name: 'name',
            label: 'Grupo',
            placeholder: 'Grupo',
            size: 100,
            value: 'name',
            required: true,
            maxLength: 50,
          },
        ],
      },
    ];
  }

  createformRowSubgroup() {
    this.formRowSubgroup = [
      {
        fields: [
          {
            name: 'name',
            label: 'Sub Grupo',
            placeholder: 'Sub Grupo',
            size: 80,
            value: 'name',
            required: true,
            maxLength: 50,
          },
        ],
        submit: true,
        submitText: 'Inserir',
        size: 20,
        marginTop: '40px',
      },
    ];
  }

  PrepareGridSubGroup() {
    this.displayedColumns = ['GroupId', 'subGroupId', 'name', 'active'];

    let activeValue = {};
    activeValue['true'] = 'Ativo';
    activeValue['false'] = 'Inativo';

    this.cols = [
      { name: 'subGroupId', title: 'Código', show: true },
      { name: 'name', title: 'Descrição', show: true },
      { name: 'active', title: 'Status', show: true, value: activeValue },
    ];

    this.itemMenus = [
      {
        name: 'Editar',
        icon: 'edit',
        action: (row: SubGroup) => {
          this.subGroupEditId = row.subGroupId;
          let sub = this._serviceSubGroup
            .get(row.subGroupId)
            .subscribe((res) => {
              this.modelSubgroup = res.data;
              sub.unsubscribe();
            });
        },
      },
      {
        name: 'Excluir',
        icon: 'delete',
        action: (row: SubGroup) => {
          //this.showModalAddress(row);
        },
      },
    ];
  }

  mensagemSucesso() {
    let msg: string =
      'Grupo ' + (this.editId ? 'alterado' : 'cadastrado') + ' com sucesso!';

    if (!this.editId || this.editId <= 0) {
      msg += ' Subgrupo disponível para cadastro';
    }

    this.modalDialog.apresentaSucesso(
      'Sucesso',
      msg,
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

  mensagemSucessoSubGroup() {
    let msg: string =
      'SubGrupo ' +
      (this.subGroupEditId ? 'alterado' : 'cadastrado') +
      ' com sucesso!';

    this.modalDialog.apresentaSucesso(
      'Sucesso',
      msg,
      false,
      true,
      null,
      () => {
        let subSubGroup = this._serviceSubGroup
          .getAll(this.editId)
          .subscribe((res) => {
            this.subgroup$ = res;
            subSubGroup.unsubscribe();
          });
        this.modelSubgroup = new SubGroup();
        this.modalDialog.dialog.closeAll();
      },
      null,
      'CONTINUAR'
    );
  }
}
