import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { FcmActions } from './fcm.actions';
import { FcmService } from 'src/app/shared/fcm.service';

export class FcmStateModel {
    device_token!: string;
    fcm_accepted!: string;
}
@State<FcmStateModel>({
    name: 'fcm',
    defaults: {
        device_token: '',
        fcm_accepted: '',
    }
})
@Injectable()
export class FcmState {

    constructor(
        private fcmService: FcmService,
        private store: Store,
    ) { }

    @Action(FcmActions.GetFcmToken)
    getFcmToken(ctx: StateContext<FcmStateModel>) {
        const state = ctx.getState();
    }

}
