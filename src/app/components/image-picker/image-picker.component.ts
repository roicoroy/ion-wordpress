/* eslint-disable @typescript-eslint/member-ordering */
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  Input,
  inject
} from '@angular/core';

import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { IonicModule, Platform } from '@ionic/angular';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { scaleHeight } from 'src/app/shared/animations/animations';
import { IonStorageService } from 'src/app/shared/utils/ionstorage.service';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
  standalone: true,
  animations: [
    scaleHeight()
  ],
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    NgxsModule,
  ],
})
export class ImagePickerComponent implements OnInit {
  
  @Output() imagePick = new EventEmitter<any>();
  
  @Input() userAvatar!: string;
  
  selectedImage!: string | any;


  constructor(
    private platform: Platform,
  ) { }

  ngOnInit() {
  }

  async onPickImage() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt,
      quality: 50,
    });
    const savedPhoto = await this.savePicture(capturedPhoto);
    this.imagePick.emit(savedPhoto);
    this.selectedImage = savedPhoto.webviewPath;
  }

  private async savePicture(cameraPhoto: Photo) {
    const base64Data = await this.readAsBase64(cameraPhoto);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });
    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath,
      };
    }
  }

  private convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  private async readAsBase64(cameraPhoto: Photo | string | any) {
    if (this.platform.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: cameraPhoto.path,
      });
      return file.data;
    } else {
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();
      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

}

export async function onLoadImage(savedPhoto: any) {
  const readFile = await Filesystem?.readFile({
    path: savedPhoto.filepath,
    directory: Directory.Data,
  });
  return `data:image/jpeg;base64,${readFile.data}`;
}
