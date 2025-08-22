import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaasFeaturesComponent } from './saas-features.component';

describe('SaasFeaturesComponent', () => {
  let component: SaasFeaturesComponent;
  let fixture: ComponentFixture<SaasFeaturesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaasFeaturesComponent]
    });
    fixture = TestBed.createComponent(SaasFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
