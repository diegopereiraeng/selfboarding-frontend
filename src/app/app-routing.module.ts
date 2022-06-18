import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorialsListComponent } from './components/tutorials-list/tutorials-list.component';
import { TutorialDetailsComponent } from './components/tutorial-details/tutorial-details.component';
import { AddTutorialComponent } from './components/add-tutorial/add-tutorial.component';
import { RepositoriesListComponent } from './components/repository-list/repository-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SinupComponent } from './components/signup/signup.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { AdminComponent } from './components/admin/admin.component';
import { TemplateListComponent } from './components/templates/template-list.component';
import { OnboardingComponent } from './components/onboarding/onboarding.component';
import { RepositoriesComponent } from './components/repositories/repositories.component';
import { RuleCreationComponent } from './components/rule-creation/rule-creation.component';
import { RulesComponent } from './components/rules/rules.component';
import { TemplateSelectionComponent } from './components/template-selection/template-selection.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'tutorials', component: TutorialsListComponent },
  { path: 'tutorials/:id', component: TutorialDetailsComponent },
  { path: 'add', component: AddTutorialComponent },
  { path: 'repositories', component: RepositoriesListComponent },
  { path: 'home', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SinupComponent},
  { path: 'promotions', component: PromotionsComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'template-list', component: TemplateListComponent},
  { path: 'onboarding', component: OnboardingComponent},
  { path: 'repository-list', component: RepositoriesComponent},
  { path: 'rule-creation', component: RuleCreationComponent},
  { path: 'rules', component: RulesComponent},
  { path: 'template-selection', component: TemplateSelectionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
