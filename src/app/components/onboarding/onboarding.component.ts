import { Component, Input, OnInit, ViewChild, SimpleChanges, AfterViewInit, Directive } from '@angular/core';
import { Template } from 'src/app/models/template.model';
import { TemplateService } from 'src/app/services/template.service';
import { FFService } from 'src/app/services/ff.service';
import { AppService } from 'src/app/app.service';
import {FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { TemplateListComponent } from 'src/app/components/templates/template-list.component';
import { RepositoriesComponent } from 'src/app/components/repositories/repositories.component';
import { Repository } from 'src/app/models/repository.model';


@Component({
    selector: 'app-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.css']
  })
  export class OnboardingComponent implements OnInit, AfterViewInit {

    
    @ViewChild(TemplateListComponent, {static: false}) directivetemplate?: TemplateListComponent;

    @ViewChild(RepositoriesComponent, {static: false}) directiverepository?: RepositoriesComponent;

    ngAfterViewInit() {
      //console.log("Diego")
      //console.log(this.directivetemplate?.currentTemplate); // 
      //this.msgFromTemplate = this.directivetemplate?.msgFromTemplate!;
      //this.currentTemplate = this.directivetemplate?.currentTemplate!; // 
      //this.currentRepository = this.directiverepository?.currentRepository!; // 
      this.logValues('AfterViewInit');
    }

    logValues(eventType: string){
      console.log(`[${eventType}]\n staticName: ${this.directivetemplate}, name value: "${this.directivetemplate?.currentTemplate?.name}"\n nonStaticName: ${this.directiverepository}, name value: "${this.directiverepository?.currentRepository?.name}"\n`);
    }

    // Test messages
    name = 'Child 1';
    @Input() msgFromParent1: string = '';

    currentMsgToParent = '';
    msgFromChild1 = ''

    msgFromTemplate: string[] = [];
    msgCurrentTemplate = '';
    currentTemplateMsgToParent = '';

    // Test messages

    errorMessage = '';
    activeStep = 1;
    OnboardingFormGroup: FormGroup;
    OnboardingGroup: FormGroup;
    OnboardingFormGroup2: FormGroup;

    currentRepository?: Repository;
    templates?: Template[];
    currentTemplate?: Template;
    currentIndex = -1;
    templateName = ''
    //load page
    templatesEnabled: boolean = true;
    templateEmpty = false;
    loading = false;
    //sort & search
    isDesc: boolean = false;
    column: string = 'name';

    constructor(private app: AppService,private templateService: TemplateService, private ff: FFService,private formBuilder: FormBuilder) { 
      console.log("App Starting")

      this.OnboardingGroup = this.formBuilder.group({
        r1: ['',[Validators.required]]
      })
      
      this.OnboardingFormGroup = this.formBuilder.group({
          // *********************************************
          // O valor padrão deste formControl será vazio
          // e os demais vazio
          // *********************************************
          name: ['', [Validators.required]],
          username: ['', [Validators.required]],
          email: ['', [
              Validators.required,
              Validators.email
          ]]

      });

      this.OnboardingFormGroup2 = this.formBuilder.group({
          // *********************************************
          // O valor padrão deste formControl será vazio
          // e os demais vazio
          // *********************************************
          password: [null, [Validators.required, Validators.minLength(8)]],
          password2: [null, [Validators.required, Validators.minLength(8) ]],
      });
      /* if (!this.ff.flagExists('Harness_Templates')) {
        ff.SetFlags('Harness_Templates',true);
      }  */

      
    }

    findInputVariables(yaml: string){
      
      if (yaml != undefined) {
        let variables = /(variables:.*\n([\s]+- name: ([a-zA-Z_]+)\n[\s]+type: ([a-zA-Z]+)\n[\s]+value: (<\+input>))+)/g
        let variablesInput = /(\n((.*?)- name: ([a-zA-Z_]+)\n[\s]+type: ([a-zA-Z]+)\n[\s]+value: (<\+input>)))/g
        let variablesInputDetail = /(\n)?(.*?)- name: ([a-zA-Z_]+)\n[\s]+type: ([a-zA-Z]+)\n[\s]+value: (<\+input>)/i
        let yamlWithoutVariables = yaml.replace(variables, "");
        let regexpMaster = /([A-Za-z]+: \<\+input\>)/g;
        let regexpChild = /([A-Za-z]+): (\<\+input\>)/;
        console.log("yaml to parse:\n"+yamlWithoutVariables)
          let result = yamlWithoutVariables.match(regexpMaster)!;
          console.log("yaml parsed:\n"+result)
          if (result != null && result !== undefined) {
            result.forEach(function (value) {
              let resultChild = value.match(regexpChild)!;
              console.log("child parsed:\n"+resultChild)
              let inputName = resultChild[1]
              let inputValue = resultChild[2]
              alert("Name: "+inputName + " value: "+inputValue); // <+input> 1
              console.log(value);
            });
          }
          let result2 = yaml.match(variables)!;
          console.log("yaml parsed:\n"+result2)
          if (result2 != null && result2 !== undefined) {
            result2.forEach(function (value) {
              let result3 = value.match(variablesInput)!;
              
              if (result3 != null && result3 !== undefined) {
                result3?.forEach(function (value2) {
                  console.log("ForEach Child "+value2);
                  let resultChild = value2.match(variablesInputDetail)!;
                  if (resultChild != null && resultChild !== undefined) {
                    console.log("child variable parsed:\n"+resultChild[0])
                    let inputName = resultChild[3]
                      let inputType = resultChild[4]
                      let inputValue = resultChild[5]
                      alert("Name: "+inputName + " type: "+ inputType + " value: "+inputValue); // <+input> 1
                      let input = '<input formControlName="'+inputName+'"  class="form-control" type="text" name="'+inputName+'" id="variable_'+inputName+'" placeholder="'+inputName+'" >'
                    /* resultChild?.forEach(function (value3) {
                    console.log("child child variable parsed:\n"+value3[0])
                      
                    
                    }); */
                  }
                  
                });
              }
            });
            
            
          }
      }
      else{
        console.log("Yaml undefined")
      }
      
      
    }

    setStep(step: number){

      this.activeStep = step;
    }

    next(step: number){
      /* if (!this.OnboardingFormGroup.valid && step >= 3 ) {
          console.log("Formulário inválido");
          return;
      }
      if (!this.OnboardingFormGroup2.valid && step >= 4) {
          console.log("Formulário inválido");
          return;
      } */
      console.log("Formulário válido", this.OnboardingFormGroup.value);
      
      
      //console.log(this.directivetemplate); // 
      //console.log(this.directiverepository); // 
      
      /* if ( step === 2) {
        this.currentRepository = this.directiverepository?.currentRepository!; //  
      } */
      if ( step === 4){
        //this.currentTemplate = this.directivetemplate?.currentTemplate!; // 
        console.log("Diego test")
        this.findInputVariables(this.currentTemplate?.yaml!)
      }
      
      

      this.activeStep = step;
    }
    stepEnabled(value: number){


      if (this.msgFromParent1 === "Repositories"){
        this.setStep(3);
      }
      if (this.activeStep === value) {
        if (this.directiverepository != undefined) {
          if (this.currentRepository != this.directiverepository.currentRepository) {
            console.log(this.directiverepository.currentRepository?.name); // 
            this.currentRepository = this.directiverepository.currentRepository;
          }
          
        }
        if (this.directivetemplate != undefined) {
          if (this.currentTemplate != this.directivetemplate.currentTemplate) {
            console.log(this.directivetemplate.currentTemplate?.name); // 
            this.currentTemplate = this.directivetemplate.currentTemplate;
          }
          
        }
        return true;
      } else {
        return false;
      }
    }
    stepActived(value: number){
        if (this.activeStep === value) {
            return "is-active";
        } else {
            return "";
        }
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
        this.logValues('AfterViewInit');
    }

    onboarding(){

    }
  }