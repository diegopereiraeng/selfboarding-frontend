import { Component, SimpleChanges, OnInit } from '@angular/core';

import { AppService } from './app.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from "rxjs/operators";



// USER RUM
import { datadogRum } from '@datadog/browser-rum';



// Feature Flags
import { FFService } from 'src/app/services/ff.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Angular 11 Crud';
  appRepositoryEnabled = false;
  isTracking = true;
  currentLat = 0;
  currentLong = 0;
  loggedIn = false;
  list: any = [];

  
  authenticated() { 
    this.loggedIn = this.app.authenticated;
    if (this.loggedIn) {
      
    }
    return this.app.authenticated;
  }

  constructor(private app: AppService, private http: HttpClient, private router: Router, private ff: FFService) {
    //this.app.authenticate(undefined, undefined);

    datadogRum.init({
      applicationId: '30927cbc-6b55-4c08-9b40-4dac1574ff34',
      clientToken: 'pubefd049856b7fad6db7bdfacd1c29d58c',
      site: 'datadoghq.com',
      service:'selfboarding',
      env:'prod',
      // Specify a version number to identify the deployed version of your application in Datadog 
      // version: '1.0.0',
      sampleRate: 100,
      premiumSampleRate: 100,
      trackInteractions: true,
      defaultPrivacyLevel:'mask-user-input'
    });
        
    datadogRum.startSessionReplayRecording();

    this.registerFlag = this.registerFlag.bind(this);


    // New implementation ff -> lot better than
    
    if (!this.ff.flagExists('App_Title')) {
      ff.SetFlags('App_Title',"Harness");
    }
    if (!this.ff.flagExists('Repositories')) {
      ff.SetFlags('Repositories',false);
    }
    if (!this.ff.flagExists('Promotions')) {
      ff.SetFlags('Promotions',false);
    }
    if (!this.ff.flagExists('Admin')) {
      ff.SetFlags('Admin',true);
    }
  }

  allowPromotions(): boolean {
    return Boolean(this.ff.GetFlags('Promotions'));
  }

  allowRepositories(): boolean {
    return Boolean(this.ff.GetFlags('Repositories'));
  }

  allowAdmin(): boolean {
    return Boolean(this.ff.GetFlags('Admin'));
  }

  getTitle(): string {
    return String(this.ff.GetFlags('App_Title'));
  }

  setRepositoryEnable(value: boolean){
    this.appRepositoryEnabled = value;
  }


  logout() {
    //this.http.post('http://localhost:8080/logout', {}).pipe(
    this.http.post('http://localhost:8080/logout', {}).pipe(
      finalize(() => {
        this.app.authenticated = false;
        this.app.saveData("SessionID","")
        this.app.saveData("name","")
        this.app.saveData("username","")
        this.app.saveData("email","")
        this.app.saveData("type","")
        this.router.navigateByUrl('/login');
      })
      ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.authenticated()
    // only run when property "data" changed
    console.log("Changes ocurred "+ changes)
    if (changes['appRepositoryEnabled']) {
      //console.log("user logged in")
      //console.log(this.appRepositoryEnabled)


    }
  }


  async ngOnInit(): Promise<void> {
    console.log("App Components: FF Starting")
    
    //this.appRepositoryEnabled = this.ff.GetFlags("repositoryEnabled")
    //console.log("flag repository enabled. value = "+ this.appRepositoryEnabled);

    //this.ff.registerEvent(Event.CHANGED, this.registerFlag);

  }

  registerFlag(flag: any): void {
    //console.log("registerFlag event");
    //console.log("flag: "+flag.flag+" value: "+flag.value);
    if (flag.flag === "Repositories") {
      //console.log("flag: "+flag.flag+" value: "+flag.value);
      const value: boolean = flag.value;
      
      this.setRepositoryEnable(value);
    } 
  }
}
