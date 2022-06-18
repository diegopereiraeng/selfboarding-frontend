import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Token } from '../models/token.model';
import { AppService } from 'src/app/app.service';

//import * as dotenv from 'dotenv';

//const baseUrl = 'http://34.133.29.95:80'; //process.env.REPOSITORY_BACKEND||'http://34.133.29.95:80/api/repositories';
const baseUrl = 'http://34.133.29.95:80';

export interface UserSignup {
  name: string; 
  username: string; 
  password: string;
  email: string; 
}

export interface ServerMessage {
  success: boolean; 
  message: string; 
  timestamp: any; 
  error: string; 
  status: number; 
  path: string; 
}


@Injectable({
  providedIn: 'root'
})
export class LoginService {


  constructor(private http: HttpClient,private app: AppService) {
  }

  login(data: any): Observable<Token> {

    return this.http.post<Token>(`${baseUrl}/signin`,data);
  }

  signup(data: UserSignup): Observable<ServerMessage> {

    console.log(JSON.stringify(data));
    return this.http.post<ServerMessage>(`${baseUrl}/users`,data);
  }

}
