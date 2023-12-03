import { Injectable, inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth/auth.state';
import { AuthActions } from '../store/auth/auth.actions';
import { UserProfileActions } from '../store/settings/settings.actions';
import { UserProfileState } from '../store/settings/settings.state';

export interface ISeetingsFacadeState {
    isLoggedIn: boolean,
    fcmToken: string,
}

@Injectable({
    providedIn: 'root'
})
export class SettingsFacade {

    @Select(AuthState.isLoggedIn) isLoggedIn$!: Observable<boolean>;

    @Select(UserProfileState.getFcmToken) fcmToken$!: Observable<string>;

    private store = inject(Store);

    readonly viewState$: Observable<ISeetingsFacadeState>;

    constructor() {
        this.viewState$ = combineLatest(
            [
                this.isLoggedIn$,
                this.fcmToken$,
            ]
        ).pipe(
            map((
                [
                    isLoggedIn,
                    fcmToken
                ]
            ) => ({
                isLoggedIn,
                fcmToken
            }))
        );
    }

    appLogout() {
        this.store.dispatch(new AuthActions.AuthLogout());
    }

    loadApp() {
        this.store.dispatch(new AuthActions.RefresUserState());
    }

    appUploadProfileImage(formData: FormData) {
        console.log(formData);
        // return this.store.dispatch(new UserProfileActions.UploadImage(formData))
    }

    setDarkMode(isDarkMode: boolean) {
        // return this.store.dispatch(new UserProfileActions.UpdateDarkMode(isDarkMode))
    }

    setFCMStatus(pushAccepted: boolean) {
        return this.store.dispatch(new UserProfileActions.UpdateFcmAccepted(pushAccepted))
    }
}
