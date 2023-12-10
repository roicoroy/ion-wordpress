
import { Injectable, OnDestroy, inject } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { tap, catchError, Observable, Subject, takeUntil } from 'rxjs';
import { ProductsActions } from './products.actions';
import { WoocommerceProductsService } from 'src/app/shared/wooApi';
import { Product } from '../../shared/wooApi/products/product.interface';
import { ErrorLoggingActions } from '../errors-logging/errors-logging.actions';

export interface IProductsStateModel {
    products: Product[];
}

@State<IProductsStateModel>({
    name: 'products',
})
@Injectable({
    providedIn: 'root'
})
export class ProductsState implements OnDestroy{

    private store = inject(Store);
    
    private wooProducts = inject(WoocommerceProductsService);
    
    private readonly ngUnsubscribe = new Subject();

    @Selector()
    static getProducts(state: IProductsStateModel): Product[] {
        return state.products;
    }

    @Action(ProductsActions.RetrieveProducts)
    retrieveProducts(ctx: StateContext<IProductsStateModel>) {
        this.wooProducts.retrieveProducts()
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    return new Observable(obs => obs.error(e));
                }),
            )
            .subscribe((response:any) => {
                if(response.products){
                    return ctx.patchState({
                        products: response.products,
                    });
                }
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}