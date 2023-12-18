import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiUrlService } from 'src/app/service/api-url.service';
import { ToastrService } from 'ngx-toastr';
import { SchemeService } from 'src/app/service/scheme.service';
import { schemesResponse } from '../schemes-list/schemes-list.component';

import { MessageConfigService } from 'src/app/service/message-config.service';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';

import {
  EnrolledService,
  enrolledResponse,
} from 'src/app/service/enrolled.service';
import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  schemeName: any;
  prefix: any;
  year: any;
  benefit: any;
  e1: any = null;
  e2: any = null;
  e3: any = null;
  e4: any = null;
  e5: any = null;
  e6: any = null;
  e7: any = null;
  e8: any = null;
  e9: any = null;
  e10: any = null;
  e11: any = null;
  e12: any = null;
  custName: any = '';
  custNumber: any = null;
  loader: boolean = false;
  selectedScheme: string = 'Select Scheme';
  mainScheme: any;
  selectedBenefit: any;
  selectedSchemeName: string = 'Select Scheme';
  selectedId: any;
  selectedPrefix: any;
  schemeData: any[] = [];
  payload = [];
  data: any[] = [];
  total: any;
  totalAmont: any;
  isStarted = false;
  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent =
    new BarcodeScannerLivestreamComponent();
  barcodeValue: any;
  schemeNumber: any = null;

  public chartOptions!: AgChartOptions;
  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private apiservice: ApiUrlService,
    private schemeService: SchemeService,
    private messageConfigService: MessageConfigService,
    
    public enrolled: EnrolledService,
    private router: Router,

  ) {
  }
  
  private modalService = inject(NgbModal);
  ngOnInit(): void {


   
  
    this.loader = true;
    this.year = localStorage.getItem('selectedYear');

    if (this.schemeService.data.length === 0) {
      this.http
        .get<schemesResponse>(
          this.apiservice.url + 'apifor=schemes' + '&year=' + this.year
        )
        .subscribe((response) => {
          this.schemeData = response.data;
          this.schemeService.data = response.data;
          console.log(this.schemeService.data);

          // Calculate total after data is fetched
          this.calculateTotalAndFetchEnrolled();


        
        });
    } else {
      this.schemeData = this.schemeService.data;
      this.loader = false;

      // Calculate total if data is already available
      this.calculateTotalAndFetchEnrolled();
    }



    if(this.schemeNumber != null){
      this.chartOptions = {
        data: this.schemeNumber,
        theme: 'ag-default-dark',
  
        background: {
          fill: '#24272F',
      },
        series: [{ type: 'pie', angleKey: 'number', legendItemKey: 'name' }],
      };
    }else{
      this.chartOptions = {
        data: [
        ],
        theme: 'ag-default-dark',
  
        background: {
          fill: '#24272F',
      },
        series: [{ type: 'pie', angleKey: 'number', legendItemKey: 'name' }],
      };
    }
  }

  start() {
    this.isStarted = true;
    this.barcodeScanner.start();
  }

  onValueChanges(result: { codeResult: { code: any } }) {
    this.barcodeScanner.stop();

    this.barcodeValue = result.codeResult.code;
    console.log(this.barcodeValue);
    // this.toastr.success(this.barcodeValue)
    this.router.navigate(['/pay-emi'], {
      queryParams: { code: this.barcodeValue },
    });
  }

  calculateTotalAndFetchEnrolled() {
    this.total = this.calculateTotalPaid(this.enrolled.data);
    this.totalAmont = this.calculateTotalAmount(this.enrolled.data);
    this.schemeNumber = this.countEntriesByScheme(this.enrolled.data);
    if (this.enrolled.data.length === 0) {
      this.enrolled.fetch().subscribe(
        (response: enrolledResponse) => {
          this.enrolled.data = response.data;
          this.data = response.data;


          this.total = this.calculateTotalPaid(this.enrolled.data);
          this.totalAmont = this.calculateTotalAmount(this.enrolled.data);
          this.schemeNumber = this.countEntriesByScheme(this.enrolled.data);
          this.chartOptions = {
            data: this.schemeNumber,
            theme: 'ag-default-dark',
            background: {
              fill: '#24272F',
          },
            series: [{ type: 'pie', angleKey: 'number', legendItemKey: 'name' }],
          };

          this.loader = false; 
        },
        (error) => {
          console.error('Error fetching enrolled data:', error);
          this.loader = false;
        }
      );
    } else {

      this.loader = false; 
    }
  }
  getData(){
return this.schemeNumber
}
  countEntriesByScheme(
    data: any[]
  ): { name: string; number: number; sum: number, turnover: number }[] {
    const schemeCount: { [key: string]: { number: number; sum: number , turnover: number} } = {};

    data.forEach((entry) => {
      const schemeName = entry.schemeName;
      const instSum =
        (+entry.inst1 || 0) +
        (+entry.inst2 || 0) +
        (+entry.inst3 || 0) +
        (+entry.inst4 || 0) +
        (+entry.inst5 || 0) +
        (+entry.inst6 || 0) +
        (+entry.inst7 || 0) +
        (+entry.inst8 || 0) +
        (+entry.inst9 || 0) +
        (+entry.inst10 || 0) +
        (+entry.inst11 || 0) +
        (+entry.inst12 || 0);
      const instAmountSum =
        (+entry.inst1amount || 0) +
        (+entry.inst2amount || 0) +
        (+entry.inst3amount || 0) +
        (+entry.inst4amount || 0) +
        (+entry.inst5amount || 0) +
        (+entry.inst6amount || 0) +
        (+entry.inst7amount || 0) +
        (+entry.inst8amount || 0) +
        (+entry.inst9amount || 0) +
        (+entry.inst10amount || 0) +
        (+entry.inst11amount || 0) +
        (+entry.inst12amount || 0);

      if (schemeName in schemeCount) {
        schemeCount[schemeName].number++;
        schemeCount[schemeName].sum += instSum;
        schemeCount[schemeName].turnover += instAmountSum;
      } else {
        schemeCount[schemeName] = { number: 1, sum: instSum, turnover: instAmountSum };
      }
    });

    // Convert schemeCount object to an array of objects
    const resultArray = Object.entries(schemeCount).map(
      ([name, { number, sum,turnover }]) => ({ name, number, sum,turnover })
    );

    return resultArray;
  }

  calculateTotalPaid(dataList: any[]): number {
    let totalPaid = 0;

    for (const item of dataList) {
      totalPaid += item.totalPaid;
    }

    return totalPaid;
  }

  calculateTotalAmount(dataList: any[]): number {
    let totalAmount = 0;

    for (const item of dataList) {
      totalAmount +=
        item.inst1amount +
        item.inst2amount +
        item.inst3amount +
        item.inst4amount +
        item.inst5amount +
        item.inst6amount +
        item.inst7amount +
        item.inst8amount +
        item.inst9amount +
        item.inst10amount +
        item.inst11amount +
        item.inst12amount;
    }

    return totalAmount;
  }
  navigateToSelect() {
    localStorage.removeItem('selectedYear');
    this.router.navigate(['/selectYear']);
    this.modalService.dismissAll();
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
  addScheme() {
    if (!this.schemeName || !this.prefix || !this.year || !this.benefit) {
      this.toastr.warning('Please fill correctly !!');
    } else if (
      this.e1 === null ||
      this.e2 === null ||
      this.e3 === null ||
      this.e4 === null ||
      this.e5 === null ||
      this.e6 === null ||
      this.e7 === null ||
      this.e8 === null ||
      this.e9 === null ||
      this.e10 === null ||
      this.e11 === null ||
      this.e12 === null
    ) {
      this.toastr.warning('Please fill installments correctly');
    } else {
      this.loader = true;
      this.http
        .get<any>(
          this.apiservice.url +
            'apifor=add-scheme&schemeName=' +
            this.schemeName.toUpperCase() +
            '&prefix=' +
            this.prefix.toUpperCase() +
            '&year=' +
            this.year.toUpperCase() +
            '&benefit=' +
            this.benefit +
            '&e1=' +
            this.e1 +
            '&e2=' +
            this.e2 +
            '&e3=' +
            this.e3 +
            '&e4=' +
            this.e4 +
            '&e5=' +
            this.e5 +
            '&e6=' +
            this.e6 +
            '&e7=' +
            this.e7 +
            '&e8=' +
            this.e8 +
            '&e9=' +
            this.e9 +
            '&e10=' +
            this.e10 +
            '&e11=' +
            this.e11 +
            '&e12=' +
            this.e12
        )
        .subscribe((res) => {
          if (res.data[0].status === 'success') {
            // this.http.get<yearsResponse>(this.apiservice.url + "apifor=years").subscribe(response => {
            //   this.data = response.data;
            //   this.loader = false;
            // })
            this.schemeName = '';
            this.prefix = '';

            this.benefit = '';
            this.e1 = null;
            this.e2 = null;
            this.e3 = null;
            this.e4 = null;
            this.e5 = null;
            this.e6 = null;
            this.e7 = null;
            this.e8 = null;
            this.e9 = null;
            this.e10 = null;
            this.e11 = null;
            this.e12 = null;
            alert('success');
            this.loader = false;
            this.modalService.dismissAll();

            this.http
              .get<schemesResponse>(
                this.apiservice.url + 'apifor=schemes' + '&year=' + this.year
              )
              .subscribe((response) => {
                this.schemeData = response.data;
                this.schemeService.data = response.data;
              });
          } else {
            alert('error');
            this.loader = false;
          }
        });
    }
  }
  selectScheme(scheme: any) {
    this.mainScheme = scheme;
    this.selectedScheme = scheme.sheetName;
    this.selectedSchemeName = scheme.name;
    this.selectedId = scheme.schemeId;
    this.selectedPrefix = scheme.prefix;
    this.selectedBenefit = scheme.benefit;
  }

  enroll() {
    if (
      !this.custName ||
      this.custNumber === null ||
      this.custNumber === undefined || // Check if custNumber is undefined
      this.selectedSchemeName === 'Select Scheme' ||
      (this.custNumber && this.custNumber.toString().length !== 10)
    ) {
      this.toastr.warning('Please fill correctly !!');
    } else {
      this.loader = true;
      this.http
        .get<any>(
          this.apiservice.url +
            'apifor=enroll&name=' +
            this.custName.toUpperCase() +
            '&number=' +
            this.custNumber +
            '&sheetName=' +
            this.selectedScheme +
            '&schemeName=' +
            this.selectedSchemeName +
            '&schemeId=' +
            this.selectedId +
            '&prefix=' +
            this.selectedPrefix +
            '&benefit=' +
            this.selectedBenefit +
            '&e1=' +
            this.mainScheme.inst1 +
            '&e2=' +
            this.mainScheme.inst2 +
            '&e3=' +
            this.mainScheme.inst3 +
            '&e4=' +
            this.mainScheme.inst4 +
            '&e5=' +
            this.mainScheme.inst5 +
            '&e6=' +
            this.mainScheme.inst6 +
            '&e7=' +
            this.mainScheme.inst7 +
            '&e8=' +
            this.mainScheme.inst8 +
            '&e9=' +
            this.mainScheme.inst9 +
            '&e10=' +
            this.mainScheme.inst10 +
            '&e11=' +
            this.mainScheme.inst11 +
            '&e12=' +
            this.mainScheme.inst12
        )
        .subscribe((res) => {
          if (res.data[0].status === 'success') {
            if (this.messageConfigService.data[0].enrollMessage) {
              if (this.messageConfigService.data[2].isImage) {
                this.http
                  .get<any>(
                    'https://soft7.in/api/send?number=91' +
                      this.custNumber +
                      '&type=media&message=Dear%20' +
                      this.custName.toUpperCase() +
                      ',%0AYou%20are%20successfully%20enrolled%20in%20' +
                      this.selectedSchemeName +
                      '.%0A%0AHaridarshan%20jewellers%0ABina&media_url=' +
                      this.messageConfigService.data[3].imageUrl +
                      '&instance_id=65785DBA24637&access_token=6578021f0b174'
                  )
                  .subscribe((res) => {});
              } else {
                this.http
                  .get<any>(
                    'https://soft7.in/api/send?number=91' +
                      this.custNumber +
                      '&type=media&message=Dear%20' +
                      this.custName.toUpperCase() +
                      ',%0AYou%20are%20successfully%20enrolled%20in%20' +
                      this.selectedSchemeName +
                      '.%0A%0AHaridarshan%20jewellers%0ABina&instance_id=65785DBA24637&access_token=6578021f0b174'
                  )
                  .subscribe((res) => {});
              }
            }
            this.custName = '';
            this.custNumber = '';

            this.toastr.success('Successfully enrolled' + this.custName);
            this.loader = false;
            this.modalService.dismissAll();
          } else {
            this.toastr.error('error' + this.custName);
            this.loader = false;
          }
        });
    }
  }
}
