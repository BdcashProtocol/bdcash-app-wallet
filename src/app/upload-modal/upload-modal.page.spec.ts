import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadModalPage } from './upload-modal.page';

describe('UploadModalPage', () => {
  let component: UploadModalPage;
  let fixture: ComponentFixture<UploadModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
