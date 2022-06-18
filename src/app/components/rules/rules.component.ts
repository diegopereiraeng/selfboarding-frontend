import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Rule } from 'src/app/models/rule.model';
import { RulesService } from 'src/app/services/rules.service';
import { FFService } from 'src/app/services/ff.service';
import { AppService } from 'src/app/app.service';



@Component({
    selector: 'app-rules',
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.css']
  })
  export class RulesComponent implements OnInit {

    rules?: Rule[];
    currentRule?: Rule;
    currentIndex = -1;
    ruleName = ''
    //load page
    rulesEnabled: boolean = true;
    ruleEmpty = false;
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
    

    constructor(private app: AppService,private rulesService: RulesService, private ff: FFService) { 
      console.log("App Starting")

      /* if (!this.ff.flagExists('Harness_Rules')) {
        ff.SetFlags('Harness_Rules',true);
      }  */
    }

    // pagination
    handlePageChange(event: number): void {
      this.page = event;
      this.retrieveRules();
    }
    handlePageSizeChange(event: any): void {
      this.pageSize = event.target.value;
      this.page = 1;
      this.retrieveRules();
    }
    // end pagination

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

    discoverRules(){ 
      this.loading = true;
      return this.rulesService.discover().subscribe(
        data => {
          this.rules = data;
          console.log("Discovered rules");
          this.loading = false;
          this.ruleEmpty = false;
        },
        error => {
          
          if (error.status === 404) {
            this.ruleEmpty = true
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
  
      this.rules?.sort(function (a, b) {
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

    ruleEnabled(){
      let result = Boolean(this.ff.GetFlags('Rules'))
      this.rulesEnabled = result;
      //console.log("rule enabled: "+this.ruleEnable)
      //console.log("rule enabled: "+result)
      if (this.rulesEnabled === true) {
        //console.log("rule"+this.rules)
        if (this.rules === undefined && !this.ruleEmpty) {
          this.retrieveRules();
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

    retrieveRules(): void {
      const params = this.getRequestParams(this.name, this.page, this.pageSize);
      this.rulesService.getAllParams(params)
        .subscribe(
          data => {

            if (data === null) {
              console.log("no rules found")
            } else {
              
              const { rules, totalItems } = data;
  
              this.rules = rules;
              this.count = totalItems;
              console.log("checking rules");
              console.log(data);
              console.log(this.rules);
              console.log(this.count);
              
              if (data === undefined) {
                this.ruleEmpty = true;
                console.log("rules empty")
              }else{
                this.ruleEmpty = false;
              }
            }
            //console.log(data);
          },
          error => {
            console.log(error);
          
            this.ruleEmpty = true;
          
          });
    }
    
    refreshList(): void {
      this.retrieveRules();
      this.currentRule = undefined;
      this.currentIndex = -1;
    }

    setActiveRule(rule: Rule, index: number): void {
      this.currentRule = rule;
      this.currentIndex = index;
    }

    searchName(): void {
      this.currentRule = undefined;
      this.currentIndex = -1;
  
      this.rulesService.findByName(this.ruleName)
        .subscribe(
          data => {
            this.rules = data;
            if (data === undefined) {
              this.ruleEmpty = false;
            }
            else{
              this.ruleEmpty = true;
            }
          },
          error => {
            console.log(error);
            this.ruleEmpty = true;
          });
    }

    ngOnInit(): void {
      if (!this.ff.flagExists('Rules')) {
          this.ff.SetFlags('Rules',true);
      }
        this.retrieveRules();
        console.log(this.rules)
    }
  }