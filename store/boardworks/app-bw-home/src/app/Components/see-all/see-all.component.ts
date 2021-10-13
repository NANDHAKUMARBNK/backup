import { Component, OnInit } from "@angular/core";
import { HomeService } from "lib-bw-svc-apis/src/lib/home/home.service";
import { Location } from "@angular/common";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { environment } from "environments/environment";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { ActivatedRoute, Router } from "@angular/router";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
@Component({
  selector: "app-see-all",
  templateUrl: "./see-all.component.html",
  styleUrls: ["./see-all.component.scss"],
})
export class SeeAllComponent implements OnInit {
  data: any = [];
  flagIcon: any = "assets/images/flag.png";
  defaultItems: any = [
    {
      text: "Home",
      title: "Home",
    },
    {
      text: "Recent Updates",
      title: "Recent Updates",
    },
  ];
  showLoader: boolean = false;
  errMessage: any;
  isError: boolean = false;
  constructor(
    private homeService: HomeService,
    private location: Location,
    private commonService: CommonService,
    private viewFileDocService: ViewFileDocService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private meetingService: MeetingsService
  ) {}

  ngOnInit(): void {
    this.getRecentUpdates();
  }

  async getRecentUpdates() {
    await this.homeService.getRecentUpdates().subscribe((response: any) => {
      if (response.result && response.result.length > 0) {
        this.commonService.setRecentUpdates(response.result);
        this.data = this.commonService.getRecentUpdates();
      }
    });
  }
  onClickUpdates(params: any) {
    this.commonService.setRecentUpdatePermission(params.entity.toLowerCase());
    if (params.itemType.toLowerCase() === "document") {
      const payload: any = {
        documentId: params.documentId,
        fileName: params.documentFilename
          ? params.documentFilename
          : params.documentTitle,
      };
      let endpoint: any =
        params.entity.toLowerCase() === "references"
          ? `${params.entity}/${
              params.referenceType.toLowerCase() === "directorsguide"
                ? "DirectorsGuide"
                : params.referenceType.toLowerCase() === "corporateinformation"
                ? "CorporateInfo"
                : "GeneralBoardInfo"
            }` + "/Documents"
          : params.entity + "/Documents";
      let url = `${environment.baseUrl}${endpoint}/${params.documentId}`;
      // this.viewFileDocService.viewfile(payload, url);
      this.downloadDocuments(url, [], payload);
    } else {
      this.route.navigate(
        [
          `../${
            params.entity.toLowerCase() === "references"
              ? "documents"
              : params.entity.toLowerCase() === "discussions"
              ? "evaluations"
              : params.entity.toLowerCase()
          }`,
          {
            id: params.alertId
              ? params.alertId
              : params.collaborationId
              ? params.collaborationId
              : params.discussionId
              ? params.discussionId
              : params.referenceId
              ? params.referenceId
              : params.surveyId
              ? params.surveyId
              : params.votingId
              ? params.votingId
              : params.meetingEventId
              ? params.meetingEventId
              : params.evaluationId
              ? params.evaluationId
              : null,
            module: params.entity,
          },
        ],
        {
          relativeTo: this.activatedRoute,
        }
      );
    }
  }
  navigateInto(e: any) {
    if (e.text === "Home" || e.title === "Home") {
      this.location.back();
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  downloadDocuments(url: any, arr?: any, params?: any) {
    this.showLoader = true;
    this.meetingService.getStatusCodeFromUrl(url).subscribe(
      (response: any) => {
        this.showLoader = false;
        if (arr && arr.length) {
          arr.map((int: any) => {
            this.viewFileDocService.viewfile(int, url);
          });
        } else {
          this.viewFileDocService.viewfile(params, url);
        }
      },
      (err: any) => {
        this.showLoader = false;
        if (err.status === 200) {
          this.viewFileDocService.viewfile(params, url);
        } else {
          if (
            err.error &&
            err.error.result &&
            err.error.result.errorMessages &&
            err.error.result.errorMessages.length > 0
          ) {
            this.setError(err.error.result.errorMessages);
          } else {
            this.setError([`${err.error.error}`]);
          }
        }
      }
    );
  }
}
