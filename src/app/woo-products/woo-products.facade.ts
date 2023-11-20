import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsState } from '../store/products/products.state';
import { Product } from '../shared/wooApi/products/product.interface';

export interface IHomeListModel {
    products: Product[];
}

@Injectable({
    providedIn: 'root'
})
export class WooProductsFacade {

    @Select(ProductsState.getProducts) products$!: Observable<Product[]>;

    readonly viewState$: Observable<any>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.products$
            ]
        ).pipe(
            map((products) => ({
                products
            }))
        );
    }
}
