import { ActivatedRoute } from '@angular/router';
import { EvaluationsService } from 'lib-bw-svc-apis/src/lib/evaluations/evaluations.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eva-responses',
  templateUrl: './eva-responses.component.html',
  styleUrls: ['./eva-responses.component.scss']
})
export class EvaResponsesComponent implements OnInit {
  evaluationData: any;
  evalId: any;

  constructor(
    private evaluationService: EvaluationsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.evalId = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getEvaluationResponses();
  }

  getEvaluationResponses() {
    this.evaluationService.getEvaluationResponses(this.evalId).subscribe(res => {
      let result;
      if (res) {
        result = res.result.responses;
        result.map((data: any, index: any) => {
          if (data.childQuestionResponse && data.childQuestionResponse.length && data.childQuestionResponse.length > 0) {
            data.childQuestionResponse.map((child: any) => {
              res.result.responses.splice(index + 1, 0, child);
            })
          }
        })
        res.result.responses.map((data: any) => {
          data.answers.map((ansData: any) => {
            let per = this.calculatePercentage(ansData.count, data.totalResponse);
            ansData['percentage'] = `${per > 100 ? 100 : per}%`;
          })
        })
        this.evaluationData = res.result.responses;
      }
    })
  }

  calculatePercentage(count: any, total: any) {
    return (count / total) * 100;
  }

  order(params: any) {
    return `${params}. `;
  }

}
