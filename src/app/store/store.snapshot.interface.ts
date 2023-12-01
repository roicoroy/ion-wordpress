import { IAuthStateModel } from "./auth/auth.state";
import { ICustomerStateModel } from "./customer/customer.state";
import { IProductsStateModel } from "./products/products.state";

export interface IStoreSnapshoModel {
    auth: IAuthStateModel,
    customer: ICustomerStateModel,
    products: IProductsStateModel
}