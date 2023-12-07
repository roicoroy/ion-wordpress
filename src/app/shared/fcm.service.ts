import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { PushNotifications, Token } from '@capacitor/push-notifications';

import { NavigationService } from './utils/navigation.service';
import { UserProfileActions } from '../store/settings/settings.actions';
import { Device, DeviceId, DeviceInfo } from '@capacitor/device';
import { catchError } from 'rxjs';
import { WoocommerceHelperService } from './wooApi';
import { ModalController } from '@ionic/angular';
import { FcmModalComponent } from '../components/fcm-modal/fcm-modal.component';
import { environment } from 'src/environments/environment';
import { ErrorLoggingActions } from '../store/errors-logging/errors-logging.actions';
import { Platform } from '@ionic/angular';

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

    public platform = inject(Platform);

    async listenersPushInit() {
        await PushNotifications.addListener('registration', (token: Token) => {
            try {
                if (token) {
                    this.store.dispatch(new UserProfileActions.SetFcmToken(token));
                }
            } catch (e: any) {
                this.store.dispatch(new ErrorLoggingActions.LogErrorEntry(e));
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

    // requestPermission() {
    //     if (this.platform.is('hybrid')) {
    //         if (this.platform.is('android') || this.platform.is('ios')) {
    //             // Request permission to use push notifications
    //             // iOS will prompt user and return if they granted permission or not
    //             // Android will just grant without prompting
    //             return PushNotifications.requestPermissions()
    //                 .then(async (result) => {
    // if (result.receive === 'granted') {
    //     // Register with Apple / Google to receive push via APNS/FCM
    //     return PushNotifications.register();
    //     // console.log(res);
    // } else {
    //                         // Show some error
    //                         return new Error('Error FCM');
    //                     }
    //                 });
    //         }
    //     }
    // }

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
            rest_api_key: environment.fcm_rest_api_key,
            device_uuid: deviceId.identifier,
            device_token: fcmToken,
            subscription: 'promotions',
            device_name: deviceInfo.name,
            os_version: deviceInfo.osVersion,
        }

        return this.httpClient.post(`wp-json/fcm/pn/subscribe/`, this.wooHelper.includeEncoded(payload))
            .pipe(catchError(err => this.wooHelper.handleError(err))).subscribe((res) => console.log(res));

    }

    async postUnSubscribeData() {
        const deviceId = await Device.getId();
        const payload = {
            rest_api_key: environment.fcm_rest_api_key,
            device_uuid: deviceId.identifier,
        }
        return this.httpClient.post(`wp-json/fcm/pn/unsubscribe/`, this.wooHelper.includeEncoded(payload))
            .pipe(catchError(err => this.wooHelper.handleError(err)))
            .subscribe((res) => console.log(res));

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

        const result: any = await PushNotifications.requestPermissions();
        if (result.receive === 'granted') {
            // Register with Apple / Google to receive push via APNS/FCM
            return PushNotifications.register();
        }
    }

    async getDeliveredNotifications() {
        const notificationList = await PushNotifications.getDeliveredNotifications();
        console.log('delivered notifications', notificationList);
    }
}
