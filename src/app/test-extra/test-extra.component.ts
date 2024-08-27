import { Component } from '@angular/core';

@Component({
  selector: 'app-test-extra',
  standalone: true,
  imports: [],
  templateUrl: './test-extra.component.html',
  styleUrl: './test-extra.component.scss'
})
export class TestExtraComponent implements OnInit {
  toggleEditButton: boolean = false;
  successButton: boolean = false;
  myForm: any;
  // orderForm: FormGroup;

  selectedProduct: any;
  banks: string[] = ['Bank A', 'Bank B', 'Bank C', 'Bank D']; // List of banks
  orderForm: any;
  userId: any;
  products: { product_id: any; name: any; price: any }[] = [];
  grandTotal: number | undefined;

  constructor(
    private userService: UserService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    // this.myForm = new FormGroup({
    //   number: new FormControl('', [Validators.required, Validators.min(5)]),
    //   name: new FormControl('', [Validators.required]),
    // });
    const productId = 1;
    // const productId = Number(this.activatedRoute.snapshot.params['product_id']);
    this.getProducts(productId);
    console.log('test', productId);
  }
  ngOnInit(): void {
    this.products = [
      { product_id: 1, name: 'Smartphone', price: 599.99 },
      { product_id: 2, name: 'Laptop', price: 999.99 },
      { product_id: 3, name: 'Wireless Headphones', price: 149.99 },
      { product_id: 4, name: 'Smartwatch', price: 199.99 },
      { product_id: 5, name: 'Professional DSLR Camera', price: 499.99 },
      { product_id: 6, name: 'Smart TV', price: 799.99 },
      { product_id: 7, name: 'Tablet', price: 299.99 },
      { product_id: 8, name: 'Gaming Console', price: 399.99 },
      { product_id: 9, name: 'Energy-Efficient Refrigerator', price: 599.99 },
    ];

    this.orderForm = this.fb.group({
      items: this.fb.array([]), // Initialize as an empty array
    });
    this.addItem(); // Add an initial item row
  }
  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }
  addItem(): void {
    const itemFormGroup = this.fb.group({
      product_id: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [{ value: 0, disabled: true }],
    });

    this.items.push(itemFormGroup);
    this.calculateGrandTotal(); // Recalculate the grand total
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
    this.calculateGrandTotal(); // Recalculate the grand total
  }

  onProductChange(index: number): void {
    const item = this.items.at(index);
    const selectedProductId = item.get('product_id')?.value;
    const selectedProduct = this.products.find(
      (product) => product.product_id == selectedProductId
    );
    console.log('prdchg', selectedProduct);

    if (selectedProduct) {
      const quantity = item.get('quantity')?.value || 1;
      const price = selectedProduct.price * quantity;

      item.patchValue({
        price: price,
      });
    }

    this.calculateGrandTotal(); // Recalculate the grand total
  }

  onQuantityChange(index: number): void {
    const item = this.items.at(index);
    const selectedProductId = item.get('product_id')?.value;
    const selectedProduct = this.products.find(
      (product) => product.product_id == selectedProductId
    );

    if (selectedProduct) {
      const quantity = item.get('quantity')?.value || 1;
      const price = selectedProduct.price * quantity;

      item.patchValue({
        price: price,
      });
    }

    this.calculateGrandTotal();
  }

  calculateGrandTotal(): void {
    this.grandTotal = this.items.controls.reduce((total, item) => {
      const price = item.get('price')?.value || 0;
      // const quantity = item.get('quantity')?.value || 0;
      return total + price;
    }, 0);
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      const payload = {
        user_id: 1, // Replace with actual user ID logic
        ...this.orderForm.value,
      };
      console.log('Form submission payload:', payload);
      // this.http.put('/your-api-endpoint', payload).subscribe(response => {
      //   console.log('Order submitted:', response);
      // });
    }
  }

  editButton(): void {
    this.toggleEditButton = !this.toggleEditButton;
    // this.myForm.reset();
  }
  editButtonClose(): void {
    this.toggleEditButton = false;
    // this.myForm.reset();
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
  getProducts(id: any) {
    this.userService.getProducts().subscribe((res) => {
      console.log('products', res);
      this.selectedProduct = res.find(
        (product: any) => product.product_id === id
      );
      console.log('select product', this.selectedProduct);
    });
  }
}