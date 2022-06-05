import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Repository } from '../models/repository.model';
import { AppService } from 'src/app/app.service';

//import * as dotenv from 'dotenv';

//const baseUrl = 'http://localhost:8080/api/repositories'; //process.env.REPOSITORY_BACKEND||'http://localhost:8080/api/repositories';
const baseUrl = 'http://localhost:8080/api/repositories';


@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private http: HttpClient,private app: AppService) {

  }
  

  getAll(): Observable<Repository[]> {
    return this.http.get<Repository[]>(baseUrl,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  getAllParams(params: any): Observable<any> {
    return this.http.get<any>(baseUrl+"paging",{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' }),params: params});
  }

  get(id: any): Observable<Repository> {
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

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  findByName(title: any): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${baseUrl}?Name=${title}`,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  discover(): Observable<Repository[]> {
    return this.http.get<Repository[]>(`${baseUrl}/discover`,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }
}
