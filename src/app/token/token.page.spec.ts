import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenPage } from './token.page';

describe('TokenPage', () => {
  let component: TokenPage;
  let fixture: ComponentFixture<TokenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
