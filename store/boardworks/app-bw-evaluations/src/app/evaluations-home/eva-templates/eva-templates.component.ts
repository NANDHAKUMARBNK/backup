import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AlertsService } from "lib-bw-svc-apis/src/lib/alerts/alerts.service";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { EvaluationsService } from "lib-bw-svc-apis/src/lib/evaluations/evaluations.service";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";

@Component({
  selector: "app-eva-templates",
  templateUrl: "./eva-templates.component.html",
  styleUrls: ["./eva-templates.component.scss"],
})
export class EvaTemplatesComponent implements OnInit {
  actions: any = ["Edit", "Copy", "Use", "Delete"];
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
      title: "Evaluation Title",
      filterType: "text",
      component: "TwolinkTextName",
      isEnableColumnOptions: false,
    },
    {
      field: "createdDate",
      title: "DATE CREATED",
      filterType: "text",
      isEnableColumnOptions: false,
    },
 
    {
      field: "closingDate",
      title: "Closing Date",
      isEnableColumnOptions: false,
    },
    // {
    //   field: "linkPopup",
    //   title: " ",
    //   component: "linkPopup",
    //   isEnableColumnOptions: false,
    // },
    {
      field: "linkTextName",
      title: "ACTIONS",
      component: "action",
      isEnableColumnOptions: false,
    },
  ];
  gridData: any;
  userPermission: any;
  errMessage: any;
  isError: boolean = false;
  deleteEvaluation: boolean = false;
  selectedData: any;
  constructor(
    private alertService: AlertsService,
    private commonService: CommonService,
    private storage: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private evaluationsService: EvaluationsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getTemplates();
    this.userPermission = JSON.parse(this.storage.getData("userPermission"));
  }

  getTemplates(isArchived?: any) {
    this.evaluationsService.getTemplates().subscribe(
      (res: any) => {
        if (res) {
          res.result.filter((data: any) => {
            data["TwolinkTextName"] = data.title;
            data["linkTextName"] = "Edit";
            data["linkPopup"] = "VIEW RESPONSES";
            data["createdDate"] = this.commonService.formatDate(
              data.createdDate
            );
            data.count = data.responseCount +'/' + data.totalRecipients;
            data.closingDate = this.commonService.formatDate(data.closingDate);
          });
          this.gridData = res.result;
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
    if (event.action == "Copy") {
      this.router.navigate(["newEvaluation"], {
        relativeTo: this.activatedRoute,
        queryParams: { id: event.data.evaluationId, type: "copy" },
      });
    } else if (event.action == "Use") {
      this.router.navigate(["newEvaluation"], {
        relativeTo: this.activatedRoute,
        queryParams: { id: event.data.evaluationId, type: "use" },
      });
    } else if (event.action === "Edit") {
      this.router.navigate(["editEvaluation"], {
        relativeTo: this.activatedRoute,
        queryParams: { id: event.data.evaluationId, type: "template" },
      });
    } else if (event.action === "Delete") {
      this.deleteEvaluation = true;
      this.selectedData = event.data;
    } else {
    }
  }
  onClickLink(event: any) {
    /// TODO
    switch (event.type) {
      case "linkPopupContent":
        //this.getDocumentById(event.data);
        break;
      case "TwolinkTextName":
        this.redirectToEdit(event.data);
        break;
    }
  }
  redirectToEdit(data: any) {
    const { evaluationId, title }: any = data;
    this.router.navigate(
      [`view-evaluation`, { type: "view", id: evaluationId, title: title }],
      {
        relativeTo: this.activatedRoute,
      }
    );
  }
  
  linksModalAction(e: any) {
    if (e == "YES") {
      this.deleteEvaluationApi(this.selectedData.evaluationId);
    } else {
      this.deleteEvaluation = false;
    }
  }
  deleteEvaluationApi(id: any) {
    this.evaluationsService.deleteEvalution(id).subscribe((res: any) => {
      if (res) {
        this.deleteEvaluation = false;
        this.toastr.showToastr("success", "Evaluation Deleted Successfully!");
        this.getTemplates();
      }
    });
  }
}
