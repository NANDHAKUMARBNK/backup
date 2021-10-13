import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { LibBwUiCompCoreModule } from "lib-bw-ui-comp-core/src/lib/lib-bw-ui-comp-core.module";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { VotingsHomeComponent } from "./Components/votings-home/votings-home.component";
import { NewVotingComponent } from "./Components/new-voting/new-voting.component";
import { ViewVotingsComponent } from "./Components/view-votings/view-votings.component";
import { ResponsesHomeComponent } from "./Components/responses-home/responses-home.component";
import { VoteSummaryComponent } from "./Components/responses-home/vote-summary/vote-summary.component";
import { VoteResponsesComponent } from "./Components/responses-home/vote-responses/vote-responses.component";
import { ViewVotingsResponseComponent } from "./Components/responses-home/view-vote-response/view-vote-response.component";
import { EditVotingComponent } from "./Components/edit-voting/edit-voting.component";
import { UploadDocumentComponent } from "./Components/upload-document/upload-document.component";

@NgModule({
  declarations: [
    AppComponent,
    VotingsHomeComponent,
    NewVotingComponent,
    ViewVotingsComponent,
    ResponsesHomeComponent,
    VoteSummaryComponent,
    VoteResponsesComponent,
    ViewVotingsResponseComponent,
    EditVotingComponent,
    UploadDocumentComponent,
  ],
  imports: [
    // BrowserModule,
    AppRoutingModule,
    LibBwUiCompCoreModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
