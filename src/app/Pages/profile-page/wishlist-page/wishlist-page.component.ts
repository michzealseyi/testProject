import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CartService } from '../../../Services/cart.service';
import { AppState } from '../../../store/app.state';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoaderModalComponent } from '../../../loader-modal/loader-modal.component';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './wishlist-page.component.html',
  styleUrl: './wishlist-page.component.scss',
})
export class WishlistPageComponent implements OnInit {
  comparedAds = new Map<number, boolean>(); // Map to track comparison state by product ID

  $adsToBeCompared: Observable<any[]>;

  newOrders: any[] = [];
  adsToBeCompared: any[] = [];
  constructor(
    private store: Store,
    private cartService: CartService,
    public dialog: MatDialog
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
  }
}
