import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rule } from '../models/rule.model';
import { AppService } from 'src/app/app.service';

//import * as dotenv from 'dotenv';

//const baseUrl = 'http://34.133.29.95:80/api/repositories'; //process.env.REPOSITORY_BACKEND||'http://34.133.29.95:80/api/repositories';
const baseUrl = 'http://34.133.29.95:80/api/rules';


@Injectable({
  providedIn: 'root'
})
export class RulesService {

  constructor(private http: HttpClient,private app: AppService) {

  }
  

  getAll(): Observable<Rule[]> {
    return this.http.get<Rule[]>(baseUrl,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  getAllParams(params: any): Observable<any> {
    return this.http.get<any>(baseUrl+"paging",{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' }),params: params});
  }

  get(id: any): Observable<Rule> {
    return this.http.get(`${baseUrl}/${id}`,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  create(data: any): Observable<any> {
    return this.http.post(baseUrl, data,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  /* deleteAll(): Observable<any> {
    return this.http.delete(baseUrl,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  } */

  findByName(title: any): Observable<Rule[]> {
    return this.http.get<Rule[]>(`${baseUrl}?Name=${title}`,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  findByIdentifier(identifier: any): Observable<Rule[]> {
    return this.http.get<Rule[]>(`${baseUrl}?identifier=${identifier}`,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  discover(): Observable<Rule[]> {
    return this.http.get<Rule[]>(`${baseUrl}/discover`,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }
}
