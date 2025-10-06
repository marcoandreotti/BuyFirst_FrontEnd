import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FishingSearch } from '@data/dto/fishing-price/fishing-search.dto';
import { SubGroup } from '@data/schema/products/sub-groups/sub-group';
import { FormRow } from '@shared/component/form/form';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-fishing-form',
  templateUrl: './fishing-form.component.html',
  styleUrls: ['./fishing-form.component.scss'],
})
export class FormFishingComponent implements OnInit {
  form: FormGroup;
  formRow: FormRow[] = [];
  model: FishingSearch;
  lastFilterTag: string = 'last_filter_fishing_price';
  subGrupos$: Observable<SubGroup[]>;

  @Input() selectedButtonToggleVal: string = 'list';
  @Input() totalFavorite: number = 0;
  @Input() totalShoppingCart: number = 0;
  @Input() showTypesGrid: boolean = false;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onButtonToggleChange: EventEmitter<any> = new EventEmitter();
  @Output() onFavoriteCLick: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteAllFavoriteCLick: EventEmitter<any> = new EventEmitter();
  @Output() onShoppingCartCLick: EventEmitter<any> = new EventEmitter();
  @Output() onDeleteAllShoppingCartCLick: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.createForm();
    this.model = this.getLastFilter();
    if (this.model) {
      this.selectedButtonToggleVal = this.model.resultTypeStyle;
    }
  }

  formSubmit(event: FishingSearch) {
    event.resultTypeStyle = this.selectedButtonToggleVal;
    event.onlyFavorites = false;
    event.onlyShoppingCarts = false;
    this.SaveLastFilter(event);
    this.onSubmit.emit(event);
  }

  onButtonToggleSubmit(val: string) {
    if (this.model) {
      this.model.resultTypeStyle = val;
      this.SaveLastFilter(this.model);
    }
    this.onButtonToggleChange.emit(val);
  }

  onShoppingCartSubmit() {
    this.onShoppingCartCLick.emit();
    this.model.onlyShoppingCarts = true;
  }

  onDeleteAllShoppingCartSubmit() {
    this.onDeleteAllShoppingCartCLick.emit();
    this.model.onlyShoppingCarts = false;
  }

  onFavoriteSubmit() {
    this.onFavoriteCLick.emit();
    this.model.onlyFavorites = true;
  }

  onDeleteAllFavoriteSubmit() {
    this.onDeleteAllFavoriteCLick.emit();
    this.model.onlyFavorites = false;
  }

  createForm() {
    this.formRow = [
      {
        fields: [
          {
            name: 'argument',
            label: 'Pesquisar',
            placeholder: 'Pesquisar',
            size: 80,
            value: 'argument',
            required: false,
          },
        ],
        submit: true,
        submitText: 'PESQUISAR',
        size: 15,
      },
    ];
  }

  SaveLastFilter(filter: any) {
    if (filter) {
      localStorage.setItem(this.lastFilterTag, JSON.stringify(filter));
    } else {
      localStorage.setItem(
        this.lastFilterTag,
        JSON.stringify({
          argument: filter.argument,
          referenceCode: filter.referenceCode,
          selectedButtonToggleVal: filter.resultTypeStyle,
        })
      );
    }
  }

  getLastFilter() {
    var data = localStorage.getItem(this.lastFilterTag);
    if (!data) {
      return null;
    } else {
      return JSON.parse(data);
    }
  }
}
