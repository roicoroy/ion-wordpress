import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { slideAnimation, flipAnimation, fadeOutAnimation, slideUpAnimation, slideDownAnimation } from '../animations/nav-animation';

export interface IInternalNavigationOptions {
    url: string;
    queryParams?: any;
    flowAnimation?: boolean;
    forwardPaths?: string[];
}
@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    constructor(
        private navCtrl: NavController,
        private router: Router
    ) { }
    async navigateForward(url: string, direction: any = 'forward') {
        await this.navCtrl.navigateForward(url, {
            animation: slideAnimation,
            animated: true,
            animationDirection: direction
        });
    }
    async navigateForwardParams(url: string, params?: any, direction: any = 'forward') {
        const navigationExtras: NavigationExtras = {
            queryParams: {
                params
            }
        };
        await this.navCtrl.navigateForward(url, {
            queryParams: navigationExtras,
            animation: slideAnimation,
            animated: true,
            animationDirection: direction
        });
    }
    async navigateFlip(url: string) {
        await this.navCtrl.navigateForward(url, {
            animation: flipAnimation,
            animated: true,
        });
    }
    async navigateFadeOut(url: string) {
        await this.navCtrl.navigateForward(url, {
            animation: fadeOutAnimation,
            animated: true,
        });
    }
    async navigateSlideUpAnimation(url: string) {
        await this.navCtrl.navigateForward(url, {
            animation: slideUpAnimation,
            animated: true,
        });
    }
    async navigateSlideDownAnimation(url: string) {
        await this.navCtrl.navigateForward(url, {
            animation: slideDownAnimation,
            animated: true,
        });
    }
    async navControllerDefault(url: string, direction: any = 'forward') {
        await this.navCtrl.navigateForward(url, direction);
    }
}
