import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleCreationComponent } from './rule-creation.component';

describe('OnboardingComponent', () => {
  let component: RuleCreationComponent;
  let fixture: ComponentFixture<RuleCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuleCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
