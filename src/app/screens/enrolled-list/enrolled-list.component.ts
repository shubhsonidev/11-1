import { HttpClient } from '@angular/common/http';
import {
  Component,
  NgModule,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/service/api-url.service';
import {
  EnrolledService,
  enrolledResponse,
} from 'src/app/service/enrolled.service';
import { SchemeService } from 'src/app/service/scheme.service';
import { schemesResponse } from '../schemes-list/schemes-list.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-enrolled-list',
  templateUrl: './enrolled-list.component.html',
  styleUrls: ['./enrolled-list.component.scss'],
})
export class EnrolledListComponent {
  isChecked: any;
  loader: boolean = false;
  searchTerm: string = '';
  selectedCode: any;
  maturityCode: any;
  maturityScheme: any;
  editSheet: any;
  editCode: any;
  constructor(
    public enrolled: EnrolledService,
    private toastr: ToastrService,

    private http: HttpClient,
    private apiservice: ApiUrlService,
    private schemeService: SchemeService
  ) {}
  data: any[] = [];
  private modalService = inject(NgbModal);
  emis: number[] = [];
  selectedEnrolled: any;
  schemeData: any;
editName: any;
editNumber: any;
  ngOnInit(): void {
    var year = localStorage.getItem('selectedYear');

    if (this.schemeService.data.length === 0) {
      this.loader = true;

      this.http
        .get<schemesResponse>(
          this.apiservice.url + 'apifor=schemes' + '&year=' + year
        )
        .subscribe((response) => {
          this.schemeService.data = response.data;
          this.schemeData = this.schemeService.data;
          this.loader = false;
        });
    } else {
      this.schemeData = this.schemeService.data;
      this.loader = false;
    }

    if (this.enrolled.data.length === 0) {
      this.enrolled.fetch().subscribe(
        (response: enrolledResponse) => {
          this.data = response.data;
          this.enrolled.data = response.data;
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    } else {
      this.data = this.enrolled.data;
    }
  }

  formatDateTime(timestamp: string): string {
    const dateObj = new Date(timestamp);
    const formattedDate = this.formatDate(dateObj);
    const formattedTime = this.formatTime(dateObj);

    return `Paid on ${formattedDate} - ${formattedTime}`;
  }

  private formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${this.addZero(day)}/${this.addZero(month)}/${year}`;
  }

  private formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${this.addZero(hours)}:${this.addZero(minutes)}`;
  }

  private addZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  openVerticallyCentered(content: TemplateRef<any>, account: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.selectedEnrolled = account;
  }

  openVerticallyCenteredBarcode(content: TemplateRef<any>, code: any) {
    this.selectedCode = code;
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  openVerticallyCenteredMaturity(content: TemplateRef<any>, code: any, sheetname: any) {
this.maturityCode = code;
this.maturityScheme = sheetname
    this.modalService.open(content, { centered: true, size: 'sm' });
  }

  openVerticallyCenteredEdit(content: TemplateRef<any>, enrolled: any) {
    this.editName = enrolled.name;
    this.editNumber = enrolled.number;
    this.editSheet = enrolled.sheetName;
    this.editCode = enrolled.code;
    this.modalService.open(content, { centered: true, size: 'md' });
  }
  selectSearch(value: any) {
    this.searchTerm = value;
  }
  payEmi(amount: any, sheetName: any, code: any, emiNumber: any) {
    this.loader = true;
    this.http
      .get<any>(
        this.apiservice.url +
          'apifor=add-emi&sheetName=' +
          sheetName +
          '&amount=' +
          amount +
          '&emiNumber=' +
          emiNumber +
          '&code=' +
          code +
          '&custNumber=' +
          this.selectedEnrolled.number +
          '&custName=' +
          this.selectedEnrolled.name
      )
      .subscribe((res) => {
        if (res.data[0].status === 'success') {
          this.toastr.success('EMI Paid Successfully');
          this.loader = false;
          this.enrolled.fetch().subscribe(
            (response: enrolledResponse) => {
              this.enrolled.data = response.data;
              this.data = response.data;
            },
            (error) => {
              console.error('Error fetching data:', error);
            }
          );

          this.modalService.dismissAll();
        } else {
          alert('error');
          this.loader = false;
        }
      });
    // }
  }
  mature( sheetName: any, code: any) {
    this.loader = true;
    this.http
      .get<any>(
        this.apiservice.url +
          'apifor=maturity&sheetName=' +
          sheetName +
          '&code=' +
          code 
      )
      .subscribe((res) => {
        if (res.data[0].status === 'success') {
          this.toastr.success('Matured Successfully');
          this.loader = false;
          this.enrolled.fetch().subscribe(
            (response: enrolledResponse) => {
              this.enrolled.data = response.data;
              this.data = response.data;
            },
            (error) => {
              console.error('Error fetching data:', error);
            }
          );

          this.modalService.dismissAll();
        } else {
          alert('error');
          this.loader = false;
        }
      });
  }
  editDetails( sheetName: any, code: any, ) {
    this.loader = true;
    this.http
      .get<any>(
        this.apiservice.url +
          'apifor=editEnrolled&sheetName=' +
          sheetName +
          '&code=' +
          code +
          '&custNumber=' +
          this.editName.toUpperCase() +
          '&custName=' +
          this.editNumber
      )
      .subscribe((res) => {
        if (res.data[0].status === 'success') {
          this.toastr.success('Details saved successfully');
          this.loader = false;
          this.enrolled.fetch().subscribe(
            (response: enrolledResponse) => {
              this.enrolled.data = response.data;
              this.data = response.data;
            },
            (error) => {
              console.error('Error fetching data:', error);
            }
          );

          this.modalService.dismissAll();
        } else {
          alert('error');
          this.loader = false;
        }
      });
    // }
  }
}
