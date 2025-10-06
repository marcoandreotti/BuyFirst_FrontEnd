import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab-step',
  templateUrl: './tab-step.component.html',
  styleUrls: ['./tab-step.component.scss']
})
export class TabStepComponent implements OnInit {

  constructor() { }

  @Input() steps: TabStep[] = [];

  ngOnInit(): void {
  }

}

export class TabStep {
  title: string;
  completed: boolean;
}
