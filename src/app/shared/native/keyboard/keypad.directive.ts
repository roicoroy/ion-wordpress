import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KeypadFacade } from './keypad.facade';

@Directive({
    selector: '[eqmHideWhenKeypadVisible]'
})
export class KeyPadDirective implements OnDestroy {

    private readonly ngUnsubscribe = new Subject();

    constructor(
        private readonly targetElement: ElementRef,
        private readonly keypadFacade: KeypadFacade

    ) {
        const originalStyle = this.targetElement.nativeElement.style.display;
        this.keypadFacade.keyboardIsOpen$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((keyboardStatus: boolean) => {
                setTimeout(() => {
                    this.targetElement.nativeElement.style.display = keyboardStatus ? 'none' : originalStyle;
                }, 25);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}
