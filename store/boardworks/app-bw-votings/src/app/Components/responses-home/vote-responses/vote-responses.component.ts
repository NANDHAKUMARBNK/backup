import { ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { VotingsServiceService } from "lib-bw-svc-apis/src/lib/votings/votings-service.service";

@Component({
  selector: "app-vote-responses",
  templateUrl: "./vote-responses.component.html",
  styleUrls: ["./vote-responses.component.scss"],
})
export class VoteResponsesComponent implements OnInit {
  votingData: any;
  voteId: any;

  constructor(
    private votingService: VotingsServiceService,
    private activatedRoute: ActivatedRoute
  ) {
    this.voteId = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getVotingsResponses();
    this.calculatePercentage(400, 500);
  }

  getVotingsResponses() {
    this.votingService.getVotingResponses(this.voteId).subscribe((res) => {
      if (res) {
        res.result.responses.map((data: any) => {
          data.answers.map((ansData: any) => {
            let per = this.calculatePercentage(
              ansData.count,
              res.result.totalRecipients
            );
            ansData["percentage"] = `${per > 100 ? 100 : per}%`;
          });
        });
        this.votingData = res.result.responses;
      }
    });
  }

  calculatePercentage(count: any, total: any) {
    return (count / total) * 100;
  }

  order(params: any) {
    return `${params}. `;
  }
}
