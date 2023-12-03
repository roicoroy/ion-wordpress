import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { KeyboardState } from 'src/app/store/keyboard/keyboard.state';

@Injectable({
    providedIn: 'root'
})
export class KeypadFacade {
    @Select(KeyboardState.isOpen) keyboardIsOpen$!: Observable<boolean>;
}
