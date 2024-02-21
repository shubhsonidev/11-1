import { HttpClient } from '@angular/common/http';

import { ApiUrlService } from 'src/app/service/api-url.service';
import { schemesResponse } from '../schemes-list/schemes-list.component';
import { OrderService } from 'src/app/service/order.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { Component, TemplateRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
  constructor(
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private apiservice: ApiUrlService,
    private orderService: OrderService
  ) {}
  data: any[] = [];
  loading: any = false;
  myForm!: FormGroup;
  selectedDisc?: string;

  private modalService = inject(NgbModal);
  ngOnInit(): void {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      description: ['', Validators.required],
      deliveryDate: ['', Validators.required],
    });
    var year = localStorage.getItem('selectedYear');
    if (this.orderService.data.length === 0) {
      this.http
        .get<schemesResponse>(this.apiservice.url + 'apifor=orderList')
        .subscribe((response) => {
          this.data = response.data;
          // this.loader = false;
          this.orderService.data = response.data;
          console.log(this.orderService.data);
        });
    } else {
      this.data = this.orderService.data;
    }
  }
  addOrder() {
          this.loading = true;

    if (this.myForm && this.myForm.valid) {
      console.log(this.myForm.value);

      this.http
        .get<schemesResponse>(
          this.apiservice.url +
            'apifor=add-order&name=' +
            this.myForm.value.name +
            '&number=' +
            this.myForm.value.number +
            '&discription=' +
            this.replaceNewLine( this.myForm.value.description )+
            '&deliveryDate=' +
            this.datePipe.transform(this.myForm.value.deliveryDate, 'dd-MM-yyyy') + 
            '&orderDate=' +
            this.formatDate(new Date()) +
            '&inhandDate='  + this.formatDate(this.subtractTwoDays(this.myForm.value.deliveryDate))
        )
        .subscribe((res) => {
          if (res.data[0].status === 'success') {
          this.loading = false;

            this.toastr.success('Order Added successfully !!');
          this.modalService.dismissAll();
          this.myForm.reset();
          this.http
        .get<schemesResponse>(this.apiservice.url + 'apifor=orderList')
        .subscribe((response) => {
          this.data = response.data;
          // this.loader = false;
          this.orderService.data = response.data;
          console.log(this.orderService.data);
        });

          }
          else{
            this.toastr.error(' Something went wrong !!');
          this.loading = false;

          }
        });
    } else {
      this.toastr.warning('Please fill out all required fields correctly.');
      this.loading = false;

    }
  }
  openVerticallyCentered(content: TemplateRef<any>, disc?: string) {
    this.modalService.open(content, { centered: true, size: 'xl' });
    this.selectedDisc = disc
  }
replaceNewLine(input: string): string {
    return input.replace(/\n/g, '%0A');
}
 formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because getMonth() returns zero-based month index
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
}
 subtractTwoDays(date: Date): Date {
  const newDate = new Date(date); // Create a new Date object to avoid mutating the original date
  newDate.setDate(newDate.getDate() - 2); // Subtract two days
  return newDate;
}
}

