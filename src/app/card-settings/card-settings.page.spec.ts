import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSettingsPage } from './card-settings.page';

describe('CardSettingsPage', () => {
  let component: CardSettingsPage;
  let fixture: ComponentFixture<CardSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardSettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
