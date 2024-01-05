import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { schemesResponse } from 'src/app/screens/schemes-list/schemes-list.component';
import { ApiUrlService } from 'src/app/service/api-url.service';
import { EnrolledService, enrolledResponse } from 'src/app/service/enrolled.service';
import { MessageConfigService } from 'src/app/service/message-config.service';
import { SchemeService } from 'src/app/service/scheme.service';

@Component({
  selector: 'app-bottom-action',
  templateUrl: './bottom-action.component.html',
  styleUrls: ['./bottom-action.component.scss']
})
export class BottomActionComponent {
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
  loading: boolean = false;
  selectedScheme: string = 'Select Scheme'
  mainScheme: any;
  selectedBenefit: any;
  selectedSchemeName: string = 'Select Scheme'
  selectedId: any;
  selectedPrefix: any;
  schemeData: any[] = [];
  payload = [];


  selectedDelay: any = 5;
selectInstRem: any = 'Select Installment';

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private apiservice: ApiUrlService,
    private schemeService: SchemeService,
    private messageConfigService: MessageConfigService,
    public enrolled: EnrolledService,
  ) { }
  private modalService = inject(NgbModal);
  ngOnInit(): void {
    this.year = localStorage.getItem('selectedYear')
    this.schemeData = this.schemeService.data

    if (this.schemeService.data.length === 0) {
      this.http.get<schemesResponse>(this.apiservice.url + "apifor=schemes" + "&year=" + this.year).subscribe(response => {
        this.schemeData = response.data;
        this.schemeService.data = response.data
        console.log(this.schemeService.data)
      })
    }
    else {
      this.schemeData = this.schemeService.data
    }
  }

  sendReminderToAll() {
    this.loading = true;
  
    // Create a Set to store unique numbers
    const uniqueNumbersSet = new Set();
  
    // Iterate through the data to populate the Set with unique numbers
    this.enrolled.data.forEach((item) => {
      uniqueNumbersSet.add(item.number);
    });
  
    // Convert the Set back to an array
    const uniqueNumbersArray = Array.from(uniqueNumbersSet);
  
    // Iterate through the unique numbers array to send reminders
    uniqueNumbersArray.forEach((uniqueNumber, index) => {
      setTimeout(() => {
        this.http
          .get<any>(
            'https://soft7.in/api/send?number=91' +
              uniqueNumber +
              '&type=text&message=सम्मानीय+' +
              this.getNameByNumber(uniqueNumber) +
              ',%0Aअपनी+सुविधा+जमा+योजना+की+इस+माह+की+*किश्त*+जमा+करने+का+कष्ट+करें+|%0Aअगर+किश्त+जमा+हो+तो+इस+मेसेज+को+अनदेखा+करें+|%0A%0A*हरिदर्शन+ज्वेलर्स*%0A*बीना*%0ADear+customer,%0APlease+make+efforts+to+deposit+this+months+*installment*+of+your+Suvidha+Deposit+Scheme.%0AIf+the+installment+is+deposited+then+ignore+this+message.%0A%0A*Haridarshan+Jewellers*%0A*Bina*&instance_id=658976BB30348&access_token=6578021f0b174'
          )
          .subscribe((res) => {
            // Handle response if needed
          });
  
        // Check if this is the last iteration to stop loading
        if (index === uniqueNumbersArray.length - 1) {
          this.loading = false;
        }
      }, index * this.selectedDelay * 1000);
    });
  
    this.modalService.dismissAll();
  }
  
  // Helper function to get the name by number
  getNameByNumber(number: any) {
    const matchingItem = this.enrolled.data.find((item) => item.number === number);
    return matchingItem ? matchingItem.name : '';
  }
  

sendReminderToSpecific(){
  if(this.selectInstRem === 'Select Installment'){
    this.toastr.error('Select Installment')
    return;
  }
  this.loading = true;
  for (let i = 0; i < this.enrolled.data.length; i++) {
    if (this.enrolled.data[i] && this.enrolled.data[i]['inst' + this.selectInstRem] === "") {

    setTimeout(() => {

      this.http.get<any>('https://soft7.in/api/send?number=91' + this.enrolled.data[i].number + '&type=text&message=सम्मानीय+' + this.enrolled.data[i].name + ',%0Aआपकी+सुविधा+जमा+योजना+की+इस+माह+की+*किश्त*+जमा+नहीं+है+कृपया+इसे+जमा+करने+का+कष्ट+करें+|%0A%0A*हरिदर्शन+ज्वेलर्स*%0A*बीना*&instance_id=658976BB30348&access_token=6578021f0b174')
        .subscribe((res) => {
         
        });
    
    }, i * this.selectedDelay *1000); }
    if(i === this.enrolled.data.length-1){
      this.loading = false;
    }
  }  
  this.modalService.dismissAll()
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
  selectDelay(delay: any,) {
   this.selectedDelay = delay;
  }

  selectInst(inst: any,) {
   this.selectInstRem = inst;
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
          this.enrolled.fetch().subscribe(
            (response: enrolledResponse) => {
              this.enrolled.data = response.data;
            },
            (error) => {
              console.error('Error fetching data:', error);
            })
        if(this.messageConfigService.data[0].enrollMessage){
          if(this.messageConfigService.data[2].isImage){

          this.http.get<any>('https://soft7.in/api/send?number=91' + this.custNumber +'&type=media&message=Dear%20' + this.custName.toUpperCase() + ',%0AYou%20are%20successfully%20enrolled%20in%20' + this.selectedSchemeName + '.%0A%0AHaridarshan%20jewellers%0ABina&media_url=' + this.messageConfigService.data[3].imageUrl +'&instance_id=658976BB30348&access_token=6578021f0b174').subscribe((res) => {})
        }
        else{
          this.http.get<any>('https://soft7.in/api/send?number=91' + this.custNumber +'&type=media&message=Dear%20' + this.custName.toUpperCase() + ',%0AYou%20are%20successfully%20enrolled%20in%20' + this.selectedSchemeName + '.%0A%0AHaridarshan%20jewellers%0ABina&instance_id=658976BB30348&access_token=6578021f0b174').subscribe((res) => {})
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
