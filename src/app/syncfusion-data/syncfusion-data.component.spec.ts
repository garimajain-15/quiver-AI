import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncfusionDataComponent } from './syncfusion-data.component';

describe('SyncfusionDataComponent', () => {
  let component: SyncfusionDataComponent;
  let fixture: ComponentFixture<SyncfusionDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncfusionDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SyncfusionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
