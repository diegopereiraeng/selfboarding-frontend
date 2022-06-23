import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tutorial } from '../models/tutorial.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppService } from 'src/app/app.service';

//const baseUrl = 'http://localhost:8080/api/tutorials';
const baseUrl = 'http://localhost:8080/api/tutorials';


@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  //headers = new HttpHeaders({ authorization : `${this.app.getToken()}` || '' });

  constructor(private http: HttpClient,private app: AppService) { }

  getAll(): Observable<Tutorial[]> {
    
    //console.log(JSON.stringify(this.headers));
    return this.http.get<Tutorial[]>(baseUrl,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
  }

  get(id: any): Observable<Tutorial> {

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

  findByTitle(title: any): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(`${baseUrl}?title=${title}`);
  }
}
