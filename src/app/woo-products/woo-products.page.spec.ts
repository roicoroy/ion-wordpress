import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WooProductsPage } from './woo-products.page';

describe('WooProductsPage', () => {
  let component: WooProductsPage;
  let fixture: ComponentFixture<WooProductsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(WooProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
