import { ToastrService } from './../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SurveysService } from "lib-bw-svc-apis/src/lib/surveys/surveys.service";

@Component({
  selector: "app-new-survey",
  templateUrl: "./new-survey.component.html",
  styleUrls: ["./new-survey.component.scss"],
})
export class NewSurveyComponent implements OnInit {
  breadCrumb = 'New Survey'
  SurveyDataForm: FormGroup;
  gridData: any;
  isError: boolean = false;
  errMessage: any;
  columnsData: any = [
    {
      field: "name",
      title: "Boards",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      title: "Users",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      title: "Access",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "writeAccess",
    },
    {
      isEnableColumnOptions: false,
      component: "icon",
    },
  ];
  columnOptions: any = {
    filter: false,
    sort: true,
    lock: false,
    stick: false,
  };
  onCellClicked: any = [];
  surveyType: any;
  surveyId: any;
  surveyData: any;
  buttonName: any;
  clickCount: any = null;

  constructor(
    private location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private commonService: CommonService,
    private surveyService: SurveysService,
    private toastr: ToastrService
  ) {
    this.SurveyDataForm = this.fb.group({
      title: ["", Validators.required],
      description: [""],
      closingDate: ["", Validators.required],
    });
    this.surveyType = this.activatedRoute.snapshot.queryParams.type;
    this.surveyId = this.activatedRoute.snapshot.queryParams.id;
    if (this.surveyId) { this.getSurveyById() };

    if (this.surveyType === undefined) {
      this.buttonName = 'CREATE SURVEY'
    }
    else {
      this.buttonName = 'SAVE'
    }

  }

  ngOnInit(): void {
    if (this.surveyType == 'template') {
      this.breadCrumb = "New Survey Template"
    }
    this.getAttendeesPermision();
  }

  backNavigation() {
    this.location.back();
  }

  getSurveyById() {
    this.surveyService.getSurveyById(this.surveyId).subscribe((data: any) => {
      this.surveyData = data.result;
      this.SurveyDataForm.patchValue({
        title: this.surveyType == 'copy' ? 'copy of' + ' ' + this.surveyData.surveyName : this.surveyType == 'use' ? '' : this.surveyData.surveyName,
        description: this.surveyData.description,
        closingDate: this.surveyType == 'use' ? new Date(this.surveyData.closeDate) : new Date(this.surveyData.createdDate)
      })
    })
  }

  submitSurvey(e: any) {
    let tempArray: any = [];
    this.gridData.forEach((element: any, index: any) => {
      element.users.forEach((innrer: any) => {
        let userObj: any = [];
        if (innrer.childWriteselected) {
          userObj = innrer.userId;
        }
        if (
          tempArray.filter((item: any) => item == userObj).length === 0 &&
          userObj.length > 0
        ) {
          tempArray.push(userObj);
        }
      });
    });

    const reqObj = {
      Title: this.SurveyDataForm.get("title")?.value,
      Description: this.SurveyDataForm.get("description")?.value,
      ClosedDate: this.SurveyDataForm.get("closingDate")?.value,
      RecepientIds: tempArray,
    };

    if (this.surveyType == 'edit') {
      if (this.clickCount) {
        this.setClickTimeout(() => { });
      } else {
        this.setClickTimeout((obj: any = 'data') =>
          this.surveyService.updateSurvey(this.surveyId, reqObj).subscribe((data: any) => {
            if (data) {
              this.toastr.showToastr('success', 'Survey Updated Successfully!')
              this.location.back();
            }
          }, err => {
            this.setError(err.error.result.errorMessages)
          }
          ));
      }
    } else if (this.surveyType == 'copy') {
      if (this.clickCount) {
        this.setClickTimeout(() => { });
      } else {
        this.setClickTimeout((obj: any = 'data') =>
          this.surveyService.copySurvey(this.surveyId, reqObj).subscribe((data: any) => {
            if (data) {
              this.toastr.showToastr('success', 'Survey Copied Successfully!')
              this.location.back();
            }
          }, err => {
            this.setError(err.error.result.errorMessages)
          }
          ));
      }
    } else if (this.surveyType == 'template') {
      if (this.clickCount) {
        this.setClickTimeout(() => { });
      } else {
        this.setClickTimeout((obj: any = 'data') =>
          this.surveyService.createSurveyTemplate(reqObj).subscribe((data: any) => {
            this.toastr.showToastr('success', 'Survey Template Created Successfully!')
            // this.location.back();
            this.router.navigate(["admin/surveys/editSurvey"], {
              queryParams: { id: data.result, type: 'template' },
            });
          }, err => {
            this.setError(err.error.result.errorMessages)
          }
          )
        );
      }
    } else if (this.surveyType == 'use') {
      if (this.clickCount) {
        this.setClickTimeout(() => { });
      } else {
        this.setClickTimeout((obj: any = 'data') =>
          this.surveyService.useSurveyTemplate(reqObj).subscribe((data: any) => {
            this.toastr.showToastr('success', 'Survey Template Used Successfully!')
            this.location.back();
          }, err => {
            this.setError(err.error.result.errorMessages)
          }
          )
        );
      }
    } else {
      if (this.clickCount) {
        this.setClickTimeout(() => { });
      } else {
        this.setClickTimeout((obj: any = 'data') =>
          this.surveyService.createSurvey(reqObj).subscribe(
            (data: any) => {
              this.toastr.showToastr('success', 'Survey Created Successfully!')
              // this.location.back();
              this.router.navigate(["admin/surveys/editSurvey"], {
                queryParams: { id: data.result, type: 'unpublish' },
              });
            },
            (err: any) => {
              this.setError(err.error.result.errorMessages);
            }
          ));
      }
    }
  }

  setClickTimeout(callback: any) {
    clearTimeout(this.clickCount);
    this.clickCount = setTimeout(() => {
      this.clickCount = null;
      callback();
    }, 200);
  }

  async createSurvey(reqObj: any) {
    await this.surveyService.createSurvey(reqObj).subscribe(
      (data: any) => {
        this.toastr.showToastr('success', 'Survey Created Successfully!')
        // this.location.back();
        this.router.navigate(["admin/surveys/editSurvey"], {
          queryParams: { id: data.result, type: 'unpublish' },
        });
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    )
  }

  writeChildAccessClick(data: any) {
    if (data.event.target.checked) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          if (innrer.userId == data.selected.userId)
            innrer.childWriteselected = true;
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          if (innrer.userId == data.selected.userId)
            innrer.childWriteselected = false;
        });
      });
    }
    this.updateParentSelection();
  }

  getAttendeesPermision() {
    this.commonService
      .getentitiesCommitteesOfficerGroups()
      .subscribe(async (data: any) => {
        data.result.filter((res: any) => {
          if (res.users.length == 0) {
            res["isUpDown"] = false;
          } else {
            res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
            res["isUpiconClass"] = "mdi mdi-chevron-up f-30";
            res["isUpDown"] = true;
          }
          res.users.map((innerres: any) => {
            // innerres.childReadselected = false;
            innerres.childWriteselected = innerres.isMandatory;
            innerres.disable = innerres.isMandatory;
          });
          res["isSelected"] = false;
          // res.parentReadselected = false;
          res.parentWriteselected = false;
        });
        this.gridData = data.result;
        if (this.surveyId) {
          this.surveyData &&
            this.surveyData.receipients.forEach((element: any) => {
              this.gridData.forEach((data: any) => {
                data.users.forEach((user: any) => {
                  if (element.userId == user.userId) {
                    user.childWriteselected = true;
                  }
                });
              });
            });
        }
        this.updateParentSelection();
      });
  }

  updateParentSelection() {
    this.gridData.forEach((element: any) => {
      element.parentReadselected = false;
      element.parentWriteselected = false;

      let writechildSelected = 0;
      let readChildSelected = 0;

      if (element.users != null && element.users.length > 0) {
        element.users.forEach((child: any) => {
          if (child.childReadselected) {
            readChildSelected += 1;
          }
          if (child.childWriteselected) writechildSelected += 1;
        });

        if (readChildSelected == element.users.length) {
          element.parentReadselected = true;
        }
        if (writechildSelected == element.users.length) {
          element.parentWriteselected = true;
        }
      }
    });
  }

  writeAccessClick(data: any) {
    if (data.event.target.checked) {
      data.selected.parentWriteselected = true;
    } else {
      data.selected.parentWriteselected = false;
    }
    if (data.selected.parentWriteselected) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (innrer.userId == selectedData.userId)
              innrer.childWriteselected = true;
          });
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (innrer.userId == selectedData.userId)
              innrer.childWriteselected = false;
          });
        });
      });
    }
    this.updateParentSelection();
  }

  accrodianClick(data: any) {
    if (data.event.isSelected) {
      data.grid.collapseRow(data.rowIndex);
    } else if (data.event.isSelected == false) {
      data.grid.expandRow(data.rowIndex);
    }

    this.gridData.forEach((element: any, index: any) => {
      if (data.event.id == element.id) {
        element.isUpDown = !element.isUpDown;
        element.isSelected = !element.isSelected;
      }
    });
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
