import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestExtraComponent } from './test-extra.component';

describe('TestExtraComponent', () => {
  let component: TestExtraComponent;
  let fixture: ComponentFixture<TestExtraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestExtraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
