import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { NzRateModule } from 'ng-zorro-antd/rate';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngxs/store';
import { AddOrder } from '../../store/app.action';
import { LoaderModalComponent } from '../../loader-modal/loader-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { AppState } from '../../store/app.state';
import { Observable } from 'rxjs';
import { CartService } from '../../Services/cart.service';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzRateModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss',
})
export class ProductDetailsPageComponent implements OnInit {
  toggleEditButton: boolean = false;
  successButton: boolean = false;
  myForm: any;

  selectedProductt: any;
  banks: string[] = ['Bank A', 'Bank B', 'Bank C', 'Bank D']; // List of banks
  orderForm: any;
  userId: any;
  products: { product_id: any; name: any; price: any }[] = [];
  grandTotal: number | undefined;
  details: any;
  productId: any;
  theProduct: any;
  newOrder: any;
  respond: any;
  otherProducts: any;
  category: any;
  newOtherProducts: any;
  $adsToBeCompared: Observable<any[]>;
  comparedAds = new Map<number, boolean>(); // Map to track comparison state by product ID

  constructor(
    private userService: UserService,
    public activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store,
    public dialog: MatDialog,
    private cartService: CartService,
    private router: Router,
    private viewportScroller: ViewportScroller,

  ) {
    this.$adsToBeCompared = this.store.select(
      AppState.getSelectedAdsForComparison
    );
  }

  ngOnInit(): void {
    // this.productId = Number(this.activatedRoute.snapshot.params['product_id']);
    // this.getProducts(this.productId);
    // console.log('test', this.productId);
    this.activatedRoute.params.subscribe((params) => {
      this.productId = Number(params['product_id']);
      this.getProducts(this.productId);
      
    });

    this.orderForm = this.fb.group({
      items: this.fb.array([]), // Initialize as an empty array
    });
    this.$adsToBeCompared.subscribe((ads: any[]) => {
      ads.forEach((ad) => this.comparedAds.set(ad.product_id, true));
    });
  }
  // newProduct(id: any) {
  //   this.router.navigate(['/product', id]).then(() => {
  //   });
  // }

  async newProduct(id: any) {
    await this.router.navigate(['/product', id]);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.viewportScroller.scrollToPosition([0, 0]); // Scroll to the top
      }});
  }
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
  getProducts(id: any) {
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
      this.selectedProductt = this.details.find(
        (product: any) => product.product_id === id
      );
      this.category = this.selectedProductt.category;
      this.otherProducts = this.details.filter(
        (product: any) => product.category === this.category
      );
      this.newOtherProducts = this.otherProducts.filter(
        (product: any) => product.product_id !== id
      );
      loader.close();
      console.log('select product', this.selectedProductt);
      console.log('OTHER product', this.otherProducts);
      console.log('new other product', this.newOtherProducts);
    });
  }
  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }
  addItem(): void {
    const itemFormGroup = this.fb.group({
      product_id: [this.selectedProductt.product_id, Validators.required],
      quantity: [0, [Validators.required, Validators.min(1)]],
      price: [{ value: 0, disabled: true }],
    });

    this.items.push(itemFormGroup);
    this.calculateGrandTotal(); // Recalculate the grand total
  }

  onProductChange(index: number): void {
    console.log('selected', this.theProduct);

    const item = this.items.at(index);
    const selectedProductId = this.selectedProductt.product_id;
    console.log('prdchg', selectedProductId);

    if (this.selectedProductt) {
      const quantity = item.get('quantity')?.value || 1;
      const price = this.selectedProductt.price * quantity;

      item.patchValue({
        price: price,
      });
    }

    this.calculateGrandTotal(); // Recalculate the grand total
  }

  onQuantityChange(index: number): void {
    const item = this.items.at(index);

    if (this.selectedProductt) {
      const quantity = item.get('quantity')?.value || 1;
      const price = this.selectedProductt.price * quantity;

      item.patchValue({
        price: price,
      });
    }

    this.calculateGrandTotal();
  }

  calculateGrandTotal(): void {
    this.grandTotal = this.items.controls.reduce((total, item) => {
      const price = item.get('price')?.value || 0;
      return total + price;
    }, 0);
  }

  // onSubmit(): void {
  //   if (this.orderForm.valid) {
  //     const payload = {
  //       user_id: localStorage.getItem('user_id'), // Replace with actual user ID logic
  //       ...this.orderForm.value,
  //     };

  //     this.userService.createOrder(payload).subscribe(
  //       (response) => {
  //         console.log('Order created successfully', response);
  //         this.respond = response;
  //         // this.newOrder = response.map((resp: any) => ({
  //         //   ...resp,
  //         //   payload2,
  //         // }));
  //         // console.log('new order', this.newOrder);
  //       },
  //       (error) => {
  //         console.error('Error creating order', error);
  //       }
  //     );
  //     console.log('Form submission payload:', payload);
  //   }
  //   this.toggleEditButton = false;
  //   setTimeout(() => {
  //     this.updatedOrder();
  //   }, 2000);
  // }
  updatedOrder() {
    if (this.orderForm.valid) {
      this.toggleEditButton = false;
      const loader = this.dialog.open(LoaderModalComponent, {
        height: '150px',
        width: '150px',
        disableClose: true,
      });
      const uniqueOrderId = Date.now().toString();
      console.log('new id', uniqueOrderId);

      const payload2 = {
        image: this.selectedProductt.imagePath,
        name: this.selectedProductt.name,
        order_id: Number(uniqueOrderId),
        status: 'Placed',
        user_id: Number(localStorage.getItem('user_id')), // Replace with actual user ID logic
        total_price: this.grandTotal,
        ...this.orderForm.value,
      };
      console.log('new submit', payload2);
      this.userService.getOrders().subscribe((res) => {
        loader.close();
        this.successButton = true;

        console.log('orders', res);

        this.store.dispatch(new AddOrder(payload2));
        this.resetForm();
      });
    } else {
      console.log('not submitted');
    }
  }

  editButton(): void {
    this.toggleEditButton = !this.toggleEditButton;
    this.resetForm();
  }

  resetForm(): void {
    this.items.clear(); // Clear the FormArray
    this.addItem(); // Add the initial item or leave empty as needed
    this.calculateGrandTotal(); // Reset the grand total
  }
  editButtonClose(): void {
    this.toggleEditButton = false;
    this.resetForm();
  }
  successClose(): void {
    this.successButton = false;
  }
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  updateProfile() {
    console.log('success');
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
}
