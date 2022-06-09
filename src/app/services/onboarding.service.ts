import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../models/template.model';
import { AppService } from 'src/app/app.service';

//import * as dotenv from 'dotenv';

//const baseUrl = 'http://localhost:8080/api/repositories'; //process.env.REPOSITORY_BACKEND||'http://localhost:8080/api/repositories';
const baseUrl = 'http://localhost:8080/api/harness';


@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  constructor(private http: HttpClient,private app: AppService) {

  }
  


  onboarding(data: any, name:string): Observable<any> {
    return this.http.post<any>(`${baseUrl}/onboarding/${name}`,data,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }
}
