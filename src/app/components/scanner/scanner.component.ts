import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements AfterViewInit {
  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent = new BarcodeScannerLivestreamComponent;

  barcodeValue: any;
  constructor(
    private toastr: ToastrService,
  ) { }
  ngAfterViewInit() {
    this.barcodeScanner.start();
  }

  onValueChanges(result: { codeResult: { code: any; }; }) {
    this.barcodeValue = result.codeResult.code;
    console.log(this.barcodeValue)
this.toastr.success(this.barcodeValue)
this.barcodeScanner.stop();

  }

  onStarted(started: any) {
    console.log(started);
  }
}

