import { ToastrService } from "./../../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { CommonService } from "./../../../../../lib-bw-svc-apis/src/lib/common/common.service";
import { Component, OnInit } from "@angular/core";
import { SurveysService } from "lib-bw-svc-apis/src/lib/surveys/surveys.service";

@Component({
  selector: "app-unpublished-survey-list",
  templateUrl: "./unpublished-survey-list.component.html",
  styleUrls: ["./unpublished-survey-list.component.scss"],
})
export class UnpublishedSurveyListComponent implements OnInit {
  actions: any = ["Edit", "Copy", "Delete"];
  onCellClicked: any = [];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData = [
    {
      field: "TwolinkTextName",
      title: "Survey Title",
      filterType: "text",
      component: "TwolinkTextName",
      isEnableColumnOptions: false,
      width: "270px",
    },
    {
      field: "displayCreatedDate",
      title: "DATE CREATED",
      filterType: "text",
      isEnableColumnOptions: false,
      width: "270px",
    },
    {
      field: "responseCount",
      title: "# of Responses",
      filterType: "text",
      isEnableColumnOptions: false,
      width: "270px",
    },
    {
      field: "displayCloseDate",
      title: "Closing Date",
      isEnableColumnOptions: false,
      width: "270px",
    },

    {
      field: "linkTextName",
      title: "",
      component: "link",
      isEnableColumnOptions: false,
      linkClassName: "bw-font-sec-bold",
    },
    {
      field: "action",
      title: "ACTIONS",
      component: "action",
      isEnableColumnOptions: false,
      width: "270px",
    },
  ];
  gridData: any = [];
  errMessage: any;
  isError: boolean = false;
  canDelete: boolean = false;
  surveyId: any;
  constructor(
    private surveyService: SurveysService,
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUnPublishedList();
  }

  getUnPublishedList() {
    this.surveyService.getUnPublishedSurveyList().subscribe((res) => {
      if (res) {
        res.result.sort(function (a: any, b: any) {
          let B: any = new Date(b.createdDate);
          let A: any = new Date(a.createdDate);
          return B - A;
        });
        res.result.map((data: any) => {
          data["displayCloseDate"] = this.commonService.formatDate(
            data["closeDate"]
          );
          data["displayCreatedDate"] = this.commonService.formatDate(
            data["createdDate"]
          );
          data[
            "responseCount"
          ] = `${data["responded"]} / ${data["totalResponse"]}`;
          data["linkTextName"] =
            data["responded"] > 0 ? "VIEW RESPONSES" : null;
          data["TwolinkTextName"] = data["surveyName"];
          data["linkText"] = data["surveyName"] && true;
        });
        this.gridData = res.result;
      }
    });
  }

  onClickAction(event: any) {
    this.surveyId = event.data.surveyId;
    if (event.action == "Copy") {
      this.router.navigate(["newSurvey"], {
        relativeTo: this.activatedRoute,
        queryParams: { id: event.data.surveyId, type: "copy" },
      });
    } else if (event.action === "Edit") {
      this.router.navigate(["editSurvey"], {
        relativeTo: this.activatedRoute,
        queryParams: { id: event.data.surveyId, type: "publish" },
      });
    } else if (event.action == "Delete") {
      this.canDelete = true;
    }
  }

  linksModalAction(e: any, type?: any) {
    console.log(e);
    if (type.toLowerCase() == "save") {
      this.deleteSurvey(this.surveyId);
    } else {
      this.canDelete = false;
    }
  }

  deleteSurvey(id: any) {
    this.surveyService.deleteSurvey(id).subscribe((res: any) => {
      if (res) {
        this.canDelete = false;
        this.toastr.showToastr("success", "Survey Deleted Successfully!");
        this.getUnPublishedList();
      }
    });
  }

  onClickLink(event: any) {
    console.log(event);
    const { type, data }: any = event;
    switch (type) {
      case "link":
        this.router.navigate(
          [
            `./view-results`,
            { id: event.data.surveyId, title: event.data.surveyName },
          ],
          {
            relativeTo: this.activatedRoute,
          }
        );
        break;
      case "TwolinkTextName":
        this.redirectToEdit(event.data);
        break;
    }
  }
  redirectToEdit(data: any) {
    console.log(data);
    this.router.navigate(
      [
        `view-survey`,
        { type: "view", id: data.surveyId, title: data.surveyName },
      ],
      {
        relativeTo: this.activatedRoute,
      }
    );
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
