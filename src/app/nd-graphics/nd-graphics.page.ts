import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { jarallax } from "jarallax";
import { IonModal } from '@ionic/angular';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();

declare let $: any;
declare let AOS: any;

@Component({
  selector: 'app-nd-graphics',
  templateUrl: './nd-graphics.page.html',
  styleUrls: ['./nd-graphics.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NdGraphicsPage implements OnInit {
  
  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;

  gallery = [
    'assets/parallax/hd-2.jpg',
    'assets/parallax/hd-3.jpg',
    'assets/parallax/hd-4.jpg',
  ];

  constructor() { }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  onWillDismiss(event: Event) {
    // @ts-ignore
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.message = `Hello, ${ev.detail.data}!`;
    }
  }

  async swiperInit() {
    const swiper = await new Swiper(".mySwiper", {
      zoom: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });
  }

  ionViewDidEnter() {

    this.swiperInit();

    jarallax(document.querySelectorAll('.jarallax'), {});

    jarallax(document.querySelectorAll('.jarallax-img'), {
      containerClass:'jarallax-image',
      imgSrc:'assets/shapes.svg',
      imgRepeat:'no-repeat',
    });

    // OWL-CAROUSAL
    $('.owl-carousel').owlCarousel({
      items: 3,
      loop: true,
      nav: false,
      dot: true,
      autoplay: true,
      slideTransition: 'linear',
      autoplayHoverPause: true,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 2
        },
        1000: {
          items: 3
        }
      }
    })

    // AOS
    AOS.init({
      offset: 120,
      delay: 0,
      duration: 1200,
      easing: 'ease',
      once: true,
      mirror: false,
      anchorPlacement: 'top-bottom',
      disable: "mobile"
    });
  }

  ngOnInit() {
  }

}
