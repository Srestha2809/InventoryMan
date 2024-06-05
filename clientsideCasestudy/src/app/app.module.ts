import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// added MaterialUI imports


import { MatComponentsModule } from './mat-components/mat-components.module';
import { HomeComponent } from './home/home.component';
import { VendorModule } from './vendor/vendor.module';
import { ValidatorsComponent } from './validators/validators.component';
import { ViewerComponent } from './purchase/viewer/viewer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ValidatorsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatComponentsModule,
    VendorModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
