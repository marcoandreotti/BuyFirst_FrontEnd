import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule, } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { A11yModule } from '@angular/cdk/a11y';
import { CdkTableModule } from '@angular/cdk/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PlatformModule } from '@angular/cdk/platform';
import { MatBadgeModule } from '@angular/material/badge';
import {MatTreeModule} from '@angular/material/tree';
import {MatSliderModule} from '@angular/material/slider';

const dutchRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 até ${length}`; }
  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;


  return `${startIndex + 1} - ${endIndex} de ${length}`;
}

export function getDutchPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Itens por página';
  paginatorIntl.nextPageLabel = 'Próxima página';
  paginatorIntl.previousPageLabel = 'Voltar página';
  paginatorIntl.getRangeLabel = dutchRangeLabel;
  return paginatorIntl;
}


@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatRadioModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DragDropModule,
    CommonModule,
    A11yModule,
    CdkTableModule,
    ScrollingModule,
    MatFormFieldModule,
    MatGridListModule,
    NgxMatSelectSearchModule,
    PlatformModule,
    MatBadgeModule,
    MatTreeModule,
    MatSliderModule,
    MatButtonToggleModule,
  ],
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatRadioModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DragDropModule,
    CommonModule,
    A11yModule,
    CdkTableModule,
    ScrollingModule,
    MatFormFieldModule,
    MatGridListModule,
    NgxMatSelectSearchModule,
    PlatformModule,
    MatBadgeModule,
    MatTreeModule,
    MatSliderModule,
    MatButtonToggleModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() },
  ],
})
export class MaterialModule {}
