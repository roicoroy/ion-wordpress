import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ProductsActions } from '../store/products/products.actions';
import { IHomeListModel, WooProductsFacade } from './woo-products.facade';
import { WooProductsComponent } from '../components/woo-products/woo-products.component';
import { CardMenuComponent } from '../components/card-menu/card-menu.component';

@Component({
  selector: 'app-woo-products',
  templateUrl: './woo-products.page.html',
  styleUrls: ['./woo-products.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    WooProductsComponent,
  ]
})
export class WooProductsPage implements OnInit, OnDestroy {

  btnSelected: boolean | null = null;

  viewState$: Observable<IHomeListModel>;

  private readonly ngUnsubscribe = new Subject();

  productsList: any;

  constructor(
    private facade: WooProductsFacade,
    private store: Store,
  ) {
    this.viewState$ = this.facade.viewState$;

    this.viewState$
      .pipe(
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe({
        next: (p) => {
          console.log(p.products);
          this.productsList = p.products[0];
        },
        error: (e) => {
          console.error(e)
        },
        complete: () => {
          console.info('complete')
        },
      });
  }

  ionViewWillEnter() {
    this.store.dispatch(new ProductsActions.GetProducts());
  }

  onButtonAction(data: any) {
    console.log(data);
    // this.store.dispatch(new )
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
  }

}
