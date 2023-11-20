import { Product } from '../../shared/wooApi/products/product.interface';

export namespace ProductsActions {
    export class GetProducts {
        static readonly type = '[Products] Get Products';
    }
    export class SetSelectedProducts {
        static readonly type = '[Result] Set Selected Products';
        constructor(public payload: Product) { }
    }
    export class RemoveSelectedProducts {
        static readonly type = '[Result] Remove Selected Products';
    }
}