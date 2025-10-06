import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { FormRow } from './form';
import { Utils } from '@app/lib/utils/utils';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isObservable } from 'rxjs';
// import { CustomValidators } from 'app/providers/custom-validators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form: FormGroup;
  @Output() formChange = new EventEmitter<FormGroup>();
  @Input() formRows: FormRow[] = [];
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Input() marginTop: number = 0;
  @Output() onValidForm: EventEmitter<any> = new EventEmitter();
  @Input() model: any;
  @Input() useErrors: boolean = true;
  // @Input() public disabled: boolean = false;

  textAreaCount: number = 0;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    const group = {};
    this.formRows.forEach((row) => {
      row.fields?.forEach((field) => {
        let validators: ValidatorFn[] = [];

        if (field.required != null && field.required) {
          validators.push(Validators.required);
        }

        if (field.validators != null && field.validators.length > 0) {
          field.validators.forEach((v) => {
            validators.push(v);
          });
        }

        // if (field.validatorComparer && field.validatorComparer.length > 0){
        //   validators.push(
        //     CustomValidators.mustMatch(field.validatorComparer[0], field.validatorComparer[1])
        //   );
        // }

        group[field.name] = new FormControl(
          this.model
            ? this.model[field.name]
              ? this.model[field.name]
              : ''
            : '',
          validators
        );
        if (field.date && field.range) {
          group[field.name + 'end'] = new FormControl(
            this.model
              ? this.model[field.name + 'end']
                ? this.model[field.name + 'end']
                : ''
              : '',
            validators
          );
        }
      });
    });

    this.form = new FormGroup(group);
    this.formChange.emit(this.form);

    this.formRows.forEach((fr) => {
      fr.fields
        .filter((fi) => fi.onChange != null)
        .forEach((f) => {
          if (f.select) {
            this.getValueFromList(f, this.f(f.name).value, (valueList) => {
              f.onChange(valueList);
            });
          } else {
            f.onChange(this.f(f.name).value);
          }

          this.f(f.name)
            .valueChanges.pipe(takeUntil(this.destroyed$))
            .subscribe((value) => {
              if (f.select) {
                this.getValueFromList(f, value, (valueList) => {
                  f.onChange(valueList);
                });
              } else {
                f.onChange(value);
              }
            });

          if (f.date && f.range) {
            this.f(f.name + 'end')
              .valueChanges.pipe(takeUntil(this.destroyed$))
              .subscribe((value) => {
                f.onChange(value);
              });
          }

          if (f.slider) {
            f.onChange(this.f(f.name).value);
          }

          if (f.checkBox) {
            f.onChange(this.f(f.name).value);
          }
        });
    });
  }

  getValueFromList(f, value, callback) {
    if (isObservable(f.list)) {
      let fastSub = f.list.subscribe((list) => {
        callback(list.find((l) => l[f.value] == value));
        Utils.unsubscribe(fastSub);
      });
    } else {
      if (f != undefined && f.list != undefined) {
        callback(f.list.find((l) => l[f.value] == value));
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const change = changes['model'];
    if (change) {
      this.model = change.currentValue;
      this.createForm();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  submit() {
    this.onSubmit.emit(this.form.getRawValue());
  }

  f = (key: string): AbstractControl => {
    return this.form?.get(key);
  };

  cpfCnpjInput(type) { }

  onValidCpfCnpj(cpfCnpj) { }

  valueChange(value) { 
    if (!value || value == '') {
      this.textAreaCount = 0
    } else {
      this.textAreaCount = value.length;
    }
  }
}
