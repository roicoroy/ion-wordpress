import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { KeyPadDirective } from './keypad.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  declarations: [
    KeyPadDirective,
  ],
  exports:[
    KeyPadDirective,
  ]
})
export class KeypadModule { }
