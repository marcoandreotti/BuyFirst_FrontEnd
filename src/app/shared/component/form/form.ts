import { SelectOption } from "../mat-select/mat-select.component";
import { ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';

export class FormRow {
  fields: Field[] = [];
  marginTop?: string;
  submit?: boolean = false;
  right?: boolean = false;
  size?: number = 0;
  submitText?: string = 'Finalizar';
}

export class Field {
  cnpj?: boolean;
  date?: boolean;
  useHour?: boolean = false;
  defaultValue?: string;
  disabled?: boolean = false;
  // disableField? = new FormControl(this.disabled);
  errorMinHeight?: number;
  label?: string;
  list?: Observable<any[]> | any[];
  mask?: string;
  maxLength?: number = 0;
  name: string;
  number?: boolean;
  numberType?: string;
  onAddEntity?: Function;
  onChange?: Function;
  options?: SelectOption[] = [];
  parceiro?: boolean = false;
  passwordType?: boolean = false;
  placeholder?: string;
  range?: boolean;
  required?: boolean;
  select?: boolean;
  selectName?: string;
  size: number;
  slider?: boolean = false;
  slidermax?: number = 100;
  slidermin?: number = 0;
  sliderstep?: number = 1;
  useAddEntity?: boolean;
  useRemove?: boolean;
  useSearch?: boolean;
  validatorComparer?: string[];
  validators?: ValidatorFn[];
  value: any;
  checkBox?: boolean = false;
  textArea?: boolean = false;
  textAreaRows?: number = 4;
}
