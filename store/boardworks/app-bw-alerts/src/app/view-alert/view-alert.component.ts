import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { DialogRef, DialogService } from "@progress/kendo-angular-dialog";
import { AlertsService } from "lib-bw-svc-apis/src/lib/alerts/alerts.service";
import { CollaborationService } from "lib-bw-svc-apis/src/lib/collaboration/collaboration.service";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";
import { environment } from "environments/environment";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
@Component({
  selector: "app-view-alert",
  templateUrl: "./view-alert.component.html",
  styleUrls: ["./view-alert.component.scss"],
})
export class ViewAlertComponent implements OnInit {
  defaultItems: any = [
    {
      text: "Alerts",
      title: "Alerts",
    },
  ];
  newAlertForm: FormGroup;
  headerName = "Alert";
  labelText: any = "Alert Details";
  gridData: any;
  readChildtempArray: any;
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

  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: true,
    lock: false,
    stick: false,
  };
  documentData: any;
  alertId: any;
  errMessage: any;
  isError: boolean = false;
  templateMode: any;
  isPublished: boolean = false;
  mode: any;
  isShowDelete: boolean = false;
  showdeleteLink: boolean = false;
  selectedData: any;
  descriptionEllipse: any;
  showLoader: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    public dialog: DialogRef,
    private dialogService: DialogService,
    private alertService: AlertsService,
    private collab: CollaborationService,
    private toastr: ToastrService,
    private activateRoute: ActivatedRoute,
    private viewFileDocService: ViewFileDocService,
    private meetingService: MeetingsService
  ) {
    this.newAlertForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", [Validators.maxLength(100)]],
      emailSubject: ["", Validators.required],
      emailBody: ["", Validators.required],
      recepientUserIds: [""],
      alertDocuments: [[]],
    });
    this.templateMode = this.activateRoute.snapshot.params.type;
    this.alertId = this.activateRoute.snapshot.params.id;
    this.mode = this.activateRoute.snapshot.params.mode;
    this.getRecepients();
  }
  ngOnInit(): void {
    // this.getRecepients();
    // if (
    //   this.templateMode &&
    //   (this.templateMode == "edit" || this.templateMode == "delete")
    // ) {
    //   this.getAlertsById(this.alertId);
    // }
    if (this.mode === "unpublished") {
      this.isPublished = true;
    }
    if (this.mode === "published") {
      this.isPublished = false;
    }
  }
  seterror(e?: any) {}
  unpublish(e: any) {
    const confirmation: any = confirm(
      "Are you sure you want to unpublish this Alert?"
    );
    if (confirmation) {
      this.alertService.addNewAlertUnPublish(this.alertId).subscribe(
        (res: any) => {
          if (res.result) {
            // this.isUnPublished = true;
            this.toastr.showToastr(
              "success",
              "New Alert UnPublished Successfully!"
            );
          }
          // this.router.navigate(["admin/alerts"]);
          this.isPublished = true;
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
        }
      );
    }
  }
  clickButton(e: any) {
    console.log(this.alertId);
    if (e === "Edit") {
      this.router.navigate(
        [`../edit-alert`, { type: "edit", id: this.alertId }],
        {
          relativeTo: this.activateRoute,
        }
      );
    } else if (e == "Delete") {
      this.deleteTemplateModal(e);
    } else {
    }
  }
  deleteTemplateModal(e: any) {
    // const dialogRef = this.dialogService.open({
    //   content: ConfirmModalComponent,
    // });
    // const info = dialogRef.content.instance;
    // info.headerTitle = "Delete Confirmation";
    // info.customMessage = "Are you sure you want to delete this Alert?";
    // info.bodyMessage =
    //   "Deleting this Alert will remove the alert and any document that has been associated with it from BoardWorks and any linked devices.";
    // info.isEnableHeader = true;
    // info.isCustomBody = true;
    // info.isDeleteBody = true;
    // info.isEnableFooter = true;
    // dialogRef.result.subscribe((result: any) => {
    //   if (result.text == "Yes") {
    //     this.deleteTemplate();
    //   }
    // });
    this.showdeleteLink = true;
    this.selectedData = e;
  }
  linksModalAction(type: any) {
    console.log(type, "typeeeee");
    if (type == "save") {
      this.deleteTemplate(this.alertId);
    } else {
      this.showdeleteLink = false;
      this.selectedData = "";
    }
  }
  deleteTemplate(alertId: any) {
    this.alertService.deleteAlert(alertId).subscribe((res) => {
      if (res) {
        this.showdeleteLink = false;
        this.toastr.showToastr(
          "success",
          "Alert Template Deleted Successfully!"
        );
        this.location.back();
      }
    });
  }
  cancel(event: any) {
    this.location.back();
  }
  ngAfterViewInit(): void {}
  keypress(event: any) {}
  async getRecepients() {
    await this.collab.getAccessControl().subscribe(
      (data: any) => {
        data.result.filter((res: any) => {
          if (res.users.length == 0) {
            res["isUpDown"] = false;
          } else {
            res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
            res["isUpiconClass"] = "mdi mdi-chevron-up f-30";
            res["isUpDown"] = true;
          }
          res.users.map((response: any) => {
            response.childWriteselected = false;
          });
          res["isSelected"] = false;
          res.parentWriteselected = false;
        });
        this.gridData = data.result;
        if (
          this.templateMode &&
          (this.templateMode == "edit" || this.templateMode == "delete")
        ) {
          this.getAlertsById(this.alertId);
        }
        // if (this.mode === "unpublished") {
        //   this.isPublished = true;
        // }
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  async getAlertsById(id: any) {
    await this.alertService.getAlertsTemplateById(id).subscribe((res) => {
      if (res) {
        this.descriptionEllipse =
          res.result.description.length > 50
            ? `${res.result.description.substring(0, 25)}...`
            : res.result.description;
        this.newAlertForm.patchValue(res.result);
        // this.isPublished = res.result.isPublished || false;
        let breadCrumbObject: any = [
          {
            title: res.result.title,
            text: res.result.title,
          },
        ];
        this.defaultItems = [...this.defaultItems, ...breadCrumbObject];
        /// Mapping Recipients's Child Access checked
        this.gridData.map((data: any) => {
          data["usersChecked"] = [];
          if (this.templateMode == "edit" || this.templateMode == "delete") {
            console.log("workingggg");
            data["parentWriteDisable"] = true;
          }
          data.users.map((user: any) => {
            if (this.templateMode == "edit" || this.templateMode == "delete") {
              user["disable"] = true;
            }
            const id: any = res.result.alertRecipients.findIndex(
              (ids: any) => ids.userId === user.userId
            );
            if (id !== -1) {
              user["childWriteselected"] = true;
            }
            /// Mapping Recipients's Parent Access checked
            data["usersChecked"].push(user["childWriteselected"]);
            data["parentWriteselected"] = data["usersChecked"].every(
              (e: any) => e == true
            );
          });
        });
      }
    });
  }
  navigateInto(params: any) {
    if (params.text === "Alerts" || params.title === "Alerts") {
      this.location.back();
    }
  }
  insideAccordion(e: any) {}
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
  clickOnDocument(e: any) {
    let url = ` ${environment.baseUrl}${apiConstant.alertsDocument}/${e.documentId}`;
    // this.viewFileDocService.viewfile(e, url);
    this.downloadDocuments(url, [], e);
  }
  shuffleGridAndDocumentData() {
    let tempArr: any = [];
    this.gridData.forEach((element: any, i: any) => {
      element.users.forEach((res: any) => {
        if (res.childWriteselected && !tempArr.includes(res.userId)) {
          tempArr.push(res.userId);
        }
      });
    });
    this.newAlertForm.value.recepientUserIds = tempArr;
  }
  publish(e: any) {
    this.shuffleGridAndDocumentData();
    if (e === "Save") {
      if (this.newAlertForm.invalid) {
        this.newAlertForm.markAllAsTouched();
        return;
      }
      if (this.newAlertForm.value.recepientUserIds.length === 0) {
        this.toastr.showToastr(
          "info",
          "You must specify the recipients before you can add documents"
        );
      } else {
        this.alertService.addNewAlert(this.newAlertForm.value).subscribe(
          (res: any) => {
            if (res) {
              this.alertId = res.result;
              const confirmation: any = confirm(
                "Are you sure you want to publish this Alert? Doing so will send the email notification to the alert recipients"
              );
              if (confirmation) {
                // this.toastr.showToastr(
                //   "success",
                //   "Are you sure you want to publish this Alert?  Doing so will send the email notification to the alert recipients"
                // );
                this.alertService
                  .addNewAlertPublish(this.alertId, this.newAlertForm.value)
                  .subscribe(
                    (res: any) => {
                      if (res) {
                        if (res.result) {
                          this.toastr.showToastr(
                            "success",
                            "New Alert Published Successfully!"
                          );
                          this.router.navigate(["admin/alerts"]);
                        }
                      }
                    },
                    (err: any) => {
                      this.setError(err.error.result.errorMessages);
                    }
                  );
              }
            }
          },
          (err: any) => {
            this.setError(err.error.result.errorMessages);
          }
        );
      }
    } else {
      const confirmation: any = confirm(
        "Are you sure you want to publish this Alert? Doing so will send the email notification to the alert recipients"
      );
      if (confirmation) {
        this.alertService
          .addNewAlertPublish(this.alertId, this.newAlertForm.value)
          .subscribe(
            (res: any) => {
              if (res) {
                if (res.result) {
                  this.toastr.showToastr(
                    "success",
                    "Alert Published Updated Successfully!"
                  );
                  this.router.navigate(["admin/alerts"]);
                }
              }
            },
            (err: any) => {
              this.setError(err.error.result.errorMessages);
            }
          );
      }
    }
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
