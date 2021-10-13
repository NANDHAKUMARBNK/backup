import { AddEvalDocumentsComponent } from './add-eval-documents/add-eval-documents.component';
import { ViewEvaluationResponseComponent } from './responses-home/view-evaluation-response/view-evaluation-response.component';
import { ResponsesHomeComponent } from './responses-home/responses-home.component';
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { EvaluationGuard } from "lib-bw-svc-apis/src/lib/evaluationGuard/evaluation.guard";
import { CreateEvaluationComponent } from "./create-evaluation/create-evaluation.component";
import { EditEvalutionComponent } from "./edit-evalution/edit-evalution.component";
import { EvaluationsHomeComponent } from "./evaluations-home/evaluations-home.component";
import { NewQuestionComponent } from "./new-question/new-question.component";
import { ViewEvalComponent } from "./view-eval/view-eval.component";

const routes: Routes = [
  {
    path: "",
    component: EvaluationsHomeComponent,
    canActivate: [EvaluationGuard],
    data: {
      action: "ViewEvaluations",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "newEvaluation",
    component: CreateEvaluationComponent,
    canActivate: [EvaluationGuard],
    data: {
      action: "CreateEvaluations",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "editEvaluation",
    component: EditEvalutionComponent,
    canActivate: [EvaluationGuard],
    data: {
      action: "CreateEvaluations",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "newQuestion",
    component: NewQuestionComponent,
    canActivate: [EvaluationGuard],
    data: {
      action: "CreateEvaluations",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "view-evaluation",
    component: ViewEvalComponent,
    // canActivate: [EvaluationGuard],
    // data: {
    //   action: "EditDeleteAlertTemplate",
    //   permission: "Allow",
    //   allowPrivate: "AllowPrivate",
    // },
  },
  {
    path: 'view-results',
    component: ResponsesHomeComponent
  },
  {
    path: 'view-eval-response',
    component: ViewEvaluationResponseComponent
  },
  {
    path: 'add-document',
    component: AddEvalDocumentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
