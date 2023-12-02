import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WordpressService } from 'src/app/shared/wordpress.service';

@Injectable({
    providedIn: 'root'
  })
export class PostsResolver implements Resolve<any> {

    constructor(
        private wordpressService: WordpressService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const categoryId = route.queryParams['categoryId'];
        const categoryTitle = route.queryParams['title'];

        return this.wordpressService.getRecentPosts(categoryId)
            .pipe(
                map((posts) => {
                    
                    console.log(posts);

                    return { posts, categoryTitle, categoryId };
                })
            )
    }
}
