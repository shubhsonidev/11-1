import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiUrlService } from 'src/app/service/api-url.service';
import { ToastrService } from 'ngx-toastr';
import { SchemeService } from 'src/app/service/scheme.service';
import { schemesResponse } from '../schemes-list/schemes-list.component';
import { messageConfig } from 'src/app/components/navbar/navbar.component';
import { MessageService } from 'src/app/service/message.service';
import { MessageConfigService } from 'src/app/service/message-config.service';
import { EnrolledService, enrolledResponse } from 'src/app/service/enrolled.service';
import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
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
  selectedScheme: string = 'Select Scheme'
  mainScheme: any;
  selectedBenefit: any;
  selectedSchemeName: string = 'Select Scheme'
  selectedId: any;
  selectedPrefix: any;
  schemeData: any[] = [];
  payload = [];
  data: any[] = [];
  total: any;
  isStarted = false;
  @ViewChild(BarcodeScannerLivestreamComponent)
  barcodeScanner: BarcodeScannerLivestreamComponent = new BarcodeScannerLivestreamComponent;
  barcodeValue: any;


  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private apiservice: ApiUrlService,
    private schemeService: SchemeService,
    private messageConfigService: MessageConfigService,
    public enrolled: EnrolledService,
    private router: Router,
  ) { }
  private modalService = inject(NgbModal);
  ngOnInit(): void {
    this.loader = true;
    this.year = localStorage.getItem('selectedYear');
  
    if (this.schemeService.data.length === 0) {
      this.http.get<schemesResponse>(this.apiservice.url + "apifor=schemes" + "&year=" + this.year)
        .subscribe(response => {
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
  }
  
  start() {
    this.isStarted = true;
    this.barcodeScanner.start();
  }

  onValueChanges(result: { codeResult: { code: any; }; }) {
this.barcodeScanner.stop();

    this.barcodeValue = result.codeResult.code;
    console.log(this.barcodeValue)
// this.toastr.success(this.barcodeValue)
this.router.navigate(['/pay-emi'], { queryParams: {code: this.barcodeValue}});

  }


  calculateTotalAndFetchEnrolled() {
    this.total = this.calculateTotalPaid(this.enrolled.data);
  
    if (this.enrolled.data.length === 0) {
      this.enrolled.fetch().subscribe(
        (response: enrolledResponse) => {
          this.enrolled.data = response.data;
          this.data = response.data;
  
          // Recalculate total after enrolled data is fetched
          this.total = this.calculateTotalPaid(this.enrolled.data);
          
          this.loader = false; // Move the loader assignment here
        },
        (error) => {
          console.error('Error fetching enrolled data:', error);
          this.loader = false; // Move the loader assignment here
        }
      );
    } else {
      // In case data is already available
      this.loader = false; // Move the loader assignment here
    }
  }
  
  
  

  calculateTotalPaid(dataList: any[]): number {
    let totalPaid = 0;


    for (const item of dataList) {
      totalPaid += item.totalPaid;
    }

    return totalPaid;
  }


  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true, size: 'lg' });
  }
  addScheme() {

    if (!this.schemeName || !this.prefix || !this.year || !this.benefit) {
      this.toastr.warning("Please fill correctly !!");
    }
    else if (
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

      this.toastr.warning("Please fill installments correctly");
    }

    else {
      this.loader = true
      this.http.get<any>(this.apiservice.url + "apifor=add-scheme&schemeName=" + this.schemeName.toUpperCase() + "&prefix=" + this.prefix.toUpperCase() + "&year=" + this.year.toUpperCase() + "&benefit=" + this.benefit
        + "&e1=" + this.e1 + "&e2=" + this.e2 + "&e3=" + this.e3 + "&e4=" + this.e4 + "&e5=" + this.e5 + "&e6=" + this.e6 + "&e7=" + this.e7 + "&e8=" + this.e8 + "&e9=" + this.e9 + "&e10=" + this.e10 + "&e11=" + this.e11 + "&e12=" + this.e12).subscribe((res) => {
          if (res.data[0].status === "success") {

            // this.http.get<yearsResponse>(this.apiservice.url + "apifor=years").subscribe(response => {
            //   this.data = response.data;
            //   this.loader = false;
            // })
            this.schemeName = ''
            this.prefix = ''

            this.benefit = ''
            this.e1 = null
            this.e2 = null
            this.e3 = null
            this.e4 = null
            this.e5 = null
            this.e6 = null
            this.e7 = null
            this.e8 = null
            this.e9 = null
            this.e10 = null
            this.e11 = null
            this.e12 = null
            alert(
              'success'
            )
            this.loader = false
            this.modalService.dismissAll()


            this.http.get<schemesResponse>(this.apiservice.url + "apifor=schemes" + "&year=" + this.year).subscribe(response => {
              this.schemeData = response.data;
              this.schemeService.data = response.data
            })

          }

          else {
            alert('error')
            this.loader = false
          }

        })

    }

  }
  selectScheme(scheme: any,) {
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
      this.custNumber === undefined ||  // Check if custNumber is undefined
      this.selectedSchemeName === 'Select Scheme' ||
      (this.custNumber && this.custNumber.toString().length !== 10)
    ) {
      this.toastr.warning("Please fill correctly !!");
    }

    else {
      this.loader = true
      this.http.get<any>(this.apiservice.url + "apifor=enroll&name=" + this.custName.toUpperCase() + "&number=" + this.custNumber + "&sheetName=" + this.selectedScheme + "&schemeName=" + this.selectedSchemeName + "&schemeId=" + this.selectedId + "&prefix=" + this.selectedPrefix + "&benefit=" + this.selectedBenefit + "&e1=" + this.mainScheme.inst1 + "&e2=" + this.mainScheme.inst2 + "&e3=" + this.mainScheme.inst3 + "&e4=" + this.mainScheme.inst4 + "&e5=" + this.mainScheme.inst5 + "&e6=" + this.mainScheme.inst6 + "&e7=" + this.mainScheme.inst7 + "&e8=" + this.mainScheme.inst8 + "&e9=" + this.mainScheme.inst9 + "&e10=" + this.mainScheme.inst10 + "&e11=" + this.mainScheme.inst11 + "&e12=" + this.mainScheme.inst12).subscribe((res) => {
        if (res.data[0].status === "success") {
        if(this.messageConfigService.data[0].enrollMessage){
          if(this.messageConfigService.data[2].isImage){

          this.http.get<any>('https://soft7.in/api/send?number=91' + this.custNumber +'&type=media&message=Dear%20' + this.custName.toUpperCase() + ',%0AYou%20are%20successfully%20enrolled%20in%20' + this.selectedSchemeName + '.%0A%0AHaridarshan%20jewellers%0ABina&media_url=' + this.messageConfigService.data[3].imageUrl +'&instance_id=65785DBA24637&access_token=6578021f0b174').subscribe((res) => {})
        }
        else{
          this.http.get<any>('https://soft7.in/api/send?number=91' + this.custNumber +'&type=media&message=Dear%20' + this.custName.toUpperCase() + ',%0AYou%20are%20successfully%20enrolled%20in%20' + this.selectedSchemeName + '.%0A%0AHaridarshan%20jewellers%0ABina&instance_id=65785DBA24637&access_token=6578021f0b174').subscribe((res) => {})
        }
      }
          this.custName = ''
          this.custNumber = ''

          this.toastr.success("Successfully enrolled" + this.custName);
          this.loader = false
          this.modalService.dismissAll()
        }

        else {
          this.toastr.error("error" + this.custName);
          this.loader = false
        }

      })

    }
  }


}
