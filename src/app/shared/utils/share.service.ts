import { Injectable } from '@angular/core';
import { Share } from '@capacitor/share';

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  async share(title: string, text: string, url: string) {
    const share = await Share.share({
      title,
      text,
      url
    });
  }

  async shareTextOnly(text:string) {
    await Share.share({
      text,
    });
  }

  async shareUrlOnly() {
    await Share.share({
      url: 'http://ionicframework.com/',
    });
  }
}
