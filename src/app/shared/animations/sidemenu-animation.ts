import { Animation, MenuI } from '@ionic/core';

export function sideMenuRight(AnimationC: any, baseEl: HTMLElement, menu: MenuI):
    Promise<Animation> {

    let contentOpenedX: string;
    let menuClosedX: string;
    const width = menu.width;
    const baseAnimation = new AnimationC();

    if (menu.isEndSide) {
        contentOpenedX = -width + 'px';
        menuClosedX = width + 'px';
    }
    else {
        contentOpenedX = width + 'px';
        menuClosedX = -width + 'px';
    }

    const menuAnimation = new AnimationC()
        .addElement(menu.menuInnerEl)
        .fromTo('z-index', '0', '0')
        .fromTo('translateX', menuClosedX, '0px');

    const contentAnimation = new AnimationC()
        .addElement(menu.contentEl)
        .fromTo('translateX', '0px', contentOpenedX)
        .fromTo('scale', '1', '0.7');

    const backdropAnimation = new AnimationC()
        .addElement(menu.backdropEl)
        .fromTo('opacity', 0.01, 0.32);

    return Promise.resolve(baseAnimation
        .addElement(baseEl)
        .easing('cubic-bezier(0.0, 0.0, 0.2, 1)')
        .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)')
        .duration(300)
        .add(contentAnimation)
        .add(menuAnimation)
        .add(backdropAnimation));
};