import { ToastrService } from "./../../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { SurveysService } from "./../../../../../lib-bw-svc-apis/src/lib/surveys/surveys.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-published-survey-list",
  templateUrl: "./published-survey-list.component.html",
  styleUrls: ["./published-survey-list.component.scss"],
})
export class PublishedSurveyListComponent implements OnInit {
  actions: any = [];
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
  userPermission: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveysService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {
    this.userPermission = JSON.parse(window.sessionStorage['userPermission']);
  }

  ngOnInit(): void {
    this.getPublishedList();
  }

  getPublishedList() {
    this.surveyService.getPublishedSurveyList().subscribe((res) => {
      if (res) {
        res.result.sort(function (a: any, b: any) {
          let B: any = new Date(b.createdDate);
          let A: any = new Date(a.createdDate);
          return B - A;
        });
        res.result.map((data: any) => {

          if (data.hasPermissionToRespond) {
            if (data.hasResponded) {
              data.linkText = false;
            } else {
              data.linkText = true;

            }
          } else {
            data.linkText = false;

          }
          
          data.actions = [];
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
            data["responded"] > 0 && data.canViewResponse ? "VIEW RESPONSES" : null;
          data["TwolinkTextName"] = data["surveyName"];
          // data["linkText"] = data["surveyName"] && true;
          if (data.canEdit) {
            data.actions.push('Edit');
          }
          if (data.canCopy) {
            data.actions.push('Copy');
          }
          if (data.canDelete) {
            data.actions.push('Delete');
          }
          if (!data.canEdit && !data.canDelete && !data.canCopy) {
            this.actions = [];
            this.columnsData.forEach((columnsData: any) => {
              if (columnsData.component == "action") {
                columnsData.component = " "
                columnsData.title = " "
              }
            });
          }
        });
        this.gridData = res.result;
      }
    });
  }

  onClickAction(event: any) {
    console.log(event, "event");
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
        this.getPublishedList();
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
