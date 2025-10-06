import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatAutocompleteComponent } from './mat-autocomplete.component';

describe('CardFormComponent', () => {
  let component: MatAutocompleteComponent;
  let fixture: ComponentFixture<MatAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatAutocompleteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
