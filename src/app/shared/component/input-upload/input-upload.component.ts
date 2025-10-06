import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-input-upload',
  templateUrl: './input-upload.component.html',
  styleUrls: ['./input-upload.component.css']
})
export class InputUploadComponent implements OnInit {
  @ViewChild("inputInvisivel") inputInvisivel: ElementRef<HTMLElement>;
  @Input() textoUpload = "";

  constructor() { }

  ngOnInit(): void {
  }

  abreUpload = () => {
    let el: HTMLElement = this.inputInvisivel.nativeElement;
    el.click();
  }

}
