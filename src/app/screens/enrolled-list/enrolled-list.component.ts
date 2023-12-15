import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/service/api-url.service';
import { EnrolledService, enrolledResponse } from 'src/app/service/enrolled.service';

@Component({
  selector: 'app-enrolled-list',
  templateUrl: './enrolled-list.component.html',
  styleUrls: ['./enrolled-list.component.scss']
})
export class EnrolledListComponent {
  isChecked: any;
  loader: boolean = false;
  selectedCode: any;
  constructor(
    public enrolled: EnrolledService,
    private toastr: ToastrService,

    private http: HttpClient,
    private apiservice: ApiUrlService

  ) { }
  data: any[] = [];
  private modalService = inject(NgbModal);
  emis: number[] = [];
  selectedEnrolled: any;


  ngOnInit(): void {
    if(this.enrolled.data.length === 0){
    this.enrolled.fetch().subscribe(
      (response: enrolledResponse) => {
        this.data = response.data;
        this.enrolled.data = response.data;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
  else{
    this.data = this.enrolled.data;
  }
  }
  openVerticallyCentered(content: TemplateRef<any>, account: any) {
    this.modalService.open(content, { centered: true, size: 'lg' });
    this.selectedEnrolled = account;
  }

  openVerticallyCenteredBarcode(content: TemplateRef<any>, code: any) {
    this.selectedCode = code;
    this.modalService.open(content, { centered: true, size: 'md' });
  }

  payEmi(amount: any, sheetName: any, code: any, emiNumber: any) {

    this.loader = true
    this.http.get<any>(this.apiservice.url + "apifor=add-emi&sheetName=" + sheetName + "&amount=" + amount + "&emiNumber=" + emiNumber + "&code=" + code + "&custNumber=" + this.selectedEnrolled.number + "&custName=" + this.selectedEnrolled.name).subscribe((res) => {
      if (res.data[0].status === "success") {
        this.toastr.success("EMI Paid Successfully");
        this.loader = false
        this.enrolled.fetch().subscribe(
          (response: enrolledResponse) => {
            this.enrolled.data = response.data;
            this.data = response.data;
          },
          (error) => {
            console.error('Error fetching data:', error);
          }
        );

        this.modalService.dismissAll()
      }

      else {
        alert('error')
        this.loader = false
      }

    })
    // }


  }

}

