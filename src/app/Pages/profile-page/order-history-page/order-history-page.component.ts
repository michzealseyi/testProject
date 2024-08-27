import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { AppState } from '../../../store/app.state';
import { Observable } from 'rxjs';
import { RemoveOrder } from '../../../store/app.action';
import { MatDialog } from '@angular/material/dialog';
import { LoaderModalComponent } from '../../../loader-modal/loader-modal.component';
import { UserService } from '../../../Services/user.service';

@Component({
  selector: 'app-order-history-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-history-page.component.html',
  styleUrl: './order-history-page.component.scss',
})
export class OrderHistoryPageComponent implements OnInit {
  orders$: Observable<any> | undefined;
  testing: any[] | undefined;
  stateOrder: any[] = [];
  updatedingOrder: any;
  combinedOrders: any[] = [];

  constructor(
    private userService: UserService,
    private store: Store,
    public dialog: MatDialog
  ) {
    this.orders$ = this.store.select(AppState.getOrders);
  }
  ngOnInit(): void {
    this.getOrders();
    this.orders$?.subscribe((res: any) => {
      this.stateOrder = res;
      console.log('state orders', res);
    });
    this.combineOrders(); // Combine orders after stateOrder is updated
    // setTimeout(() => {
    //   this.getOrdersForUser(this.userId);
    // }, 2000);
  }
  newOrders: any[] = [];
  userOrders: any[] = [];
  grandTotal: number = 0;
  userId!: number;
  combineOrders() {
    this.combinedOrders = [...this.stateOrder];
    // this.combinedOrders = [...this.stateOrder, ...this.newOrders];
    console.log('Combined Orders:', this.combinedOrders);
    // if (this.stateOrder && this.newOrders) {

    // }
  }
  getOrders() {
    const loader = this.dialog.open(LoaderModalComponent, {
      height: '150px',
      width: '150px',
      disableClose: true,
    });
    this.userId = Number(localStorage.getItem('user_id'));
    this.userService.getOrders().subscribe({
      next: (res) => {
        console.log('orders', res);
        this.newOrders = res;
        this.combineOrders(); // Combine orders after newOrders is updated
        setTimeout(() => {
          this.getOrdersForUser(this.userId);
          loader.close();
        }, 500);
      },
      error: (err) => {
        loader.close();
      },
      complete: () => {
        loader.close();
      },
    });
  }
  deleteOrder(adId: number) {
    this.store.dispatch(new RemoveOrder(adId));
    this.getOrders(); // Refresh the orders list
    // this.getOrdersForUser(this.userId);
  }
  getOrdersForUser(userId: number): void {
    // Filter orders for the given user ID
    this.userOrders = this.combinedOrders.filter(
      (order: { user_id: number }) => order.user_id === userId
    );

    console.log('MY ORDER', this.userOrders);

    // Calculate the grand total for the user's orders
    this.grandTotal = this.userOrders.reduce(
      (total, order) => total + order.total_price,
      0
    );
  }
}
