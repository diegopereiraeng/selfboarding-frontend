import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Repository } from 'src/app/models/repository.model';
import { RepositoryService } from 'src/app/services/repository.service';
import { FFService } from 'src/app/services/ff.service';
import { AppService } from 'src/app/app.service';



@Component({
    selector: 'app-repositories',
    templateUrl: './repositories.component.html',
    styleUrls: ['./repositories.component.css']
  })
  export class RepositoriesComponent implements OnInit {

    repositories?: Repository[];
    currentRepository?: Repository;
    currentIndex = -1;
    repositoryName = ''
    //load page
    repositoriesEnabled: boolean = true;
    repositoryEmpty = false;
    loading = false;
    
    name = '';
    //sort & search
    isDesc: boolean = false;
    column: string = 'name';


    //Pagination
    page = 1;
    count = 0;
    pageSize = 5;
    pageSizes = [5, 10, 20];

    constructor(private app: AppService,private repositoryService: RepositoryService, private ff: FFService) { 
      console.log("App Starting")

      /* if (!this.ff.flagExists('Harness_Repositories')) {
        ff.SetFlags('Harness_Repositories',true);
      }  */
    }

    searchEnabled(){ return false }

    getRequestParams(searchName: string, page: number, pageSize: number): any {
      // tslint:disable-next-line:prefer-const
      let params: any = {};
      if (searchName) {
        params[`name`] = searchName;
      }
      if (page) {
        params[`page`] = page - 1;
      }
      if (pageSize) {
        params[`size`] = pageSize;
      }
      return params;
    }

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

    repositoryEnabled(){
      let result = Boolean(this.ff.GetFlags('Repositories'))
      this.repositoriesEnabled = result;
      //console.log("repository enabled: "+this.repositoryEnable)
      //console.log("repository enabled: "+result)
      if (this.repositoriesEnabled === true) {
        //console.log("repository"+this.repositories)
        if (this.repositories === undefined && !this.repositoryEmpty) {
          this.retrieveRepositories();
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
    }

    authenticated() { return this.app.authenticated; }

    retrieveRepositories(): void {
      const params = this.getRequestParams(this.name, this.page, this.pageSize);
      this.repositoryService.getAllParams(params)
        .subscribe(
          data => {
            const { repositories, totalItems } = data;

            this.repositories = repositories;
            this.count = totalItems;
            console.log("checking repositories");
            console.log(data);
            console.log(this.repositories);
            console.log(this.count);
            
            if (data === undefined) {
              this.repositoryEmpty = true;
              console.log("repositories empty")
            }else{
              this.repositoryEmpty = false;
            }
            //console.log(data);
          },
          error => {
            console.log(error);
          
            this.repositoryEmpty = true;
          
          });
    }
    // pagination
    handlePageChange(event: number): void {
      this.page = event;
      this.retrieveRepositories();
    }
    handlePageSizeChange(event: any): void {
      this.pageSize = event.target.value;
      this.page = 1;
      this.retrieveRepositories();
    }
    // end pagination
    refreshList(): void {
      this.retrieveRepositories();
      this.currentRepository = undefined;
      this.currentIndex = -1;
    }

    setActiveRepository(repository: Repository, index: number): void {
      this.currentRepository = repository;
      this.currentIndex = index;
    }

    searchName(): void {
      this.currentRepository = undefined;
      this.currentIndex = -1;
  
      this.repositoryService.findByName(this.repositoryName)
        .subscribe(
          data => {
            this.repositories = data;
            if (data === undefined) {
              this.repositoryEmpty = false;
            }
            else{
              this.repositoryEmpty = true;
            }
          },
          error => {
            console.log(error);
            this.repositoryEmpty = true;
          });
    }

    ngOnInit(): void {
      if (!this.ff.flagExists('Repositories')) {
          this.ff.SetFlags('Repositories',true);
      }
        this.retrieveRepositories();
        console.log(this.repositories)
    }
  }