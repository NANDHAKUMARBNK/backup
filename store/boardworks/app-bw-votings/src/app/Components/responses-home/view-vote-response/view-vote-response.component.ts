import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { VotingsServiceService } from "lib-bw-svc-apis/src/lib/votings/votings-service.service";

@Component({
  selector: "app-view-vote-response",
  templateUrl: "./view-vote-response.component.html",
  styleUrls: ["./view-vote-response.component.scss"],
})
export class ViewVotingsResponseComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "Votings",
      title: "Votings",
    },
    {
      text: "Results",
      title: "Results",
    },
  ];
  title: any;
  voteId: any;
  recipientId: any;
  questionsList: any = [];
  answersList: any = [];
  votingData: any;
  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private votingService: VotingsServiceService
  ) {
    this.title = this.activatedRoute.snapshot.queryParams.title;
    this.voteId = this.activatedRoute.snapshot.queryParams.voteId;
    this.recipientId = this.activatedRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.getVotingsResponse();
  }

  getVotingsResponse() {
    this.votingService
      .getVotingIndividualResponse(this.voteId, this.recipientId)
      .subscribe((res) => {
        if (res) {
          this.votingData = res.result;
        }
      });
  }

  export(event: any, type: any) {}

  navigateInto(params: any) {
    const { text, title }: any = params;
    if (text === "Votings" || title === "Votings") {
      this.location.back();
    }
  }
}
