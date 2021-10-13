import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { ToastrService } from "./../../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { CommonService } from "./../../../../../lib-bw-svc-apis/src/lib/common/common.service";
import { SurveysService } from "./../../../../../lib-bw-svc-apis/src/lib/surveys/surveys.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-templates-survey-list",
  templateUrl: "./templates-survey-list.component.html",
  styleUrls: ["./templates-survey-list.component.scss"],
})
export class TemplatesSurveyListComponent implements OnInit {
  actions = ["Delete", "Use", "Edit"];
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
      width: "330px",
    },
    {
      field: "displayCreatedDate",
      title: "DATE CREATED",
      filterType: "text",
      isEnableColumnOptions: false,
      width: "330px",
    },
    // {
    //   field: "responseCount",
    //   title: "# of Responses",
    //   filterType: "text",
    //   isEnableColumnOptions: false,
    // },
    {
      field: "displayCloseDate",
      title: "Closing Date",
      isEnableColumnOptions: false,
      width: "330px",
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
      width: "320px",
      
    },
  ];
  gridData: any = [];
  errMessage: any;
  isError: boolean = false;
  deleteSurvey: boolean = false;
  selectedData: any;
  constructor(
    private surveyService: SurveysService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getTemplateList();
  }

  getTemplateList() {
    this.surveyService.getTemplateSurveyList().subscribe((res) => {
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
    this.selectedData = event.data;
    console.log(event);
    if (event.action === "Delete") {
      this.deleteSurvey = true;
    } else if (event.action === "Use") {
      this.router.navigate([`newSurvey`], {
        relativeTo: this.activatedRoute,
        queryParams: { type: "use", id: event.data.surveyId },
      });
    }
    if (event.action === "Edit") {
      this.router.navigate(["editSurvey"], {
        relativeTo: this.activatedRoute,
        queryParams: { id: event.data.surveyId, type: "template" },
      });
    }
  }

  linksModalAction(e: any, type?: any) {
    console.log(e);
    if (type.toLowerCase() == "save") {
      this.deleteSurveyApi(this.selectedData.surveyId);
    } else {
      this.deleteSurvey = false;
    }
  }
  deleteSurveyApi(id: any) {
    this.surveyService.deleteSurvey(id).subscribe((res: any) => {
      if (res) {
        this.deleteSurvey = false;
        this.toastr.showToastr(
          "success",
          "Survey Template Deleted Successfully!"
        );
        this.getTemplateList();
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
