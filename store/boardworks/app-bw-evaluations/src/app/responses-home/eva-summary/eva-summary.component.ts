import { ToastrService } from 'lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';
import { CommonService } from 'lib-bw-svc-apis/src/lib/common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationsService } from 'lib-bw-svc-apis/src/lib/evaluations/evaluations.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eva-summary',
  templateUrl: './eva-summary.component.html',
  styleUrls: ['./eva-summary.component.scss']
})
export class EvaSummaryComponent implements OnInit {
  actions: any = ["View"];
  onCellClicked: any = [];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData = [
    {
      field: "recipientName",
      title: "Respondee",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "",
      iconClass: "checkbox-marked-circle icon-clr-eggplant icon-md-size cursor-pointer mb-2",
      title: "Response Received",
      showIcon: false,
      isEnableColumnOptions: false,
      component: "iconAction",
    },
    {
      field: "displayDate",
      title: "Date | Time Response Received",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "linkTextName",
      title: "",
      component: "action",
      isEnableColumnOptions: false,
      linkClassName: "bw-font-sec-bold",
      buttonName: "Manage",
    },
  ];
  gridData: any = [];
  errMessage: any;
  isError: boolean = false;
  evalId: any;
  title: any;
  canDeleteSummary: boolean = false;
  responseId: any;
  constructor(
    private evaluationService: EvaluationsService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.evalId = this.activatedRoute.snapshot.params.id;
    this.title = this.activatedRoute.snapshot.params.title;
  }

  ngOnInit(): void {
    this.getEvaluationSummaryList();
  }

  getEvaluationSummaryList() {
    this.evaluationService.getEvaluationSummaryList(this.evalId).subscribe(res => {
      if (res) {
        res.result.map((data: any) => {
          // data['isResponded'] = true;
          if (data['isResponded']) {
            this.actions = ['View', 'Delete'];
          }
          data['showIcon'] = data['isResponded'];
          const responseDate = data['responseDate'] !== null ? new Date(data['responseDate']) : null;
          data['displayDate'] = data['responseDate'] !== null ? this.commonService.formatDate(responseDate, 'dateWithPipeTime') : null;
        })
        this.gridData = res.result;
      }
    })
  }

  onClickAction(event: any) {
    console.log(event);
    switch (event.action) {
      case 'View':
        this.router.navigate(['../view-eval-response'], { relativeTo: this.activatedRoute, 
          queryParams: { id: event.data.recipientId, evalId: this.evalId, title: this.title } })
        break;
      case 'Delete':
        this.canDeleteSummary = true;
        // this.deleteEvaluationResponse(event.data.recipientId);
        this.responseId = event.data.recipientId;
        break;
    }

  }

  onClickLink(event: any) { }

  linksModalAction(e: any) {
    if (e == "YES") {
      this.deleteEvaluationResponse(this.responseId);
    } else {
      this.canDeleteSummary = false;
    }
  }

  deleteEvaluationResponse(id: any) {
    this.evaluationService.deleteEvaluationResponse(this.evalId, id).subscribe((res: any) => {
      if (res) {
        this.canDeleteSummary = false;
        this.toastr.showToastr("success", "Responses Deleted Successfully!");
        this.getEvaluationSummaryList();
      }
    });
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

}
