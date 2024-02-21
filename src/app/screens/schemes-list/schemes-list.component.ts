import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiUrlService } from 'src/app/service/api-url.service';
import { SchemeService } from 'src/app/service/scheme.service';

@Component({
  selector: 'app-schemes-list',
  templateUrl: './schemes-list.component.html',
  styleUrls: ['./schemes-list.component.scss']
})
export class SchemesListComponent {

  constructor(
    private http: HttpClient,
    private apiservice: ApiUrlService,
    private schemeService: SchemeService
  ) { }
  data: any[] = [];


  ngOnInit(): void {

    var year = localStorage.getItem('selectedYear')
    if (this.schemeService.data.length === 0) {

      this.http.get<schemesResponse>(this.apiservice.url + "apifor=schemes" + "&year=" + year).subscribe(response => {
        this.data = response.data;
        // this.loader = false;
        this.schemeService.data = response.data
        console.log(this.schemeService.data)
      })
    }
    else {
      this.data = this.schemeService.data
    }
  }

}

export interface schemes {
  orderId: string;
  name: string;
  number: string;
  discription: string;
  status: string;
  orderDate: string;
  deliveryDate: string;
  inhandDate: string;
}

export interface schemesResponse {
  data: schemes[];
}
