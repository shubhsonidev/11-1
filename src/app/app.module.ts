import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './screens/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LoaderComponent } from './components/loader/loader.component';
import { SelectYearComponent } from './screens/select-year/select-year.component';
import { DashboardComponent } from './screens/dashboard/dashboard.component';
import { BlockLoaderComponent } from './components/block-loader/block-loader.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiInterceptor } from './api-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";
import { FilterPipe } from './filter.pipe';
import { NgChartsModule } from 'ng2-charts';

import {  NgChartsConfiguration } from 'ng2-charts';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ToastrModule } from 'ngx-toastr';
import { SchemesListComponent } from './screens/schemes-list/schemes-list.component';
import { EnrolledListComponent } from './screens/enrolled-list/enrolled-list.component';
import { OtpVerifyComponent } from './screens/otp-verify/otp-verify.component';
import { BottomActionComponent } from './components/bottom-action/bottom-action.component';

import {NgxPrintModule} from 'ngx-print';
import { ScannerComponent } from './components/scanner/scanner.component';
import { PayemiMobComponent } from './screens/payemi-mob/payemi-mob.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoaderComponent,
    SelectYearComponent,
    DashboardComponent,
    BlockLoaderComponent,
    NavbarComponent,
    SchemesListComponent,
    EnrolledListComponent,
    OtpVerifyComponent,
    FilterPipe,
    BottomActionComponent,
     ScannerComponent,
     PayemiMobComponent
  ],
  imports: [
    NgbDatepickerModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    NgxBarcode6Module,
    BarcodeScannerLivestreamModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPrintModule,
    ToastrModule.forRoot(),
    NgChartsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    { provide: NgChartsConfiguration, useValue: { generateColors: false }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
