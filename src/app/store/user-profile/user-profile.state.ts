import { Injectable, OnDestroy, inject } from "@angular/core";
import { State, Action, StateContext, Store } from "@ngxs/store";
import { UserProfileActions } from "./user-profile.actions";
import { Subject } from "rxjs";
import { UserProfileStateService } from "src/app/shared/user-profile.service";

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
    }

    @Action(UserProfileActions.UpdateStrapiUser)
    updateStrapiUser(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UpdateStrapiUser) {
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.user.id);
        if (userId) {
        }
    }

    @Action(UserProfileActions.UploadImage)
    uploadImage(ctx: StateContext<UserProfileModel>, action: UserProfileActions.UploadImage) {
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.user.id);
    }
}
