import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { PushNotifications } from '@capacitor/push-notifications';

import { NavigationService } from './utils/navigation.service';
import { UserProfileActions } from '../store/settings/settings.actions';
import { Device, DeviceId, DeviceInfo } from '@capacitor/device';
import { catchError } from 'rxjs';
import { WoocommerceHelperService } from './wooApi';
import { ModalController } from '@ionic/angular';
import { FcmModalComponent } from '../components/fcm-modal/fcm-modal.component';

export interface INotifcationPayload {
    id: string;
    data: {
        image: string;
        news_id: string;
    };
    title: string;
    body: string;
}

@Injectable({
    providedIn: 'root'
})
export class FcmService {

    headers_json = new HttpHeaders().set('Content-Type', 'application/json');

    private httpClient = inject(HttpClient);

    private navigation = inject(NavigationService);

    private store = inject(Store);

    private wooHelper = inject(WoocommerceHelperService);

    private modalCtrl = inject(ModalController);


    async listenersPushInit() {
        await PushNotifications.addListener('registration', token => {
            try {
                if (token.value) {
                    console.info('Registration token: ', token.value);
                    // this.utility.presentAlert(token.value);
                    this.store.dispatch(new UserProfileActions.SetFcmToken(token.value));
                }
            } catch (e: any) {
                console.error('Registration error: ', e.error);
            }
        });

        await PushNotifications.addListener('registrationError', err => {
            console.error('Registration error: ', err.error);
        });

        await PushNotifications.addListener('pushNotificationReceived', notification => {
            console.log('Push notification received: ', notification);
            this.openNotification(notification)
        });

        await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
            console.log('Push notification action performed', notification.actionId, notification.inputValue);
        });
    }

    async openNotification(notification: any) {
        const notificationPayload: INotifcationPayload = {
            "id": notification.id,
            "data": {
                "image": notification.data.image || 'assets/shapes.svg',
                "news_id": notification.data.news_id
            },
            "title": notification.title,
            "body": notification.body,
        }

        const presentingElement: HTMLElement = document.querySelector('.main-content')!;

        const modal = await this.modalCtrl.create({
            component: FcmModalComponent,
            componentProps: {
                notificationPayload
            },
            presentingElement
        });
        modal.present();
    }

    async requestPermission() {
        // Request permission to use push notifications
        // iOS will prompt user and return if they granted permission or not
        // Android will just grant without prompting
        await PushNotifications.requestPermissions()
            .then(async (result) => {
                if (result.receive === 'granted') {
                    // Register with Apple / Google to receive push via APNS/FCM
                    await PushNotifications.register();
                    // console.log(res);
                } else {
                    // Show some error
                    throw new Error('Error FCM');
                }
            });
    }

    async getDeviceId(): Promise<DeviceId> {
        return Device.getId();
    }

    async getDeviceInfo(): Promise<DeviceInfo> {
        return Device.getInfo();
    }

    async postSubscribeData(fcmToken: string) {
        const deviceId = await Device.getId();
        const deviceInfo = await Device.getInfo();

        const payload = {
            // (required)
            rest_api_key: '4121560q6r.1892767n:72o094o4o60s98nqs:5o5p947ss08so28oo0q7n4o43',
            // (required)
            device_uuid: deviceId.identifier,
            // (required)
            device_token: fcmToken,
            // (required) - This would be the category in which the device is registered, if there is no category exists in WordPress it’ll be created automatically.
            subscription: 'promotions',
            // (optional)
            device_name: deviceInfo.name,
            // (optional)
            os_version: deviceInfo.osVersion,
        }

        return this.httpClient.post(`wp-json/fcm/pn/subscribe/`, this.wooHelper.includeEncoded(payload))
            .pipe(catchError(err => this.wooHelper.handleError(err))).subscribe((res) => console.log(res));

    }

    async registerNotifications() {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive !== 'granted') {
            const message = 'User denied permissions!';
            throw new Error(message);
        }

        await PushNotifications.register();
    }

    async getDeliveredNotifications() {
        const notificationList = await PushNotifications.getDeliveredNotifications();
        console.log('delivered notifications', notificationList);
    }
}
