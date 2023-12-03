import { Injectable } from "@angular/core";
import { AlertController, AlertOptions } from "@ionic/angular";
import { State, Store, Action, StateContext } from "@ngxs/store";
import { ErrorLoggingActions } from "./errors-logging.actions";

export class ErrosStateModel {
    entries!: Error[];
}

@State({
    name: 'errors',
})
@Injectable()
export class ErrorsLoggingState {
    errorEntries: Error[] = [];
    
    constructor(
    ) { }

    @Action(ErrorLoggingActions.LogErrorEntry)
    logErrorEntry(ctx: StateContext<unknown>, action: ErrorLoggingActions.LogErrorEntry): void {
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
