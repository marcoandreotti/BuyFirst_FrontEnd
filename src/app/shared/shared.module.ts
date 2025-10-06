import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { ControlMessagesComponent } from './component/control-messages/control-messages.component';
import { SpinnerComponent } from './component/spinner/spinner.component';
import { LogoComponent } from './component/logo/logo.component';
import { TranslatorComponent } from './component/translator/translator.component';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { InputSearchComponent } from './component/input-search/input-search.component';
import { DialogGenericoComponent } from './component/dialog-generico/dialog-generico.component';
import { InputUploadComponent } from './component/input-upload/input-upload.component';
import { TableComponent } from './component/grid/table/table.component';
import { GridComponent } from './component/grid/grid.component';
import { HeaderComponent } from './component/grid/header/header.component';
import { FiltersComponent } from './component/grid/filters/filters.component';
import { PaginationComponent } from './component/grid/pagination/pagination.component';
import { ColumnsComponent } from './component/grid/columns/columns.component'
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
import { SectionFormComponent } from './component/section-form/section-form.component';
import { NgxMaskModule } from 'ngx-mask';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectComponent } from './component/mat-select/mat-select.component';
import { FormComponent } from './component/form/form.component';
import { MaskDateDirective } from './component/form/date.directive';
import { NgxCurrencyModule } from 'ngx-currency';
import {
  ListObjectComponent,
  CopyAlertComponent,
} from './component/list-object/list-object.component';
import { SelectListComponent } from './component/select-list/select-list.component';
import { InputNumberComponent } from './component/input-number/input-number.component';
import { DashboardComponent } from './component/grid/dashboard/dashboard.component';
import { InputDateComponent } from './component/input-date/input-date.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatAutocompleteComponent } from './component/mat-autocomplete/mat-autocomplete.component';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule,
} from '@angular-material-components/datetime-picker';
import { MaskDateTimeDirective } from './component/input-date/datetime-mask.directive';
import { TabStepComponent } from './component/tab-step/tab-step.component';
import { MenuLateralComponent } from './component/menu-lateral/menu-lateral.component';
import { SliderComponent } from './component/input-slider/input-slider.component';
import { FormFishingComponent } from '@modules/fishing-price/component/fishing-form/fishing-form.component';
import { slideToggleComponent } from './component/form/slide-toggle/slide-toggle.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    TranslateModule.forChild({ isolate: false }),
    NgxMaskModule.forRoot({
      thousandSeparator: '.',
      decimalMarker: ',',
    }),
    FlexLayoutModule,
    NgxCurrencyModule,
    NgxChartsModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
  ],

  declarations: [
    ControlMessagesComponent,
    SpinnerComponent,
    LogoComponent,
    TranslatorComponent,
    InputSearchComponent,
    DialogGenericoComponent,
    GridComponent,
    HeaderComponent,
    TableComponent,
    FiltersComponent,
    PaginationComponent,
    InputUploadComponent,
    ColumnsComponent,
    ColumnsComponent,
    SectionFormComponent,
    MatSelectComponent,
    MaskDateDirective,
    MaskDateTimeDirective,
    SelectListComponent,
    ListObjectComponent,
    FormComponent,
    CopyAlertComponent,
    InputNumberComponent,
    DashboardComponent,
    InputDateComponent,
    MatAutocompleteComponent,
    TabStepComponent,
    SliderComponent,
    MenuLateralComponent,
    FormFishingComponent,
    slideToggleComponent,
    
  ],

  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    ControlMessagesComponent,
    SpinnerComponent,
    LogoComponent,
    TranslatorComponent,
    TranslateModule,
    InputSearchComponent,
    DialogGenericoComponent,
    GridComponent,
    InputUploadComponent,
    SectionFormComponent,
    FlexLayoutModule,
    NgxMaskModule,
    MatSelectComponent,
    MaskDateDirective,
    MaskDateTimeDirective,
    SelectListComponent,
    ListObjectComponent,
    FormComponent,
    CopyAlertComponent,
    NgxMaskModule,
    FlexLayoutModule,
    NgxCurrencyModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    InputNumberComponent,
    InputDateComponent,
    NgxChartsModule,
    MatAutocompleteComponent,
    TabStepComponent,
    MenuLateralComponent,
    FormFishingComponent,
    MatExpansionModule,
    slideToggleComponent,
  ],
})
export class SharedModule {
  constructor() {}
}
