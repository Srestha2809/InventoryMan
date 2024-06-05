import { PDFURL } from '@app/constants';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { Purchase } from '@app/purchase/purchase';
import { PurchaseItem } from '@app/purchase/purchase-item';
import { PurchaseService } from '@app/purchase/purchase.service';
import { Vendor } from '@app/vendor/vendor';
import { VendorService } from '@app/vendor/vendor.service';
import { Product } from '@app/product/product';
import { ProductService } from '@app/product/product.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, MatComponentsModule, ReactiveFormsModule],
  templateUrl: './viewer.component.html',
})
export class ViewerComponent implements OnInit, OnDestroy {
  // form
  viewerForm: FormGroup;
  vendorid: FormControl;
  productid: FormControl;
  poid: FormControl;
  qty: FormControl;
  // data
  formSubscription?: Subscription;
  products: Product[] = []; // everybody's products
  vendors: Vendor[] = []; // all vendors
  quantities: { value: number; label: string }[] = []; // all quantities
  vendorproducts: Product[] = []; // all products for a particular vendor
  items: PurchaseItem[] = []; // product items that will be in purchase-order
  selectedproducts: Product[] = []; // products that being displayed currently in app
  selectedProduct: Product; // the current selected product
  selectedVendor: Vendor; // the current selected vendor
  selectedQuantity: Number = 0;
  vendorpurchases: Purchase[] = [];
  purchases: Purchase[] = [];
  selectedPurchase: Purchase;
  purchaseProducts: Product[] = [];
  // misc
  pickedProduct: boolean;
  pickedVendor: boolean;
  pickedPurchase: boolean;
  pickedQty: boolean;
  generated: boolean;
  hasProducts: boolean;
  msg: string;
  subtotal: number = 0.0;
  taxtotal: number = 0.0;
  total: number = 0.0;
  pono: number = 0;
  selectedQty: number = 0;
  constructor(
    private builder: FormBuilder,
    private vendorService: VendorService,
    private productService: ProductService,
    private poService: PurchaseService
  ) {
    this.pickedVendor = false;
    this.pickedProduct = false;
    this.pickedPurchase = false;
    this.pickedQty = false;
    this.generated = false;
    this.msg = '';
    this.vendorid = new FormControl('');
    this.productid = new FormControl('');
    this.poid = new FormControl('');
    this.qty = new FormControl('');
    this.viewerForm = this.builder.group({
      productid: this.productid,
      vendorid: this.vendorid,
      poid: this.poid,
      qty: this.qty,
    });
    this.selectedProduct = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0.0,
      msrp: 0.0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode: '',
      qrcodetxt: '',
    };
    this.selectedVendor = {
      id: 0,
      name: '',
      address1: '',
      city: '',
      province: '',
      postalcode: '',
      phone: '',
      type: '',
      email: '',
    };
    this.selectedPurchase = {
      id: 0,
      vendorid: 0,
      items: [
        {
          id: 0,
          productid: '',
          poid: 0,
          price: 0,
          qty: 0
        },
      ],
      podate: '',
      amount: 0.0
    };
    this.hasProducts = false;
    this.total = 0.0;
  } // constructor
  ngOnInit(): void {
    this.onPickVendor(); // sets up subscription for dropdown click
    this.onPickProduct(); // sets up subscription for dropdown click
    this.onPickPurchase();
    this.onPickQty();
    this.msg = 'loading vendors from server...';
    this.getAllVendors();
  } // ngOnInit
  ngOnDestroy(): void {
    if (this.formSubscription !== undefined) {
      this.formSubscription.unsubscribe();
    }
  } // ngOnDestroy
  /**
  * getAllVendors - retrieve everything
  */
  getAllVendors(passedMsg: string = ''): void {
    this.vendorService.getAll().subscribe({
      // Create observer object
      next: (vendors: Vendor[]) => {
        this.vendors = vendors;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get vendors - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Vendors loaded!`),
    });
  } // getAllVendors
  /**
  * loadVendorProducts - retrieve a particular vendor's products
  */
  loadVendorProducts(): void {
    this.vendorproducts = [];
    this.productService.getSome(this.selectedVendor.id).subscribe({
      // observer object
      next: (products: Product[]) => {
        this.vendorproducts = products;
      },
      error: (err: Error) =>
        (this.msg = `product fetch failed! - ${err.message}`),
      complete: () => { },
    });
  } // loadVendorProducts
  /**
  * onPickVendor - Another way to use Observables, subscribe to the select change event
  * then load specific vendor products for subsequent selection
  */
  onPickVendor(): void {
    this.formSubscription = this.viewerForm
      .get('vendorid')
      ?.valueChanges.subscribe((val) => {
        this.selectedVendor = val; // Vendor data gets stored
        this.loadVendorProducts(); // Products called from vendor added in array
        this.loadVendorPurchase();
        this.pickedQty = false; // Qty not picked
        this.pickedProduct = false; // Product not picked
        this.hasProducts = false; // Array does not have products
        this.msg = 'choose product for vendor';
        this.pickedVendor = true; // Vendor is picked
        this.generated = false; // PO generation flag
        this.items = []; // array for the purchase-order
        this.selectedproducts = []; // array for the details in app html
      });
  } // onPickVendor

  loadVendorPurchase(): void {
    this.vendorpurchases = [];
    this.poService.getSome(this.selectedVendor.id).subscribe({
      // observer object
      next: (purchases: Purchase[]) => {
        this.vendorpurchases = purchases;
      },
      error: (err: Error) =>
        (this.msg = `product fetch failed! - ${err.message}`),
      complete: () => { },
    });
  } // loadEmployeeExpenses
  /**
  * onPickProduct - subscribe to the select change event then
  * update array containing items.
  */
  onPickProduct(): void {
    const productSubscription = this.viewerForm
      .get('productid')
      ?.valueChanges.subscribe((val) => {
        this.selectedProduct = val; // Product data gets stored
        this.quantities = [
          { value: this.selectedProduct.eoq, label: 'EOQ' },
          { value: 0, label: '0' },
          { value: 1, label: '1' },
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
          { value: 5, label: '5' }
        ]
        this.msg = 'choose qty to order';
        this.pickedVendor = true; // Vendor is picked
        this.pickedProduct = true; // Product is picked
        this.generated = false; // PO not generated yet
      });
    this.formSubscription?.add(productSubscription); // add it as a child, so all can be destroyed together
  } // onPickProduct
  /**
  * onPickQty - subscribe to the select change event then
  * update array containing items.
  */
  onPickQty(): void {
    const quantitySubscription = this.viewerForm
      .get('qty')
      ?.valueChanges.subscribe((val) => {
        const item: PurchaseItem = {
          id: 0,
          poid: 0,
          productid: this.selectedProduct?.id,
          qty: val,
          price: this.selectedProduct?.costprice
        };
        this.subtotal = 0.0;
        if (
          this.items.find((item) => item.productid === this.selectedProduct?.id)
        ) {
          const index = this.items.findIndex((item) => item.productid === this.selectedProduct?.id);
          if (index !== -1) {
            if (item.qty === 0) {
              this.items.splice(index, 1);
              this.msg = 'all ' + this.selectedProduct.name + '\'s removed';
            } else {
              this.items[index].qty = item.qty;
            }
          }
        } else {
          // add entry
          this.items.push(item);
        }
        if (this.items.length > 0) {
          this.hasProducts = true;
        } else {
          this.hasProducts = false;
          this.msg = 'No items';
        }
        this.items.forEach((pro) => this.subtotal += (pro.qty * pro.price));
        this.taxtotal = this.subtotal * 0.13;
        this.total = this.subtotal + this.taxtotal;
      });
    this.formSubscription?.add(quantitySubscription); // add it as a child, so all can be destroyed together
  } // onPickProduct
  onPickPurchase(): void {
    const selectedReportSubscription = this.viewerForm
      .get('poid')
      ?.valueChanges.subscribe((val) => {
        this.selectedPurchase = val;
        // retrieve just the expenses in the report
        if (this.vendorproducts !== undefined) {
          this.purchaseProducts = this.vendorproducts.filter((product) =>
            this.selectedPurchase?.items.some(
              (item) => item.productid === product.id
            )
          );
        }
        if (this.purchaseProducts.length > 0) {


          this.hasProducts = true;
          this.total = 0.0;
          this.taxtotal = 0.0;
          this.subtotal = 0.0;
          this.vendorpurchases.forEach((exp) => {
            exp.items.forEach((lineItem) => {
              this.subtotal += lineItem.price * lineItem.qty;
            });
          });

          this.taxtotal = this.subtotal * 0.13;
          this.total = this.subtotal + this.taxtotal;
        }


      });

    this.formSubscription?.add(selectedReportSubscription); // add it as a child, so all can be destroyed together

  }
  /**
  * createPurchaseOrder - create the client side purchase-order
  */
  createPurchaseOrder(): void {
    this.generated = false;
    const po: Purchase = {
      id: 0,
      items: this.items,
      vendorid: this.selectedProduct.vendorid,
      amount: 0,
      podate: '',
    };
    this.poService.create(po).subscribe({
      // observer object
      next: (po: Purchase) => {
        // server should be returning purchase-order with new id
        po.id > 0
          ? (this.msg = `Purchase Order ${po.id} added!`)
          : (this.msg = 'Purchase Order not added! - server error');
        this.pono = po.id;
      },
      error: (err: Error) => (this.msg = `Purchase Order not added! - ${err.message}`),
      complete: () => {
        this.hasProducts = false;
        this.pickedVendor = false;
        this.pickedProduct = false;
        this.pickedPurchase = false;
        this.generated = true;
      },
    });
  } // createPurchaseOrder
  viewPdf(): void {
    window.open(`${PDFURL}${this.selectedPurchase.id}`, '');
  }
  getProductName(productId: string): string {
    const product = this.vendorproducts.find((p) => p.id === productId);
    return product ? product.name : 'Product Not Found';
  }
} // GeneratorComponent