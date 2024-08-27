import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AppState } from '../../store/app.state';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CartService } from '../../Services/cart.service';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  comparedAds = new Map<number, boolean>(); // Map to track comparison state by product ID

  $adsToBeCompared: Observable<any[]>;
  profilePics: any = 'assets/avatar.jpg';
  newOrders: any[] = [];
  adsToBeCompared: any[] = [];
  userId: number | undefined;
  theUser: any;
  userName: any;
  userEmail: any;
  constructor(
    private store: Store,
    private cartService: CartService,
    private userService: UserService
  ) {
    this.$adsToBeCompared = this.store.select(
      AppState.getSelectedAdsForComparison
    );
  }
  toggleCompare(event: MouseEvent, ad: any): void {
    const isCompared = this.comparedAds.get(ad.product_id) || false;

    if (isCompared) {
      this.cartService.unCompareAd(ad?.product_id);
      this.comparedAds.set(ad?.product_id, false);
    } else {
      this.cartService.onCompareClick(ad);
      this.comparedAds.set(ad?.product_id, true);
    }
  }

  isCompared(product_id: number): boolean {
    return this.comparedAds.get(product_id) || false;
  }

  ngOnInit(): void {
    this.$adsToBeCompared?.subscribe((res: any[]) => {
      res.forEach((ad) => this.comparedAds.set(ad.product_id, true));

      this.adsToBeCompared = res || [];
    });
    console.log('comparing', this.adsToBeCompared);
    this.getUserDetails();
  }

  getUserDetails() {
    (this.userId = Number(localStorage.getItem('user_id'))),
      this.userService.getUsers().subscribe((res) => {
        this.theUser = res.find((user: any) => user.user_id === this.userId);
        this.userName = this.theUser.username;
        this.userEmail = this.theUser.email;
      });
  }
}
