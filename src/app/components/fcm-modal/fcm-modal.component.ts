import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { INotifcationPayload } from 'src/app/shared/fcm.service';

@Component({
  selector: 'app-fcm-modal',
  templateUrl: './fcm-modal.component.html',
  styleUrls: ['./fcm-modal.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class FcmModalComponent  implements OnInit {

  @Input() notificationPayload!: INotifcationPayload;

  constructor(
    private modalController: ModalController,
  ) { }
  
  ngOnInit() { 
  }

  ionViewDidEnter(){
    console.log(this.notificationPayload);
  }


  async closeModel() {
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

}
