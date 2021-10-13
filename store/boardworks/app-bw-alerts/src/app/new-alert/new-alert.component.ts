import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import { DialogRef, DialogService } from "@progress/kendo-angular-dialog";
import { AlertAddDocumentModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/alert-add-document-modal/alert-add-document-modal.component";
import { AlertsService } from "lib-bw-svc-apis/src/lib/alerts/alerts.service";
import { CollaborationService } from "lib-bw-svc-apis/src/lib/collaboration/collaboration.service";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
@Component({
  selector: "app-new-alert",
  templateUrl: "./new-alert.component.html",
  styleUrls: ["./new-alert.component.scss"],
})
export class NewAlertComponent implements OnInit {
  defaultItems: any = [];
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
  documents: any;
  isTriggerDocumentDeleteAPI: boolean = false;
  documentsAlert: any;
  showAddDocument: boolean = false;
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
    private commonService: CommonService
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
    this.getRecepients();
  }
  ngOnInit(): void {
    this.alertService.alertDocumentsRetain.subscribe((res: any) => {
      if (res && res.length && this.documents && this.documents.length) {
        let tempArr: any = [...this.documents, ...res];
        this.documents = tempArr.filter(
          (v: any, i: any, a: any) =>
            a.findIndex((t: any) => t.documentId === v.documentId) === i
        );
        this.isTriggerDocumentDeleteAPI = false;
      }
    });
    if (!this.activateRoute.snapshot.params.id) {
      this.defaultItems = [
        {
          text: "Alerts",
          title: "Alerts",
        },
        {
          text: "New Alert",
          title: "New Alert",
        },
      ];
    }
  }
  seterror(e?: any) {}
  cancel(event: any) {
    this.router.navigate(["admin/alerts"]);
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
    this.newAlertForm.value.alertDocuments = this.documents;
    // this.alertId
    //   ? this.documents
    // : this.documentData && this.documentData.documents;
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
  save(e: any) {
    this.shuffleGridAndDocumentData();
    if (e === "Save") {
      if (this.newAlertForm.invalid) {
        this.newAlertForm.markAllAsTouched();
        return;
      }
      if (
        // (this.newAlertForm.value.alertDocuments &&
        //   this.newAlertForm.value.alertDocuments.length === 0) || !this.newAlertForm.value.alertDocuments ||
        this.newAlertForm.value.recepientUserIds.length === 0
      ) {
        this.toastr.showToastr(
          "info",
          "You must specify the recipients before you can add documents or publish your alert"
        );
      } else {
        this.alertService.addNewAlert(this.newAlertForm.value).subscribe(
          (res: any) => {
            if (res) {
              this.alertId = res.result;
              //unpublish
              this.alertService.addNewAlertUnPublish(this.alertId).subscribe(
                (res: any) => {
                  if (res) {
                    if (res.result) {
                      this.toastr.showToastr(
                        "success",
                        "New Alert UnPublished Successfully!"
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
          },
          (err: any) => {
            this.setError(err.error.result.errorMessages);
          }
        );
      }
    } else {
      this.alertService
        .updateAlertTemplates(this.alertId, this.newAlertForm.value)
        .subscribe((res) => {
          if (res) {
            this.toastr.showToastr("success", "Alert Updated Successfully!");
            // this.location.back();
          }
        });
    }
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
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  async getAlertsById(id: any) {
    await this.alertService.getAlertsTemplateById(id).subscribe((res) => {
      if (res) {
        this.isTriggerDocumentDeleteAPI = true;
        this.newAlertForm.patchValue(res.result);
        let breadCrumbObject: any = [
          {
            text: "Alerts",
            title: "Alerts",
          },
          {
            title: `Edit Alert - ${res.result.title}`,
            text: `Edit Alert - ${res.result.title}`,
          },
        ];
        this.defaultItems = [...this.defaultItems, ...breadCrumbObject];
        this.documents = res.result.alertDocuments && res.result.alertDocuments;
        if (this.templateMode == "edit" || this.templateMode == "delete") {
          this.newAlertForm.get("title")?.disable();
        }
        /// Mapping Recipients's Child Access checked
        this.gridData.map((data: any) => {
          data["usersChecked"] = [];
          if (this.templateMode == "edit" || this.templateMode == "delete") {
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
  templateModal(msg: any) {
    const dialogRef = this.dialogService.open({
      content: ConfirmModalComponent,
    });
    const info = dialogRef.content.instance;
    info.headerTitle = "Delete Confirmation";
    info.customMessage = msg;
    info.bodyMessage = "";
    info.isEnableHeader = true;
    info.isCustomBody = true;
    info.isDeleteBody = true;
    info.isEnableFooter = true;
    dialogRef.result.subscribe((result: any) => {
      if (result.text == "Yes") {
      }
    });
  }
  addDocument(params: any) {
    this.showAddDocument = true;
    // let dialogRef: any = this.dialogService.open({
    //   content: AlertAddDocumentModalComponent,
    // });
    // let info: any = dialogRef.content.instance;
    // info.headerTitle = "Add Document";
    // info.bodyMessage = this.documents && this.documents;
    // info.isEnableHeader = true;
    // info.isEnableBody = true;
    // info.isEnableFooter = true;
    // dialogRef.result.subscribe((result: any) => {
    //   if (result.text === "cancel") {
    //     return;
    //   } else {
    //     this.documents = result.documents;
    //   }
    // });
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
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
  deleteIcon(index: any, item: any) {
    this.documents.splice(index, 1);
    this.commonService
      .deleteDocumentcache(item.documentId)
      .subscribe((res: any) => {});
    if (this.alertId && item.documentId && this.isTriggerDocumentDeleteAPI) {
      this.alertService
        .deleteAlertDocumentById(this.alertId, item.documentId)
        .subscribe(
          (res) => {
            if (res) {
              this.toastr.showToastr(
                "success",
                "Alert Document Deleted Successfully!"
              );
            }
          },
          (err: any) => {
            this.setError(err.error.result.errorMessages);
          }
        );
    }
  }
  linksModalAction(e: any) {
    if (e === "cancel") {
      this.showAddDocument = false;
    } else {
      this.documents = e;
      this.showAddDocument = false;
    }
  }
}
