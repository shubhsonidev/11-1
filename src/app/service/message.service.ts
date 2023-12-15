import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'https://soft7.in/api/send';
  private instanceId = '65785DBA24637';
  private accessToken = '6578021f0b174';
  constructor(private http: HttpClient) { }

  sendMediaMessage(number: number): Observable<any> {
    const url = `${this.apiUrl}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const payload = {
      number: '91' + number,
      type: 'media',
      message: 'shubh',
      media_url: 'https://media.discordapp.net/attachments/1022127438387486833/1101750697466286110/sticker.png?ex=6586784b&is=6574034b&hm=68245d87ac10fe605b1c922e755254dea1b775169e6ceda5ac409b14c1a61de2&=&format=webp&quality=lossless&width=200&height=200',
      instance_id: this.instanceId,
      access_token: this.accessToken
    };

    return this.http.post(url, payload, { headers: headers }).pipe(
      catchError((error) => {
        console.error('API Error:', error);
        return throwError('Something went wrong with the API request.');
      })
    );
  }
}
