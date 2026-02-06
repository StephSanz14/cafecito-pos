import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicshellComponent } from './publicshell.component';

describe('PublicshellComponent', () => {
  let component: PublicshellComponent;
  let fixture: ComponentFixture<PublicshellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicshellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicshellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
