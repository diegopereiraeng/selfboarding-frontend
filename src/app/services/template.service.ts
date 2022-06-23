import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Template } from '../models/template.model';
import { AppService } from 'src/app/app.service';

//import * as dotenv from 'dotenv';

//const baseUrl = 'http://34.133.29.95:80/api/repositories'; //process.env.REPOSITORY_BACKEND||'http://34.133.29.95:80/api/repositories';
const baseUrl = 'http://34.133.29.95:80/api/harness/templates';


@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpClient,private app: AppService) {

  }
  

  getAll(): Observable<Template[]> {
    return this.http.get<Template[]>(baseUrl,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  get(id: any): Observable<Template> {
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

  findByName(title: any): Observable<Template[]> {
    return this.http.get<Template[]>(`${baseUrl}?Name=${title}`,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  discover(): Observable<Template[]> {
    return this.http.get<Template[]>(`${baseUrl}/discover`,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }
}
