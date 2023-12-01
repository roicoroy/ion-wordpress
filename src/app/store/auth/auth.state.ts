import { Injectable, inject } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { AuthService, CreateNonceRes, WoocommerceCustomerService } from "src/app/shared/wooApi";
import { tap, catchError, Observable } from "rxjs";
import { AuthActions } from "./auth.actions";

export interface IUserResponseModel {
    token: string;
    user_display_name: string;
    user_email: string;
    user_nicename: string;
}

export interface IAuthStateModel {
    user: IUserResponseModel
}

@State<IAuthStateModel>({
    name: 'auth',
    defaults: {
        user: {
            token: '',
            user_display_name: '',
            user_email: '',
            user_nicename: '',
        }
    },
})
@Injectable({
    providedIn: 'root'
})
export class AuthState {
    private wooApi = inject(AuthService);

    @Selector()
    static getUser(state: IAuthStateModel): IUserResponseModel {
        return state.user;
    }

    @Selector()
    static getToken(state: IAuthStateModel): string {
        return state.user.token;
    }

    @Action(AuthActions.CreateNonceAction)
    createNonceAction(ctx: StateContext<IAuthStateModel>, { payload }: AuthActions.CreateNonceAction) {
        // console.log(payload);
        this.wooApi.createNonce(payload)
            .pipe(
                catchError(e => {
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((res: CreateNonceRes) => {
                console.log(res);
            });
    }

    @Action(AuthActions.RetrievePassword)
    RetrievePassword(ctx: StateContext<IAuthStateModel>, { username }: AuthActions.RetrievePassword) {
        console.log(username);
    }

    /* 
     * Login
    */
    @Action(AuthActions.GetAuthToken)
    getAuthToken(ctx: StateContext<IAuthStateModel>, { payload }: AuthActions.GetAuthToken) {
        console.log(payload);
        this.wooApi.getAuthToken(payload)
            .pipe(
                catchError(e => {
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((user: IUserResponseModel) => {
                console.log(user);
                ctx.patchState({
                    user: {
                        token: user?.token,
                        user_display_name: user?.user_display_name,
                        user_email: user?.user_email,
                        user_nicename: user?.user_nicename,
                    },
                });

            });
    }

    @Action(AuthActions.GenerateAuthCookie)
    GenerateAuthCookie(ctx: StateContext<IAuthStateModel>, { data }: AuthActions.GenerateAuthCookie) {
        // console.log(data);
        this.wooApi.generateAuthCookie(data)
            .pipe(
                tap((user: IUserResponseModel) => {
                    console.log(user);
                }),
                catchError(e => {
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((response) => {
                console.log(response);
            });
    }

    @Action(AuthActions.AuthLogout)
    authLogout(ctx: StateContext<IAuthStateModel>, { }: AuthActions.AuthLogout) {
        ctx.patchState({
            user: {
                token: '',
                user_display_name: '',
                user_email: '',
                user_nicename: '',
            }
        });
    }

}