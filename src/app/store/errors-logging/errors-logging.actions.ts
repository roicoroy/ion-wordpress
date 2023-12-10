import { HttpErrorResponse } from "@angular/common/http";

export namespace ErrorLoggingActions {
    export class LogErrorEntry {
        public static readonly type = '[ErrorsLogging] Log Error Entry';
        constructor(public readonly error: HttpErrorResponse | Error | any) { }
    }
    export class ClearErrorEntry {
        public static readonly type = '[ClearErrorEntry] Clear Error Entry';
    }
}
