import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListComponent {

  private API_URL = 'http://localhost:9091/api/';
  public token: any;

  constructor(
    private httpClient: HttpClient,
  ) { }

  getData(): Observable<any> {
    return this.httpClient.get<any>(this.API_URL + "procesos",);
  }

}