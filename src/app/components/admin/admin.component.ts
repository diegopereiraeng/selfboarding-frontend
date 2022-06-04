import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { FFService } from 'src/app/services/ff.service';
import {FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { UserBackend } from '../../models/userBackend.model';
import { UserBackendProfile } from '../../models/userBackendProfile.model';
import { UserBackendRole } from '../../models/userBackendRole.model';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';


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
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {

    credentials = {harness_username: '', harness_password: '', account: ''};

    userLoaded = false;
    harnessConfigured = false;

    signupFormGroup: FormGroup;
    HarnessFormGroup: FormGroup;

    account = '';

    //user = {name: '', username: '', email: '',password: ''} as UserSignup;
    user: UserBackend = {id: "0", username: "guest", email: "guest@guest.io", createdAt: '', updatedAt: '', active: true, userProfile: {} as UserBackendProfile ,roles: [] as UserBackendRole[] } as UserBackend;

    errorMessage = '';
    successMessage = '';

    //activeStep = 1;

    constructor(private app: AppService, private ff: FFService,private formBuilder: FormBuilder, private login: LoginService, private userService: UserService ) {
        //http.get('http://localhost:8080/api/').subscribe(data => this.greeting = data);
        if (!this.ff.flagExists('Admin_Version')) {
            ff.SetFlags('Admin_Version',"v1");
        }

        // Form Groups 
        this.signupFormGroup = this.formBuilder.group({
            // *********************************************
            // O valor padrão deste formControl será vazio
            // e os demais vazio
            // *********************************************
            name: ['', [Validators.required]],
            username: ['', [Validators.required]],
        });

        this.HarnessFormGroup = this.formBuilder.group({
            // *********************************************
            // O valor padrão deste formControl será vazio
            // e os demais vazio
            // *********************************************
            harness_username: [null, [Validators.required]],
            harness_password: [null, [Validators.required ]],
            account: [null, [Validators.required ]],
        });

        this.userService.get().subscribe(data => {
            this.user = data;
            this.userLoaded = true;
            if (this.user.userProfile?.harnessCredentials === undefined || this.user.userProfile?.harnessCredentials === null ) {
                this.harnessConfigured = false;
            } else {
                this.harnessConfigured = true;
            }
        },
        error => {
            this.errorMessage = error.error.message
            //console.log("Error: "+this.errorMessage);
            
        }
        );
    }

    save(){
        console.log("saved")
    }

    editHarness(){ 
        this.harnessConfigured = false;
    }

    adminEnabled() {
        return String(this.ff.GetFlags('Admin_Version'));
    }

    authenticated() { return this.app.authenticated; }

    harnessConfig() {

        if (this.userLoaded) {

            let resultusername: string = this.HarnessFormGroup.get('harness_username')?.value
            let resultpassword: string = this.HarnessFormGroup.get('harness_password')?.value
            let resultaccount: string = this.HarnessFormGroup.get('account')?.value
            if (this.user.userProfile != undefined) {
                this.user.userProfile.harnessAccount = resultaccount;
                this.user.userProfile.harnessCredentials = 'Basic ' + btoa(resultusername+':'+resultpassword) ;
                this.userService.update(this.user).subscribe(data => {
                    this.user = data;
                    this.userLoaded = true;
                    this.errorMessage = ""
                    this.successMessage = 'User Updated'
                    this.harnessConfigured = true;
                },
                error => {
                    this.errorMessage = error.error.message
                    //console.log("Error: "+this.errorMessage);
                    this.harnessConfigured = false;
                }
                );

            }
            else{
                this.errorMessage = "User Profile Empty"
                this.successMessage = ''
            }
        } else {
            this.errorMessage = "User not loaded"
            this.successMessage = ''
        }
}

}