import { ActivatedRoute } from "@angular/router";
import { CollaborationService } from "lib-bw-svc-apis/src/lib/collaboration/collaboration.service";
import { ToastrService } from "./../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { AlertsService } from "lib-bw-svc-apis/src/lib/alerts/alerts.service";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { AlertAddDocumentModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/alert-add-document-modal/alert-add-document-modal.component";
import { DialogService } from "@progress/kendo-angular-dialog";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";

@Component({
  selector: "app-create-alert-template",
  templateUrl: "./create-alert-template.component.html",
  styleUrls: ["./create-alert-template.component.scss"],
})
export class CreateAlertTemplateComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "Alerts",
      title: "Alerts",
    },
    {
      text: "New Alert Template",
      title: "New Alert Template",
    },
  ];
  selectField = new FormControl();
  templateDataForm!: FormGroup;
  actions: any = ["Edit"];
  onCellClicked: any = [];
  // buttonProperties: any = [
  //   {
  //     buttonText: "CANCEL",
  //     className:
  //       "btn-base btn-contained secondary-btn-outlined btn-lg bw-font-sec-bold",
  //     buttonAction: "Cancel",
  //     isDisable: false,
  //     withIcon: false,
  //     showButton: true,
  //   },
  //   {
  //     buttonText: "SAVE",
  //     className:
  //       "btn-base btn-contained secondary-btn-contained btn-lg bw-font-sec-bold me-md-4",
  //     buttonAction: "Save",
  //     isDisable: false,
  //     withIcon: false,
  //     showButton: true,
  //   },
  // ];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
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
  gridData: any = [];
  templateMode: any;
  alertId: any;
  isShowDocumentModal: boolean = false;
  documentData: any;
  noTitle: any = false;
  documents: any;
  isTriggerDocumentDeleteAPI: boolean = false;
  isDocumentAdded: boolean = false;
  title: any;
  showAddDocument: boolean = false;
  errMessage: any;
  isError: boolean = false;
  viewScreen: boolean = false;
  descriptionEllipse: any;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertsService,
    private collabService: CollaborationService,
    private location: Location,
    private toastr: ToastrService,
    // private router: Router,
    private activateRoute: ActivatedRoute,
    private dialogService: DialogService,
    private commonService: CommonService
  ) {
    this.createForm();
    this.templateMode = this.activateRoute.snapshot.params.type;
    this.alertId = this.activateRoute.snapshot.params.id;
    this.getCommitteesGroups();
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
  }

  createForm() {
    this.templateDataForm = this.fb.group({
      title: ["", Validators.required],
      description: [""],
      emailSubject: ["", Validators.required],
      emailBody: ["", Validators.required],
      recepientUserIds: [""],
      alertDocuments: [[]],
    });
  }

  async getCommitteesGroups() {
    await this.collabService.getAccessControl().subscribe((data) => {
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
        (this.templateMode == "edit" ||
          this.templateMode == "delete" ||
          this.templateMode == "view" ||
          this.templateMode == "use")
      ) {
        this.getAlertTemplateById(this.alertId);
        this.alertService.alertDocumentsRetain.subscribe((res: any) => {
          if (res && res.length && this.documents && this.documents.length) {
            let tempArr: any = [...this.documents, ...res];
            tempArr.filter(
              (v: any, i: any, a: any) =>
                a.findIndex((t: any) => t.documentId === v.documentId) === i
            );
            this.documents = tempArr;
            this.isTriggerDocumentDeleteAPI = false;
          }
        });
      }
    });
  }

  async getAlertTemplateById(id: any, type?: any) {
    await this.alertService.getAlertsTemplateById(id).subscribe((res) => {
      if (res) {
        this.descriptionEllipse =
          res.result.description.length > 50
            ? `${res.result.description.substring(0, 25)}...`
            : res.result.description;
        if (!type) {
          this.templateDataForm.patchValue(res.result);
        }
        if (this.templateMode == "use" && !this.isDocumentAdded) {
          this.title = this.templateDataForm.get("title");
          this.templateDataForm.get("title")?.reset();
        } else if (
          this.templateMode == "edit" ||
          this.templateMode == "delete"
          // ||
          //this.templateMode == "view"
        ) {
          this.title = this.templateDataForm.get("title");
          this.templateDataForm.get("title")?.disable();
          this.templateDataForm.get("description")?.enable();
          this.templateDataForm.get("emailSubject")?.enable();
          this.templateDataForm.get("emailBody")?.enable();
        }
        if (this.templateMode == "view") {
          this.viewScreen = true;
          // this.templateDataForm.get("description")?.disable();
          // this.templateDataForm.get("emailSubject")?.disable();
          // this.templateDataForm.get("emailBody")?.disable();
        }
        /// Mapping Recipients's Child Access checked
        this.gridData.map((data: any) => {
          data["usersChecked"] = [];
          if (
            this.templateMode == "edit" ||
            this.templateMode == "delete" ||
            this.templateMode == "view" ||
            this.isDocumentAdded
          ) {
            data["parentWriteDisable"] = true;
          }
          data.users.map((user: any) => {
            if (
              this.templateMode == "edit" ||
              this.templateMode == "delete" ||
              this.templateMode == "view" ||
              this.isDocumentAdded
            ) {
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

  save(type?: any) {
    this.templateDataForm.value.alertDocuments = this.documents
      ? this.documents
      : this.templateDataForm.value.alertDocuments;
    if (type == "Save") {
      this.alertService
        .addAlertTemplates(this.templateDataForm.value)
        .subscribe((res) => {
          if (res) {
            this.toastr.showToastr(
              "success",
              "Alert Template Created Successfully!"
            );
            this.location.back();
          }
        });
    } else if (type == "Update" && this.templateMode !== "use") {
      this.templateDataForm.value["title"] = this.title.value;
      // this.alertService.addNewAlert(this.templateDataForm.value)
      this.alertService
        .updateAlertTemplates(this.alertId, this.templateDataForm.value)
        .subscribe((res) => {
          if (res) {
            this.toastr.showToastr(
              "success",
              "Alert Template Updated Successfully!"
            );
            this.location.back();
          }
        });
    } else {
      this.templateDataForm.value["title"] = this.title.value;
      this.alertService
        .addNewAlert(this.templateDataForm.value)
        // .updateAlertTemplates(this.alertId, this.templateDataForm.value)
        .subscribe((res) => {
          if (res) {
            this.toastr.showToastr(
              "success",
              "Alert Template Updated Successfully!"
            );
            this.location.back();
          }
        });
    }
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

  writeAccessClick(data: any) {
    if (data.event.target.checked) {
      data.selected.parentWriteselected = true;
    } else {
      data.selected.parentWriteselected = false;
    }
    if (data.selected.parentWriteselected) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (inner.userId == selectedData.userId)
              inner.childWriteselected = true;
          });
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (inner.userId == selectedData.userId)
              inner.childWriteselected = false;
          });
        });
      });
    }
  }

  writeChildAccessClick(data: any) {
    if (data.event.target.checked) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          if (inner.userId == data.selected.userId)
            inner.childWriteselected = true;
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          if (inner.userId == data.selected.userId)
            inner.childWriteselected = false;
        });
      });
    }
  }

  insideAccordion(e: any) {}

  seterror(e: any) {
    if (e == "title" && this.templateDataForm.value.title !== "") {
      this.noTitle = false;
    }
  }

  onClickAction(event: any) {}

  clickButton(e: any) {
    if (e == "Cancel") {
      this.location.back();
    } else if (e == "Save" || e == "Update") {
      let tempArr: any = [];
      this.gridData.forEach((element: any, i: any) => {
        element.users.forEach((res: any) => {
          if (res.childWriteselected && !tempArr.includes(res.userId)) {
            tempArr.push(res.userId);
          }
        });
      });
      this.templateDataForm.value.recepientUserIds = tempArr;
      this.save(e);
    } else if (e == "Delete") {
      this.deleteTemplateModal(e);
    } else if (e == "Publish") {
      this.publishTemplate(e);
    } else if (e == "Edit") {
      this.templateMode = "edit";
      this.viewScreen = false;
      this.getCommitteesGroups();
    }
  }

  addDocument(e: any) {
    if (this.templateDataForm.value.title) {
      this.noTitle = false;
      this.showAddDocument = true;
      // this.isShowDocumentModal = true;
      // const dialogRef = this.dialogService.open({
      //   content: AlertAddDocumentModalComponent,
      // });
      // const info = dialogRef.content.instance;
      // info.headerTitle = "Add Document";
      // info.bodyMessage = this.documents && this.documents;
      // info.isEnableHeader = true;
      // info.isEnableBody = true;
      // info.isEnableFooter = true;
      // dialogRef.result.subscribe((result: any) => {
      //   this.isDocumentAdded = true;
      //   if (result.text === "cancel") {
      //     return;
      //   } else {
      //     this.documents = result.documents;
      //   }
      //   this.getAlertTemplateById(this.alertId, 'document');
      // });
    } else {
      this.noTitle = true;
    }
  }

  deleteTemplateModal(e: any) {
    const dialogRef = this.dialogService.open({
      content: ConfirmModalComponent,
    });
    const info = dialogRef.content.instance;
    info.headerTitle = "Delete Confirmation";
    info.customMessage = "Are you sure you want to delete this Alert Template?";
    info.bodyMessage =
      "Deleting this Alert Template will remove the alert template and any document that has been associated with it from BoardWorks and any linked devices.";
    info.isEnableHeader = true;
    info.isCustomBody = true;
    info.isDeleteBody = true;
    info.isEnableFooter = true;
    dialogRef.result.subscribe((result: any) => {
      if (result.text == "Yes") {
        this.deleteTemplate();
      }
    });
  }

  closeDialog(e: any) {
    this.isShowDocumentModal = e;
  }

  deleteTemplate() {
    this.alertService.deleteAlert(this.alertId).subscribe((res) => {
      if (res) {
        this.toastr.showToastr(
          "success",
          "Alert Template Deleted Successfully!"
        );
        this.location.back();
      }
    });
  }

  // deleteIcon(index: any, item: any) {
  //   this.documents.splice(index, 1);
  //   if (this.alertId && item.documentId && this.isTriggerDocumentDeleteAPI) {
  //     this.alertService
  //       .deleteAlertDocumentById(this.alertId, item.documentId)
  //       .subscribe(
  //         (res) => {
  //           if (res) {
  //             this.toastr.showToastr(
  //               "success",
  //               "Alert Document Deleted Successfully!"
  //             );
  //           }
  //         },
  //         (err: any) => { }
  //       );
  //   }
  //   if (this.documents.length == 0) {
  //     this.isDocumentAdded = false;
  //   }
  // }

  publishTemplate(e: any) {
    let tempArr: any = [];
    this.gridData.forEach((element: any, i: any) => {
      element.users.forEach((res: any) => {
        if (res.childWriteselected && !tempArr.includes(res.userId)) {
          tempArr.push(res.userId);
        }
      });
    });
    this.templateDataForm.value.recepientUserIds = tempArr;
    this.templateDataForm.value.alertDocuments = this.documents;
    this.alertService
      .publishAlertTemplate(this.templateDataForm.value)
      .subscribe((res) => {
        if (res) {
          this.toastr.showToastr(
            "success",
            "Alert Template Published Successfully!"
          );
          this.location.back();
        }
      });
  }

  navigateInto(params: any) {
    if (params.text === "Alerts" || params.title === "Alerts") {
      // this.router.navigate(['../'], { relativeTo: this.activateRoute })
      this.location.back();
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
