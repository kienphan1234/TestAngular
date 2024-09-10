import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { catalogue } from '../models/catalogue';

@Injectable({
  providedIn: 'root'
})
export class CatalogueService {

  private apiUrl = 'assets/data.json';

  constructor(private http: HttpClient) { }

  getProductData(): Observable<catalogue> {
    return this.http.get<catalogue>(this.apiUrl);
  }

}
