import { Routes } from '@angular/router';
import { PostsResolver } from './blog/posts/posts.resolver';
import { PostResolver } from './blog/post/post.resolver';

export const routes: Routes = [
  {
    path: '',
    // redirectTo: 'folder/inbox',
    redirectTo: 'nd-graphics',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'nd-graphics',
    loadComponent: () =>
      import('./nd-graphics/nd-graphics.page').then(m => m.NdGraphicsPage)
  },
  {
    path: 'product-list',
    loadComponent: () =>
      import('./shop/product-list/product-list.page').then(m => m.ProductListPage)
  },
  {
    path: 'product-details/:id',
    loadComponent: () =>
      import('./shop/product-details/product-details.page').then(m => m.ProductDetailsPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'posts',
    loadComponent: () => import('./blog/posts/posts.page').then( m => m.PostsPage),
    resolve: {
      data: PostsResolver
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: 'post/:id',
    loadComponent: () => import('./blog/post/post.page').then( m => m.PostPage),
    resolve: {
      data: PostResolver
    }
  },
];


