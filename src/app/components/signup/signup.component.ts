import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FFService } from 'src/app/services/ff.service';
import { LoginService } from 'src/app/services/login.service';
import {FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { CustomValidator } from '../../shared/validation.shared';
//import * as $ from "jquery";

declare var jquery: any;
declare var $: any;

export function createPasswordStrengthValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        if (!control || !control.parent) {
            return null;
        }
        const value = control.value;
        //console.log(value);


        const hasUpperCase = /[A-Z]+/.test(value);

        const hasLowerCase = /[a-z]+/.test(value);

        const hasNumeric = /[0-9]+/.test(value);

        const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
        
        return !passwordValid ? {passwordStrength:true}: null;

    }
}

export function checkPasswordConfirmation(confirmPassword: string): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        if (!control || !control.parent) {
            return null;
        }
        const value = control.value;
        const confirmValue = control?.parent?.get(confirmPassword)?.value;
        //console.log(value," = ",confirmValue);

        return confirmValue === value? null : { mismatch: true };
    }
}
export function checkSpecialCharacteres(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        if (!control || !control.parent) {
            return null;
        }
        const value = control.value;
        const nameRegexp: RegExp = /[ !@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?]/;
        if (control.value && nameRegexp.test(value)) {
            return { invalidName: true };
        }
        return null;

    }
}

export function nameValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        if (!control || !control.parent) {
            return null;
        }
        const value = control.value;
        const nameRegexp: RegExp = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        if (control.value && nameRegexp.test(value)) {
            return { invalidName: true };
        }
        return null;

    }
}
export function emailValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        if (!control || !control.parent) {
            return null;
        }
        const value = control.value;
        const nameRegexp: RegExp = /^\w+([\.-]?\w+)*@\w\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (control.value && !nameRegexp.test(value)) {
            return { invalidEmail: true };
        }
        return null;

    }
}

export interface UserSignup {
    name: string; 
    username: string; 
    password: string;
    email: string; 
}
export interface ServerMessage {
    success: boolean; 
    message: string; 
}

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
})
export class SinupComponent {

    user = {name: '', username: '', email: '',password: ''} as UserSignup;

    errorMessage = '';
    successMessage = '';

    activeStep = 1;

    signupFormGroup: FormGroup;
    signupFormGroup2: FormGroup;

    get email() {
        return this.signupFormGroup.controls['email'];
    }
    
    get password() {
        return this.signupFormGroup.controls['password'];
    }

    
    constructor(private app: AppService, private http: HttpClient, private ff: FFService,private formBuilder: FormBuilder, private login: LoginService) {
        
        //ff.SetFlags('Sinup_Version',"v2");
        this.signupFormGroup = this.formBuilder.group({
            // *********************************************
            // O valor padrão deste formControl será vazio
            // e os demais vazio
            // *********************************************
            name: ['', [Validators.required, nameValidator()]],
            username: ['', [Validators.required, checkSpecialCharacteres()]],
            email: ['', [
                Validators.required,
                Validators.email,
                emailValidator()
            ]]
        });

        this.signupFormGroup2 = this.formBuilder.group({
            // *********************************************
            // O valor padrão deste formControl será vazio
            // e os demais vazio
            // *********************************************
            password: [null, [Validators.required, Validators.minLength(8), createPasswordStrengthValidator()]],
            password2: [null, [Validators.required, Validators.minLength(8), checkPasswordConfirmation('password') ]],
        });

        
    }

    

    signup() {
        if (this.signupFormGroup2.get('password')?.value === this.signupFormGroup2.get('password2')?.value) {
            this.user.name = this.signupFormGroup.get('name')?.value;
            this.user.username = this.signupFormGroup.get('username')?.value.toLowerCase();
            this.user.email = this.signupFormGroup.get('email')?.value;
            this.user.password = this.signupFormGroup2.get('password')?.value
            this.login.signup(this.user).subscribe(
                data => {
                    let result = {success: false, message: 'failed to register'} as ServerMessage;
                    result = data;
                    //console.log(JSON.stringify(result));

                    if (result.success) {
                        this.errorMessage = '';
                        this.successMessage = 'Here is your Harness Feature Flags Demo username:';
                        this.next(4)
                    } else {
                        this.errorMessage = result.message;
                        this.successMessage = ''
                        this.next(4)
                    }
                    
                },
                error => {
                    this.errorMessage = error.error.message
                    //console.log("Error: "+this.errorMessage);
                    this.next(4)
                });
        } else {
            console.log("Passwords are not the same!")
            this.signupFormGroup2.controls['password2'].updateValueAndValidity();
        }
        
    }

    next(step: number){
        if (!this.signupFormGroup.valid) {
            console.log("Formulário inválido");
            return;
        }
        if (!this.signupFormGroup2.valid && step >= 4) {
            console.log("Formulário inválido");
            return;
        }
        console.log("Formulário válido", this.signupFormGroup.value);
        
        this.activeStep = step;
    }

    stepEnabled(value: number){
        if (this.activeStep === value) {
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



    authenticated() { return this.app.authenticated; }

}