import { Directive, ElementRef, OnDestroy } from '@angular/core';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';

@Directive({
  selector: '[appMaskDate]',
})
export class MaskDateDirective implements OnDestroy {
  public mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]; // dd/mm/yyyy
  public maskedInputController;

  constructor(private element: ElementRef) {
    this.maskedInputController = textMask.maskInput({
      inputElement: this.element.nativeElement,
      mask: this.mask,
    });
  }

  public ngOnDestroy(): void {
    this.maskedInputController.destroy();
  }
}
