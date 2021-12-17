import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginToWalletPage } from './login-to-wallet.page';

describe('LoginToWalletPage', () => {
  let component: LoginToWalletPage;
  let fixture: ComponentFixture<LoginToWalletPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginToWalletPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginToWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
