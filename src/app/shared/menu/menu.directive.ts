import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MenuFacade } from './menu.facade';

@Directive({
    selector: '[menuVisible]'
})
export class MenuDirective implements OnDestroy {

    private readonly ngUnsubscribe = new Subject();

    constructor(
        private readonly targetElement: ElementRef,
        private readonly menuFacade: MenuFacade

    ) {
        const originalStyle = this.targetElement.nativeElement.style.display;
        this.menuFacade.menuIsOpen$
            .pipe(
                takeUntil(this.ngUnsubscribe)
            )
            .subscribe((menuStatus: boolean) => {

                console.log(menuStatus);

                // setTimeout(() => {
                //     this.targetElement.nativeElement.style.display = keyboardStatus ? 'none' : originalStyle;
                // }, 25);
            });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(null);
        this.ngUnsubscribe.complete();
    }
}
