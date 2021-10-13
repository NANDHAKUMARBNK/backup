import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SurveysService} from 'lib-bw-svc-apis/src/lib/surveys/surveys.service';
import { Location } from "@angular/common";

@Component({
  selector: 'app-view-survey-response',
  templateUrl: './view-survey-response.component.html',
  styleUrls: ['./view-survey-response.component.scss']
})
export class ViewSurveyResponseComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "Survey",
      title: "Survey",
    },
    {
      text: "Results",
      title: "Results",
    },
  ];
  title: any;
  surveyId: any;
  recipientId: any;
  questionsList: any = [];
  answersList: any = [];
  surveyData: any;
  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private surveyService: SurveysService
  ) {
    this.title = this.activatedRoute.snapshot.queryParams.title;
    this.surveyId = this.activatedRoute.snapshot.queryParams.surveyId;
    this.recipientId = this.activatedRoute.snapshot.queryParams.id;
  }

  ngOnInit(): void {
    this.getsurveyResponse();
  }

  getsurveyResponse() {
    this.surveyService.getsurveyIndividualResponse(this.surveyId, this.recipientId).subscribe(res => {
      if (res) {
        this.surveyData = res.result;
      }
    })
  }

  export(event: any, type: any) { }

  navigateInto(params: any) {
    const { text, title }: any = params;
    if (text === "surveys" || title === "surveys") {
      this.location.back();
    }
  }

}

