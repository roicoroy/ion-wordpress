import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NdGraphicsPage } from './nd-graphics.page';

describe('NdGraphicsPage', () => {
  let component: NdGraphicsPage;
  let fixture: ComponentFixture<NdGraphicsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NdGraphicsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
