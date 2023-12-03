import { Injectable, OnDestroy, inject } from "@angular/core";
import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { UserProfileActions } from "./settings.actions";
import { Subject } from "rxjs";
import { UserProfileStateService } from "src/app/shared/user-profile.service";
import { FcmService } from "src/app/shared/fcm.service";

export interface SeetingsModel {
    isDarkMode: boolean;
    fcmAccepted: boolean;
    fcmToken: string;
}

@State({
    name: 'settings',
})
@Injectable()
export class UserProfileState implements OnDestroy {

    subscription = new Subject();

    private store = inject(Store);

    private service = inject(UserProfileStateService);

    private fcmService = inject(FcmService);

    @Selector()
    static getFcmToken(state: SeetingsModel): string {
        return state.fcmToken;
    }

    @Action(UserProfileActions.UpdateDarkMode)
    updateDarkMode(ctx: StateContext<SeetingsModel>, action: UserProfileActions.UpdateDarkMode): void {
        const state = ctx.getState();
        ctx.patchState({
            ...state,
            isDarkMode: action.isDarkMode,
        });
    }

    @Action(UserProfileActions.UpdateFcmAccepted)
    updateFcmAccepted(ctx: StateContext<SeetingsModel>, action: UserProfileActions.UpdateFcmAccepted): void {
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.user.id);
        console.log(action.fcmAccepted);
        const state = ctx.getState();
        ctx.patchState({
            ...state,
            fcmAccepted: action.fcmAccepted,
        });
    }

    @Action(UserProfileActions.SetFcmToken)
    setFcmToken(ctx: StateContext<SeetingsModel>, action: UserProfileActions.SetFcmToken): void {
        console.log(action.fcmToken);
        const state = ctx.getState();
        ctx.patchState({
            ...state,
            fcmToken: action.fcmToken,
        });
    }

    @Action(UserProfileActions.UpdateStrapiUser)
    updateStrapiUser(ctx: StateContext<SeetingsModel>, action: UserProfileActions.UpdateStrapiUser) {
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.user.id);
        if (userId) {
        }
    }

    @Action(UserProfileActions.UploadImage)
    uploadImage(ctx: StateContext<SeetingsModel>, action: UserProfileActions.UploadImage) {
        const userId = this.store.selectSnapshot<any>((state: any) => state.authState?.user.id);
    }


    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
