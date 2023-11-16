import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public async set(key: any, value: any) {
    return await Storage.set({ key, value })
      .then((value: any) => {
        return true
      })
      .catch((error: any) => {
        return false
      });
  }

  public async get(key: any) {
    return await Storage.get({ key })
      .then((data: any) => {
        return JSON.parse(data.value)
      })
      .catch((error: any) => {
        return error
      });
  }

  public async remove(key: any) {
    return await Storage.remove({ key })
      .then((value: any) => {
        return true
      })
      .catch((error: any) => {
        return false
      });
  }
}
