import { SurveysService } from './../../../../../lib-bw-svc-apis/src/lib/surveys/surveys.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'lib-bw-svc-apis/src/lib/common/common.service';
import { ToastrService } from 'lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';

@Component({
  selector: 'app-survey-summary',
  templateUrl: './survey-summary.component.html',
  styleUrls: ['./survey-summary.component.scss']
})
export class SurveySummaryComponent implements OnInit {
  actions: any =null;
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
  surveyId: any;
  title: any;
  canDeleteSummary: boolean = false;
  responseId: any;
  constructor(
    private surveyService: SurveysService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.surveyId = this.activatedRoute.snapshot.params.id;
    this.title = this.activatedRoute.snapshot.params.title;
  }

  ngOnInit(): void {
    this.getSurveySummaryList();
  }

  getSurveySummaryList() {
    this.surveyService.getSurveySummaryList(this.surveyId).subscribe(res => {
      if (res) {
        res.result.map((data: any) => {
          // data['isResponded'] = true;
          if (data['isResponded']) {
            data['actions'] = ['View', 'Delete'];
          } else {
            data['actions'] = null;
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
        this.router.navigate(['../view-survey-response'], {
          relativeTo: this.activatedRoute,
          queryParams: { id: event.data.recipientId, surveyId: this.surveyId, title: this.title }
        })
        break;
      case 'Delete':
        this.canDeleteSummary = true;
        this.responseId = event.data.recipientId;
        break;
    }

  }

  onClickLink(event: any) { }

  linksModalAction(e: any) {
    if (e.toLowerCase() == "yes") {
      this.deleteSurveyResponse(this.responseId);
    } else {
      this.canDeleteSummary = false;
    }
  }

  deleteSurveyResponse(id: any) {
    this.surveyService.deleteSurveyResponse(this.surveyId, id).subscribe((res: any) => {
      if (res) {
        this.canDeleteSummary = false;
        this.toastr.showToastr("success", "Responses Deleted Successfully!");
        this.getSurveySummaryList();
      }
    });
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

}
