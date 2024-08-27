

export class SetSelectedAdsForComparison {
    static readonly type = '[App] Set Selected Ads For Comparison';
    constructor(public ads: any[]) {}
  }
  export class SetSelectedOrders {
    static readonly type = '[App] Set Selected Ads For Comparison';
    constructor(public payload: any) {}
  }
  export class RemoveSelectedAdForComparison {
    static readonly type = '[App] Remove Selected Ad For Comparison';
    constructor(public adId: string) {}
  }
  export class RemoveOrder {
    static readonly type = '[App] Remove Order';
    constructor(public orderId: number) {}
  }
  export class AddOrder {
    static readonly type = '[Order] Add Order';
    constructor(public payload: any) {}
  }