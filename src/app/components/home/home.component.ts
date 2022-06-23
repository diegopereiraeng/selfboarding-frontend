import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Message } from 'src/app/models/message.model';
import { MessageService } from 'src/app/services/message.service';
import { FFService } from 'src/app/services/ff.service';

@Component({
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
})
export class HomeComponent {

    title = 'Demo';
    greeting: Message = {};

    constructor(private app: AppService, private http: HttpClient, private messageService: MessageService, private ff: FFService) {
        //http.get('http://localhost:8080/api/').subscribe(data => this.greeting = data);
        http.get('http://localhost:8080/api/',{headers: new HttpHeaders({ authorization : `${this.app.getToken()}` || '' })}).subscribe(data => this.greeting = data);
        
        if (!this.ff.flagExists('Home_Version')) {
            ff.SetFlags('Home_Version',"v2");
        }
    }

    homeEnabled() {
        return String(this.ff.GetFlags('Home_Version'));
    }

    getGreatings(){
        if (this.app.getData("name") === "Guest" || this.app.getData("name") === null || this.app.getData("name") === '') {
            return null;
        } else {
            return "Hi "+this.app.getData("name")
        }
    }

    authenticated() { return this.app.authenticated; }

}