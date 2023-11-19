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
// declare let owlCarousel: any;

import { StatusBar, Style } from '@capacitor/status-bar';

// iOS only
window.addEventListener('statusTap', function () {
  console.log('statusbar tapped');
});

// Display content under transparent status bar (Android only)
StatusBar.setOverlaysWebView({ overlay: true });

const setStatusBarStyleDark = async () => {
  await StatusBar.setStyle({ style: Style.Dark });
};

const setStatusBarStyleLight = async () => {
  await StatusBar.setStyle({ style: Style.Light });
};

const hideStatusBar = async () => {
  await StatusBar.hide();
};

const showStatusBar = async () => {
  await StatusBar.show();
};


@Component({
  selector: 'app-nd-graphics',
  templateUrl: './nd-graphics.page.html',
  styleUrls: ['./nd-graphics.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class NdGraphicsPage implements OnInit {

  gallery = [
    'assets/parallax/hd-2.jpg',
    'assets/parallax/hd-3.jpg',
    'assets/parallax/hd-4.jpg',
  ];

  constructor() { }


  @ViewChild(IonModal) modal!: IonModal;

  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  name!: string;

  async statusHide() {
    return await showStatusBar();
  }
  
  async statusShow() {
    return await showStatusBar();
  }
  
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
    });

    // HEADER ANIMATION
    // window.onscroll = function () { scrollFunction() };
    // var element: any = document.getElementById("local-ion-content");
    // function scrollFunction() {
    //   if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
    //     $(".navbar").addClass("fixed-top");
    //     element.classList.add("header-small");
    //     $("local-ion-content").addClass("body-top-padding");

    //   } else {
    //     $(".navbar").removeClass("fixed-top");
    //     element.classList.remove("header-small");
    //     $("local-ion-content").removeClass("body-top-padding");
    //   }
    // }

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

    // SCROLLSPY
    // $(document).ready(function () {
    //   $(".nav-link").click(function () {
    //     // @ts-ignore
    //     var t = $(this).attr("href");
    //     $("html, body").animate({
    //       scrollTop: $(t).offset().top - 75
    //     }, {
    //       duration: 1000,
    //     });
    //     $('body').scrollspy({ target: '.navbar', offset: $(t).offset().top });
    //     return false;
    //   });
    // });

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

    // //SIDEBAR-OPEN
    // $('#navbarSupportedContent').on('hidden.bs.collapse', function () {
    //   $("body").removeClass("sidebar-open");
    // })

    // $('#navbarSupportedContent').on('shown.bs.collapse', function () {
    //   $("body").addClass("sidebar-open");
    // })

    // window.onresize = function () {
    //   var w = window.innerWidth;
    //   if (w >= 992) {
    //     $('body').removeClass('sidebar-open');
    //     $('#navbarSupportedContent').removeClass('show');
    //   }
    // }
  }

  ngOnInit() {

  }

}
