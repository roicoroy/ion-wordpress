export class LogErrorEntry {
    public static readonly type = '[ErrorsLogging] Log Error Entry';
    constructor(public readonly payload: Error) { }
}
export class ClearErrorEntry {
    public static readonly type = '[ClearErrorEntry] Clear Error Entry';
}