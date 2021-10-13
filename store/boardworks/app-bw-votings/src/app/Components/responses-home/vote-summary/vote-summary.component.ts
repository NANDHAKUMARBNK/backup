import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { VotingsServiceService } from "lib-bw-svc-apis/src/lib/votings/votings-service.service";

@Component({
  selector: "app-vote-summary",
  templateUrl: "./vote-summary.component.html",
  styleUrls: ["./vote-summary.component.scss"],
})
export class VoteSummaryComponent implements OnInit {
  actions: any = ["View"];
  onCellClicked: any = [];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData = [
    {
      field: "recipientsName",
      title: "Respondee",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "",
      iconClass:
        "checkbox-marked-circle icon-clr-eggplant icon-md-size cursor-pointer mb-2",
      title: "Response Received",
      showIcon: false,
      isEnableColumnOptions: false,
      component: "iconAction",
    },
    {
      field: "displayDate",
      title: "Date | Time Response Received",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "linkTextName",
      title: "",
      component: "action",
      isEnableColumnOptions: false,
      linkClassName: "bw-font-sec-bold",
      buttonName: "Manage",
    },
  ];
  gridData: any = [];
  errMessage: any;
  isError: boolean = false;
  voteId: any;
  title: any;
  canDeleteSummary: boolean = false;
  responseId: any;
  constructor(
    private votingService: VotingsServiceService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.voteId = this.activatedRoute.snapshot.params.id;
    this.title = this.activatedRoute.snapshot.params.title;
  }

  ngOnInit(): void {
    this.getVotingsSummaryList();
  }

  getVotingsSummaryList() {
    this.votingService.getVotingSummaryList(this.voteId).subscribe((res) => {
      if (res) {
        res.result.responses.map((data: any) => {
          if (data["hasResponded"]) {
            this.actions = ["View", "Delete"];
          }
          data["showIcon"] = data["hasResponded"];
          const modifiedDate =
            data["modifiedDate"] !== null
              ? new Date(data["modifiedDate"])
              : null;
          data["displayDate"] =
            data["modifiedDate"] !== null
              ? this.commonService.formatDate(modifiedDate, "dateWithPipeTime")
              : null;
        });
        this.gridData = res.result.responses;
      }
    });
  }

  onClickAction(event: any) {
    console.log(event);
    switch (event.action) {
      case "View":
        this.router.navigate(["../view-vote-response"], {
          relativeTo: this.activatedRoute,
          queryParams: {
            id: event.data.recipientsId,
            voteId: this.voteId,
            title: this.title,
          },
        });
        break;
      case "Delete":
        this.canDeleteSummary = true;
        this.responseId = event.data.recipientsId;
        break;
    }
  }

  onClickLink(event: any) {}

  linksModalAction(e: any) {
    if (e == "YES") {
      this.deleteEvaluationResponse(this.responseId);
    } else {
      this.canDeleteSummary = false;
    }
  }

  deleteEvaluationResponse(id: any) {
    this.votingService
      .deleteVotingResponse(this.voteId, id)
      .subscribe((res: any) => {
        if (res) {
          this.canDeleteSummary = false;
          this.toastr.showToastr("success", "Responses Deleted Successfully!");
          this.getVotingsSummaryList();
        }
      });
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
