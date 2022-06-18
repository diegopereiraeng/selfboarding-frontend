import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
//import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import { RepositoriesListComponent } from './components/repository-list/repository-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AppService } from './app.service';
import { SinupComponent } from './components/signup/signup.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminComponent } from './components/admin/admin.component';
import { TemplateListComponent } from './components/templates/template-list.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { RepositoriesComponent } from './components/repositories/repositories.component';
import { RuleCreationComponent } from './components/rule-creation/rule-creation.component';
import { RulesComponent } from './components/rules/rules.component';
import { TemplateSelectionComponent } from './components/template-selection/template-selection.component';
import { NgxPaginationModule } from 'ngx-pagination'; // <-- import the module
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
  declarations: [
    AppComponent,
    AddTutorialComponent,
    TutorialDetailsComponent,
    TutorialsListComponent,
    RepositoriesListComponent,
    HomeComponent,
    LoginComponent,
    SinupComponent,
    PromotionsComponent,
    AdminComponent,
    TemplateListComponent,
    OnboardingComponent,
    RepositoriesComponent,
    RuleCreationComponent,
    RulesComponent,
    TemplateSelectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgxPaginationModule,
    //NgSelectModule
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [AppService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
