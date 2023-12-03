import { Injectable } from "@angular/core";
import { AlertController, AlertOptions } from "@ionic/angular";
import { State, Store, Action, StateContext } from "@ngxs/store";
import { ClearErrorEntry, LogErrorEntry } from "./errors-logging.actions";

export class ErrosStateModel {
    errorEntry!: Error[];
}

@State({
    name: 'errorsLogging',
    defaults: {
        errorEntry: null,
    }
})
@Injectable()
export class ErrorsLoggingStateModule {
    constructor(
        public alertCtrl: AlertController,
        private store: Store,
    ) { }

    @Action(LogErrorEntry)
    logErrorEntry(ctx: StateContext<unknown>, action: LogErrorEntry): void {
        const error = action.payload;
        if (error.message) {
            this.presentErrorAlert(error.message);
        }
        // console.log('error', error);
        ctx.patchState({
            errorEntry: error,
        });
    }
    @Action(ClearErrorEntry)
    clearErrprEntry(ctx: StateContext<unknown>): void {
        // console.log('clear');
        ctx.patchState({
            errorEntry: null,
        });
    }
    async presentErrorAlert(error: any) {
        const alertOptions: AlertOptions = {
            header: 'Alert!',
            subHeader: '',
            message: error,
            cssClass: 'alert-error',
            buttons: [
                {
                    text: 'OK',
                    role: 'confirm',
                    handler: () => {
                        // console.log('clear');
                        setTimeout(() => {
                            this.store.dispatch(new ClearErrorEntry());
                        }, 1000);
                    },
                },
            ],
            backdropDismiss: true,
            translucent: true,
            animated: true,
            mode: 'ios',
            keyboardClose: true,
            id: 'alert-error',
        }

        const alert = await this.alertCtrl.create(
            alertOptions
        );

        await alert.present();
    }
}
