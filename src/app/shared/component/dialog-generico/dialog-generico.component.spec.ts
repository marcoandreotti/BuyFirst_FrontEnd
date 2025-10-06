import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogGenericoComponent } from './dialog-generico.component';

describe('DialogGenericoComponent', () => {
  let component: DialogGenericoComponent;
  let fixture: ComponentFixture<DialogGenericoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogGenericoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogGenericoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
