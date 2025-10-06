import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListObjectComponent } from './list-object.component';

describe('ListObjectComponent', () => {
  let component: ListObjectComponent;
  let fixture: ComponentFixture<ListObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
