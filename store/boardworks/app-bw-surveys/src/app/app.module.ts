import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibBwUiCompCoreModule } from 'lib-bw-ui-comp-core/src/public-api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewSurveyComponent } from './new-survey/new-survey.component';
import { SurveyResponseComponent } from './survey-response/survey-response.component';
import { SurveyHomeComponent } from './survey-home/survey-home.component';
import { PublishedSurveyListComponent } from './survey-home/published-survey-list/published-survey-list.component';
import { UnpublishedSurveyListComponent } from './survey-home/unpublished-survey-list/unpublished-survey-list.component';
import { TemplatesSurveyListComponent } from './survey-home/templates-survey-list/templates-survey-list.component';
import { ResponsesHomeComponent } from './responses-home/responses-home.component';
import { SurveyResponsesComponent } from './responses-home/survey-responses/survey-responses.component';
import { ViewSurveyResponseComponent } from './responses-home/view-survey-response/view-survey-response.component';
import { SurveySummaryComponent } from './responses-home/survey-summary/survey-summary.component';
import { ViewSurveyComponent } from './view-survey/view-survey.component';
import { EditSurveyComponent } from './edit-survey/edit-survey.component';
import { NewSurveyTemplateComponent } from './new-survey-template/new-survey-template.component';

@NgModule({
  declarations: [
    AppComponent,
    NewSurveyComponent,
    SurveyResponseComponent,
    SurveyHomeComponent,
    PublishedSurveyListComponent,
    UnpublishedSurveyListComponent,
    TemplatesSurveyListComponent,
    ResponsesHomeComponent,
    SurveyResponsesComponent,
    ViewSurveyResponseComponent,
    SurveySummaryComponent,
    ViewSurveyComponent,
    EditSurveyComponent,
    NewSurveyTemplateComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    LibBwUiCompCoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
