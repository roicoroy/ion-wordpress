import { Injectable, inject } from "@angular/core";
import { AlertController, AlertOptions } from "@ionic/angular";
import { State, Store, Action, StateContext } from "@ngxs/store";
import { ErrorLoggingActions } from "./errors-logging.actions";
import { AlertService } from "src/app/shared/utils/alert.service";

export class ErrosStateModel {
    entries!: Error[];
}

@State({
    name: 'errors',
})
@Injectable()
export class ErrorsLoggingState {

    errorEntries: Error[] = [];

    private alertService = inject(AlertService);

    @Action(ErrorLoggingActions.LogErrorEntry)
    async logErrorEntry(ctx: StateContext<unknown>, action: ErrorLoggingActions.LogErrorEntry): Promise<void> {
        if (action.error.error?.message) {
            await this.alertService.presentSimpleAlert(action.error.error?.message);
        } else if (action.error) {
            await this.alertService.presentSimpleAlert(action.error);
        }
        this.errorEntries.push(action.error);
        ctx.patchState({
            entries: this.errorEntries,
        });
    }

    @Action(ErrorLoggingActions.ClearErrorEntry)
    clearErrprEntry(ctx: StateContext<unknown>): void {
        ctx.patchState({
            entries: null,
        });
    }
}
