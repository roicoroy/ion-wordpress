import { Customer } from '../../shared/wooApi';

export namespace CustomerActions {
    export class CreateCustomers {
        static readonly type = '[CustomerActions] CreateCustomers';
        constructor(public customer: Customer) { }
    }
    export class RetrieveCustomers {
        static readonly type = '[CustomerActions] RetrieveCustomers';
        constructor(public id: number) { }
    }
    export class UpdateCustomers {
        static readonly type = '[CustomerActions] UpdateCustomers';
        constructor(public id: number) { }
    }
}