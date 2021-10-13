import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { Component, Input, OnInit } from "@angular/core";
import { AlertsService } from "lib-bw-svc-apis/src/lib/alerts/alerts.service";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { Router, ActivatedRoute } from "@angular/router";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";
import { environment } from "environments/environment";
import { DialogRef, DialogService } from "@progress/kendo-angular-dialog";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";

@Component({
  selector: "app-unpublished-list",
  templateUrl: "./unpublished-list.component.html",
  styleUrls: ["./unpublished-list.component.scss"],
})
export class UnpublishedListComponent implements OnInit {
  actions: any = ["Archive", "Edit", "Delete"];
  showdeleteLink: boolean = false;
  selectedData: any;
  onCellClicked: any = [];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData: any;
  gridData: any;
  userPermission: any;
  errMessage: any;
  isError: boolean = false;
  showLoader: boolean = false;
  constructor(
    private alertService: AlertsService,
    private commonService: CommonService,
    private storage: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private viewFileDocService: ViewFileDocService,
    public dialog: DialogRef,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private meetingService: MeetingsService
  ) {}

  ngOnInit(): void {
    this.getUnpublishedAlerts();
    this.userPermission = JSON.parse(this.storage.getData("userPermission"));
    this.userPermission &&
      this.userPermission.forEach((element: any) => {
        if (
          element.action == "EditDeleteAlertTemplate" &&
          (element.permission == "Allow" ||
            element.permission == "AllowPrivate")
        ) {
          this.columnsData = [
            {
              field: "linkTextName",
              title: "Alert Title",
              filterType: "text",
              isEnableColumnOptions: false,
              component: "link",
              width: "150px",
            },
            {
              field: "isArchive",
              title: "",
              component: "isArchiveAlert",
              isEnableColumnOptions: false,
              width: "100px",
            },
            {
              field: "description",
              title: "Alert Description",
              filterType: "text",
              isEnableColumnOptions: false,
              width: "250px",
            },
            {
              field: "displayDate",
              title: "DATE CREATED",
              filterType: "text",
              isEnableColumnOptions: false,
              width: "250px",
            },
            {
              field: "linkPopup",
              title: "DOCUMENTS",
              component: "linkPopup",
              isEnableColumnOptions: false,
              width: "250px",
            },
            {
              field: "TwolinkTextName",
              title: "ACTIONS",
              component: "action",
              isEnableColumnOptions: false,
              linkClassName: "bw-font-sec-bold",
              buttonName: "Manage",
            },
          ];
        } else {
          this.columnsData = [
            {
              field: "linkTextName",
              title: "Alert Title",
              filterType: "text",
              isEnableColumnOptions: false,
              component: "link",
            },
            {
              field: "isArchive",
              title: "",
              component: "isArchiveAlert",
              isEnableColumnOptions: false,
            },
            {
              field: "description",
              title: "Alert Description",
              filterType: "text",
              isEnableColumnOptions: false,
            },
            {
              field: "displayDate",
              title: "DATE CREATED",
              filterType: "text",
              isEnableColumnOptions: false,
            },
            {
              field: "linkPopup",
              title: "DOCUMENTS",
              component: "linkPopup",
              isEnableColumnOptions: false,
              linkClassName: "p-3",
            },
          ];
        }
      });
  }

  getUnpublishedAlerts(isArchived?: any) {
    this.alertService.getAlertsUnpublished(isArchived).subscribe(
      (res) => {
        if (res) {
          let result: any = res.result.sort(function (a: any, b: any) {
            let B: any = new Date(b.createdDate);
            let A: any = new Date(a.createdDate);
            return B - A;
          });
          result.filter((data: any) => {
            data["TwolinkTextName"] = "EDIT";
            data["linkTextName"] = data.title;
            data["archiveTag"] = data.isArchive || false;
            data["linkPopup"] =
              data.alertDocuments.length > 0
                ? data.alertDocuments.length + " Document(s)"
                : "";
            data["linkPopupContent"] = data.alertDocuments || [];
            data["displayDate"] = this.commonService.formatDate(
              data.createdDate
            );
            data["isArchive"] = data.isArchive ? data.isArchive : false;
            if (data.isArchived) {
              data.actions = ["UnArchive", "Edit", "Delete"];
            }
          });
          this.gridData = result;
        }
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
  onClickAction(event: any) {
    if (event.action === "Edit") {
      this.router.navigate(
        [
          `view-alert`,
          { type: "edit", id: event.data.alertId, mode: "unpublished" },
        ],
        { relativeTo: this.activatedRoute }
      );
    } else if (event.action === "Delete") {
      this.showdeleteLink = true;
      this.selectedData = event;
    } else if (event.action === "Archive" || event.action === "UnArchive") {
      this.alertService
        .archiveAndUnarchiveAlert(event.data.alertId, event.action)
        .subscribe((res: any) => {
          this.toastr.showToastr(
            "success",
            event.action === "Archive"
              ? "Alert Archive Successfully!"
              : "Alert UnArchive Successfully!"
          );
          this.getUnpublishedAlerts();
        });
    }
  }
  linksModalAction(type: any) {
    console.log(type, "typeeeee");
    if (type == "save") {
      this.deleteTemplate(this.selectedData.data.alertId);
    } else {
      this.showdeleteLink = false;
      this.selectedData = "";
    }
  }
  deleteTemplate(alertId: any) {
    this.alertService.deleteAlert(alertId).subscribe((res: any) => {
      if (res) {
        this.showdeleteLink = false;
        this.toastr.showToastr(
          "success",
          "Alert Template Deleted Successfully!"
        );
        this.getUnpublishedAlerts();
      }
    });
  }
  onClickLink(event: any) {
    /// TODO
    switch (event.type) {
      case "linkPopupContent":
        this.getDocumentById(event.data);
        break;
      case "link":
        this.redirectToEdit(event.data);
        break;
    }
  }
  redirectToEdit(data: any) {
    this.router.navigate(
      [`view-alert`, { type: "edit", id: data.alertId, mode: "unpublished" }],
      {
        relativeTo: this.activatedRoute,
      }
    );
  }
  getArchivedEvent(e: any) {
    this.getUnpublishedAlerts(e);
  }

  getDocumentById(data: any) {
    // this.alertService.getDocumentById(id).subscribe((res) => {
    //   if (res) {
    //     /// TODO downloadFile
    //   }
    // });
    let url = ` ${environment.baseUrl}${apiConstant.alertsDocument}/${data.documentId}`;
    // this.viewFileDocService.viewfile(data, url);
    this.downloadDocuments(url, [], data);
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
