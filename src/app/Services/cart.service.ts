import { Select, Store } from '@ngxs/store';
import { AppState } from '../store/app.state';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  RemoveSelectedAdForComparison,
  SetSelectedAdsForComparison,
} from '../store/app.action';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  //   @Select(AppState.getSelectedAdsForComparison) $adsToBeCompared:
  //     | Observable<any[]>
  //     | undefined;
  $adsToBeCompared: Observable<any[]>; // Remove the @Select decorator

  adAdded: boolean = false;
  adsToBeCompared: any[] = [];

  constructor(private store: Store) {
    this.$adsToBeCompared = this.store.select(
      AppState.getSelectedAdsForComparison
    );
    this.$adsToBeCompared.subscribe((res) => {
      this.adsToBeCompared = res || [];
    });
    // this.$adsToBeCompared?.subscribe((res) => {
    //   this.adsToBeCompared = res || [];
    // });
  }

  onCompareClick(ad: any) {
    const existingAd = this.adsToBeCompared.find(
      (selectedAd) => selectedAd?.product_id == ad?.product_id
    );

    if (!existingAd) {
      const updatedAds = [...this.adsToBeCompared, ad];
      this.store.dispatch(new SetSelectedAdsForComparison(updatedAds));
    }
  }

  unCompareAd(adId: string) {
    this.store.dispatch(new RemoveSelectedAdForComparison(adId));
  }
}
