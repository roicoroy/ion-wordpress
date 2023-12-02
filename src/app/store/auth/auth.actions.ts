import { CreateNonce, LoginPayload, RegisterPayload } from "src/app/shared/wooApi";

export namespace AuthActions {
    export class CreateNonceAction {
        static readonly type = '[AuthActions] CreateNonceAction';
        constructor(public payload: CreateNonce) { }
    }
    export class Register {
        static readonly type = '[AuthActions] Register';
        constructor(public registerData: RegisterPayload) { }
    }
    export class RetrievePassword {
        static readonly type = '[AuthActions] RetrievePassword';
        constructor(public username: string) { }
    }
    export class GetAuthToken {
        static readonly type = '[AuthActions] GetAuthToken';
        constructor(public payload: LoginPayload) { }
    }
    export class RefresUserState {
        static readonly type = '[AuthActions] RefresUserState';
    }
    export class DoLogin {
        static readonly type = '[AuthActions] Do Login';
        constructor(public data: LoginPayload) { }
    }
    export class GenerateAuthCookie {
        static readonly type = '[AuthActions] GenerateAuthCookie';
        constructor(public data: LoginPayload) { }
    }
    export class AuthLogout {
        static readonly type = '[AuthActions] AuthLogout';
    }
}