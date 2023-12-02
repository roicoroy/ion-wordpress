import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of, map } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/authentication.service';
import { WordpressService, } from 'src/app/shared/wordpress.service';

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
export class PostPage implements OnInit {

  post: any;
  author!: string;
  comments: any = [];
  categories: any = [];

  constructor(
    public loadingController: LoadingController,
    public alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationService
  ) { }

  async ngOnInit() {
    this.route.data.subscribe(routeData => {
      const data = routeData['data'];
      this.post = data.post;
      this.author = data.author.name;
      this.categories = data.categories;
      console.log(this.categories);
      this.comments = data.comments;
      console.log(this.comments);
    })
  }

  getComments() {
    return this.wordpressService.getComments(this.post.id);
  }

  loadMoreComments(event: any) {
    const page = (this.comments.length / 10) + 1;

    this.wordpressService.getComments(this.post.id, page)
      .subscribe((comments: any) => {
        console.log(comments);
        // @ts-ignore
        this.comments.push(...comments);
        event.target.complete();
      }, err => {
        // there are no more comments available
        event.target.disabled = true;
      })
  }

  async createComment() {
    const loggedUser = await this.authenticationService.getUser();

    if (loggedUser) {
      let user = JSON.parse(loggedUser);

      // check if token is valid
      this.authenticationService.validateAuthToken(user.token)
        .pipe(
          catchError(error => of(error)),
          map(result => {
            if (result.error) {
              // token is expired
              this.openLogInAlert();
            }
            else {
              // user is logged in and token is valid
              this.openEnterCommentAlert(user);
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

}
