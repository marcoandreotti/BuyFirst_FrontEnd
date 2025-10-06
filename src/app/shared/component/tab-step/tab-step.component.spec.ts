import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabStepComponent } from './tab-step.component';

describe('TabStepComponent', () => {
  let component: TabStepComponent;
  let fixture: ComponentFixture<TabStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
