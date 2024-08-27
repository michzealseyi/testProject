import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import {
  AddOrder,
  RemoveOrder,
  RemoveSelectedAdForComparison,
  SetSelectedAdsForComparison,
  SetSelectedOrders,
} from './app.action';

export class AppStateModel {
  selectedAdsForComparison: any[] = [];
  orders: any[] = [];
}

@Injectable()
@State<AppStateModel>({
  name: 'App',
})
export class AppState {
  @Selector()
  static getSelectedAdsForComparison(state: AppStateModel): any[] {
    return state.selectedAdsForComparison;
  }

  @Selector()
  static getOrders(state: AppStateModel): any {
    return state.orders;
  }
  @Action(AddOrder)
  addOrder(
    { getState, patchState }: StateContext<AppStateModel>,
    { payload }: AddOrder
  ) {
    const state = getState();
    patchState({
      orders: [...(state.orders || []), payload],
    });
  }

//   @Action(SetSelectedOrders)
//   SetSelectedOrders(
//     { getState, patchState }: StateContext<AppStateModel>,
//     { payload }: SetSelectedOrders
//   ): void {
//     const state = getState();
//     const currentOrder = state.orders || []; // Ensure it's an array
    
//     patchState({
//       orders: [...currentOrder, ...payload],
//     });
//   }
  

  @Action(SetSelectedAdsForComparison)
  setSelectedAdsForComparison(
    { getState, patchState }: StateContext<AppStateModel>,
    { ads }: SetSelectedAdsForComparison
  ): void {
    const state = getState();
    const currentAds = state.selectedAdsForComparison || []; // Ensure it's an array
    const newAds = ads.filter(
      (newAd: { product_id: string }) =>
        !currentAds.some(
          (currentAd: { product_id: string }) =>
            currentAd.product_id === newAd.product_id
        )
    );
    patchState({
      selectedAdsForComparison: [...currentAds, ...newAds],
    });
  }

  @Action(RemoveSelectedAdForComparison)
  removeSelectedAdForComparison(
    { getState, setState }: StateContext<AppStateModel>,
    { adId }: RemoveSelectedAdForComparison
  ): void {
    const state = getState();
    const updatedAds =
      state.selectedAdsForComparison.filter(
        (ad: { product_id: string }) => ad?.product_id !== adId
      ) || [];
    setState({
      ...state,
      selectedAdsForComparison: updatedAds,
    });
  }

  @Action(RemoveOrder)
  removeOrder(
    { getState, setState }: StateContext<AppStateModel>,
    { orderId }: RemoveOrder
  ): void {
    const state = getState();
    const updatedOrder =
      state.orders.filter(
        (order: { order_id: number }) => order?.order_id !== orderId
      ) || [];
    setState({
      ...state,
      orders: updatedOrder || [],
    });
  }
}
