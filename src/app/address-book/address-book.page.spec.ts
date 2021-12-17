import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AddressBookPage } from './address-book.page';

describe('AddressBookPage', () => {
  let component: AddressBookPage;
  let fixture: ComponentFixture<AddressBookPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressBookPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
