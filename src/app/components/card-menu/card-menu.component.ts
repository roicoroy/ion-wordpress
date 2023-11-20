import { Component, OnInit } from '@angular/core';
import { DropDownAnimation, DropDownAnimationContainer, DropDownAnimationItem, SlideInOutAnimation } from './animation';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  animations: [DropDownAnimationContainer, DropDownAnimation, DropDownAnimationItem, SlideInOutAnimation]
})
export class CardMenuComponent implements OnInit {

  isOpen = false;

  title: string;

  linksList = [
    {
      icon: 'home',
      slug: 'home'
    },
    {
      icon: 'home',
      slug: 'settings'
    },
    {
      icon: 'home',
      slug: 'calculator'
    },
  ]

  constructor() {
    this.title = 'Goiabeira Calculator';
   }

  name = 'Angular 5';
  animationState = 'out';

  toggleShowDiv() {
    this.animationState = this.animationState === 'out' ? 'in' : 'out';
    this.isOpen = !this.isOpen;
  }

  ngOnInit() {
  }
  show_hide() {
    var click: any = document.getElementById("list-items");
    if (click.style.display === "none") {
      click.style.display = "block";
    } else {
      click.style.display = "none";
    }
  }

  navigate(slug: string) {
    console.log(slug);
  }

}
