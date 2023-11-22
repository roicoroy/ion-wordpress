import { CUSTOM_ELEMENTS_SCHEMA, Component, Directive, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { jarallax } from "jarallax";
import { IonModal } from '@ionic/angular';
import { IonicSlides } from '@ionic/angular/standalone';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { LightboxModule } from 'ngx-lightbox';
import { Lightbox } from 'ngx-lightbox';
import { ShareService } from '../shared/utils/share.service';

declare let $: any;
declare let AOS: any;

@Component({
  selector: 'app-nd-graphics',
  templateUrl: './nd-graphics.page.html',
  styleUrls: ['./nd-graphics.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LightboxModule
  ]
})
export class NdGraphicsPage implements OnInit {

  @ViewChild(IonModal) modal!: IonModal;

  swiperModules = [IonicSlides];

  @ViewChild('swiper') swiperRef: ElementRef | undefined;

  swiper?: Swiper;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';

  name!: string;

  subscribeEmail: string = 'test@email.com';

  vehiclesGallery: any = [
    {
      src: 'assets/banners/car-1.png',
      thumb: 'assets/banners/car-1.png'
    },
    {
      src: 'assets/banners/car-2.png',
      thumb: 'assets/banners/car-2.png',
    },
    {
      src: 'assets/banners/car-3.png',
      thumb: 'assets/banners/car-3.png'
    },
  ];

  signsGallery: any = [
    {
      src: 'assets/banners/sign-1.png',
      thumb: 'assets/banners/sign-1.png'
    },
    {
      src: 'assets/banners/sign-2.png',
      thumb: 'assets/banners/sign-2.png',
    },
    {
      src: 'assets/banners/sign-3.png',
      thumb: 'assets/banners/sign-3.png'
    },
  ];

  frontBanner = [
    {
      title: 'Business',
      content: 'Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce egeabus consectetuer turpis, suspendisse.',
      image: 'assets/banners/van.png'
    },
    {
      title: 'Vehicles',
      content: 'Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce egeabus consectetuer turpis, suspendisse.',
      image: 'assets/banners/kebab-banner.png'
    },
    {
      title: 'Wall Decoration',
      content: 'Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce egeab...',
      image: 'assets/banners/kebab-banner1.png'
    },
  ];

  testimonials = [
    {
      name: 'Laura Doe',
      content: 'Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce egeabus consectetuer turpis, suspendisse.',
      thumb: 'assets/nd-graphics-landing-page/images/face1.jpg',
      job: 'Marketing Manager on Gray Adamns, Fraserburgh'
    },
    {
      name: 'Mohamed Doe',
      content: 'Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce egeabus consectetuer turpis, suspendisse.',
      thumb: 'assets/nd-graphics-landing-page/images/face2.jpg',
      job: 'Kebab Shop owner, Aberdden'
    },
    {
      name: 'Tim Doe',
      content: 'Lorem ipsum dolor sit amet, tincidunt vestibulum. Fusce egeabus consectetuer turpis, suspendisse.',
      thumb: 'assets/nd-graphics-landing-page/images/face3.jpg',
      job: 'Football stadium manger, Fraserburgh'
    },
  ];

  shareInfo = {
    header: 'Hello friend',
    message: 'Look at my shop, please :)',
    link: 'https://fae.zra.mybluehost.me/public',
  }


  constructor(
    private share: ShareService,
    private elRef: ElementRef,
    private _lightbox: Lightbox
  ) { }

  openVehiclesGallery(index: number): void {
    this._lightbox.open(this.vehiclesGallery, index);
  }

  openSignsGallery(index: number): void {
    this._lightbox.open(this.vehiclesGallery, index);
  }

  close(): void {
    this._lightbox.close();
  }

  ngOnInit() {

  }

  ionViewWillLeave() {

  }

  ionViewDidEnter() {

    this.swiperInit();

    jarallax(document.querySelectorAll('.jarallax'), {
      containerClass: 'jarallax-image-local',
      imgSrc: 'assets/logo/logo-para2.jpeg',
      imgRepeat: 'no-repeat',
    });

    jarallax(document.querySelectorAll('.jarallax-img'), {

    });
  }

  openImage(image: string) {
    console.log(image);
  }

  goNext() {
    this.swiper?.slideNext();
  }

  goPrev() {
    this.swiper?.slidePrev();
  }

  async swiperInit() {
    const initSwipe = () => {
    }

    this.swiper = new Swiper(".photoSwiper", {
      modules: [Navigation, Pagination],
      navigation: {
        enabled: false,
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets: true,
        type: 'bullets',
        renderProgressbar: function (progressbarFillClass) {
          return '<span class="' + progressbarFillClass + '"></span>';
        }
      },
      on: {
        init() {
          initSwipe();
        },
      },
    });
    this.swiper.init();
  }

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

  swiperSlideChanged(e?: any) {
    console.log('changed: ', e);
  }

  shareLink(shareInfo: any) {
    this.share.share(
      shareInfo.header,
      shareInfo.messaage,
      shareInfo.link,
    )
  }
}
