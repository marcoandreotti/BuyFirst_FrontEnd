import { Component, Input, OnInit } from '@angular/core';
import { ConditionMask, getElementValue, GridColumn } from '../grid/grid.config';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-object',
  templateUrl: './list-object.component.html',
  styleUrls: ['./list-object.component.scss']
})
export class ListObjectComponent implements OnInit {

  @Input() value: any = null;
  @Input() list: GridColumn[] = [];
  @Input() maxHeight: any = 'auto';
  @Input() orientation: string = 'vertical';
  @Input() itensPerLine: number = 5;

  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  getElementValue(element, column) {
    return getElementValue(element, column);
  }

  copy(value) {
    this.copyToClipboard(value);
    this._snackBar.openFromComponent(CopyAlertComponent, {
      duration: 3 * 1000,
    });
  }

  copyToClipboard(item) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (item));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

}

@Component({
  selector: 'copy-alert',
  templateUrl: 'copy-alert.html',
  styles: [`mat-icon {
    margin-right: 15px;
  }`],
})

export class CopyAlertComponent { }