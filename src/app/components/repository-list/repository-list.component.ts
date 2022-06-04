import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Repository } from 'src/app/models/repository.model';
import { FF } from 'src/app/models/ff.model';
import { RepositoryService } from 'src/app/services/repository.service';
import { FFService } from 'src/app/services/ff.service';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

// Feature Flags
import { Event } from '@harnessio/ff-javascript-client-sdk'
//import * as dotenv from 'dotenv';




@Component({
  selector: 'app-repository-list',
  templateUrl: './repository-list.component.html',
  styleUrls: ['./repository-list.component.css','../../shared/loading.shared.scss','../../shared/content-div.shared.scss']
})
export class RepositoriesListComponent implements OnInit {
  repositories?: Repository[];
  currentRepository?: Repository;
  currentIndex = -1;
  name = '';
  repositoryEnable: boolean = false; 
  repositoryEmpty = false;
  loading = false;
  userAgent = 'desktop';

  isDesc: boolean = false;
  column: string = 'name';


  // Teste onboarding messages
  Componentname = 'Parent';
  currentMsgToChild1 = '';

  reset() {
    this.currentMsgToChild1 = '';
  }
  // Teste onboarding messages

  constructor(private app: AppService,private repositoryService: RepositoryService, private ff: FFService, private router: Router) { 
    console.log("App Starting")

    if (!this.ff.flagExists('Harness_Onboarding')) {
      ff.SetFlags('Harness_Onboarding',false);
    } 
    if (!this.ff.flagExists('Repository_Filter')) {
      ff.SetFlags('Repository_Filter',false);
    } 
    if (!this.ff.flagExists('Repositories')) {
      ff.SetFlags('Repositories',false);
    } 

    var ua = navigator.userAgent;

    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua)){
      this.userAgent = "mobile"
    }
    else if(/Chrome/i.test(ua)){
      this.userAgent = "chrome"
    }
    else {
      this.userAgent = "desktop"
    }
    /* ff.flags.push(new FF('Harness_Onboarding',false));
    ff.flags.push(new FF('Repository_Filter',false)); */
  }

  authenticated() { return this.app.authenticated; }

  /* SetFlags(flag: String, value: boolean ): void {
    this.repositoryEnabled = value;
  } */

  discoverRepositories(){ 
    this.loading = true;
    return this.repositoryService.discover().subscribe(
      data => {
        this.repositories = data;
        console.log("Discovered repositories");
        this.loading = false;
        this.repositoryEmpty = false;
      },
      error => {
        
        if (error.status === 404) {
          this.repositoryEmpty = true
          console.log("Discover returned empty results: Error "+error);
        }else{
          console.log(error);
        }
        this.loading = false;
      });
  }

  sort(collumn: string) {
    this.isDesc = !this.isDesc; //change the direction    
    this.column = collumn!;
    let direction = this.isDesc ? 1 : -1;

    this.repositories?.sort(function (a, b) {
      if (a.name! < b.name!) {
        return -1 * direction;
      }
      else if (a.name! > b.name!) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  };
  
  onboardingEnabled(){
    //console.log("onboarding enabled: "+this.ff.GetFlags('Harness_Onboarding'))
    return this.ff.GetFlags('Harness_Onboarding');
  }
  repositoryFilterEnabled(){
    //console.log("repositoryFilter enabled: "+this.ff.GetFlags('Repository_Filter'))
    return this.ff.GetFlags('Repository_Filter');
  }
  repositoryEnabled(){
    let result = Boolean(this.ff.GetFlags('Repositories'))
    this.repositoryEnable = result;
    //console.log("repository enabled: "+this.repositoryEnable)
    //console.log("repository enabled: "+result)
    if (this.repositoryEnable === true) {
      //console.log("repository"+this.repositories)
      if (this.repositories === undefined && !this.repositoryEmpty) {
        this.retrieveRepositories();
        if (this.repositories === undefined) {
          this.repositoryEmpty = true;
          console.log("repositories empty")
        }
      }
      //console.log("true")
      return true;
    } else {
      //console.log("false")
      return false;
    }
    
    
  }

  ngOnChanges(changes: SimpleChanges) {
    this.authenticated()
    // only run when property "data" changed
  }

  async ngOnInit(): Promise<void> {

    /* this.repositoryEnabled = this.ff.GetFlags("repositoryEnabled") */
    //console.log("flag repository enabled. value = "+ this.repositoryEnabled());
    //console.log("flag repository enabled");
    if (this.repositoryEnabled()) {

      this.retrieveRepositories();  

    } else {
      console.log("Not Authorized to list repositories");
    }
    
    /* this.ff.cfClient.on(Event.CHANGED, flagInfo => {
      console.log("Repositories: flag changed "+flagInfo.flag);
      if (flagInfo.flag === "Repositories") {
        this.repositoryEnabled() = Boolean(flagInfo.value);
      }
      
    }) */
  }

  retrieveRepositories(): void {
    this.repositoryService.getAll()
      .subscribe(
        data => {
          this.repositories = data;
          console.log("Retrieved repositories");
          if (data === null) {
            console.log("Repositories Empty");
            this.repositoryEmpty = true;
          }else {
            this.repositoryEmpty = false
            this.sort("name");
          }
          
        },
        error => {
          
          if (error.status === 404) {
            this.repositoryEmpty = true
            console.log("Not Found: Error "+error);
          }else{
            this.repositoryEmpty = true
            console.log(error);
          }
          
        });
  }

  refreshList(): void {
    this.retrieveRepositories();
    
    this.currentRepository = undefined;
    this.currentIndex = -1;
    
  }

  setActiveRepository(repository: Repository, index: number): void {
    this.currentRepository = repository;
    this.currentIndex = index;
  }

  removeAllRepositories(): void {
    this.repositoryService.deleteAll()
      .subscribe(
        response => {
          //console.log(response);
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }
  removeOneRepository(): void {
    this.repositoryService.delete(this.currentIndex)
      .subscribe(
        response => {
          //console.log(response);
          this.refreshList();
        },
        error => {
          console.log(error);
        });
  }

  getShortName(name : string){
    let shortName:string = name;
    //console.log(name);
    return shortName.substring(0, 15);
  }

  onboarding(){
    //this.router.navigateByUrl('https://app.harness.io');
    this.currentMsgToChild1 = "Repositories";
    //this.router.navigateByUrl("/onboarding", { skipLocationChange: true });
    
  }

  searchName(): void {
    this.currentRepository = undefined;
    this.currentIndex = -1;

    this.repositoryService.findByName(this.name)
      .subscribe(
        data => {
          this.repositories = data;
          //console.log(data);
        },
        error => {
          console.log(error);
        });
  }

}
