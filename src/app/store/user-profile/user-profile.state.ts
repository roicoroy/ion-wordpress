import { Injectable, OnDestroy, inject } from "@angular/core";
import { State, Action, StateContext, Store } from "@ngxs/store";
import { UserProfileActions } from "./user-profile.actions";
import { Subject, catchError, takeUntil, throwError } from "rxjs";
import { UserProfileStateService } from "src/app/shared/user-profile.service";
import { AuthActions } from "../auth/auth.actions";

export class UserProfileModel {
}

@State({
    name: 'userProfile',
})
@Injectable()
export class UserProfileState implements OnDestroy {

    subscription = new Subject();

    private store = inject(Store);
    
    private service = inject(UserProfileStateService);

    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }

    @Action(UserProfileActions.UpdateDarkMode)
    updateDarkMode(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UpdateDarkMode): void {
        const state = ctx.getState();
        ctx.patchState({
            ...state,
            isDarkMode: action.isDarkMode,
        });
    }

    @Action(UserProfileActions.UpdateFcmAccepted)
    updateFcmAccepted(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UpdateFcmAccepted): void {
        const state = ctx.getState();
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.user.id);
        this.service.updateStrapiUserFcm(userId, action.fcmAccepted, '123')
            .pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    // this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                    return throwError(() => new Error(err));
                }),
            )
            .subscribe((user) => {
                // this.store.dispatch(new AuthActions.LoadStrapiUser(userId));
                // ctx.patchState({
                //     ...state,
                //     fcmAccepted: action.fcmAccepted,
                // });
            });
    }

    @Action(UserProfileActions.UpdateStrapiUser)
    updateStrapiUser(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UpdateStrapiUser) {
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.user.id);
        if (userId) {
            this.service.updateStrapiUserProfile(userId, action.userForm).pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    // this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                    return throwError(() => new Error(err));
                }),
            ).subscribe(() => {
                // this.store.dispatch(new AuthStateActions.LoadStrapiUser(userId));
            });
        }
    }

    @Action(UserProfileActions.UploadImage)
    uploadImage(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UploadImage) {
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.user.id);
        this.service.uploadStrapiImageToServer(action.imageForm)
            .pipe(
                takeUntil(this.subscription),
                catchError(err => {
                    // this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                    return throwError(() => new Error(err));
                }),
            )
            .subscribe((response: any) => {
                const fileId = response[0].id;
                this.service.setProfileImage(userId, fileId)
                    .pipe(
                        takeUntil(this.subscription),
                        catchError(err => {
                            // this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(err));
                            return throwError(() => new Error(err));
                        }),
                    )
                    .subscribe((user: any) => {
                        // this.store.dispatch(new AuthStateActions.LoadStrapiUser(userId));
                    });;
            });
    }
}
