import { Injectable, inject } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { AuthService, CreateNonceRes, LoginPayload, UserResponse, WordpressWpUserResponsePayload } from "src/app/shared/wooApi";
import { tap, catchError, Observable, Subject, takeUntil } from "rxjs";
import { AuthActions } from "./auth.actions";
import { IStoreSnapshoModel } from "../store.snapshot.interface";
import { IonStorageService } from "src/app/shared/utils/ionstorage.service";
import { ErrorLoggingActions } from "../errors-logging/errors-logging.actions";
import { Router } from "@angular/router";

export interface IUserResponseModel {
    token: string | null;
    user_display_name: string | null;
    user_email: string | null;
    user_nicename: string | null;
}

export interface IAuthStateModel {
    user: IUserResponseModel,
    isLoggedIn: boolean,
    retrievePasswordResponseCode: number,
    retrievePasswordResponseMessage: string,
}

@State<IAuthStateModel>({
    name: 'auth',
    // defaults: {
    //     user: {
    //         token: null,
    //         user_display_name: null,
    //         user_email: null,
    //         user_nicename: null,
    //     },
    //     isLoggedIn: false,
    // },
})
@Injectable({
    providedIn: 'root'
})
export class AuthState {

    private store = inject(Store);

    private router = inject(Router);

    private wooApi = inject(AuthService);

    private ionStorage = inject(IonStorageService);

    private readonly ngUnsubscribe = new Subject();

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
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe(async (response: WordpressWpUserResponsePayload) => {
                // console.log('registerData', response);
                if (response.code === 200) {
                    const loginPaylod: LoginPayload = {
                        username: registerData.email,
                        password: registerData.password,
                    };
                    this.store.dispatch(new AuthActions.GetAuthToken(loginPaylod));
                }
            });
    }

    /* 
     * Do Login
    */
    @Action(AuthActions.Login)
    async Login(ctx: StateContext<IAuthStateModel>, { loginPayload }: AuthActions.Login) {
        // console.log(loginPayload);
        this.store.dispatch(new AuthActions.GetAuthToken(loginPayload));
    }

    /* 
     * Auth Token
    */
    @Action(AuthActions.GetAuthToken)
    getAuthToken(ctx: StateContext<IAuthStateModel>, { loginPayload }: AuthActions.GetAuthToken) {
        
        
        console.log(loginPayload);


        this.wooApi.getAuthToken(loginPayload)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((user: IUserResponseModel) => {
                console.log(user);
                this.wooApi.setUser({
                    token: user?.token,
                    user_display_name: user?.user_display_name,
                    user_email: user?.user_email,
                    user_nicename: user?.user_nicename,
                }).then(() => {
                    this.router.navigateByUrl('product-list').then(() => {
                        return ctx.patchState({
                            user: {
                                token: user?.token,
                                user_display_name: user?.user_display_name,
                                user_email: user?.user_email,
                                user_nicename: user?.user_nicename,
                            },
                            isLoggedIn: true
                        });
                    });
                });
            });
    }

    @Action(AuthActions.GenerateAuthCookie)
    generateAuthCookie(ctx: StateContext<IAuthStateModel>, { loginPayload }: AuthActions.GenerateAuthCookie) {
        // console.log(data);
        this.wooApi.generateAuthCookie(loginPayload)
            .pipe(
                takeUntil(this.ngUnsubscribe),
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

    @Action(AuthActions.RetrievePassword)
    RetrievePassword(ctx: StateContext<IAuthStateModel>, { payload }: AuthActions.RetrievePassword) {
        console.log(payload.username);
        this.wooApi.retrievePassword(payload.username)
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe({
                next(response: WordpressWpUserResponsePayload) {
                    console.log('got value ' + JSON.stringify(response));
                    return ctx.patchState({
                        isLoggedIn: false,
                        retrievePasswordResponseCode: response.code,
                        retrievePasswordResponseMessage: response.message
                    });
                },
                error(err) {
                    console.error('something wrong occurred: ' + err);
                },
                complete() {
                    console.log('done');
                },
            });
    }

    @Action(AuthActions.RefresUserState)
    async refresUserState(ctx: StateContext<IAuthStateModel>, { }: AuthActions.RefresUserState) {
        this.ionStorage.getKeyAsObservable('user')
            .pipe(
                takeUntil(this.ngUnsubscribe),
                catchError(e => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
                    this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
                    return new Observable(obs => obs.error(e));
                })
            )
            .subscribe((user: UserResponse) => {
                console.log(user);
                if (user) {
                    ctx.patchState({
                        user: {
                            token: user.token,
                            user_display_name: user.user_display_name,
                            user_email: user.user_email,
                            user_nicename: user.user_nicename,
                        },
                        isLoggedIn: true
                    });
                } else {
                    ctx.patchState({
                        user: {
                            token: null,
                            user_display_name: null,
                            user_email: null,
                            user_nicename: null,
                        },
                        isLoggedIn: false
                    });
                }
            });
    }

    @Action(AuthActions.AuthLogout)
    authLogout(ctx: StateContext<IAuthStateModel>, { }: AuthActions.AuthLogout) {
        return this.ionStorage.storageRemove('user')
            .then(() => {
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

    @Action(AuthActions.CreateNonceAction)
    createNonceAction(ctx: StateContext<IAuthStateModel>, { payload }: AuthActions.CreateNonceAction) {
        this.wooApi.createNonce(payload)
            .pipe(
                takeUntil(this.ngUnsubscribe),
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

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }

}