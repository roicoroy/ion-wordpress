import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IHomeListModel, ProductsListFacade } from './products-list.facade';
import { RouterLink } from '@angular/router';
import { Images, Product } from 'src/app/shared/wooApi';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { IAlbum, Lightbox, LightboxModule } from 'ngx-lightbox';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.page.html',
  styleUrls: ['./product-list.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    RouterLink,
    IonicModule,
    CommonModule,
    FormsModule,
    LightboxModule
  ]
})
export class ProductListPage implements OnInit, OnDestroy {

  @ViewChild('swiper') swiperRef: ElementRef | undefined;

  swiper?: Swiper;

  viewState$: Observable<IHomeListModel>;

  productsList!: Product[];

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

  private readonly ngUnsubscribe = new Subject();

  private lightbox = inject(Lightbox);

  constructor(
    private facade: ProductsListFacade,
    private store: Store,
  ) {
    this.viewState$ = this.facade.viewState$;

    this.facade.viewState$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (p: IHomeListModel) => {
          this.productsList = p.products;
        },
        error: (e) => {
          console.error(e)
        },
        complete: () => {
          console.info('complete')
        },
      });
  }

  ngOnInit() {
    this.swiperInit()
  }

  openGallery(gallery: Images[] | undefined, index: number): void {
    const album: IAlbum[] | any = gallery?.map((element: any, i) => ({
      src: element.src,
      thumb: element.src,
      caption: element.name,
      downloadUrl: null
    }));

    this.lightbox.open(album, index);
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

  onButtonAction(data: any) {
    console.log(data);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }

}
