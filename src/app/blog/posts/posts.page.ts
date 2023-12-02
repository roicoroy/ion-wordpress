import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, Subject, of, takeUntil } from 'rxjs';
import { WordpressService } from 'src/app/shared/wordpress.service';
import { AuthService } from 'src/app/shared/wooApi';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.page.html',
  styleUrls: ['./posts.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink,
  ]
})
export class PostsPage implements OnInit, OnDestroy {

  posts: Array<any> = new Array<any>();

  categoryId!: number;

  categoryTitle!: string;

  private wooApi = inject(AuthService);

  private readonly ngUnsubscribe = new Subject();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public wordpressService: WordpressService,
  ) { }

  ngOnInit() {
    // this.wooApi.loggedUserObservable()
    //   .subscribe(user => {
    //     // console.log(user);
    //     this.loggedInObservable = user == null ? of(false) : of(true);
    //   });

    this.route.data
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(routeData => {
        const data = routeData['data'];

        this.posts = data.posts;
        this.categoryId = data.categoryId;
        this.categoryTitle = data.categoryTitle;
      })
  }

  loadData(event: any) {
    // const page = (Math.ceil(this.posts.length / 10)) + 1;
    const page = 1;
    this.wordpressService.getRecentPosts(this.categoryId, page)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((newPagePosts: []) => {
        this.posts.push(...newPagePosts);
        // console.log(this.posts);
        event.target.complete();
      }, err => {
        // there are no more posts available
        event.target.disabled = true;
      });
      // .subscribe({
      //   next(newPagePosts: any) {
      //     // @ts-ignore
      //     this.posts.push(...newPagePosts);
      //     // @ts-ignore
      //     console.log(this.posts);
      //     event.target.complete();
      //   },
      //   error(err) {
      //     console.error('something wrong occurred: ' + err);
      //   },
      //   complete() {
      //     console.log('done');
      //   },
      // });
  }

  logOut() {

  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
