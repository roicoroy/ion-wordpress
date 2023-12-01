
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap, catchError, Observable } from 'rxjs';
import { ProductsActions } from './products.actions';
import { WoocommerceProductsService } from 'src/app/shared/wooApi';
import { Product } from '../../shared/wooApi/products/product.interface';

export interface IProductsStateModel {
    products?: Product[] | any;
    selectedProduct?: Product | null;
}

@State<IProductsStateModel>({
    name: 'products',
    defaults: {
        products: null
    },
})
@Injectable({
    providedIn: 'root'
})
export class ProductsState {

    constructor(
        private wooProducts: WoocommerceProductsService
    ) { }

    @Selector()
    static getProducts(state: IProductsStateModel): Product[] {
        return state.products;
    }

    @Action(ProductsActions.RetrieveProducts)
    retrieveProducts(ctx: StateContext<IProductsStateModel>) {
        this.wooProducts.retrieveProducts()
            .pipe(
                tap((response: Product[] | any) => {
                    // console.log(response);
                    // console.log(response.products);
                    ctx.patchState({
                        products: response.products,
                    });
                }),
                catchError(e => {
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((response) => {
            });
    }

    @Action(ProductsActions.SetSelectedProducts)
    setSelectedResult(ctx: StateContext<IProductsStateModel>, { payload }: ProductsActions.SetSelectedProducts) {
        ctx.patchState({
            selectedProduct: payload
        });
    }

    @Action(ProductsActions.RemoveSelectedProducts)
    removeSelectedResult(ctx: StateContext<IProductsStateModel>) {
        ctx.patchState({
            selectedProduct: null
        });
    }
}