import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { LibBwUiCompCoreModule } from "lib-bw-ui-comp-core/src/public-api";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EvaPublishComponent } from './evaluations-home/eva-publish/eva-publish.component';
import { EvaluationsHomeComponent } from './evaluations-home/evaluations-home.component';
import { EvaUnpublishComponent } from './evaluations-home/eva-unpublish/eva-unpublish.component';
import { EvaTemplatesComponent } from './evaluations-home/eva-templates/eva-templates.component';
import { CreateEvaluationComponent } from './create-evaluation/create-evaluation.component';
import { EditEvalutionComponent } from './edit-evalution/edit-evalution.component';
import { NewQuestionComponent } from './new-question/new-question.component';
import { ViewEvalComponent } from './view-eval/view-eval.component';
import { ResponsesHomeComponent } from './responses-home/responses-home.component';
import { EvaSummaryComponent } from './responses-home/eva-summary/eva-summary.component';
import { EvaResponsesComponent } from './responses-home/eva-responses/eva-responses.component';
import { ViewEvaluationResponseComponent } from './responses-home/view-evaluation-response/view-evaluation-response.component';
import { AddEvalDocumentsComponent } from './add-eval-documents/add-eval-documents.component';
import { QuestionTypesComponent } from './question-types/question-types.component';

@NgModule({
  declarations: [
    AppComponent,
    EvaluationsHomeComponent,
    EvaPublishComponent,
    EvaUnpublishComponent,
    EvaTemplatesComponent,
    CreateEvaluationComponent,
    EditEvalutionComponent,
    NewQuestionComponent,
    ViewEvalComponent,
    ResponsesHomeComponent,
    EvaSummaryComponent,
    EvaResponsesComponent,
    ViewEvaluationResponseComponent,
    AddEvalDocumentsComponent,
    QuestionTypesComponent
    
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    LibBwUiCompCoreModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
