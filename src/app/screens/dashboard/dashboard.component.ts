import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  Component,
  Inject,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiUrlService } from 'src/app/service/api-url.service';
import { ToastrService } from 'ngx-toastr';
import { SchemeService } from 'src/app/service/scheme.service';
import { schemesResponse } from '../schemes-list/schemes-list.component';
import { formatDate } from '@angular/common';
import { MessageConfigService } from 'src/app/service/message-config.service';
import { AgChartsAngularModule } from 'ag-charts-angular';
import { AgChartOptions } from 'ag-charts-community';
import { DatePipe } from '@angular/common';
import {
  EnrolledService,
  enrolledResponse,
} from 'src/app/service/enrolled.service';
import { BarcodeScannerLivestreamComponent } from 'ngx-barcode-scanner';
import { Router } from '@angular/router';
import { BankService } from 'src/app/services/bank.service';

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
  totalBenefit: any;
  loading: any;
  isStarted = false;
  blur = true;
  type: any;
  dailyCollection: any;
  bankAmout: any;
  formattedDate: any;

  bankData: any[] = [];

  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent =
    new BarcodeScannerLivestreamComponent();
  barcodeValue: any;
  schemeNumber: any = null;
  totalmonthamt: any = 0;
  public chartOptions!: AgChartOptions;
  id: any;
  bankDesc: any = 'Select Type';
  bankSearchDesc: any = 'All';
  constructor(
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private http: HttpClient,
    private apiservice: ApiUrlService,
    private schemeService: SchemeService,
    private messageConfigService: MessageConfigService,
    private bank: BankService,
    public enrolled: EnrolledService,
    private router: Router
  ) {}

  private modalService = inject(NgbModal);
  ngOnInit(): void {
    this.loader = true;
    this.year = localStorage.getItem('selectedYear');

    if (this.bank.data.length === 0) {
      this.loader = true;

      this.http
        .get<bankResponse>(
          this.apiservice.url + 'apifor=bank-amount' + '&sheetName=' + this.year
        )
        .subscribe((response) => {
          this.bankData = response.data;
          this.bank.data = response.data;

          this.loader = true;
        });
    } else {
      this.bankData = this.bank.data;
      this.loader = true;
    }

    if (this.schemeService.data.length === 0) {
      this.loader = true;

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
          this.loader = true;
        });
    } else {
      this.schemeData = this.schemeService.data;
      this.loader = true;

      // Calculate total if data is already available
      this.calculateTotalAndFetchEnrolled();
    }

    if (this.schemeNumber != null) {
      this.chartOptions = {
        data: this.schemeNumber,
        theme: 'ag-default-dark',

        background: {
          fill: '#24272F',
        },
        series: [{ type: 'pie', angleKey: 'number', legendItemKey: 'name' }],
      };
    } else {
      this.chartOptions = {
        data: [],
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

  transaction() {
    this.year = localStorage.getItem('selectedYear');
    let sign;
    if (!this.bankAmout || !this.bankSearchDesc) {
      this.toastr.warning('Please fill correctly !!');
    } else {
      if (this.type == 'add') {
        sign = '+';
      } else {
        sign = '-';
      }
      this.loading = true;
      this.http
        .get<any>(
          this.apiservice.url +
            'apifor=bank&sheetName=' +
            this.year +
            '&amount=' +
            sign +
            this.bankAmout +
            '&date=' +
            new Date() +
            '&desc=' +
            this.bankDesc
        )
        .subscribe((res) => {
          if (res.data[0].status === 'success') {
            this.toastr.success('Amount Saved Successfully !');
            this.loading = false;
            this.modalService.dismissAll();
            this.http
              .get<bankResponse>(
                this.apiservice.url +
                  'apifor=bank-amount' +
                  '&sheetName=' +
                  this.year
              )
              .subscribe((response) => {
                this.bankData = response.data;
                this.bank.data = response.data;
              });
          } else {
            alert('error');
            this.loading = false;
          }
        });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    // Adjusting for the local time zone offset
    const localDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60000
    );
    const day = this.addLeadingZero(localDate.getDate());
    const month = this.addLeadingZero(localDate.getMonth() + 1);
    const year = localDate.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private addLeadingZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  editTransaction() {
    this.year = localStorage.getItem('selectedYear');
    let sign;
    if (!this.bankAmout) {
      this.toastr.warning('Please fill correctly !!');
    } else {
      this.loading = true;
      this.http
        .get<any>(
          this.apiservice.url +
            'apifor=edit-bank&sheetName=' +
            this.year +
            '&amount=' +
            this.bankAmout +
            '&id=' +
            this.id
        )
        .subscribe((res) => {
          if (res.data[0].status === 'success') {
            this.toastr.success('Amount Saved Successfully !');
            this.loading = false;
            this.modalService.dismissAll();
            this.http
              .get<bankResponse>(
                this.apiservice.url +
                  'apifor=bank-amount' +
                  '&sheetName=' +
                  this.year
              )
              .subscribe((response) => {
                this.bankData = response.data;
                this.bank.data = response.data;
              });
          } else {
            alert('error');
            this.loading = false;
          }
        });
    }
  }

  totalDeposited(data: any) {
    let total = 0;

    for (let i = 0; i < data.length; i++) {
      total += data[i].amount;
    }
    return total;
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
    this.loader = true;
    this.dailyCollection = this.calculateDailyCollection(this.enrolled.data);
    this.total = this.calculateTotalPaid(this.enrolled.data);
    this.totalAmont = this.calculateTotalAmount(this.enrolled.data);
    this.totalBenefit = this.calculateTotalBenefit(this.enrolled.data);
    this.schemeNumber = this.countEntriesByScheme(this.enrolled.data);
    if (this.enrolled.data.length === 0) {
      this.enrolled.fetch().subscribe(
        (response: enrolledResponse) => {
          this.enrolled.data = response.data;
          this.data = response.data;
          this.dailyCollection = this.calculateDailyCollection(
            this.enrolled.data
          );
          this.total = this.calculateTotalPaid(this.enrolled.data);
          this.totalAmont = this.calculateTotalAmount(this.enrolled.data);
          this.totalBenefit = this.calculateTotalBenefit(this.enrolled.data);

          this.schemeNumber = this.countEntriesByScheme(this.enrolled.data);
          this.chartOptions = {
            data: this.schemeNumber,
            theme: 'ag-default-dark',
            background: {
              fill: '#24272F',
            },
            series: [
              { type: 'pie', angleKey: 'number', legendItemKey: 'name' },
            ],
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

  countEntriesByScheme(data: any[]): {
    name: string;
    number: number;
    sum: number;
    turnover: number;
    month1coll: number;
    month2coll: number;
    month3coll: number;
    month4coll: number;
    month5coll: number;
    month6coll: number;
    month7coll: number;
    month8coll: number;
    month9coll: number;
    month10coll: number;
    month11coll: number;
    month12coll: number;
    month1: number;
    month2: number;
    month3: number;
    month4: number;
    month5: number;
    month6: number;
    month7: number;
    month8: number;
    month9: number;
    month10: number;
    month11: number;
    month12: number;
  }[] {
    const schemeCount: {
      [key: string]: {
        number: number;
        sum: number;
        turnover: number;
        month1coll: number;
        month2coll: number;
        month3coll: number;
        month4coll: number;
        month5coll: number;
        month6coll: number;
        month7coll: number;
        month8coll: number;
        month9coll: number;
        month10coll: number;
        month11coll: number;
        month12coll: number;
        month1: number;
        month2: number;
        month3: number;
        month4: number;
        month5: number;
        month6: number;
        month7: number;
        month8: number;
        month9: number;
        month10: number;
        month11: number;
        month12: number;
      };
    } = {};

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
        schemeCount[schemeName].month1coll +=
          entry.benefit !== 1 ? entry.inst1amount : 0;
        schemeCount[schemeName].month2coll +=
          entry.benefit !== 2 ? entry.inst2amount : 0;
        schemeCount[schemeName].month3coll +=
          entry.benefit !== 3 ? entry.inst3amount : 0;
        schemeCount[schemeName].month4coll +=
          entry.benefit !== 4 ? entry.inst4amount : 0;
        schemeCount[schemeName].month5coll +=
          entry.benefit !== 5 ? entry.inst5amount : 0;
        schemeCount[schemeName].month6coll +=
          entry.benefit !== 6 ? entry.inst6amount : 0;
        schemeCount[schemeName].month7coll +=
          entry.benefit !== 7 ? entry.inst7amount : 0;
        schemeCount[schemeName].month8coll +=
          entry.benefit !== 8 ? entry.inst8amount : 0;
        schemeCount[schemeName].month9coll +=
          entry.benefit !== 9 ? entry.inst9amount : 0;
        schemeCount[schemeName].month10coll +=
          entry.benefit !== 10 ? entry.inst10amount : 0;
        schemeCount[schemeName].month11coll +=
          entry.benefit !== 11 ? entry.inst11amount : 0;
        schemeCount[schemeName].month12coll +=
          entry.benefit !== 12 ? entry.inst12amount : 0;
          schemeCount[schemeName].month1 += Number(entry.inst1) || 0;
          schemeCount[schemeName].month2 += Number(entry.inst2) || 0;
          schemeCount[schemeName].month3 += Number(entry.inst3) || 0;
          schemeCount[schemeName].month4 += Number(entry.inst4) || 0;
          schemeCount[schemeName].month5 += Number(entry.inst5) || 0;
          schemeCount[schemeName].month6 += Number(entry.inst6) || 0;
          schemeCount[schemeName].month7 += Number(entry.inst7) || 0;
          schemeCount[schemeName].month8 += Number(entry.inst8) || 0;
          schemeCount[schemeName].month9 += Number(entry.inst9) || 0;
          schemeCount[schemeName].month10 += Number(entry.inst10) || 0;
          schemeCount[schemeName].month11 += Number(entry.inst11) || 0;
          schemeCount[schemeName].month12 += Number(entry.inst12) || 0;
          
          
          
          
      } else {
        schemeCount[schemeName] = {
          number: 1,
          sum: instSum,
          turnover: instAmountSum,
          month1coll: entry.benefit !== 1 ? entry.inst1amount : 0,
          month2coll: entry.benefit !== 2 ? entry.inst2amount : 0,
          month3coll: entry.benefit !== 3 ? entry.inst3amount : 0,
          month4coll: entry.benefit !== 4 ? entry.inst4amount : 0,
          month5coll: entry.benefit !== 5 ? entry.inst5amount : 0,
          month6coll: entry.benefit !== 6 ? entry.inst6amount : 0,
          month7coll: entry.benefit !== 7 ? entry.inst7amount : 0,
          month8coll: entry.benefit !== 8 ? entry.inst8amount : 0,
          month9coll: entry.benefit !== 9 ? entry.inst9amount : 0,
          month10coll: entry.benefit !== 10 ? entry.inst10amount : 0,
          month11coll: entry.benefit !== 11 ? entry.inst11amount : 0,
          month12coll: entry.benefit !== 12 ? entry.inst12amount : 0,
          month1: Number(entry.inst1) || 0,
          month2: Number(entry.inst2) || 0,
          month3: Number(entry.inst3) || 0,
          month4: Number(entry.inst4) || 0,
          month5: Number(entry.inst5) || 0,
          month6: Number(entry.inst6) || 0,
          month7: Number(entry.inst7) || 0,
          month8: Number(entry.inst8) || 0,
          month9: Number(entry.inst9) || 0,
          month10: Number(entry.inst10) || 0,
          month11: Number(entry.inst11) || 0,
          month12: Number(entry.inst12) || 0,
      
        };
      }
    });

    const resultArray = Object.entries(schemeCount).map(
      ([
        name,
        {
          number,
          sum,
          turnover,
          month1coll,
          month2coll,
          month3coll,
          month4coll,
          month5coll,
          month6coll,
          month7coll,
          month8coll,
          month9coll,
          month10coll,
          month11coll,
          month12coll,
          month1,
          month2,
          month3,
          month4,
          month5,
          month6,
          month7,
          month8,
          month9,
          month10,
          month11,
          month12,
        },
      ]) => ({
        name,
        number,
        sum,
        turnover,
        month1coll,
        month2coll,
        month3coll,
        month4coll,
        month5coll,
        month6coll,
        month7coll,
        month8coll,
        month9coll,
        month10coll,
        month11coll,
        month12coll,
        month1,
        month2,
        month3,
        month4,
        month5,
        month6,
        month7,
        month8,
        month9,
        month10,
        month11,
        month12,
      })
    );

    return resultArray;
  }

  getTotalSum(property: string): number {
    // Check if this.schemeNumber is not null
    if (this.schemeNumber !== null) {
      this.totalmonthamt = this.schemeNumber.reduce(
        (sum: any, item: { [x: string]: any }) => sum + (item[property] || 0),
        0
      );
    } else {
      // Handle the case where this.schemeNumber is null
      this.totalmonthamt = 0;
    }

    return this.totalmonthamt;
  }

  calculateTotalPaid(dataList: any[]): number {
    let totalPaid = 0;

    for (const item of dataList) {
      totalPaid += item.totalPaid;
    }

    return totalPaid;
  }

  changeBlur() {
    this.blur = !this.blur;
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

  calculateTotalBenefit(dataList: any[]): number {
    let totalBenefit = 0;

    for (const item of dataList) {
      if (item.benefit === 1) {
        totalBenefit += item.inst1amount;
      }

      if (item.benefit === 2) {
        totalBenefit += item.inst2amount;
      }

      if (item.benefit === 3) {
        totalBenefit += item.inst3amount;
      }

      if (item.benefit === 4) {
        totalBenefit += item.inst4amount;
      }

      if (item.benefit === 5) {
        totalBenefit += item.inst5amount;
      }

      if (item.benefit === 6) {
        totalBenefit += item.inst6amount;
      }

      if (item.benefit === 7) {
        totalBenefit += item.inst7amount;
      }

      if (item.benefit === 8) {
        totalBenefit += item.inst8amount;
      }

      if (item.benefit === 9) {
        totalBenefit += item.inst9amount;
      }

      if (item.benefit === 10) {
        totalBenefit += item.inst10amount;
      }

      if (item.benefit === 11) {
        totalBenefit += item.inst11amount;
      }

      if (item.benefit === 12) {
        totalBenefit += item.inst12amount;
      }
    }

    return totalBenefit;
  }
  calculateDailyCollection(dataList: any[]): number {
    let dailyCollection = 0;
    const today = new Date();
    for (const item of dataList) {
      if (this.isPaymentWithinRange(item.inst1date, today)) {
        dailyCollection += item.inst1amount;
      }
      if (this.isPaymentWithinRange(item.inst2date, today)) {
        dailyCollection += item.inst2amount;
      }
      if (this.isPaymentWithinRange(item.inst3date, today)) {
        dailyCollection += item.inst3amount;
      }
      if (this.isPaymentWithinRange(item.inst4date, today)) {
        dailyCollection += item.inst4amount;
      }
      if (this.isPaymentWithinRange(item.inst5date, today)) {
        dailyCollection += item.inst5amount;
      }
      if (this.isPaymentWithinRange(item.inst6date, today)) {
        dailyCollection += item.inst6amount;
      }
      if (this.isPaymentWithinRange(item.inst7date, today)) {
        dailyCollection += item.inst7amount;
      }
      if (this.isPaymentWithinRange(item.inst8date, today)) {
        dailyCollection += item.inst8amount;
      }
      if (this.isPaymentWithinRange(item.inst9date, today)) {
        dailyCollection += item.inst9amount;
      }
      if (this.isPaymentWithinRange(item.inst10date, today)) {
        dailyCollection += item.inst10amount;
      }
      if (this.isPaymentWithinRange(item.inst11date, today)) {
        dailyCollection += item.inst11amount;
      }
      if (this.isPaymentWithinRange(item.inst12date, today)) {
        dailyCollection += item.inst12amount;
      }
    }

    return dailyCollection;
  }
  isPaymentWithinRange(
    paymentDate: string | Date | undefined,
    currentDate: Date
  ): boolean {
    if (paymentDate === undefined) {
      return false; // Handle the case when paymentDate is undefined
    }

    const paymentDateObj = new Date(paymentDate);
    const currentMidnight = new Date(currentDate);
    currentMidnight.setHours(0, 0, 0, 0); // Set time to midnight

    const paymentDateMidnight = new Date(paymentDateObj);
    paymentDateMidnight.setHours(0, 0, 0, 0); // Set time to midnight

    return (
      paymentDateMidnight &&
      Math.abs(paymentDateMidnight.getTime() - currentMidnight.getTime()) <= 0
    );
  }

  navigateToSelect() {
    localStorage.removeItem('selectedYear');
    this.router.navigate(['/selectYear']);
    this.modalService.dismissAll();
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
  openVerticallyCenteredxl(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'xl' });
  }

  openVerticallyCenteredBank(content: TemplateRef<any>, type: string) {
    this.bankAmout = '';
    this.type = type;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  openVerticallyCenteredEditBank(
    content: TemplateRef<any>,
    amount: any,
    id: any
  ) {
    this.id = id;
    this.bankAmout = amount;
    this.modalService.open(content, { centered: true, size: 'md' });
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

  selectType(type: any) {
    this.bankDesc = type;
  }
  selectSearchType(type: any) {
    this.bankSearchDesc = type;
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

export interface banks {
  id: string;
  amount: string;
  date: string;
  desc: string;
}

export interface bankResponse {
  data: banks[];
}
