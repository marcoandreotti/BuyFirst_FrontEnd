import * as textMask from '@app/lib/vanillaTextMask.js';
import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { DateAdapter } from '@angular/material/core';

@Directive({
  selector: '[appMaskDate]',
})
export class MaskDateDirective implements OnDestroy {
  mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]; // dd/mm/yyyy
  maskedInputController;

  constructor(
    private element: ElementRef,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.maskedInputController = textMask.maskInput({
      inputElement: this.element.nativeElement,
      mask: this.mask,
    });
    this.dateAdapter.setLocale('pt-BR');
  }

  ngOnDestroy() {
    this.maskedInputController.destroy();
  }
}
