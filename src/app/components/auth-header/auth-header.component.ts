import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IAuthHeader } from 'src/app/auth/interfaces';

@Component({
  selector: 'auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class AuthHeaderComponent implements OnInit {

  @Input() pageTitle!: string;

  constructor() { }

  ngOnInit() { 
    
  }

  ionViewDidEnter(){
    console.log(this.pageTitle);
  }

}
