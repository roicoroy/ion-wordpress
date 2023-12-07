import { Injectable, inject } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { AuthService, CreateNonceRes } from "src/app/shared/wooApi";
import { tap, catchError, Observable, from } from "rxjs";
import { AuthActions } from "./auth.actions";
import { IStoreSnapshoModel } from "../store.snapshot.interface";
import { IonStorageService } from "src/app/shared/utils/ionstorage.service";
import { ErrorLoggingActions } from "../errors-logging/errors-logging.actions";
import { RegisterUserInterface, SimpleJwtLogin } from "src/app/shared/wordpress/wordpress-simple-jwt-login";
import { environment } from "src/environments/environment";

export interface IUserResponseModel {
    token: string | null;
    user_display_name: string | null;
    user_email: string | null;
    user_nicename: string | null;
}

export interface IAuthStateModel {
    user: IUserResponseModel,
    isLoggedIn: boolean
}

@State<IAuthStateModel>({
    name: 'auth',
    defaults: {
        user: {
            token: null,
            user_display_name: null,
            user_email: null,
            user_nicename: null,
        },
        isLoggedIn: false
    },
})
@Injectable({
    providedIn: 'root'
})
export class AuthState {

    private store = inject(Store);

    private wooApi = inject(AuthService);

    private ionStorage = inject(IonStorageService);

    @Selector()
    static getUser(state: IAuthStateModel): IUserResponseModel {
        return state.user;
    }

    @Selector()
    static getToken(state: IAuthStateModel): string | null {
        return state.user.token;
    }

    @Selector()
    static isLoggedIn(state: IAuthStateModel): boolean {
        return state.isLoggedIn;
    }

    /* 
     * Register
    */
    @Action(AuthActions.Register)
    register(ctx: StateContext<IAuthStateModel>, { registerData }: AuthActions.Register) {
        this.wooApi.register(registerData)
            .pipe(
                catchError(e => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe(async (res: IUserResponseModel) => {
                console.log('registerData', res);
                await this.wooApi.setUser({
                    token: res?.token,
                    user_display_name: res?.user_display_name,
                    user_email: res?.user_email,
                    user_nicename: res?.user_nicename,
                });
                return ctx.patchState({
                    user: {
                        token: res?.token,
                        user_display_name: res?.user_display_name,
                        user_email: res?.user_email,
                        user_nicename: res?.user_nicename,
                    },
                    isLoggedIn: true
                });
            });

        const stateUser = this.store.selectSnapshot((state: IStoreSnapshoModel) => state.auth.user);
        if (stateUser.token) {
        }
    }

    /* 
     * Do Login
    */
    @Action(AuthActions.DoLogin)
    async doLogin(ctx: StateContext<IAuthStateModel>, { data }: AuthActions.DoLogin) {
        return this.wooApi.login(data.username, data.password).subscribe((res) => {
            console.log(res);
        });
    }

    /* 
     * Auth Token
    */
    @Action(AuthActions.GetAuthToken)
    getAuthToken(ctx: StateContext<IAuthStateModel>, { payload }: AuthActions.GetAuthToken) {
        this.wooApi.getAuthToken(payload)
            .pipe(
                catchError(e => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((user: IUserResponseModel) => {
                ctx.patchState({
                    user: {
                        token: user?.token,
                        user_display_name: user?.user_display_name,
                        user_email: user?.user_email,
                        user_nicename: user?.user_nicename,
                    },
                    isLoggedIn: true
                });

            });
    }

    @Action(AuthActions.CreateNonceAction)
    createNonceAction(ctx: StateContext<IAuthStateModel>, { payload }: AuthActions.CreateNonceAction) {
        this.wooApi.createNonce(payload)
            .pipe(
                catchError(e => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
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

    @Action(AuthActions.GenerateAuthCookie)
    generateAuthCookie(ctx: StateContext<IAuthStateModel>, { data }: AuthActions.GenerateAuthCookie) {
        // console.log(data);
        this.wooApi.generateAuthCookie(data)
            .pipe(
                tap((user: IUserResponseModel) => {
                    console.log(user);
                }),
                catchError(e => {
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((response) => {
                console.log(response);
            });
    }

    @Action(AuthActions.RefresUserState)
    async refresUserState(ctx: StateContext<IAuthStateModel>, { }: AuthActions.RefresUserState) {
        const storageUser = await this.wooApi.getUser();
        const stateUser = this.store.selectSnapshot((state: IStoreSnapshoModel) => state.auth.user);
        if (storageUser) {
            ctx.patchState({
                user: {
                    token: storageUser?.token,
                    user_display_name: storageUser?.user_display_name,
                    user_email: storageUser?.user_email,
                    user_nicename: storageUser?.user_nicename,
                },
                isLoggedIn: true
            });
        } else if (stateUser) {
            this.wooApi.setUser({
                token: stateUser?.token,
                user_display_name: stateUser?.user_display_name,
                user_email: stateUser?.user_email,
                user_nicename: stateUser?.user_nicename,
            });
        }

    }

    @Action(AuthActions.AuthLogout)
    authLogout(ctx: StateContext<IAuthStateModel>, { }: AuthActions.AuthLogout) {
        return this.ionStorage.storageRemove('user')
            .then(
                (res) => {
                    return ctx.patchState({
                        user: {
                            token: null,
                            user_display_name: null,
                            user_email: null,
                            user_nicename: null,
                        },
                        isLoggedIn: false
                    });
                },
                (e) => {
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    console.log('Error logging out');
                }
            )
    }

}