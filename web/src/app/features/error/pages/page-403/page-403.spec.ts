import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Page403 } from './page-403';

describe('Page403', () => {
  let component: Page403;
  let fixture: ComponentFixture<Page403>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Page403]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Page403);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
