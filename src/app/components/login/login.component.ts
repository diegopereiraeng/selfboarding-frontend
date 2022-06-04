import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { FFService } from 'src/app/services/ff.service';
import { Token } from 'src/app/models/token.model';



@Component({
  templateUrl: './login.component.html',
  styles: ["@import \"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css\";"],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  credentials = {username: '', password: ''};

  error = false;
  token: Token = new Token;
  


  constructor(private app: AppService, private http: HttpClient, private router: Router,private loginService: LoginService, private ff: FFService) {
    
    if (!this.ff.flagExists('Login_Version')) {
      ff.SetFlags('Login_Version',"v2");
    }
    if (!this.ff.flagExists('Social_Login')) {
      ff.SetFlags('Social_Login',"off");
    }
    
    
  }

  loginEnabled(){
    //console.log("login enabled: "+this.ff.GetFlags('Login_Version'))
    return String(this.ff.GetFlags('Login_Version'));
  }

  socialEnabled(){
    //console.log("social enabled: "+this.ff.GetFlags('Social_Login'))
    return String(this.ff.GetFlags('Social_Login'));
  }

  login() {

    const data = this.loginService.login(this.credentials)
      .subscribe(
        data => {
          this.token = data;
          this.app.setToken(this.token);
          this.app.saveData("SessionID",this.token.accessToken)
          this.app.authenticate(this.credentials, () => {
            this.router.navigateByUrl('/');
            this.ff.renitializeSDK();
          } );
        },
        error => {
          console.log(error);

        });

    return false;
  }

}