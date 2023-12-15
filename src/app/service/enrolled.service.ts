import { Injectable } from '@angular/core';
import { ApiUrlService } from './api-url.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrolledService {



  constructor(
    private http: HttpClient,
    private apiservice: ApiUrlService,
  ) { }
  data: any[] = [];

  fetch(): Observable<enrolledResponse> {
    var year = localStorage.getItem('selectedYear')
    return this.http.get<enrolledResponse>(this.apiservice.url + 'apifor=enrolled' + '&year=' + year);
  }
}


export interface enrolled {
  id: number;
  name: string;
  number: number;
  code: string;
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
  schemeId: number;
  schemeName: string;
  benefit: string;
  createdAt: string;
  totalPaid: number; // Assuming createdAt is a string, you can adjust the type accordingly
}



export interface enrolledResponse {
  data: enrolled[];
}

