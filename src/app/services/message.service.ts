import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';

//import * as dotenv from 'dotenv';

//const baseUrl = 'http://34.133.29.95:80/api/'; //process.env.REPOSITORY_BACKEND||'http://34.133.29.95:80/api/repositories';
const baseUrl = 'http://34.133.29.95:80/api/';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private http: HttpClient) {

  }
  
  getOne(): Observable<Message> {
    return this.http.get<Message>(baseUrl);
  }

}
