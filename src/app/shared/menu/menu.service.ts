import { Injectable } from '@angular/core';
import { Keyboard } from '@capacitor/keyboard';
import { Store } from '@ngxs/store';

@Injectable({
    providedIn: 'root'
})
export class MenuService {

    constructor(
        private readonly store: Store,
    ) { }

    initMenuListeners() {
    }

    async hideMenu(): Promise<void> {
        try {
            return await Keyboard.hide();
        } catch (error) {
            throw error;
        }
    }

    async openMenu(): Promise<void> {
        try {
            return await Keyboard.show();
        } catch (error) {
            throw error;
        }
    }
}
