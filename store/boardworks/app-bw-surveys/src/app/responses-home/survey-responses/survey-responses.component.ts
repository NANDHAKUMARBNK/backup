import { SurveysService } from './../../../../../lib-bw-svc-apis/src/lib/surveys/surveys.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-survey-responses',
  templateUrl: './survey-responses.component.html',
  styleUrls: ['./survey-responses.component.scss']
})
export class SurveyResponsesComponent implements OnInit {
  surveyData: any;
  surveyId: any;

  constructor(
    private surveyService: SurveysService,
    private activatedRoute: ActivatedRoute
  ) {
    this.surveyId = this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.getSurveyResponses();
  }

  getSurveyResponses() {
    this.surveyService.getSurveyResponses(this.surveyId).subscribe(res => {
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
            ansData['percentage'] = `${this.calculatePercentage(ansData.count, data.totalResponse)}%`;
          })
        })
        this.surveyData = res.result.responses;
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
