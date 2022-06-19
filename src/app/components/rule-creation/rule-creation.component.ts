import { Component, Input, OnInit, ViewChild, SimpleChanges, AfterViewInit, Directive } from '@angular/core';
import { Template } from 'src/app/models/template.model';
import { TemplateService } from 'src/app/services/template.service';
import { FFService } from 'src/app/services/ff.service';
import { AppService } from 'src/app/app.service';
import {FormBuilder, Validators, FormControl, FormArray, ValidatorFn, FormGroup } from '@angular/forms';
import { TemplateSelectionComponent } from 'src/app/components/template-selection/template-selection.component';
import { RepositoriesComponent } from 'src/app/components/repositories/repositories.component';
import { Repository } from 'src/app/models/repository.model';
import { RulesService } from '../../services/rules.service';
import { Rule } from 'src/app/models/rule.model';



export interface inputVariable {
  name: string; 
  type: string; 
  value: string;
  harnessType?: string;
}
export interface inputTemplates {
  id: string; 
  inputVariables: inputVariable[];
  yaml?: string
}
export interface TemplateRule {
  id: string; 
  yaml?: string
}

export interface onboardResult {
  url: string; 
}

@Component({
    selector: 'app-rule-creation',
    templateUrl: './rule-creation.component.html',
    styleUrls: ['./rule-creation.component.css', "../../shared/loading-div.shared.css"]
  })
  export class RuleCreationComponent implements OnInit, AfterViewInit {

    
    @ViewChild(TemplateSelectionComponent, {static: false}) directivetemplate?: TemplateSelectionComponent;

    @ViewChild(RepositoriesComponent, {static: false}) directiverepository?: RepositoriesComponent;

    ngAfterViewInit() {
      //console.log("Diego")
      //console.log(this.directivetemplate?.currentTemplate); // 
      //this.msgFromTemplate = this.directivetemplate?.msgFromTemplate!;
      //this.currentTemplate = this.directivetemplate?.currentTemplate!; // 
      this.selectedTemplates = this.directivetemplate?.selectedTemplates!; // 
      console.log(this.selectedTemplates.entries.length)
    }

    

    // harness rule-creation
    harnessLink = "https://app.harness.io/ng/#/account/Io9SR1H7TtGBq9LVyJVB2w/ci/orgs/default/projects/"
    harnessOnboarded = "";



    errorMessage = '';
    activeStep = 1;


    variablesFormGroup: FormGroup[] = [];
    
    //dynamic forms

    weightNumbers = Array.from(Array(101).keys());

    templateVariablesFormGroup: FormGroup;
    /* templateVariablesFormGroupSubs:Subscription; 
    templateVariablesFormArray: FormArray; */

    // dynamic forms 

    RuleFormGroup: FormGroup;
    OnboardingGroup: FormGroup;
    RuleFormGroup2: FormGroup;
    onboardLink = { "url": "/rule-creation" } as onboardResult;
    currentPipeline: string = '';
    
    currentTemplateSelected = false;
    currentRepositorySelected = false;
    currentRepository?: Repository;

    templates?: Template[];
    currentTemplate?: Template;
    currentIndex = -1;
    templateName = ''
    //load page
    activeTemplateStep: number = 0;


    selectedTemplates: Template[] = [];
    templatesEnabled: boolean = true;
    templateEmpty = false;
    loading = false;
    //sort & search
    isDesc: boolean = false;
    column: string = 'name';


    //Dynamic variables
    templateVariables: inputVariable[] = new Array<inputVariable>();
    inputTemplates: inputTemplates[] = new Array<inputTemplates>();
    public variablesForm: FormGroup;
    unsubcribe: any

    //end Dynamic variables

    handleNumberChange(val:any){ console.log(val)}

    constructor(private app: AppService,private templateService: TemplateService, private ff: FFService,private formBuilder: FormBuilder, private rulesService: RulesService) { 
      console.log("App Starting")
      
      // dynamic forms 
      this.templateVariablesFormGroup = this.formBuilder.group({
        inputArray: this.formBuilder.array([])
      });
      // dynamic forms 

      /* this.templateVariablesFormGroupSubs = this.templateVariablesFormGroup.valueChanges.subscribe(val=>{
        this.handleNumberChange(val);
      }) */

      this.currentRepositorySelected = false;
      this.currentTemplateSelected = false;
      //Dynamic variables

      
      
      this.variablesForm = new FormGroup({
        fields: new FormControl(JSON.stringify(this.templateVariables.map(variable => variable.name)))
      })
      this.unsubcribe = this.variablesForm.valueChanges.subscribe((update) => {
        console.log(update);
        this.templateVariables = JSON.parse(update.fields);
      });

      // end dynamic variables

      this.OnboardingGroup = this.formBuilder.group({
        r1: ['',[Validators.required]]
      })
      
      this.RuleFormGroup = this.formBuilder.group({
          // *********************************************
          // O valor padrão deste formControl será vazio
          // e os demais vazio
          // *********************************************
          name: ['', [Validators.required]],
          description: ['', ],
          repoField: ['', [Validators.required]],
          clause: ['', [Validators.required]],
          value: ['', [Validators.required]],
          weight: ['', [Validators.required]],
          organization: ['', [Validators.required]],
          project: ['', [Validators.required]],
          

          

      });

      

      this.RuleFormGroup2 = this.formBuilder.group({
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


    setClause(){

    }

    cleanSpecialCharacteres(value: string): string {  
      const specialRegexp: RegExp = /[ !@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/gi;
      value = value.replace(specialRegexp,"_")
      return value;
    }

    getTemplateInputs(id: string): inputVariable[]{
      if (this.directivetemplate?.inputTemplates != undefined) {
        this.inputTemplates = this.directivetemplate?.inputTemplates as inputTemplates[]
      }
      let templateInputs = this.inputTemplates.find(element => element.id === id) as inputTemplates
      return templateInputs.inputVariables
    }

    toFormGroup(inputVariables: inputVariable[] ) {
      const group: any = {};
  
      inputVariables.forEach(inputVariable => {
        group[inputVariable.name] = new FormControl(inputVariable.value || '', Validators.required);
        
      });
      return new FormGroup(group);
    }

    inputVariablesToYaml(inputVariables: inputVariable[],identifier: string ):TemplateRule {
      let template = this.templates?.find(template => template.identifier === identifier) as Template
      let templatesRule = {} as TemplateRule
      let inputYaml = template?.yamlInput
      inputVariables.forEach(inputVariable => {
        let regexpPattern = "/("+inputVariable.name+"): (\<\+input\>)/";
        let regexpMaster = new RegExp(regexpPattern,'g');
        let letRegexVariables = "(name: )("+inputVariable.name+")(\\n[\\s]+type: )([a-zA-Z]+)(\\n[\\s]+value: )(\<\\+input\>)"
        let variablesInputDetail = new RegExp(letRegexVariables,'i');

        console.log("converting input "+inputVariable.name+" to value "+inputVariable.value)
        
        if (inputVariable.harnessType === "variables") {
          //console.log("regext to convert input "+variablesInputDetail)
          inputYaml = inputYaml?.replace(variablesInputDetail,"$1$2$3$4$5"+inputVariable.value)
        } else if(inputVariable.harnessType === "pipeline"){
          //console.log("regext to convert input "+regexpPattern)
          inputYaml = inputYaml?.replace(regexpMaster,"$1: "+inputVariable.value)
        }
        
        //console.log("yaml converted: \n"+inputYaml)
        
      })
      templatesRule = { id: identifier, yaml: inputYaml, versionLabel: template?.versionLabel } as TemplateRule
      return templatesRule;
    }

    findInputVariables(yaml: string, identifier: string) {
      let templateVariables: inputVariable[] = new Array<inputVariable>();
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
          const selfThis = this; // 👈️ closure of this
          result.forEach(function (value) {
            let resultChild = value.match(regexpChild)!;
            console.log("child parsed:\n"+resultChild)
            let inputName = resultChild[1]
            let inputValue = resultChild[2]
            //alert("Name: "+inputName + " value: "+inputValue); // <+input> 1
            console.log(value);
            //let input = '<input formControlName="'+inputName+'"  class="form-control" type="text" name="'+inputName+'" id="variable_'+inputName+'" placeholder="'+inputName+'" >'
            let inputVariable: inputVariable = {name: inputName, value: inputValue, type: "String", harnessType: "pipeline" } as inputVariable
            templateVariables.push(inputVariable)
          });
          let inputTemplate: inputTemplates = {id: identifier, inputVariables: templateVariables } as inputTemplates
          this.inputTemplates.push(inputTemplate);

          let inputVariablesFormGroup = new FormGroup({
            fields: new FormControl(JSON.stringify(templateVariables.map(variable => variable.name)))
          })
          
          this.variablesFormGroup.push(inputVariablesFormGroup)
        }

        let result2 = yaml.match(variables)!;
        console.log("yaml parsed:\n"+result2)
        if (result2 != null && result2 !== undefined) {
          const selfThis = this; // 👈️ closure of this
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
                    //alert("Name: "+inputName + " type: "+ inputType + " value: "+inputValue); // <+input> 1
                    //let input = '<input formControlName="'+inputName+'"  class="form-control" type="text" name="'+inputName+'" id="variable_'+inputName+'" placeholder="'+inputName+'" >'
                    let inputVariable: inputVariable = {name: inputName, value: inputValue, type: inputType, harnessType: "variables"} as inputVariable
                    templateVariables.push(inputVariable)
                    //this.templateVariables = []//.push(input)
                  /* resultChild?.forEach(function (value3) {
                  console.log("child child variable parsed:\n"+value3[0])
                    
                  
                  }); */
                }
                
              });
            }
          });
            
            
          }

        /* this.templateVariablesFormGroup =  */
        let inputTemplate: inputTemplates = {id: identifier, inputVariables: templateVariables } as inputTemplates
        this.inputTemplates.push(inputTemplate);
        return templateVariables;
      }
      else{
        console.log("Yaml undefined")
        return new Array<inputVariable>();
      }
      console.log(this.templateVariables)
      
    }

    setStep(step: number){

      this.activeStep = step;
    }

    checkSelectedOption(): boolean {
      
      if (this.activeStep === 1) {
        if (this.currentRepository?.name != undefined) {
          this.currentRepositorySelected = true;
          
          return true
        }
        else{
          return false;
        }
      }
      else if (this.activeStep === 3) {
        if (this.currentTemplate?.name != undefined) {
          this.currentTemplateSelected = true;
          return true;
        }
        else{
          return false;
        }
      }
      return false;
    }

    nextTemplate(step: number){
      console.log("next template = "+step)
      this.activeTemplateStep = step;
    }

    next(step: number){
      /* if (!this.RuleFormGroup.valid && step >= 3 ) {
          console.log("Formulário inválido");
          return;
      }
      if (!this.RuleFormGroup2.valid && step >= 4) {
          console.log("Formulário inválido");
          return;
      } */
      console.log("Formulário válido", this.RuleFormGroup.value);
      
      
      //console.log(this.directivetemplate); // 
      //console.log(this.directiverepository); // 
      
      /* if ( step === 2) {
        this.currentRepository = this.directiverepository?.currentRepository!; //  
      } */

      if ( step === 2){
        let form:any = {}
        //this.currentTemplate = this.directivetemplate?.currentTemplate!; // 
        console.log("Diego test")
        
        for (let index = 0; index < this.selectedTemplates.length; index++) {
          
          let id = this.selectedTemplates[index]!

          console.log(id);
          let template = this.templates?.find(element => element.identifier === id.identifier) as Template
          
          let variables: inputVariable[] =  this.findInputVariables(template?.yamlInput!,id?.identifier!) || new Array<inputVariable>();

          for (let index = 0; index < variables.length; index++) {
            const element = variables[index];
            form[id.identifier+'*'+element.name] = new FormControl('');
          }
          
          
        }
        this.templateVariablesFormGroup = new FormGroup(form);
        console.log("FormGroup")
        console.log(this.templateVariablesFormGroup )
        /* this.variablesForm = this.toFormGroup(this.templateVariables)
        console.log(JSON.stringify(this.templateVariables.map(variable => variable.name)))
        console.log(this.templateVariables.map(variable => variable.name)) */
      }
      if (step === 3) {
        let rule: Rule = new Rule(this.cleanSpecialCharacteres(this.RuleFormGroup.get('name')?.value.toLowerCase()), this.RuleFormGroup.get('name')?.value, this.RuleFormGroup.get('description')?.value,true,"TemplateSelection",[],this.RuleFormGroup.get('repoField')?.value,this.RuleFormGroup.get('clause')?.value,this.RuleFormGroup.get('value')?.value,this.RuleFormGroup.get('project')?.value,this.RuleFormGroup.get('organization')?.value,this.RuleFormGroup.get('weight')?.value)
        this.selectedTemplates.forEach(template =>{
          let templateMaster = this.templates?.find(templateMaster => templateMaster.identifier === template?.identifier) as Template
          let variables: inputVariable[] =  this.findInputVariables(templateMaster?.yamlInput!,template?.identifier!) || new Array<inputVariable>();
          
          
          /* for (const obj of variables) {
            if (obj.name === "serviceName") {
              console.log(obj.name)
              obj.value = "KoalaService"
            }
            if (obj.name === "repoName") {
              console.log(obj.name)
              obj.value = "KoalaRepo"
            }
          } */


          console.log(variables)
          let resultConvertion = this.inputVariablesToYaml(variables,template?.identifier!)
          console.log(resultConvertion);
          rule.templatesRule?.push(resultConvertion)
        })

        console.log(rule)
        this.rulesService.create(rule).subscribe(
          data => {
              if (data === undefined) {
                this.errorMessage = "Failed to Create Rule"
              }else{
                console.log(data);
              }
              //console.log(JSON.stringify(result));

              
          },
          error => {
              this.errorMessage = error.error.message
              console.log("Error Creating Rule: "+this.errorMessage);
              
          }
        );
        
      }
      
      
      

      this.activeStep = step;
    }

    goToHarness(element: string){
      window.open(element, "_blank");
    }

    stepEnabled(value: number){
      if (this.activeStep === value) {
        if (this.directiverepository != undefined) {
          if (this.currentRepository != this.directiverepository.currentRepository) {
            console.log(this.directiverepository.currentRepository?.name); // 
            this.currentRepository = this.directiverepository.currentRepository;
          }
          
        }
        if (this.directivetemplate != undefined) {
          if (this.selectedTemplates != this.directivetemplate.selectedTemplates) {
            console.log(this.directivetemplate.selectedTemplates); // 
            this.selectedTemplates = this.directivetemplate.selectedTemplates;
          }
          
        }
        return true;
      } else {
        return false;
      }
    }

    stepTemplateEnabled(value: number){
      //console.log("stepTemplateEnabled "+value +" = "+ this.activeTemplateStep);
      if (this.activeTemplateStep === value) {
        
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

    stepTemplateActived(value: number){
      if (this.activeTemplateStep === value) {
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
              if (this.directivetemplate != undefined) {
                if (this.templates != this.directivetemplate.templates) {
                  console.log(this.directivetemplate.templates); // 
                  this.directivetemplate.templates = this.templates;
                }
                
              }
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
        
    }

    onboarding(){

    }
  }