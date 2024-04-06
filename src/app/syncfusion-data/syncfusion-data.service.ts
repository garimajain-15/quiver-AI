import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SyncfusionDataService {
  public shareData = new Subject<[]>();
  public shareData$ = this.shareData.asObservable();
  constructor(private http: HttpClient) { }

  fetchData() {
    return this.http.get<any>('./assets/JSON/sample-data.json').subscribe({next: data => {
      this.shareData.next(data);
    }});
  }
}
