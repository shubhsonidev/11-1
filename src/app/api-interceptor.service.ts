import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if the request is for a specific API that should not be modified
    if (request.url.includes('apifor=verify' || 'apifor=login' || 'api/send')) {
      return next.handle(request);
    }

    // Modify the request URL by adding something
    const modifiedRequest = request.clone({
      url: this.addSomethingToUrl(request.url)
    });

    // Pass the modified request to the next handler
    return next.handle(modifiedRequest);
  }

  private addSomethingToUrl(url: string): string {
    // Add whatever you want to the URL here
    return url + '&token=' + localStorage.getItem('accessToken');
  }
}
