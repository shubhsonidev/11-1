import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/service/api-url.service';
import { EnrolledService, enrolledResponse } from 'src/app/service/enrolled.service';

@Component({
  selector: 'app-payemi-mob',
  templateUrl: './payemi-mob.component.html',
  styleUrls: ['./payemi-mob.component.scss'],
})
export class PayemiMobComponent {
  constructor(
    private route: ActivatedRoute,
    public enrolled: EnrolledService,
    private toastr: ToastrService,
    private http: HttpClient,
    private apiservice: ApiUrlService
  ) {}

  data: any[] = [];
  selectedEnrolled: any;
  param1: any;
  loader: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.param1 = params['code'];
      console.log('param1:', this.param1);

      // Fetch data only if it's not already available
      if (this.enrolled.data.length === 0) {
        this.enrolled.fetch().subscribe(
          (response: enrolledResponse) => {
            this.data = response.data;
            this.enrolled.data = response.data;
            this.processData();
          },
          (error) => {
            console.error('Error fetching data:', error);
          }
        );
      } else {
        this.data = this.enrolled.data;
        this.processData();
      }
    });
  }

  processData() {
    for (let i = 0; i < this.enrolled.data.length; i++) {
      if (this.enrolled.data[i].code.toString() === this.param1) {
        this.selectedEnrolled = i;
      }
    }
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

          // Fetch data again after EMI is paid
          this.enrolled.fetch().subscribe(
            (response: enrolledResponse) => {
              this.enrolled.data = response.data;
              this.data = response.data;
            },
            (error) => {
              console.error('Error fetching data:', error);
            }
          );
        } else {
          alert('error');
          this.loader = false;
        }
      });
  }
}