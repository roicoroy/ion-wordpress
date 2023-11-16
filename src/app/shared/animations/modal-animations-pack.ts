import { NavOptions, createAnimation } from '@ionic/core';
import { ModalController, AnimationController } from '@ionic/angular';
interface TransitionOptions extends NavOptions {
    progressCallback?: (ani: Animation | undefined) => void;
    baseEl: any;
    enteringEl: HTMLElement;
    leavingEl: HTMLElement | undefined;
}

function getIonPageElement(element: HTMLElement) {
    if (element.classList.contains('ion-page')) {
        return element;
    }

    const ionPage = element.querySelector(
        ':scope > .ion-page, :scope > ion-nav, :scope > ion-tabs, :scope > ion-content'
    );
    if (ionPage) {
        return ionPage;
    }

    return element;
}

export function pageTransition(_: HTMLElement, opts: TransitionOptions | any) {
    const DURATION = 300;

    const rootTransition = createAnimation()
        .duration(opts.duration || DURATION)
        .easing('cubic-bezier(0.3,0,0.66,1)');

    const enteringPage = createAnimation()
        .addElement(getIonPageElement(opts.enteringEl))
        .beforeRemoveClass('ion-page-invisible');

    const leavingPage = createAnimation()
        .addElement(getIonPageElement(opts.leavingEl));

    if (opts.direction === 'forward') {
        enteringPage.fromTo('transform', 'translateX(100%)', 'translateX(0)');
        leavingPage.fromTo('opacity', '1', '0.25');
    }
    else {
        leavingPage.fromTo('transform', 'translateX(0)', 'translateX(100%)');
        enteringPage.fromTo('opacity', '0.25', '1');
    }
    // console.log(rootTransition);
    rootTransition.addAnimation(enteringPage);
    rootTransition.addAnimation(leavingPage);
    return rootTransition;
}
//
const animationCtrl = new AnimationController();
//
export const fancyAnimation = (_: HTMLElement, opts: any) => {
    const backDirection = opts.direction === 'back';
    const enteringEl = opts.enteringEl;
    const leavingEl = opts.leavingEl;

    const enteringPageEl = getIonPageElement(enteringEl);

    const rootTransition = animationCtrl.create();

    const enterTransition = animationCtrl.create();
    const leavingTransition = animationCtrl.create();

    leavingTransition.addElement(getIonPageElement(leavingEl))
        .duration(250);

    enterTransition
        .addElement(enteringPageEl)
        .duration(250)
        .fill('both')
        .beforeRemoveClass('ion-page-invisible');

    if (!backDirection) {
        enterTransition
            .beforeStyles({ border: 'thin solid black' })
            .keyframes([
                { offset: 0, transform: 'scale(0)' },
                { offset: 1, transform: 'scale(1)' }
            ])
            .afterClearStyles(['border']);

        leavingTransition.keyframes([
            { offset: 0, opacity: 1 },
            { offset: 1, opacity: 0.1 }
        ]);
    } else {
        enterTransition.keyframes([
            { offset: 0, opacity: 0.1 },
            { offset: 1, opacity: 1 }
        ]);

        leavingTransition
            .beforeStyles({ border: 'thin solid black' })
            .keyframes([
                { offset: 0, transform: 'scale(1)' },
                { offset: 1, transform: 'scale(0)' }
            ])
            .afterClearStyles(['border']);
    }

    rootTransition.addAnimation([enterTransition, leavingTransition]);

    return rootTransition;
};
export const modalEnterAnimation = (baseEl: any) => {
    const backdropAnimation = animationCtrl
        .create()
        .addElement(baseEl.querySelector('ion-backdrop')!)
    // .fromTo('opacity', '0', '0')
    // .duration(50);

    const wrapperAnimation = animationCtrl
        .create()
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .delay(500)
        .keyframes([
            { offset: 0, opacity: '0', transform: 'scale(0)' },
            { offset: 1, opacity: '0.99', transform: 'scale(1)' }
        ])
        .duration(250);
    return animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .addAnimation([backdropAnimation, wrapperAnimation]);
};
export const modalLeaveAnimation = (baseEl: any) => {
    return modalEnterAnimation(baseEl).direction('reverse');
};