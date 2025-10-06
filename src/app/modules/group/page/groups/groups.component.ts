import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '@app/service/theme.service';
import { FormRow } from '@shared/component/form/form';
import { GridColumn, GridItemMenu } from '@shared/component/grid/grid.config';
import { PageEvent } from '@angular/material/paginator';
import { Group } from '@data/schema/products/groups/group';
import { SubGroup } from '@data/schema/products/sub-groups/sub-group';
import { GroupService } from '@app/service/https/group.service';
import { DialogGenericoFuncoes } from '@shared/component/dialog-generico/dialog-generico.funcoes';
import { SubGroupService } from '@app/service/https/subgroup.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'],
})
export class GroupsComponent {
  groups$: Group[];

  cols: GridColumn[] = [];
  displayedColumns: String[] = [];
  editId: number = null;
  filters: FormRow[] = [];
  itemMenus: GridItemMenu[] = [];
  lastFilter: any;
  lastFilterTag: string = 'last_filter_groups';
  modalDialog = new DialogGenericoFuncoes(this.dialog);
  modelIdentity: string = 'groupId';
  pageIndex: number = 0;
  pageSize: number = 25;
  topMenus: GridItemMenu[] = [];

  subGroups$: SubGroup[];
  expandedElementIndex: SubGroup[] | any;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private _serviceGroup: GroupService,
    private _serviceSubGroup: SubGroupService
  ) {
    this.PrepareColumns();
    this.PrepareItemMenus();
  }

  ngOnInit(): void {
    this.themeService.setBackRoute('configuracoes');
    this.themeService.setTitle('Grupos');

    this.lastFilter = this.getLastFilter();
    this.filter(this.lastFilter);
  }

  onExpandItem(event) {
    this.expandedElementIndex = event.row[this.modelIdentity];
    let sub = this._serviceSubGroup
      .getSelectAll(event.row.groupId)
      .subscribe((res) => {
        this.subGroups$ = res;
        sub.unsubscribe();
      });
  }

  onCloseExpandItem(event) {
    this.expandedElementIndex = null;
  }

  onPageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    this.filter(this.lastFilter);
  }

  onFilter(event) {
    this.pageIndex = 0;

    this.filter(event);
  }

  filter(event) {
    if (event) {
      this.SaveLastFilter(event);
      this.lastFilter = event;
    } else {
      event = this.lastFilter;
    }

    let sub = this._serviceGroup.getAll().subscribe((res) => {
      this.groups$ = res;
      sub.unsubscribe();
    });

    localStorage.setItem(this.lastFilterTag, JSON.stringify(event));
    this.lastFilter = event;
  }

  SaveLastFilter(filter: any) {
    if (filter) {
      localStorage.setItem(this.lastFilterTag, JSON.stringify(event));
    } else {
      localStorage.setItem(
        this.lastFilterTag,
        JSON.stringify({
          groupId: this.editId,
        })
      );
    }
  }

  getLastFilter() {
    var data = localStorage.getItem(this.lastFilterTag);
    if (data == 'undefined') {
      return null;
    } else {
      return JSON.parse(data);
    }
  }

  PrepareColumns() {
    this.displayedColumns = ['groupId', 'name', 'active'];

    let activeValue = {};
    activeValue['true'] = 'Ativo';
    activeValue['false'] = 'Inativo';

    this.cols = [
      {
        name: 'groupId',
        title: 'ID',
        show: true,
      },
      {
        name: 'name',
        title: 'Nome',
        show: true,
      },
      {
        name: 'active',
        title: 'Ativo',
        show: true,
        value: activeValue,
      },

      {
        name: 'subGroup',
        title: 'SubGrupos',
        show: true,
        expandled: true,
        expandledColumns: [
          { name: 'subGroupId', title: 'Id', show: true },
          { name: 'name', title: 'Sub-grupo', show: true },
          { name: 'active', title: 'Status', show: true, value: activeValue },
        ],
        expandledDisplayColumns: ['subGroupId', 'name', 'active'],
      },
    ];
  }

  PrepareItemMenus() {
    this.itemMenus = [
      {
        name: 'Excluir',
        icon: 'delete',
        action: (_onclick) => {},
      },
    ];
  }
}
