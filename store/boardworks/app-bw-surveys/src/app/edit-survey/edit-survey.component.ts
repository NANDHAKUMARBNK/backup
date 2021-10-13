import { ToastrService } from "./../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { SurveysService } from "lib-bw-svc-apis/src/lib/surveys/surveys.service";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { PanelBarExpandMode } from "@progress/kendo-angular-layout";
@Component({
  selector: "app-edit-survey",
  templateUrl: "./edit-survey.component.html",
  styleUrls: ["./edit-survey.component.scss"],
})
export class EditSurveyComponent implements OnInit {
  public expandMode: number = PanelBarExpandMode.Full;
  public kendoPanelBarExpandMode: any = PanelBarExpandMode;
  public height = 320;
  public onHeightChange(value: any): void {
    this.height = value;
  }
  public onPanelChange(event: any): void {}
  actions: any = ["Edit", "Delete"];
  showEditQuestion = false;
  pageType = "";
  questionId = "";
  defaultItems: any = [
    {
      text: "Surveys",
      title: "Surveys",
    },
  ];
  emailAlertControl = new FormControl(false);
  buttonName = "UnPublished";
  columnsData: any = [
    {
      title: "Questions",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "link",
    },
    {
      title: "Type",
      field: "type",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      title: "Details",
      field: "description",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      title: "Is Required",
      filterType: "boolean",
      isEnableColumnOptions: false,
      field: "required",
      width: "150px",
    },
    {
      field: "isShowManage",
      title: "",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "action",
      buttonName: "Action",
      width: "150px",
    },
    // {
    //   isEnableColumnOptions: false,
    //   component: "icon",
    //   width:'150px'
    // },
  ];
  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: true,
    lock: false,
    stick: false,
  };
  gridData: any;
  surveyId: any;
  surveyType: any;
  surveyData: any;
  templateScreen: boolean = false;
  unPublishScreen: boolean = false;
  emailCheckBox = [
    {
      name: "Send Email Notification",
      value: "Send Email Notification",
      selected: false,
    },
  ];
  emailSelectedValue: any;
  showDeleteSurvey: boolean = false;
  showDeleteResponse: boolean = false;
  showDeleteQuestion: boolean = false;
  isError = false;
  errMessage: any = [];
  constructor(
    private location: Location,
    private surveyService: SurveysService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.surveyId = this.activatedRoute.snapshot.queryParams.id;
    this.surveyType = this.activatedRoute.snapshot.queryParams.type;
    this.getSurveyById();
    this.getQuestions();
    if (this.surveyType == "template") {
      this.templateScreen = true;
    }
    if (this.surveyType == "unpublish") {
      this.unPublishScreen = true;
    }
  }

  ngOnInit(): void {
    this.expandMode = parseInt("2", 10);
  }

  getQuestions() {
    this.surveyService.getSurveyQuestionsBasedOnId(this.surveyId).subscribe(
      (data: any) => {
        let gridDetails = data.result;
        gridDetails &&
          gridDetails.forEach((res: any, index: any) => {
            res.linkTextName = res.question;
            res.parentWriteselected = res.required;
          });
        this.gridData = gridDetails;
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }

  getSurveyById() {
    this.surveyService.getSurveyById(this.surveyId).subscribe(
      (data: any) => {
        if (data.result) {
          this.surveyData = data.result;
          if (this.surveyData.isPublished) {
            this.buttonName = "UnPublished";
            this.actions = ["Edit"];
            this.unPublishScreen = false;
          } else {
            this.buttonName = "Published";
            this.actions = ["Edit", "Delete"];
            this.unPublishScreen = true;
          }
        }
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }

  buttonClick(e: any, type: any) {
    console.log(e, type, "type");
    switch (type) {
      case "settings":
        this.router.navigate(["admin/surveys/newSurvey"], {
          queryParams: { id: this.surveyId, type: "edit" },
        });
        break;
      case "Published":
        this.published();
        break;
      case "UnPublished":
        this.unPublished();
        break;
      case "delete":
        this.showDeleteSurvey = true;
        break;
      case "deleteResponse":
        this.showDeleteResponse = true;
        break;
      case "newQuestion":
        this.pageType = "";
        this.questionId = "";
        this.showEditQuestion = true;
        break;
    }
  }

  published() {
    const reqObj = {
      isPublished: !this.surveyData.isPublished,
      sendAlert: this.emailSelectedValue,
    };
    this.surveyService.putPublished(this.surveyId, reqObj).subscribe(
      (data: any) => {
        this.getQuestions();
        this.getSurveyById();
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }

  unPublished() {
    const reqObj = {
      isPublished: !this.surveyData.isPublished,
      sendAlert: this.emailSelectedValue,
    };
    this.surveyService.putUnPublished(this.surveyId, reqObj).subscribe(
      (data: any) => {
        this.getQuestions();
        this.getSurveyById();
      },
      (err) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }

  writeAccessClick(data: any) {
    if (data.event.target.checked) {
      data.selected.parentWriteselected = true;
    } else {
      data.selected.parentWriteselected = false;
    }
    this.updateParentSelection();
  }

  updateParentSelection() {
    this.gridData.forEach((element: any) => {
      element.parentWriteselected = false;
      let writeChildSelected = 0;
      if (element.users != null && element.users.length > 0) {
        element.users.forEach((child: any) => {
          if (child.childWriteselected) writeChildSelected += 1;
        });
        if (writeChildSelected == element.users.length) {
          element.parentWriteselected = true;
        }
      }
    });
  }

  changeCheckbox(e: any) {
    this.emailSelectedValue = e;
  }

  deleteSurvey(e: any) {
    if (e == "cancel") {
      this.showDeleteSurvey = false;
    } else {
      this.surveyService.deleteSurvey(this.surveyId).subscribe(
        (data: any) => {
          this.showDeleteSurvey = false;
          this.location.back();

          // this.getQuestions();
        },
        (err) => {
          this.setError(err.error.result.errorMessages);
          this.showDeleteSurvey = false;
        }
      );
    }
  }
  deleteResponse(e: any) {
    if (e == "cancel") {
      this.showDeleteResponse = false;
    } else {
      this.surveyService.deleteResponse(this.surveyId).subscribe(
        (data: any) => {
          if (data.result) {
            this.showDeleteResponse = false;
            this.toastr.showToastr("success", "Response Deleted Successfully!");
            this.getQuestions();
          } else {
            this.showDeleteResponse = false;
            this.toastr.showToastr("info", "No Response Available!");
          }
        },
        (err) => {
          this.setError(err.error.result.errorMessages);
          this.showDeleteResponse = false;
        }
      );
    }
  }

  deleteSurveyQuestion(e: any) {
    if (e == "cancel") {
      this.showDeleteQuestion = false;
    } else {
      this.surveyService
        .deleteSurveyQuestion(this.surveyId, this.questionId)
        .subscribe(
          (data: any) => {
            if (data.result) {
              this.showDeleteQuestion = false;
              this.toastr.showToastr(
                "success",
                "Question Deleted Successfully!"
              );
              this.getQuestions();
              // this.location.back();
            } else {
              this.showDeleteQuestion = false;
              this.toastr.showToastr("info", "No Response Available!");
            }
          },
          (err) => {
            this.setError(err.error.result.errorMessages);
            this.showDeleteQuestion = false;
          }
        );
    }
  }

  onClickLink(data: any) {
    this.pageType = "edit";
    this.questionId = data.data.questionId;
    this.showEditQuestion = true;
  }

  ngOnChanges(): void {
    console.log(this.gridData, "ngOnChanges");

    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  childLinkClick(e: any) {
    console.log(e, "eeee");
    this.router.navigate(["admin/surveys/newQuestion"], {
      queryParams: {
        id: this.surveyId,
        questionId: e.child.questionId,
        type: "edit",
      },
    });
  }

  backNavigation() {
    this.location.back();
  }

  hideQuestion(e: any) {
    this.getQuestions();
    this.showEditQuestion = false;
  }

  ationTaken(e: any) {
    if (e.action === "Edit") {
      this.onClickLink(e);
    } else if (e.action === "Delete") {
      this.questionId = e.data.questionId;
      this.showDeleteQuestion = true;
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
