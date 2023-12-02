
export namespace LanguageActions {

    export class GetLanguage {
        static readonly type = '[LanguageActions] Get Language';
    }
    export class SetLanguage {
        static readonly type = '[LanguageActions] Set Language';
        constructor(public payload: any) { }
    }

}
