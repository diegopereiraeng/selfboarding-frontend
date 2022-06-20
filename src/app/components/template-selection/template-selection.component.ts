import { Component, SimpleChanges, Input, OnInit, VERSION } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Template } from 'src/app/models/template.model';

export interface inputVariable {
    name: string; 
    type: string; 
    value: string;
}
export interface inputTemplates {
    id: string; 
    inputVariables: inputVariable[]; 
}

@Component({
    selector: 'app-template-selection',
    templateUrl: './template-selection.component.html',
    styleUrls: ['./template-selection.component.css','./template-selection.component.scss'],
})
export class TemplateSelectionComponent {
    myForm:FormGroup;
    disabled = false;
    ShowFilter = true;
    limitSelection = false;
    cities: Array<any> = [];
    selectedItems: Array<any> = [];
    
    dropdownSettings: any = {};
    dropdownSettings2: any = {};

    selectedTemplates: Template[] = [];
    templates: Template[] = new Array<Template>();

    inputTemplates: inputTemplates[] = new Array<inputTemplates>();

    


    constructor(private fb: FormBuilder) {

        var ua = navigator.userAgent;

        

        this.myForm = this.fb.group({
            city: [this.selectedItems],
            template: [this.selectedTemplates]
        });
        this.cities = [
            { id: 1, item_text: 'New Delhi' },
            { id: 2, item_text: 'Mumbai' },
            { id: 3, item_text: 'Bangalore' },
            { id: 4, item_text: 'Pune' },
            { id: 5, item_text: 'Chennai' },
            { id: 6, item_text: 'Navsari' }
        ];
        this.selectedItems = [{ id: 4, item_text: 'Pune' }, { id: 6, item_text: 'Navsari' }];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: this.ShowFilter
        };
        this.dropdownSettings2 = {
            singleSelection: false,
            idField: 'identifier',
            textField: 'name',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: this.ShowFilter
        };
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(this.templates);
        
    }

    ngOnInit() {
        console.log(this.templates)
        this.cities = [
            { id: 1, item_text: 'New Delhi' },
            { id: 2, item_text: 'Mumbai' },
            { id: 3, item_text: 'Bangalore' },
            { id: 4, item_text: 'Pune' },
            { id: 5, item_text: 'Chennai' },
            { id: 6, item_text: 'Navsari' }
        ];
        this.selectedItems = [{ id: 4, item_text: 'Pune' }, { id: 6, item_text: 'Navsari' }];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'id',
            textField: 'item_text',
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: this.ShowFilter
        };
        this.myForm = this.fb.group({
            city: [this.selectedItems],
            template: [this.selectedTemplates]
        });
    }

    onItemDeSelect(item: any) {
        //console.log("Diego Delesect")
        console.log('onItemDeSelect', item);
        /* const index = this.selectedTemplates.indexOf(item as Template);
        if (index > -1) {
            this.selectedTemplates.splice(index, 1);
        } */
        console.log('selectedTemplates', this.selectedTemplates);
        
    }

    onItemSelect(item: any) {
        console.log('onItemSelect', item);
        console.log('selectedTemplates before', this.selectedTemplates);
        //this.selectedTemplates.push(item as Template);
        console.log('selectedTemplates after', this.selectedTemplates);
        console.log('selected count', this.selectedTemplates.length);
        let template: Template = item as Template;
        console.log(template?.yaml);
        
        let template2: Template = this.templates.filter(x => x.identifier === template?.identifier!)[0]
        console.log(template2.yaml);
        this.findInputVariables(template2.yaml!,template?.identifier!)
        console.log(this.inputTemplates);

        let inputTemplate = this.inputTemplates.filter(x => x.id === template?.identifier!)[0]
        console.log(inputTemplate)
        let templateID = this.selectedTemplates.findIndex((obj => obj.identifier === template?.identifier!))
        this.selectedTemplates[templateID].inputVariables = inputTemplate.inputVariables as inputVariable[]
        //console.log(this.selectedTemplates[templateID].inputVariables)
    }
    onSelectAll(items: any) {
        console.log('onSelectAll', items);
    }
    toogleShowFilter() {
        this.ShowFilter = !this.ShowFilter;
        this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
    }

    handleLimitSelection() {
        if (this.limitSelection) {
            this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
        } else {
            this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
        }
    }


findInputVariables(yaml: string, identifier: string){
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
            let inputVariable: inputVariable = {name: inputName, value: inputValue, type: "String" } as inputVariable
            templateVariables.push(inputVariable)
        });
        /* let inputTemplate: inputTemplates = {id: identifier, inputVariables: templateVariables } as inputTemplates
        this.inputTemplates.push(inputTemplate); */
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
                    let inputVariable: inputVariable = {name: inputName, value: inputValue, type: inputType } as inputVariable
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
        let inputTemplate: inputTemplates = {id: identifier, inputVariables: templateVariables } as inputTemplates
        this.inputTemplates.push(inputTemplate);
    }
    else{
        console.log("Yaml undefined")
    }
    
    
    }
}
