import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter, ContentChildren, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-section-form',
  templateUrl: './section-form.component.html',
  styleUrls: ['./section-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SectionFormComponent implements OnInit {
  constructor() { }

  @ContentChildren("conteudoSection", {read: TemplateRef, descendants: true}) templates: TemplateRef<any>[];
  @Input() tituloSection = "";
  @Input() subtituloSection = "";


  ngOnInit(): void {
  }

}
