import { EditSurveyComponent } from './edit-survey/edit-survey.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewSurveyComponent } from './new-survey/new-survey.component';
import { ResponsesHomeComponent } from './responses-home/responses-home.component';
import { SurveyHomeComponent } from './survey-home/survey-home.component';
import { SurveyResponseComponent } from './survey-response/survey-response.component';
import { NewSurveyTemplateComponent } from "./new-survey-template/new-survey-template.component";
import { ViewSurveyResponseComponent } from './responses-home/view-survey-response/view-survey-response.component';

const routes: Routes = [
  { path: "", component: SurveyHomeComponent },
  { path: "newSurvey", component: NewSurveyComponent },
  { path: "editSurvey", component: EditSurveyComponent },
  { path: "view-results", component: ResponsesHomeComponent },
  { path: "view-survey", component: ViewSurveyComponent },
  { path: "view-survey-response", component: ViewSurveyResponseComponent },
  { path: "newSurveyTemplate", component: NewSurveyTemplateComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
