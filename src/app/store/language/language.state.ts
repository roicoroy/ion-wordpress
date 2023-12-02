import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { LanguageActions } from './language.actions';

export class LanguageStateModel {
    language: any;
}
@State<LanguageStateModel>({
    name: 'language',
    defaults: {
        language: null,
    }
})
@Injectable()
export class LanguageState {

    @Selector()
    static getLanguage(state: LanguageStateModel) {
        return state.language;
    }

    @Action(LanguageActions.GetLanguage)
    getLanguage(ctx: StateContext<LanguageStateModel>) {
        const state = ctx.getState();
    }

    @Action(LanguageActions.SetLanguage)
    setLanguage(ctx: StateContext<LanguageStateModel>, { payload }: LanguageActions.SetLanguage) {
        const state = ctx.getState();
        return ctx.patchState({
            ...state,
            language: payload,
        });
    }

}
