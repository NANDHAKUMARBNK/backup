import { CommonService } from "./../../../../lib-bw-svc-apis/src/lib/common/common.service";
import { ReferenceService } from "lib-bw-svc-apis/src/lib/reference/reference.service";
import { Component, Input, OnInit } from "@angular/core";
import { REFERENCE_TYPES } from "lib-bw-svc-apis/src/lib/constant/commonConstant";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogRef, DialogService } from "@progress/kendo-angular-dialog";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";
import { environment } from "environments/environment";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
@Component({
  selector: "app-signature-requests",
  templateUrl: "./signature-requests.component.html",
  styleUrls: ["./signature-requests.component.scss"],
})
export class SignatureRequestsComponent implements OnInit {
  @Input() tab: any;
  showDelete: boolean = false;
  type: any;
  actions: any = ["Send Reminder", "View", "Delete"];
  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: true,
    lock: false,
    stick: false,
  };
  gridData: any = [];
  columnsData: any = [
    {
      field: "TwolinkTextName",
      title: "Document Name",
      filterType: "text",
      component: "TwolinkTextName",
      isEnableColumnOptions: false,
    },
    {
      field: "requestSubject",
      title: "Request Subject",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "signaturesRequested",
      filterType: "text",
      title: "#Signature Requested",
      isEnableColumnOptions: false,
    },
    {
      field: "started",
      filterType: "text",
      title: "Started",
      isEnableColumnOptions: false,
    },
    {
      field: "status",
      filterType: "text",
      title: "Status",
      isEnableColumnOptions: false,
    },
    {
      field: "signaturesReceived",
      filterType: "text",
      title: "#Signature Received",
      isEnableColumnOptions: false,
    },
    {
      field: "action",
      title: "ACTIONS",
      component: "action",
      isEnableColumnOptions: false,
      linkClassName: "bw-font-sec-bold",
      buttonName: "Manage",
    },
  ];
  cellData: any;
  errMessage: any;
  isError: boolean = false;
  showRemainder: boolean = false;
  showTerminate: boolean = false;
  selectedRequest: any;
  showLoader: boolean = false;

  constructor(
    private referenceService: ReferenceService,
    private commonService: CommonService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: DialogRef,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private viewFileDocService: ViewFileDocService,
    private meetingService: MeetingsService
  ) { }

  ngOnInit(): void {
    this.getReferenceType();
    this.getSignatureRequests();
  }

  getReferenceType() {
    REFERENCE_TYPES.map((type) => {
      if (type.displayName == this.tab) {
        this.type = type.value;
      }
    });
  }

  getSignatureRequests() {
    this.referenceService.getSignatureRequests(this.type).subscribe(
      (res) => {
        if (res.result) {
          res.result.map((data: any) => {
            data["TwolinkTextName"] = data.document;
            data["linkText"] = data.document && true;
            data["started"] = this.commonService.formatDate(data.modifiedDate);
            if (data["status"] == "InProgress") {
              data["actions"] = ["Send Reminder", "Cancel", "View"];
            } else {
            }
          });
          this.gridData = res.result;
        }
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  getDocumentById(data: any) {
    //getReferenceDocument
    // this.referenceService.getDocuments(data.documentId).subscribe(
    //   (res) => {
    // let url: any = `${environment.baseUrl}${apiConstant.documentsCache}/${data.documentId}`;
    let url: any = ` ${environment.baseUrl}${apiConstant.references}/${this.tab === "DIRECTOR GUIDE"
        ? "DirectorsGuide"
        : this.tab === "GENERAL BOARD INFORMATION"
          ? "GeneralBoardInfo"
          : "CorporateInfo"
      }/Documents/${data.documentId}`;
    data.fileName = data.fileName;
    data.fileType = null;
    // this.viewFileDocService.viewfile(data, url);
    this.downloadDocuments(url, [], data);
    // },
    // (err: any) => {
    //   this.setError(err.error.result.errorMessages);
    // }
    // );
  }

  onClickLink(e: any) {
    switch (e.type) {
      case "TwolinkTextName":
        this.getDocumentById(e.data);
        break;
    }
  }

  onClickAction(e: any) {
    console.log(e);
    this.selectedRequest = e.data;
    let { action, data }: any = e;
    this.cellData = data;
    if (action === "View") {
      this.route.navigate(
        [
          `view-workflow`,
          {
            type: "view",
            id: data.infoSiteId,
            workflow: data.infoSiteWorkflowId,
            mode:
              this.tab === "DIRECTOR GUIDE"
                ? "DirectorsGuide"
                : this.tab === "GENERAL BOARD INFORMATION"
                  ? "GeneralBoardInfo"
                  : "CorporateInfo",
          },
        ],
        {
          relativeTo: this.activatedRoute,
        }
      );
    } else if (action === "Delete") {
      this.showDelete = true;
      this.showTerminate = false;
      this.showRemainder = false;
    } else if (action === "Send Reminder") {
      this.showRemainder = true;
      this.showDelete = false;
      this.showTerminate = false;
    } else if (action === "Cancel") {
      this.showTerminate = true;
      this.showDelete = false;
      this.showRemainder = false;
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  linksModalAction(type: any) {
    this.getReferenceType();
    if (type === "delete") {
      this.showTerminate = false;
      this.showRemainder = false;
      const { infoSiteId, infoSiteWorkflowId }: any = this.cellData;
      this.referenceService
        .deleteSignatureWorkflow(infoSiteId, infoSiteWorkflowId, this.type)
        .subscribe(
          (response: any) => {
            if (response) {
              this.showDelete = false;
              this.getSignatureRequests();
              this.toastr.showToastr(
                "success",
                "Signature Workflow Deleted Successfully!"
              );
              this.getSignatureRequests();
            }
          },
          (err: any) => {
            this.setError(err.error.result.errorMessages);
          }
        );
    } else if (type === "terminate") {
      // this.showDelete = false;
      // this.showRemainder = false;
      this.terminateWorkflow();
    } else if (type === "remainder") {
      // this.showTerminate = false;
      // this.showDelete = false;
      this.sendRemainder();
    } else {
      this.showTerminate = false;
      this.showRemainder = false;
      this.showDelete = false;
    }
  }
  terminateWorkflow() {
    this.referenceService
      .terminateSignatureWorkflow(
        this.selectedRequest.infoSiteId,
        this.selectedRequest.infoSiteWorkflowId,
        this.type
      )
      .subscribe(
        (response: any) => {
          if (response) {
            this.showTerminate = false;
            this.toastr.showToastr(
              "success",
              "Signature Workflow Cancelled Successfully!"
            );
            this.getSignatureRequests();
          }
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
          this.showTerminate = false;
        }
      );
  }
  sendRemainder() {
    this.referenceService
      .sendRemainderWorkflow(
        this.selectedRequest.infoSiteId,
        this.selectedRequest.infoSiteWorkflowId,
        this.type
      )
      .subscribe(
        (response: any) => {
          if (response) {
            this.showRemainder = false;
            this.toastr.showToastr("success", "Send Remainder Successfully!");
          }
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
          this.showRemainder = false;
        }
      );
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
