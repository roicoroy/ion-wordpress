import { Routes } from '@angular/router';

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
    loadComponent: () => import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'nd-graphics',
    loadComponent: () => import('./nd-graphics/nd-graphics.page').then( m => m.NdGraphicsPage)
  },
  {
    path: 'woo-products',
    loadComponent: () => import('./woo-products/woo-products.page').then( m => m.WooProductsPage)
  },
];
