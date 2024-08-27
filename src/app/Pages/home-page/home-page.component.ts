import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../Services/cart.service';
import { AppState } from '../../store/app.state';
import { Select, select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LoaderModalComponent } from '../../loader-modal/loader-modal.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})

// interface  myTest{
//     isTrueFalse: boolean;
//     myId:number
//   }
export class HomePageComponent implements OnInit {
  details: any;
  $adsToBeCompared: Observable<any[]>;

  // alreadyCompared = signal<any>();
  comparedAds = new Map<number, boolean>(); // Map to track comparison state by product ID

  // adsToBeCompared = select<any[]>(AppState.getSelectedAdsForComparison);

  images = [
    { imagePath: 'assets/smart phone.jpg' },
    { imagePath: 'assets/laptop.jpg' },
    { imagePath: 'assets/wireless headphone.jpg' },
    { imagePath: 'assets/smartwatch.jpg' },
    { imagePath: 'assets/Professional DSLR Camera.jpg' },
    { imagePath: 'assets/tv.jpg' },
    { imagePath: 'assets/tablet.jpg' },
    { imagePath: 'assets/gaming console.jpg' },
    { imagePath: 'assets/refrigerator.jpg' },
  ];
  activeIndex: number = 4; // Default active image index
  setActive(index: number) {
    this.activeIndex = index;
  }
  imagePath1: string = 'assets/frame.png';
  imagePath2: string = 'assets/lady.png';
  imagePath3: string = 'assets/bkground-pics.png';

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private store: Store,
    public dialog: MatDialog
  ) {
    this.$adsToBeCompared = this.store.select(
      AppState.getSelectedAdsForComparison
    );

    // this.getProducts();
  }
  ngOnInit(): void {
    this.getProducts();
    this.$adsToBeCompared.subscribe((ads: any[]) => {
      ads.forEach((ad) => this.comparedAds.set(ad.product_id, true));
    });
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

  getProducts() {
    const loader = this.dialog.open(LoaderModalComponent, {
      height: '150px',
      width: '150px',
      disableClose: true,
    });
    this.userService.getProducts().subscribe((res) => {
      console.log('products', res);
      this.details = res.map((item: any, index: number) => ({
        ...item,
        imagePath: this.images[index % this.images.length].imagePath,
      }));
      loader.close();
    });
  }
  // onLogout(): void {
  //   this.authService.logout();
  //   this.router.navigate(['login']); // Navigate to login page

  // }
}
