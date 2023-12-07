import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import { WordpressService } from 'src/app/shared/wordpress/wordpress.service';

@Injectable({
    providedIn: 'root'
  })
export class PostResolver implements Resolve<any> {

    constructor(
        private wordpressService: WordpressService
    ) { }

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const id = route.paramMap.get('id');

        return this.wordpressService.getPost(id)
            .pipe(
                concatMap((post: any) => {
                    const author = this.wordpressService.getAuthor(post.author);
                    const categories = this.wordpressService.getPostCategories(post);
                    const comments = this.wordpressService.getComments(post.id);
                    return forkJoin({ author, categories, comments })
                        .pipe(
                            map(postData => {
                                return { ...postData, post };
                            })
                        );
                        
                })
            );
    }
}
