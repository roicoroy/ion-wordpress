import { Injectable, inject } from "@angular/core";
import { Action, Selector, State, StateContext, Store } from "@ngxs/store";
import { AuthService, CreateNonceRes } from "src/app/shared/wooApi";
import { tap, catchError, Observable } from "rxjs";
import { AuthActions } from "./auth.actions";
import { IStoreSnapshoModel } from "../store.snapshot.interface";

export interface IUserResponseModel {
    token: string;
    user_display_name: string;
    user_email: string;
    user_nicename: string;
}

export interface IAuthStateModel {
    user: IUserResponseModel,
    isLoggedIn: boolean
}

@State<IAuthStateModel>({
    name: 'auth',
    defaults: {
        user: {
            token: '',
            user_display_name: '',
            user_email: '',
            user_nicename: '',
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

    @Selector()
    static getUser(state: IAuthStateModel): IUserResponseModel {
        return state.user;
    }

    @Selector()
    static getToken(state: IAuthStateModel): string {
        return state.user.token;
    }

    @Selector()
    static isLoggedIn(state: IAuthStateModel): boolean {
        return state.isLoggedIn;
    }

    @Action(AuthActions.CreateNonceAction)
    createNonceAction(ctx: StateContext<IAuthStateModel>, { payload }: AuthActions.CreateNonceAction) {
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

    /* 
     * Do Login
    */
    @Action(AuthActions.DoLogin)
    async doLogin(ctx: StateContext<IAuthStateModel>, { data }: AuthActions.DoLogin) {
        // console.log(data);
        const payload = {
            username: data.username,
            password: data.password
        }
        this.wooApi.doLogin(data.username, data.password)
        .pipe(
            catchError(e => {
                ctx.patchState({
                    isLoggedIn: false
                });
                return new Observable(obs => obs.error(e));
            })
        )
        .subscribe(async (res: any) => {
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
        const user = await this.wooApi.getUser();
        if (user) {
            ctx.patchState({
                user: {
                    token: user?.token,
                    user_display_name: user?.user_display_name,
                    user_email: user?.user_email,
                    user_nicename: user?.user_nicename,
                },
                isLoggedIn: true
            });
        } else {
        }
    }

    /* 
     * Auth Token
    */
    @Action(AuthActions.GetAuthToken)
    getAuthToken(ctx: StateContext<IAuthStateModel>, { payload }: AuthActions.GetAuthToken) {
        console.log(payload);
        this.wooApi.getAuthToken(payload)
            .pipe(
                catchError(e => {
                    ctx.patchState({
                        isLoggedIn: false
                    });
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
                    isLoggedIn: true
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
        this.wooApi.logOut()
            .then(
                (res) => {
                    ctx.patchState({
                        user: {
                            token: '',
                            user_display_name: '',
                            user_email: '',
                            user_nicename: '',
                        },
                        isLoggedIn: false
                    });
                },
                (err) => console.log('Error logging out')
            )
    }

}