import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaltransactionPage } from './modaltransaction.page';

describe('ModaltransactionPage', () => {
  let component: ModaltransactionPage;
  let fixture: ComponentFixture<ModaltransactionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModaltransactionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModaltransactionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
