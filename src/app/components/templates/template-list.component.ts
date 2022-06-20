import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Template } from 'src/app/models/template.model';
import { TemplateService } from 'src/app/services/template.service';
import { FFService } from 'src/app/services/ff.service';
import { AppService } from 'src/app/app.service';


@Component({
    selector: 'app-template-list',
    templateUrl: './template-list.component.html',
    styleUrls: ['./template-list.component.css'],
    template: 'templatelist'
  })
  export class TemplateListComponent implements OnInit {

    //Receive context
    @Input() msgFromParent1: any = '';

    currentMsgToParent = '';
    msgFromTemplate: string[] = [];

    templates?: Template[];
    currentTemplate?: Template;
    currentIndex = -1;
    templateName = ''
    //load page
    templatesEnabled: boolean = true;
    templateEmpty = false;
    loading = false;

    name = '';
    //sort & search
    isDesc: boolean = false;
    column: string = 'name';


    //user agent 
    userAgent = 'desktop';

    constructor(private app: AppService,private templateService: TemplateService, private ff: FFService) { 
      console.log("App Starting")
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

      /* if (!this.ff.flagExists('Harness_Templates')) {
        ff.SetFlags('Harness_Templates',true);
      }  */
    }

    searchEnabled(){ return false }

    discoverTemplates(){ 
      this.loading = true;
      return this.templateService.discover().subscribe(
        data => {
          this.templates = data;
          console.log("Discovered templates");
          this.loading = false;
          this.templateEmpty = false;
        },
        error => {
          
          if (error.status === 404) {
            this.templateEmpty = true
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
  
      this.templates?.sort(function (a, b) {
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

    templateEnabled(){
      let result = Boolean(this.ff.GetFlags('Templates'))
      this.templatesEnabled = result;
      //console.log("template enabled: "+this.templateEnable)
      //console.log("template enabled: "+result)
      if (this.templatesEnabled === true) {
        //console.log("template"+this.templates)
        if (this.templates === undefined && !this.templateEmpty) {
          this.retrieveTemplates();
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

    retrieveTemplates(): void {
      this.templateService.getAll()
        .subscribe(
          data => {
            this.templates = data;
            console.log("checking templates");
            //console.log(data);
            //console.log(this.templates);
            
            if (data === undefined) {
              this.templateEmpty = true;
              console.log("templates empty")
            }else{
              this.templateEmpty = false;
            }
            //console.log(data);
          },
          error => {
            console.log(error);
          
            this.templateEmpty = true;
          
          });
    }

    refreshList(): void {
      this.retrieveTemplates();
      this.currentTemplate = undefined;
      this.currentIndex = -1;
    }

    setActiveTemplate(template: Template, index: number): void {
      this.currentTemplate = template;
      this.currentIndex = index;
      this.msgFromTemplate.push(template.name!);
    }

    searchName(): void {
      this.currentTemplate = undefined;
      this.currentIndex = -1;
  
      this.templateService.findByName(this.templateName)
        .subscribe(
          data => {
            this.templates = data;
            if (data === undefined) {
              this.templateEmpty = false;
            }
            else{
              this.templateEmpty = true;
            }
          },
          error => {
            console.log(error);
            this.templateEmpty = true;
          });
    }

    ngOnInit(): void {
      if (!this.ff.flagExists('Templates')) {
          this.ff.SetFlags('Templates',true);
      }
        this.retrieveTemplates();
        console.log(this.templates)
    }
  }