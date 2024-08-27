import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { CommonModule } from '@angular/common';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { AppState } from './store/app.state';
import { Store } from '@ngxs/store';
import { CartService } from './Services/cart.service';
import { Observable } from 'rxjs';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from './Services/auth.service';
import { UserService } from './Services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    NzBadgeModule,
    NzPopoverModule,
    ReactiveFormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, ControlValueAccessor {
  isLoggedIn: boolean = false;
  $adsToBeCompared: Observable<any[]>;
  adsToBeCompared: any[] = [];
  login = localStorage.getItem('auth_token');
  loginPass: any;
  myLogo: string = 'assets/another.png';
  details: any;
  // value: any;
  list: any;
  recipientBank = new FormControl('', [Validators.required]);
  value: any = 'Select';
  onChange: any = () => {};
  onTouch: any = () => {};
  shown: boolean = false; // Controls the visibility of the dropdown
  // list = [] ;
  temp_list = [];
  keyword = '';
  _img: any;
  _label: any;
  _uid: any;
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective | undefined;
  @ViewChild('input', { static: false }) inputs: ElementRef | undefined;
  stepOneForm: any;
  formValue: any;
  routeProduct: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private userService: UserService,
    private ele: ElementRef
  ) {
    this.$adsToBeCompared = this.store.select(
      AppState.getSelectedAdsForComparison
    );
    this.stepOneForm = new FormGroup({
      recipientBank: this.recipientBank,
    });
  }

  ngOnInit(): void {
    this.login;
    this.userService.currentMessage.subscribe((res) => (this.loginPass = res));
    this.isLoggedIn = this.authService.isLoggedIn();
    this.$adsToBeCompared?.subscribe((res: any[]) => {
      // res.forEach((ad) => this.comparedAds.set(ad.product_id, true));

      this.adsToBeCompared = res || [];
    });
    this.getProducts();
    this.writeValue();
  }
  bodyClick() {
    this.isVisible = false;
  }
  getProducts() {
    this.userService.getProducts().subscribe((res) => {
      console.log('where are u', res);
      this.details = res;
    });
  }
  writeValue() {
    if (this.details) {
      this.details.map((x: { name: any }) => {
        if (x.name == this.details) {
          this.value = x.name;
        }
      });
    }
    console.log('value', this.value);
  }
  search(val: any) {
    const searchValue = val.toLowerCase();
    this.list = this.details.filter((item: { name: any }) =>
      item.name.toLowerCase().includes(searchValue)
    );
    console.log('search list', this.list);
  }

  select(item: any) {
    this.onChange(item.name);
    this.value = item.name;
    this.shown = false;
    console.log('value', this.value);

    console.log('Dropdown shown = ', this.shown);
  }
  productRoute() {
    this.routeProduct = this.details.find(
      (product: any) => product.name === this.value
    );
    console.log('route me na', this.routeProduct);

    this.router
      .navigate(['/product', this.routeProduct.product_id])
      .then(() => {
        window.location.reload();
      });
  }

  show() {
    this.shown = !this.shown;
    console.log('Dropdown shown = ', this.shown);

    // this.shown = this.shown ? false : true;
    // setTimeout(() => {
    //   this.inputs?.nativeElement.focus();
    // }, 200);
  }
  registerOnChange(fn: any) {
    this.onChange = fn;
  }
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['login']); // Navigate to login page
    this.login;
  }
  isVisible: boolean = false;

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
