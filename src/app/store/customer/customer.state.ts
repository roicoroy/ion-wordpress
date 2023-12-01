import { Injectable, inject } from "@angular/core";
import { Action, State, StateContext } from "@ngxs/store";
import { WoocommerceCustomerService } from "src/app/shared/wooApi";
import { CustomerActions } from "./customer.actions";

export interface ICustomerStateModel {

}

@State<ICustomerStateModel>({
    name: 'customer',
    defaults: {
    },
})
@Injectable({
    providedIn: 'root'
})
export class CustomerState {
    private wooApi = inject(WoocommerceCustomerService);

    @Action(CustomerActions.CreateCustomers)
    createCustomers(ctx: StateContext<ICustomerStateModel>, { customer }: CustomerActions.CreateCustomers) {
        console.log(customer);
        // ctx.patchState({
        // });
    }
    @Action(CustomerActions.RetrieveCustomers)
    retrieveCustomers(ctx: StateContext<ICustomerStateModel>, { id }: CustomerActions.RetrieveCustomers) {
        console.log(id);
        // ctx.patchState({
        // });
    }
    @Action(CustomerActions.UpdateCustomers)
    updateCustomers(ctx: StateContext<ICustomerStateModel>, { id }: CustomerActions.UpdateCustomers) {
        console.log(id);
        // ctx.patchState({
        // });
    }

}