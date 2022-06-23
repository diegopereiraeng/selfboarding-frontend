import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { UserBackend } from '../models/userBackend.model';

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
export class UserService {


    constructor(private http: HttpClient,private app: AppService) {
    }

    get (): Observable<UserBackend> {

        return this.http.get<UserBackend>(`${baseUrl}/users/view`,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
    }

    update(data: UserBackend): Observable<UserBackend> {

        return this.http.put<UserBackend>(`${baseUrl}/users/${data.username}`,data,{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })});
    }


}
