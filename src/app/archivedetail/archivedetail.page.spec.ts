import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedetailPage } from './archivedetail.page';

describe('ArchivedetailPage', () => {
  let component: ArchivedetailPage;
  let fixture: ComponentFixture<ArchivedetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivedetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivedetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
