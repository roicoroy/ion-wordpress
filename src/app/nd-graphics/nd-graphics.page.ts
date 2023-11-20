import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { jarallax } from "jarallax";
import { IonModal } from '@ionic/angular';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
register();

declare let $: any;
declare let AOS: any;

@Component({
  selector: 'app-nd-graphics',
  templateUrl: './nd-graphics.page.html',
  styleUrls: ['./nd-graphics.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule]
})
export class NdGraphicsPage implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;

  subscribeEmail: string = 'test@email.com';

  gallery = [
    'assets/galeria/2.png',
    'assets/galeria/4.png',
    'assets/galeria/6.png',
  ];
  
  frontBanner = [
    {
      title:'Speed Optimisation',
      content:'Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce egeabus consectetuer turpis, suspendisse.',
      image:'../../assets/banners/cleaning.png'
    },
    {
      title:'Speed Optimisation',
      content:'Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce egeabus consectetuer turpis, suspendisse.',
      image:'../../assets/banners/bebidas.png'
    },
    {
      title:'Speed Optimisation',
      content:'Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce egeabus consectetuer turpis, suspendisse.',
      image:'../../assets/banners/acougue.png'
    },
  ];

  constructor() { }

  // async statusHide() {
  //   return await showStatusBar();
  // }

  // async statusShow() {
  //   return await showStatusBar();
  // }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.name, 'confirm');
  }

  async subscribe() {
    console.log(this.subscribeEmail);
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

    jarallax(document.querySelectorAll('.jarallax'), {
      containerClass: 'jarallax-image',
      imgSrc: '../../assets/logo/logo-para.png',
      imgRepeat: 'no-repeat',
    });

    jarallax(document.querySelectorAll('.jarallax-img'), {

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
    });

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
