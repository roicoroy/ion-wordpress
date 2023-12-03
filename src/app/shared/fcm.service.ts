import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { PushNotifications, PushNotificationSchema, PushNotificationToken } from '@capacitor/push-notifications';
import { Token } from '@angular/compiler';
import { UtilityService } from './utility/utility.service';
import { NavigationService } from './utils/navigation.service';

@Injectable({
    providedIn: 'root'
})
export class FcmService {

    headers_json = new HttpHeaders().set('Content-Type', 'application/json');

    private http = inject(HttpClient);
    private utility = inject(UtilityService);
    private navigation = inject(NavigationService);
    private store = inject(Store);

    constructor() {
    }

    async listenersPushInit() {
        await PushNotifications.addListener('registration', token => {
            console.info('Registration token: ', token.value);
            this.utility.presentAlert(token.value);
        });

        await PushNotifications.addListener('registrationError', err => {
            console.error('Registration error: ', err.error);
            this.utility.presentAlert(err.error);
        });

        await PushNotifications.addListener('pushNotificationReceived', notification => {
            console.log('Push notification received: ', notification);
            this.utility.presentAlert(notification);
        });

        await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
            console.log('Push notification action performed', notification.actionId, notification.inputValue);
            this.utility.presentAlert(notification.inputValue);
            this.utility.presentAlert(notification.actionId);
        });
    }

    async registerNotifications() {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            const message = 'User denied permissions!';
            this.utility.presentAlert(message);
            throw new Error(message);
        }

        await PushNotifications.register();
    }

    async getDeliveredNotifications() {
        const notificationList = await PushNotifications.getDeliveredNotifications();
        console.log('delivered notifications', notificationList);
    }
}
