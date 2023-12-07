import { Injectable, OnDestroy, inject } from "@angular/core";
import { State, Action, StateContext, Store, Selector } from "@ngxs/store";
import { UserProfileActions } from "./settings.actions";
import { Subject, from } from "rxjs";
import { UserProfileStateService } from "src/app/shared/user-profile.service";
import { FcmService } from "src/app/shared/fcm.service";
import { IStoreSnapshoModel } from "../store.snapshot.interface";
import { set } from "date-fns";

export interface ISettingsModel {
    isDarkMode: boolean;
    fcmAccepted: boolean;
    fcmToken: string;
}

@State({
    name: 'settings',
    defaults: {
        fcmAccepted: null,
        fcmToken: null
    }
})
@Injectable()
export class SettingsState implements OnDestroy {

    subscription = new Subject();

    private store = inject(Store);

    private service = inject(UserProfileStateService);

    private fcmService = inject(FcmService);

    @Selector()
    static getFcmToken(state: ISettingsModel): string {
        return state.fcmToken;
    }

    @Action(UserProfileActions.UpdateDarkMode)
    updateDarkMode(ctx: StateContext<ISettingsModel>, action: UserProfileActions.UpdateDarkMode): void {
        const state = ctx.getState();
        ctx.patchState({
            ...state,
            isDarkMode: action.isDarkMode,
        });
    }

    @Action(UserProfileActions.UpdateFcmAccepted)
    updateFcmAccepted(ctx: StateContext<ISettingsModel>, action: UserProfileActions.UpdateFcmAccepted): void {
        const fcmToken = this.store.selectSnapshot<string>((state: IStoreSnapshoModel) => state.settings.fcmToken);
        const state = ctx.getState();
        if (action.fcmAccepted) {
            if (!fcmToken) {
                console.log('No fcm token, request one:');
                this.fcmService.registerNotifications()
                    .then(() => {
                        setTimeout(() => {
                            const fcmToken = this.store.selectSnapshot<string>((state: IStoreSnapshoModel) => state.settings.fcmToken);
                            this.fcmService.postSubscribeData(fcmToken);
                        }, 1000);
                    });
            } else {
                this.fcmService.postSubscribeData(fcmToken)
            }
            ctx.patchState({
                ...state,
                fcmAccepted: action.fcmAccepted,
            });
        }

        if (!action.fcmAccepted) {
            this.fcmService.postUnSubscribeData()
            ctx.patchState({
                ...state,
                // update negative
                fcmAccepted: action.fcmAccepted,
                // remove token because denyingxx
                fcmToken: undefined
            });
        }
    }

    @Action(UserProfileActions.SetFcmToken)
    setFcmToken(ctx: StateContext<ISettingsModel>, action: UserProfileActions.SetFcmToken): void {
        const state = ctx.getState();
        ctx.patchState({
            ...state,
            fcmToken: action.fcmToken.value
        });
    }

    ngOnDestroy() {
        this.subscription.next(null);
        this.subscription.complete();
    }
}
