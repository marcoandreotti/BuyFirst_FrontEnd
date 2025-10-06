import { Component, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css']
})
export class TranslatorComponent implements OnInit {

  languages = [
    { name: "BRL", image: "brazil.png", value: "br" },
    { name: "EUA", image: "united-states.png", value: "en" },
    { name: "ESP", image: "spain.png", value: "es" }
  ]

  current;

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {


    this.current = this.languages.find(l => l.value == this.translate.currentLang);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.current = this.languages.find(l => l.value == this.translate.currentLang);
    });

  }

  changeLanguage(item) {
    this.translate.use(item.value);
  }

}
