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
  name: string;
  prefix: string;
  year: string;
  benefit: string;
  inst1: string;
  inst2: string;
  inst3: string;
  inst4: string;
  inst5: string;
  inst6: string;
  inst7: string;
  inst8: string;
  inst9: string;
  inst10: string;
  inst11: string;
  inst12: string;
  schemeId: string;
  sheetName: string;
  inst1amount: string;
  inst2amount: string;
  inst3amount: string;
  inst4amount: string;
  inst5amount: string;
  inst6amount: string;
  inst7amount: string;
  inst8amount: string;
  inst9amount: string;
  inst10amount: string;
  inst11amount: string;
  inst12amount: string;
  inst1date: string;
  inst2date: string;
  inst3date: string;
  inst4date: string;
  inst5date: string;
  inst6date: string;
  inst7date: string;
  inst8date: string;
  inst9date: string;
  inst10date:	string;
  inst11date:	string;
  inst12date:	string;
  matured: boolean;
  createdAt: string;




}

export interface schemesResponse {
  data: schemes[];
}
