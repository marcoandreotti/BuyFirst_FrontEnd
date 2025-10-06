export class GridOption {
  dir: GridOptionDir;
  name: string;
  icon: string;
  menu: GridOptionMenu[];
  hint: Boolean;
  disable?: Boolean;
  action?: Function;
  mobileHint?: Boolean = true;
}

export class GridItemMenu {
  name: string;
  icon?: string;
  action?: Function;
  selected?: boolean;
  color?: string;
  styleColor?: string;
}

export class GridOptionMenu {
  name: string;
  icon?: string;
  action?: Function;
}

export enum GridOptionDir {
  LEFT = 'left',
  RIGHT = 'right',
}

export class GridFilter {
  name: string;
  title: string;
  options: GridFilterOptions[];
  search?: string;
}

export class GridFilterOptions {
  name: string;
  checked: boolean;
  value: any;
}

export class GridColumn {
  alignEnd?: boolean = false;
  center?: boolean = false;
  conditionMask?: ConditionMask;
  date?: boolean;
  decimal?: boolean;
  decimalPrecision?: number = 3;
  expandled?: boolean = false;
  expandledColumns?: GridColumn[];
  expandledColumnsItemsMenu?: GridItemMenu[];
  expandledColumnsSecond?: GridColumn[];
  expandledDisplayColumns?: string[];
  expandledDisplayColumnsSecond?: string[];
  hour?: boolean;
  input?: boolean;
  inputMask?: boolean;
  inputMaskOptions?: any;
  mask?: string;
  name: string;
  prefix?: string;
  searchable?: boolean = true;
  show: boolean;
  showFavorite?: boolean = false;
  showSort?: boolean = false;
  suffix?: string;
  title: string;
  titleSecond?: string;
  value?: any;
}

export class ConditionMask {
  column: string;
  mask: any;
}

export class LoadingColumn {
  index: number;
  column: string;
}

export class ColumnValue {
  row: any;
  index: number;
  column: string;
  value: any;
}

const retornaValorFormatado = (valor: number, precision) => {
  return (valor || 0).toLocaleString('PT-br', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
};

export const getElementValue = (element, column: GridColumn) => {
  let e = element;
  let c = column.name;
  let split = column.name.split('.');
  if (split.length > 1) {
    if (split.length > 2) {
      e = element[split[0]][split[1]];
      c = split[2];
    } else {
      e = element[split[0]];
      c = split[1];
    }
  }

  let elementValue = e[c];

  let returnValue;

  if (column.value) {
    if (column.value[elementValue]) {
      returnValue = { value: column.value[elementValue], mask: '' };
    } else {
      returnValue = elementValue;
    }
  } else {
    if (column.mask) {
      returnValue = { value: elementValue, mask: column.mask };
    } else {
      if (
        column.conditionMask &&
        column.conditionMask.mask[element[column.conditionMask.column]]
      ) {
        returnValue = {
          value: elementValue,
          mask: column.conditionMask.mask[element[column.conditionMask.column]],
        };
      } else {
        if (column.date) {
          if (elementValue) {
            let date = new Date(elementValue);
            returnValue = {
              value:
                date.toLocaleDateString() +
                ' ' +
                (column.hour == null || column.hour == true
                  ? date.toLocaleTimeString()
                  : ''),
              mask: '',
            };
          } else {
            returnValue = {
              value: '',
            };
          }
        } else {
          if (column.decimal) {
            returnValue = {
              value: elementValue
                ? retornaValorFormatado(elementValue, column.decimalPrecision)
                : '',
              mask: '',
            };
          } else {
            returnValue = { value: elementValue, mask: '' };
          }
        }
      }
    }
  }

  if (column.prefix && returnValue.value) {
    returnValue.value = column.prefix + returnValue.value;
  }

  if (column.suffix && returnValue.value) {
    returnValue.value = returnValue.value + column.suffix;
  }

  return returnValue;
};
