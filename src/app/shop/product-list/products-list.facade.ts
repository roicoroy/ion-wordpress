import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/shared/wooApi';
import { AuthState, IUserResponseModel } from 'src/app/store/auth/auth.state';
import { ProductsState } from 'src/app/store/products/products.state';

export interface IHomeListModel {
    products: Product[];
    user: IUserResponseModel
}

@Injectable({
    providedIn: 'root'
})
export class ProductsListFacade {

    @Select(ProductsState.getProducts) products$!: Observable<Product[]>;

    readonly viewState$: Observable<any>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.products$
            ]
        )
        .pipe(
            map((
                products,
            ) => ({
                products: products[0],
            }))
        );
    }
}
