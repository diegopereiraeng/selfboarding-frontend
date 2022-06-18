import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from 'src/app/models/token.model';
import { Auth } from 'src/app/models/auth.model';
import { User } from 'src/app/models/user.model';
import { UserLocation } from 'src/app/models/userLocation.model';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable()
export class AppService {

    authenticated = false;

    currentUser = new User("Guest","guest","guest@guest.com","GUEST");

    token: Token = new Token;

    authorization: string = this.token.tokenType + ' ' + this.token.accessToken

    lastLocation = new UserLocation();

    constructor(private http: HttpClient) {
        this.token.tokenType = "Bearer"
        this.token.accessToken = this.getData("SessionID") || '';
        this.recoverSessionAuth();
        this.getLocation().subscribe((location: UserLocation) => {
            this.lastLocation = location;
            this.currentUser.name = "Guest "+(JSON.parse(this.getData("UserLocation")!) as UserLocation)?.regionName || "Guest"
            this.currentUser.username = "guest-"+((JSON.parse(this.getData("UserLocation")!) as UserLocation)?.region || 'guest').toLowerCase()
            this.currentUser.email = "guest@guest."+((JSON.parse(this.getData("UserLocation")!) as UserLocation)?.region || 'guest').toLowerCase()+".com"
            this.saveData("UserLocation",JSON.stringify(location));
            this.saveData("Location",true)
            this.saveData("LocationDate",new Date())
        })
    }

    getDifferenceInMinutes(date1: number, date2: number) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60);
    }

    getLocation(): Observable<UserLocation> {

        const location = this.getData("Location");
        if (location === null) {
            return this.http.get<UserLocation>(`http://ip-api.com/json`);
            
        } else {
            console.log("Location is not null");
        }
        const locationDate = new Date(this.getData("LocationDate")!).valueOf();
        const locationDateCheck = new Date().valueOf(); 
        const diff = (locationDateCheck - locationDate) / 60000;
        

        //const minDiff = parseInt(Math.abs(locationDateCheck - locationDate) / (1000 * 60) % 60);
        //console.log("Diego: "+this.getDifferenceInMinutes(locationDate,locationDate))
        if (diff >= 1.00 ) {
            console.log("Collecting Location diff was "+diff)
            return this.http.get<UserLocation>(`http://ip-api.com/json`);

        }

        return of((JSON.parse(this.getData("UserLocation")!) as UserLocation));
        
    
    }

    setToken(token: Token) {
        this.token = token;
    }

    getToken(){
        this.authorization = this.token.tokenType + ' ' + this.token.accessToken
        return this.authorization;
    }

    saveData(key:string , value: any) {
        sessionStorage.setItem(key, value);
    }

    getData(key: string){
    return sessionStorage.getItem(key);
    }

    removeData(key: string) {
    sessionStorage.removeItem(key);
    }

    async recoverSessionAuth(){
        const headers = new HttpHeaders({
            authorization : this.token.tokenType + ' ' + this.token.accessToken
        });
        
        //const response = await this.http.get<Auth>('http://localhost:8080/auth', {headers: headers}).toPromise();
        const response = await this.http.get<Auth>('http://localhost:8080/auth', {headers: headers}).toPromise();

        if (response['name']) {
            //console.log("authenticating user: "+response['name'])
            this.authenticated = true;
            if (this.authenticated) {
                this.http.get<User>('http://localhost:8080/users/me', {headers: headers}).subscribe(response => {
                this.currentUser.username = response.username;
                this.currentUser.name = response.name;
                this.currentUser.email = response.email;
                this.currentUser.type = response.type;
                this.saveData("username",response.username)
                this.saveData("name",response.name)
                this.saveData("email",response.email)
                this.saveData("type",response.type)
            });
            }
            //console.log(response['name']);
        } else {
            this.authenticated = false;
        }
    }

    async authenticate(credentials: any, callback: any) {
        const headers = new HttpHeaders(credentials ? {
            authorization : this.token.tokenType + ' ' + this.token.accessToken
        } : {});
        
        //const response = await this.http.get<Auth>('http://localhost:8080/auth', {headers: headers}).toPromise();
        const response = await this.http.get<Auth>('http://localhost:8080/auth', {headers: headers}).toPromise();
        /* const result = await this.http.get<Auth>('http://localhost:8080/auth', {headers: headers}).subscribe(response => {
            if (response['name']) {
                console.log("authenticating user: "+response['name'])
                this.authenticated = true;
                console.log(response['name']);
            } else {
                this.authenticated = false;
            }
            return callback && callback();
        }); */
        if (response['name']) {
            //console.log("authenticating user: "+response['name'])
            this.authenticated = true;
            //console.log(response['name']);
        } else {
            this.authenticated = false;
        }

        if (this.authenticated) {
            //console.log("App Service: Getting User info...")
            //this.http.get<User>('http://localhost:8080/users/me', {headers: headers}).subscribe(response => {
            this.http.get<User>('http://localhost:8080/users/me', {headers: headers}).subscribe(response => {
            this.currentUser.username = response.username;
            this.currentUser.name = response.name;
            this.currentUser.email = response.email;
            this.currentUser.type = response.type;
            this.saveData("username",response.username)
            this.saveData("name",response.name)
            this.saveData("email",response.email)
            this.saveData("type",response.type)

            //console.log("App Service: user "+response.username);
            //console.log("App Service: user "+this.getData("name"));

            return callback && callback();
        });
        }
        

    }

}