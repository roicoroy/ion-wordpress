
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { tap, catchError, Observable } from 'rxjs';
import { ProductsActions } from './products.actions';
import { WoocommerceProductsService } from 'src/app/shared/wooApi';
import { Product } from '../../shared/wooApi/products/product.interface';

export interface IProductsStateModel {
    products?: Product[] | any;
    selectedProduct?: Product | null;
    isLoading?: boolean;
}

@State<IProductsStateModel>({
    name: 'products',
    defaults: {
        isLoading: false,
    },
})
@Injectable({
    providedIn: 'root'
})
export class ProductsState {

    constructor(
        private wooProducts: WoocommerceProductsService
    ) { }

    // Defines a new selector for the error field
    @Selector()
    static getProducts(state: IProductsStateModel): Product[] {
        return state.products;
    }

    // Triggers the PinTask action, similar to redux
    @Action(ProductsActions.GetProducts)
    getProducts(ctx: StateContext<IProductsStateModel>) {
        this.wooProducts.retrieveProducts()
            .pipe(
                tap((response: Product[] | any) => {
                    console.log(response);
                    let array = [];
                    array.push(response?.products);
                    
                    // console.log(array);
    
                    ctx.patchState({
                        products: array[0],
                    });
                }),
                catchError(e => {
                    ctx.patchState({
                        isLoading: false
                    });
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