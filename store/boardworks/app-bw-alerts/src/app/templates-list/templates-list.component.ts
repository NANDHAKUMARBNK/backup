import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { Component, OnInit } from "@angular/core";
import { AlertsService } from "lib-bw-svc-apis/src/lib/alerts/alerts.service";
import { Router, ActivatedRoute } from "@angular/router";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { DialogRef, DialogService } from "@progress/kendo-angular-dialog";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
@Component({
  selector: "app-templates-list",
  templateUrl: "./templates-list.component.html",
  styleUrls: ["./templates-list.component.scss"],
})
export class TemplatesListComponent implements OnInit {
  actions: any = ["Edit", "Delete"];
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
  showdeleteLink: boolean = false;
  selectedData: any;
  constructor(
    private alertsService: AlertsService,
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storage: StorageService,
    public dialog: DialogRef,
    private dialogService: DialogService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAlertTemplates();
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
              field: "title",
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
              isEnableColumnOptions: false,
              width: "250px",
            },
            // {
            //   field: "linkTextName",
            //   title: "Actions",
            //   component: 'link',
            //   linkClassName: "bw-font-sec-bold",
            //   isEnableColumnOptions: false,
            // },
            {
              field: "action",
              title: "Actions",
              // componnet: "action",
              isEnableColumnOptions: false,
              component: "action",
              buttonName: "Manage",
            },
            {
              field: "useTemplate",
              title: "",
              component: "useTemplate",
              linkClassName: "bw-font-sec-bold",
              isEnableColumnOptions: false,
            },
          ];
        } else {
          this.columnsData = [
            {
              field: "title",
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
              isEnableColumnOptions: false,
            },
            {
              field: "useTemplate",
              title: "",
              component: "useTemplate",
              linkClassName: "bw-font-sec-bold",
              isEnableColumnOptions: false,
            },
          ];
        }
      });
  }

  getAlertTemplates(isArchived?: any) {
    this.alertsService.getAlertsTemplates(isArchived).subscribe(
      (data: any) => {
        if (data.result) {
          let result: any = data.result.sort(function (a: any, b: any) {
            let B: any = new Date(b.createdDate);
            let A: any = new Date(a.createdDate);
            return B - A;
          });
          result.filter((res: any) => {
            // if (res.canEdit) {
            res["linkTextName"] = res.title;
            // }
            res["useTemplate"] = "USE TEMPLATE";
            res["displayDate"] = this.commonService.formatDate(res.createdDate);
            res["isArchive"] = res.isArchive ? res.isArchive : false;
          });
          this.gridData = data.result;
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
    switch (event.action) {
      case "Edit":
        this.router.navigate(
          [`edit-alert-template`, { type: "edit", id: event.data.alertId }],
          { relativeTo: this.activatedRoute }
        );
        break;
      case "Delete":
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
        //     this.deleteTemplate(event.data.alertId);
        //   }
        // });
        // break;
        this.showdeleteLink = true;
        this.selectedData = event;
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
    this.alertsService.deleteAlert(alertId).subscribe((res: any) => {
      if (res) {
        this.showdeleteLink = false;
        this.toastr.showToastr(
          "success",
          "Alert Template Deleted Successfully!"
        );
        this.getAlertTemplates();
      }
    });
  }
  onClickLink(event: any) {
    console.log(event);
    switch (event.type) {
      case "EDIT":
        this.router.navigate(
          [`edit-alert-template`, { type: "edit", id: event.data.alertId }],
          { relativeTo: this.activatedRoute }
        );
        break;
      case "USE TEMPLATE":
        this.router.navigate(
          [`use-alert-template`, { type: "use", id: event.data.alertId }],
          { relativeTo: this.activatedRoute }
        );
        break;
      case "link":
        // this.redirectToEdit(event.data);
        this.router.navigate(
          [`edit-alert-template`, { type: "view", id: event.data.alertId }],
          { relativeTo: this.activatedRoute }
        );
        break;
    }
  }
  redirectToEdit(data: any) {
    this.router.navigate(
      [`edit-alert-template`, { type: "edit", id: data.alertId }],
      { relativeTo: this.activatedRoute }
    );
  }
  templateClick(event: any) {
    this.router.navigate(
      [`use-alert-template`, { type: "use", id: event.data.alertId }],
      { relativeTo: this.activatedRoute }
    );
  }
  getArchivedEvent(e: any) {
    this.getAlertTemplates(e);
  }
}
