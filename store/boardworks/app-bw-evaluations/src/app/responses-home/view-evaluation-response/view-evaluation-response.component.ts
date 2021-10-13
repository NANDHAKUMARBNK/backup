import { EvaluationsService } from 'lib-bw-svc-apis/src/lib/evaluations/evaluations.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-view-evaluation-response',
  templateUrl: './view-evaluation-response.component.html',
  styleUrls: ['./view-evaluation-response.component.scss']
})
export class ViewEvaluationResponseComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "Evaluations",
      title: "Evaluations",
    },
    {
      text: "Results",
      title: "Results",
    },
  ];
  title: any;
  evalId: any;
  recipientId: any;
  questionsList: any = [];
  answersList: any = [];
  evaluationData: any;
  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private evaluationService: EvaluationsService
  ) {
    this.title = this.activatedRoute.snapshot.queryParams.title;
    this.evalId = this.activatedRoute.snapshot.queryParams.evalId;
    this.recipientId = this.activatedRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.getEvaluationResponse();
  }

  getEvaluationResponse() {
    this.evaluationService.getEvaluationIndividualResponse(this.evalId, this.recipientId).subscribe(res => {
      if (res) {
        this.evaluationData = res.result;
      }
    })
  }

  export(event: any, type: any) { }

  navigateInto(params: any) {
    const { text, title }: any = params;
    if (text === "Evaluations" || title === "Evaluations") {
      this.location.back();
    }
  }

}
