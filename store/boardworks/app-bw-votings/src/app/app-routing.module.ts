import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { VotingsGuardGuard } from "lib-bw-svc-apis/src/lib/votings-guard/votings-guard.guard";
import { EditVotingComponent } from "./Components/edit-voting/edit-voting.component";
import { NewVotingComponent } from "./Components/new-voting/new-voting.component";
import { ResponsesHomeComponent } from "./Components/responses-home/responses-home.component";
import { ViewVotingsResponseComponent } from "./Components/responses-home/view-vote-response/view-vote-response.component";
import { UploadDocumentComponent } from "./Components/upload-document/upload-document.component";
import { ViewVotingsComponent } from "./Components/view-votings/view-votings.component";
import { VotingsHomeComponent } from "./Components/votings-home/votings-home.component";

const routes: Routes = [
  {
    path: "",
    component: VotingsHomeComponent,
    canActivate: [VotingsGuardGuard],
    data: {
      action: "ViewVoting",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "create-vote",
    component: NewVotingComponent,
    canActivate: [VotingsGuardGuard],
    data: {
      action: "CreateVoting",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  {
    path: "view-voting",
    component: ViewVotingsComponent,
  },
  {
    path: "view-results",
    component: ResponsesHomeComponent,
  },
  {
    path: "view-vote-response",
    component: ViewVotingsResponseComponent,
  },
  {
    path: "edit-voting",
    component: EditVotingComponent,
    canActivate: [VotingsGuardGuard],
    data: {
      action: "CreateVoting",
      permission: "Allow",
      allowPrivate: "AllowPrivate",
    },
  },
  { path: "add-document", component: UploadDocumentComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
