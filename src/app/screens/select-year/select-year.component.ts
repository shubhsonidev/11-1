import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrlService } from 'src/app/service/api-url.service';
import { YearsService } from 'src/app/service/years.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-select-year',
  templateUrl: './select-year.component.html',
  styleUrls: ['./select-year.component.scss']

})
export class SelectYearComponent {
  private modalService = inject(NgbModal);
  year: string = '';
  data: any[] = [];
  loader: boolean = true;
  loadMessage = 'Fetching years...'

  constructor(private router: Router,
    private years: YearsService,
    private http: HttpClient,
    private apiservice: ApiUrlService
  ) { }
  selectedYear: string = 'Select Year';

  selectYear(year: string) {
    this.selectedYear = year;
  }

  openVerticallyCentered(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }


  navigateToDashboard() {
    localStorage.setItem('selectedYear', this.selectedYear);
    this.router.navigate(['/dashboard']);
    location.reload();

  }

  ngOnInit(): void {
    const year = localStorage.getItem('selectedYear');

    if (year == '' || year == null) { }

    else {
      this.router.navigate(['/dashboard']);
    }



  this.loader = true;

    this.http.get<yearsResponse>(this.apiservice.url + "apifor=years").subscribe(response => {
      this.years.data = response.data;
      this.data = response.data;
      this.loader = false;
    })
  }

  addYear() {
    if (this.year === "") {
      alert("Please fill correctly !!")
    }

    else {
      this.loader = true
      this.http.get<any>(this.apiservice.url + "apifor=add-year&year=" + this.year).subscribe((res) => {
        if (res.data[0].status === "success") {

          this.http.get<yearsResponse>(this.apiservice.url + "apifor=years").subscribe(response => {
            this.data = response.data;
            this.loader = false;
          })
          this.loader = false
          this.year = '';
        }

        else {
          alert('erro')
          this.loader = false
        }

      })
      this.modalService.dismissAll()
    }
  }
}

export interface years {
  years: string;
}

export interface yearsResponse {
  data: years[];
}
