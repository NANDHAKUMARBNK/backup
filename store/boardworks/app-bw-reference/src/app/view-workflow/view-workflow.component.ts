import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ReferenceService } from "lib-bw-svc-apis/src/lib/reference/reference.service";
import { Location } from "@angular/common";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
@Component({
  selector: "app-view-workflow",
  templateUrl: "./view-workflow.component.html",
  styleUrls: ["./view-workflow.component.scss"],
})
export class ViewWorkflowComponent implements OnInit {
  onCellClicked: any = [];
  type: any;
  infoSited: any;
  workflow: any;
  mode: any;
  showTerminate: boolean = false;
  showRemainder: boolean = false;
  headerName: any = "Documents";
  requestSubject: any = "";
  description: any = "";
  dueDate: any = "";
  signedOrder: any = "";
  status: any = "";
  isEnableSelectAll: boolean = false;
  isShowCheckbox: boolean = false;
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "displayName",
      title: "REQUEST",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "status",
      title: "STATUS",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "completedOn",
      title: "COMPLETED ON",
      filterType: "text",
      isEnableColumnOptions: false,
    },

    {
      field: "ip",
      title: "",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "ip",
    },
  ];
  rowData: any;
  errMessage: any;
  isError: boolean = false;
  showLoader: boolean = false;
  constructor(
    private activateRoute: ActivatedRoute,
    private referenceService: ReferenceService,
    private location: Location,
    private toastr: ToastrService
  ) {
    this.type = this.activateRoute.snapshot.params.type;
    this.infoSited = this.activateRoute.snapshot.params.id;
    this.workflow = this.activateRoute.snapshot.params.workflow;
    this.mode = this.activateRoute.snapshot.params.mode;
  }

  ngOnInit(): void {
    if (this.type === "view") {
      this.getWorkflowDetails(this.infoSited, this.workflow, this.mode);
    }
  }

  getWorkflowDetails(id: any, workId: any, mode: any) {
    this.referenceService.getSignatureWorkflow(id, workId, mode).subscribe(
      (response: any) => {
        let {
          result: { workflowItem, workflowTaskItem },
        }: any = response;
        if (workflowItem) {
          let { subject, description, dueDate, status, assignRequests }: any =
            workflowItem;
          this.requestSubject = subject;
          this.description = description;
          this.dueDate = dueDate;
          this.signedOrder = assignRequests;
          this.status = status;
        }
        if (
          workflowTaskItem &&
          workflowTaskItem.length &&
          workflowTaskItem.length > 0
        ) {
          this.rowData = workflowTaskItem;
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

  sendRemainder() {
    this.showLoader = true;
    this.referenceService
      .sendRemainderWorkflow(this.infoSited, this.workflow, this.mode)
      .subscribe(
        (response: any) => {
          if (response) {
            this.showLoader = false;
            this.showRemainder = false;
            this.toastr.showToastr("success", "Send Remainder Successfully!");
          }
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
          this.showRemainder = false;
          this.showLoader = false;
        }
      );
  }

  terminateWorkflow() {
    this.referenceService
      .terminateSignatureWorkflow(this.infoSited, this.workflow, this.mode)
      .subscribe(
        (response: any) => {
          if (response) {
            this.showTerminate = false;
            this.toastr.showToastr(
              "success",
              "Signature Workflow Terminated Successfully!"
            );
            this.getWorkflowDetails(this.infoSited, this.workflow, this.mode);
          }
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
          this.showTerminate = false;
        }
      );
  }

  actionButton(type: any) {
    if (type === "back") {
      this.location.back();
    } else if (type === "cancel") {
      this.showTerminate = true;
      this.showRemainder = false;
    } else if (type === "remainder") {
      this.showTerminate = false;
      this.showRemainder = true;
    } else {
    }
  }

  linksModalAction(type: any) {
    if (type === "cancel") {
      this.showTerminate = false;
      this.showRemainder = false;
    } else if (type === "terminate") {
      this.terminateWorkflow();
    } else if (type === "remainder") {
      this.showLoader = true;
      this.sendRemainder();
    } else {
    }
  }
}
