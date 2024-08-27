import { Routes } from '@angular/router';
import { HomePageComponent } from './Pages/home-page/home-page.component';
import { ProductDetailsPageComponent } from './Pages/product-details-page/product-details-page.component';
import { ProfilePageComponent } from './Pages/profile-page/profile-page.component';
import { WishlistPageComponent } from './Pages/profile-page/wishlist-page/wishlist-page.component';
import { OrderHistoryPageComponent } from './Pages/profile-page/order-history-page/order-history-page.component';
import { AuthGuard } from './Services/auth.guard';
import { LoginPageComponent } from './Pages/login-page/login-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] },
  {
    path: 'product/:product_id',
    component: ProductDetailsPageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'wishlist',
        component: WishlistPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'my-orders',
        component: OrderHistoryPageComponent,
        canActivate: [AuthGuard],
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
