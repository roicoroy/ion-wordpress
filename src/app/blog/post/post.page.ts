import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of, map, Subject } from 'rxjs';
import { WordpressService, } from 'src/app/shared/wordpress.service';
import { AuthService } from 'src/app/shared/wooApi';
import { jarallax } from "jarallax";

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink,
  ]
})
export class PostPage implements OnInit, OnDestroy {

  post: any;
  author!: string;
  comments: any = [];
  categories: any = [];

  private wooApi = inject(AuthService);

  private loadingController = inject(LoadingController);

  private alertController = inject(AlertController);

  private router = inject(Router);

  private route = inject(ActivatedRoute);

  private wordpressService = inject(WordpressService);

  private readonly ngUnsubscribe = new Subject();

  async ngOnInit() {
    this.route.data.subscribe(routeData => {
      const data = routeData['data'];
      this.post = data.post;
      jarallax(document.querySelectorAll('.jarallax'), {
        containerClass: 'jarallax-image-local',
        imgSrc: this.post.jetpack_featured_media_url === "" ? 'assets/shapes.svg' : this.post.jetpack_featured_media_url,
        imgRepeat: 'no-repeat',
      });
      this.author = data.author.name;
      this.categories = data.categories;
      this.comments = data.comments;
    });
    this.getComments();
  }

  getComments() {
    return this.wordpressService.getComments(this.post.id);
  }

  loadMoreComments(event: any) {
    // const page = (this.comments.length / 10) + 1;
    const page = 1;
    this.comments = [];
    this.wordpressService.getComments(this.post.id, page)
      .subscribe(
        (comments: any) => {
          this.comments.push(...comments);
          event.target.complete();
        }, 
        err => {
          event.target.disabled = true;
        })
  }

  async createComment() {
    const loggedUser = await this.wooApi.getUser();
    console.log(loggedUser);
    if (loggedUser) {
      // let user = JSON.parse(loggedUser);
      // check if token is valid
      this.wooApi.validateAuthToken(loggedUser.token)
        .pipe(
          catchError(error => of(error)),
          map(result => {
            // console.log(result);
            if (result.error) {
              this.openLogInAlert();
            }
            else {
              // user is logged in and token is valid
              this.openEnterCommentAlert(loggedUser);
            }
          })
        ).subscribe()
    } else {
      this.openLogInAlert();
    }
  }

  async openLogInAlert() {
    const alert = await this.alertController.create({
      header: 'Please login',
      message: 'You need to login in order to comment',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Login',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }

  async openEnterCommentAlert(user: any) {
    const alert = await this.alertController.create({
      header: 'Add a comment',
      inputs: [
        {
          name: 'comment',
          type: 'text',
          placeholder: 'Comment'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Accept',
          handler: async (data: any) => {
            const loading = await this.loadingController.create();
            await loading.present();

            this.wordpressService.createComment(this.post.id, user, data.comment)
              .subscribe(
                async (data: any) => {
                  this.getComments().subscribe(async (comments: any) => {
                    const recentComments = Object.keys(comments).map(i => comments[i]);
                    // @ts-ignore
                    this.comments = recentComments;
                    await loading.dismiss();
                  });
                },
                async (err: any) => {
                  await loading.dismiss();
                }
              );
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
