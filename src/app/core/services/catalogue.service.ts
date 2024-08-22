import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { catalogue } from '../models/catalogue';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  private apiUrl = 'https://gearenhance.s3.us-east-1.amazonaws.com/data.json';

  constructor(private http: HttpClient) { }

  getProductData(): Observable<catalogue> {
    return this.http.get<catalogue>(this.apiUrl);
  }

}
