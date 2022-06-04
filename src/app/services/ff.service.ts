import { Injectable, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FF } from '../models/ff.model';
import { UserLocation } from '../models/userLocation.model';
import { FFClient } from '../models/ffClient.model';
import { AppService } from 'src/app/app.service';
// Feature Flags
import { initialize, Event, Result } from '@harnessio/ff-javascript-client-sdk'


@Injectable({
  providedIn: 'root'
})
export class FFService {

  flags: Array<FF> = [];
  ffSdk = '3bd65244-64dc-4e7e-a492-ef5226f5c7ac';
  cfClient = {} as Result;
  loggedIn = false;
  clients: FFClient[] = [];
  userLocation: UserLocation = new UserLocation();

  constructor(private http: HttpClient,private app: AppService) {
    this.authenticated()

    // Setup initials flags
    this.flags.push(new FF('repositoryEnabled',false));
    this.flags.push(new FF('harnessOnboardingEnabled',false));

    this.app.getLocation().subscribe(
      data => {
        this.app.saveData("UserLocation",JSON.stringify(data));
        this.userLocation.country = data.country;
        this.userLocation.countryCode = data.countryCode;
        this.userLocation.region = data.region;
        this.userLocation.regionName = data.regionName;
        this.userLocation.city = data.city;
        this.userLocation.isp = data.isp;
        this.userLocation.org = data.org;
        this.userLocation.zip = data.zip;
        this.app.saveData("Location",true)
        this.app.saveData("LocationDate",new Date())
        
      },
      error => {
        console.log(error);
        this.app.saveData("Location",false)
      });

    this.renitializeSDK()

  }


  
  registerEvent(event: Event,callback: any){ 
    console.log("Registering event subcription")
    this.clients.push( new FFClient(event,callback) );

    this.cfClient.on(event,callback)
  }

  authenticated() {
    if (this.loggedIn != this.app.authenticated) {
      this.loggedIn = this.app.authenticated;
      //console.log("FF Service: Authenticated")
      this.renitializeSDK();
    }
    return this.loggedIn
  }

  renitializeSDK() {
    /* console.log("Restarting FF Service SDK");
    console.log("Restarting username = "+this.app.currentUser.username)
    console.log("Restarting "+this.app.currentUser.username+ " auth="+this.app.authenticated)
    console.log("Restarting FF Service: Registering new target, restarting SDK"); */
    this.cfClient.off;
    this.cfClient.close;

    this.authenticated()

    

    // Setup initials flags
    this.flags.push(new FF('Repositories',false));
    //this.flags.push(new FF('harnessOnboardingEnabled',false));

    // Initialize Client
    this.cfClient = initialize(this.ffSdk, {
      identifier: this.app.getData("username") || this.app.currentUser.username!,      // Target identifier
      name: this.app.getData("name") || this.app.currentUser.name!,                  // Optional target name
      attributes: {                            // Optional target attributes
        email: this.app.getData("email") || this.app.currentUser.email!,
        userType: this.app.getData("type") || this.app.currentUser.type!,
        platform: navigator.platform,
        language: navigator.language,
        timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone),
        country: this.userLocation.country,
        region: this.userLocation.region,
        regionName: this.userLocation.regionName,
        city: this.userLocation.city,
        isp: this.userLocation.isp,
        org: this.userLocation.org,
        zip: this.userLocation.zip
      }
    });
    //console.log(this.clients.length)
    for (let clientID = 0; clientID < this.clients.length; clientID++) {
      const client:FFClient = this.clients[clientID];
      this.cfClient.on(client.event!,client.callback!)
      //console.log(clientID)
    }

    this.cfClient.on(Event.READY, flags => {
      console.log(JSON.stringify(flags))
      for (const [key, value] of Object.entries(flags)) {
        //console.log("Diego READY");
        //console.log(key);
        //console.log(value);
        this.SetFlags(key,value);
      }
      /* console.log(JSON.stringify(flags, null, 2))
      console.log(flags["Repositories"]); */
      this.SetFlags("Repositories",Boolean(flags["Repositories"]));
      //this.SetFlags("harnessOnboardingEnabled",Boolean(flags["Harness_Onboarding"]));
      
    })

    this.cfClient.on(Event.CHANGED, flagInfo => {
      /* console.log("Flag:"+flagInfo.flag+" changed")
      console.log(JSON.stringify(flagInfo, null, 2)) */
      if (flagInfo.flag === "Repositories") {
        this.SetFlags("repositoryEnabled",Boolean(flagInfo.value));
        this.SetFlags(flagInfo.flag,Boolean(flagInfo.value));
      }
      else if (flagInfo.flag === "Repository_Filter") {
        this.SetFlags("Repository_Filter",Boolean(flagInfo.value));
        this.SetFlags(flagInfo.flag,Boolean(flagInfo.value));
      }
      else{

        
        /* console.log("Flag:"+flagInfo.flag+" changed to "+Boolean(flagInfo.value)) */
        if (typeof flagInfo.value === "boolean") {
          this.SetFlags(flagInfo.flag,Boolean(flagInfo.value));
        }
        else{
          this.SetFlags(flagInfo.flag,String(flagInfo.value));
        }
      }
        
      
    })
  }

  flagExists(flag:string):boolean {
    this.flags.filter(flagObj => flagObj.flag == flag)
    let ffToUpdate = new FF(flag,"false");
    let updateItem = this.flags.find(this.findIndexToUpdate, ffToUpdate.flag);

    let index = this.flags.indexOf(updateItem!);

    if (this.flags[index] !== undefined) {
      return true ;
    }
    else {
      return false
    }
  }

  SetFlags(flag: string, value: any ): void {
    
    this.flags.filter(flagObj => flagObj.flag == flag)
    let ffToUpdate = new FF(flag,value);
    let updateItem = this.flags.find(this.findIndexToUpdate, ffToUpdate.flag);

    let index = this.flags.indexOf(updateItem!);

    if (this.flags[index] !== undefined) {
      this.flags[index].value = value ;
    }else{
      this.flags.push(new FF(flag,value));
    }
    

  }

  findIndexToUpdate(flagObj: any) { 
        return flagObj.flag === this;
  }

  GetFlags(flag: string ): any {
    
    this.flags.filter(flagObj => flagObj.flag == flag)
    let ffToUpdate = new FF(flag,false);
    let updateItem = this.flags.find(this.findIndexToUpdate, ffToUpdate.flag);
    let index = this.flags.indexOf(updateItem!);
    //this.flags[index].value = this.cfClient.variation(flag,this.flags[index].value);
    /* console.log("Get flags "+flag+": " + this.flags[index].value) */
    
    return this.flags[index].value
  }



  ngOnChanges(changes: SimpleChanges) {

    /* console.log("FF Service: Authenticated="+this.loggedIn)
    console.log("FF Service: Authenticated="+this.app.currentUser) */
    // only run when property "data" changed
    if (changes['loggedIn']) {
      
      console.log("FF Service");
      console.log("Registering new target, restarting SDK");
      this.renitializeSDK()
      
    }
  }

  async ngOnInit(): Promise<void> {
    //dotenv.config();
    console.log("FF Starting");
    
    this.renitializeSDK();
    
  }

  
}
