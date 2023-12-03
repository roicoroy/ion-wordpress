import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { ThemeActions } from './theme.action';

export class ThemeStateModel {
    isDarkMode!: boolean;
}

@State<ThemeStateModel>({
    name: 'theme',
    defaults: {
        isDarkMode: false
    }
})
@Injectable()
export class ThemeState {
    @Action(ThemeActions.SetDarkMode)
    setTutorialComplete(ctx: StateContext<ThemeStateModel>, { isDarkMode }: ThemeActions.SetDarkMode) {
        const state = ctx.getState();
        console.log(isDarkMode);
        return ctx.patchState({
            ...state,
            isDarkMode: isDarkMode
        });
    }
}
