import { HttpClient } from '@angular/common/http';
import { Component, inject, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiUrlService } from 'src/app/service/api-url.service';
import { MessageConfigService } from 'src/app/service/message-config.service';
import { SchemeService } from 'src/app/service/scheme.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private modalService = inject(NgbModal);
  messageConfigData: any;
  enrollMessage: any;
  emiMessage: any;
  addImage: any = false;
  imageUrl: any;


  constructor(private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    private apiservice: ApiUrlService,
    private messageConfigService: MessageConfigService
  ) { }
  private offcanvasService = inject(NgbOffcanvas);
  closeResult = '';
  year: any;



  ngOnInit(): void {
    this.year = localStorage.getItem('selectedYear')
    this.http.get<any>(this.apiservice.url + "apifor=messageConfig").subscribe(response => {
      this.messageConfigData = response.data;
      this.enrollMessage = response.data[0].enrollMessage
      this.emiMessage = response.data[1].emiMessage
      this.addImage = response.data[2].isImage
      this.imageUrl = response.data[3].imageUrl
      this.messageConfigService.data = response.data;
    })
  }

  open(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { ariaLabelledBy: 'offcanvas-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case OffcanvasDismissReasons.ESC:
        return 'by pressing ESC';
      case OffcanvasDismissReasons.BACKDROP_CLICK:
        return 'by clicking on the backdrop';
      default:
        return `with: ${reason}`;
    }
  }
  logout() {
    localStorage.clear()
    this.router.navigate(['/login']);
  }

  navigateToSelect() {
    localStorage.removeItem('selectedYear')
    this.router.navigate(['/selectYear'])
    this.modalService.dismissAll()
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }
  changeEnrollMessageConfig(value: boolean) {
    this.http.get<any>(this.apiservice.url + "apifor=enrollMessage&value=" + this.enrollMessage).subscribe(response => {

      if (response.data[0].status === "success") {
        this.toastr.success('Configuration Saved Successfully')
        this.http.get<any>(this.apiservice.url + "apifor=messageConfig").subscribe(response => {
          this.messageConfigData = response.data;
          this.enrollMessage = response.data[0].enrollMessage
          this.emiMessage = response.data[1].emiMessage
          this.addImage = response.data[2].isImage
          this.imageUrl = response.data[3].imageUrl
          this.messageConfigService.data = response.data;
        })
      }
      else {
        this.toastr.error('error')
        this.http.get<any>(this.apiservice.url + "apifor=messageConfig").subscribe(response => {
          this.messageConfigData = response.data;
          this.enrollMessage = response.data[0].enrollMessage
          this.emiMessage = response.data[1].emiMessage
          this.addImage = response.data[2].isImage
          this.imageUrl = response.data[3].imageUrl
          this.messageConfigService.data = response.data;
        })

      }
    })
  }

  addImageUrl(value: boolean) {
    this.http.get<any>(this.apiservice.url + "apifor=addImageUrl&value=" + this.imageUrl).subscribe(response => {

      if (response.data[0].status === "success") {
        this.toastr.success('Image url Saved Successfully')
        this.http.get<any>(this.apiservice.url + "apifor=messageConfig").subscribe(response => {
         this.messageConfigData = response.data;
      this.enrollMessage = response.data[0].enrollMessage
      this.emiMessage = response.data[1].emiMessage
      this.addImage = response.data[2].isImage
      this.imageUrl = response.data[3].imageUrl
      this.messageConfigService.data = response.data;
        })
      }
      else {
        this.toastr.error('error')
        this.http.get<any>(this.apiservice.url + "apifor=messageConfig").subscribe(response => {
         this.messageConfigData = response.data;
      this.enrollMessage = response.data[0].enrollMessage
      this.emiMessage = response.data[1].emiMessage
      this.addImage = response.data[2].isImage
      this.imageUrl = response.data[3].imageUrl
      this.messageConfigService.data = response.data;
        })

      }
    })
  }
  changeIsImageConfig(value: boolean) {
    this.http.get<any>(this.apiservice.url + "apifor=isImage&value=" + this.addImage).subscribe(response => {

      if (response.data[0].status === "success") {
        this.toastr.success('Configuration Saved Successfully')
        this.http.get<any>(this.apiservice.url + "apifor=messageConfig").subscribe(response => {
        this.messageConfigData = response.data;
      this.enrollMessage = response.data[0].enrollMessage
      this.emiMessage = response.data[1].emiMessage
      this.addImage = response.data[2].isImage
      this.imageUrl = response.data[3].imageUrl
      this.messageConfigService.data = response.data;
        })
      }
      else {
        this.toastr.error('error')
        this.http.get<any>(this.apiservice.url + "apifor=messageConfig").subscribe(response => {
        this.messageConfigData = response.data;
      this.enrollMessage = response.data[0].enrollMessage
      this.emiMessage = response.data[1].emiMessage
      this.addImage = response.data[2].isImage
      this.imageUrl = response.data[3].imageUrl
      this.messageConfigService.data = response.data;
        })

      }
    })
  }
  changeEMIMessageConfig(value: boolean) {
    this.http.get<any>(this.apiservice.url + "apifor=EmiMessage&value=" + this.emiMessage).subscribe(response => {
      if (response.data[0].status === "success") {
        this.toastr.success('Configuration Saved Successfully')
        this.http.get<any>(this.apiservice.url + "apifor=messageConfig").subscribe(response => {
        this.messageConfigData = response.data;
      this.enrollMessage = response.data[0].enrollMessage
      this.emiMessage = response.data[1].emiMessage
      this.addImage = response.data[2].isImage
      this.imageUrl = response.data[3].imageUrl
      this.messageConfigService.data = response.data;
        })
      }
      else {
        this.toastr.error('error')
        this.http.get<any>(this.apiservice.url + "apifor=messageConfig").subscribe(response => {
        this.messageConfigData = response.data;
      this.enrollMessage = response.data[0].enrollMessage
      this.emiMessage = response.data[1].emiMessage
      this.addImage = response.data[2].isImage
      this.imageUrl = response.data[3].imageUrl
      this.messageConfigService.data = response.data;
        })
      }
    })
  }
}
export interface messageConfig {
  enrollMessage: string;
  emiMessage: string;
}

export interface messageConfigResponse {
  data: messageConfig[];
}