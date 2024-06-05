import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatComponentsModule } from '@app/mat-components/mat-components.module';
import { Product } from '../product';
import { Vendor } from '@app/vendor/vendor';
import { VendorModule } from '@app/vendor/vendor.module';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '@app/product/product.service';
import { Sort } from '@angular/material/sort';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { VendorService } from '@app/vendor/vendor.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-product-home',
  standalone: true,
  imports: [
    CommonModule,
    MatComponentsModule,
    VendorModule,
    ProductDetailComponent,
  ],
  templateUrl: './product-home.component.html',
  styles: [],
})
export class ProductHomeComponent implements OnInit {
  products: Product[] = []; // Change the array type to Product
  product: Product;
  msg: string;
  displayedColumns: string[] = ['productNo', 'name', 'vendorId'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>(); // Change the data source type to Product
  vendors: Vendor[] = [];
  hideEditForm: boolean = true;
  constructor(
    public productService: ProductService,
    public vendorService: VendorService
  ) {
    this.msg = '';
    this.product = {
      id: '', // Initialize with an empty string
      vendorid: 0, // Initialize with a default value
      name: '',
      costprice: 0,
      msrp: 0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode: '',
      qrcodetxt: '',
    };
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllVendors();
  }

  /**
   * getAllProducts - retrieve everything
   */
  getAllProducts(passedMsg: string = ''): void {
    this.productService.getAll().subscribe({
      // Create observer object
      next: (products: Product[]) => {
        this.products = products;
        this.dataSource.data = this.products;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get products - ${err.message}`),
      complete: () =>
        passedMsg ? (this.msg = passedMsg) : (this.msg = `Products loaded!`),
    });
  } // ProductHomeComponen

  getAllVendors(passedMsg: string = ''): void {
    this.vendorService.getAll().subscribe({
      next: (vendors: Vendor[]) => {
        this.vendors = vendors;
      },
      error: (err: Error) =>
        (this.msg = `Couldn't get vendors - ${err.message}`),
      complete: () => (passedMsg ? (this.msg = passedMsg) : null),
    });
  }

  select(selectedProduct: Product): void {
    this.product = selectedProduct;
    this.msg = `Product ${selectedProduct.id} selected`;
    this.hideEditForm = !this.hideEditForm;
  }

  cancel(msg?: string): void {
    this.hideEditForm = !this.hideEditForm;
    this.msg = 'Operation cancelled';
  }

  update(selectedProduct: Product): void {
    this.productService.update(selectedProduct).subscribe({
      next: (prod: Product) => {
        let msg = `Product ${prod.id} updated!`;
        this.getAllProducts(msg);
      },
      error: (err: Error) => (this.msg = `Update failed! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
      },
    });
  }

  save(product: Product): void {
    product.id ? this.update(product) : this.add(product);
  }

  add(newProduct: Product): void {
    this.msg = 'Adding product...';
    this.productService.create(newProduct).subscribe({
      next: (prod: Product) => {
        let msg = '';
        prod.id
          ? (msg = `Product ${prod.id} added!`)
          : (msg = `Product ${prod.id} not added!`);
        this.getAllProducts(msg);
      },
      error: (err: Error) => (this.msg = `Product not added! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
      },
    });
  }

  delete(selectedProduct: Product): void {
    this.productService.delete(selectedProduct.id).subscribe({
      next: (numOfProductsDeleted: number) => {
        let msg = '';
        numOfProductsDeleted === 1
          ? (msg = `Product ${selectedProduct.id} deleted!`)
          : (msg = `Product ${selectedProduct.id} not deleted!`);
        this.getAllProducts(msg);
      },
      error: (err: Error) => (this.msg = `Delete failed! - ${err.message}`),
      complete: () => {
        this.hideEditForm = !this.hideEditForm;
      },
    });
  }

  newProduct(): void {
    this.product = {
      id: '',
      vendorid: 0,
      name: '',
      costprice: 0,
      msrp: 0,
      rop: 0,
      eoq: 0,
      qoh: 0,
      qoo: 0,
      qrcode: '',
      qrcodetxt: '',
    };
    this.msg = 'New product';
    this.hideEditForm = !this.hideEditForm;
  }

  sortProductsWithObjectLiterals(sort: Sort): void {
    const literals = {
      // Sort on id (which is a string)
      productNo: () =>
      (this.dataSource.data = this.dataSource.data.sort(
        (a: Product, b: Product) =>
          sort.direction === 'asc'
            ? a.id.localeCompare(b.id)
            : b.id.localeCompare(a.id)
      )),
      // Sort on name
      name: () =>
      (this.dataSource.data = this.dataSource.data.sort(
        (a: Product, b: Product) =>
          sort.direction === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name)
      )),
      // Sort on vendorId
      vendorId: () =>
      (this.dataSource.data = this.dataSource.data.sort(
        (a: Product, b: Product) =>
          sort.direction === 'asc'
            ? a.vendorid - b.vendorid
            : b.vendorid - a.vendorid // descending
      )),
    };
    literals[sort.active as keyof typeof literals]();
  }

  // MatPaginator
  pageSize = 8;
  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.dataSource.paginator = paginator;
  }
} // ProductHomeComponent
