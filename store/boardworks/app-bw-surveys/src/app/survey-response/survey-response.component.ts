import { SurveysService } from './../../../../lib-bw-svc-apis/src/lib/surveys/surveys.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-survey-response',
  templateUrl: './survey-response.component.html',
  styleUrls: ['./survey-response.component.scss']
})
export class SurveyResponseComponent implements OnInit {
  defaultItems: any = [
    {
      text: "Surveys",
      title: "Surveys",
    },
    {
      text: "Response",
      title: "Response",
    },
  ];
  errMessage: any;
  isError: boolean = false;
  surveyResponseForm: FormGroup;
  selectData = [{
    name: "Option 1",
    type: "1",
    selected: true
  }, {
    name: "Option 2",
    type: "2"
  }, {
    name: "Option 3",
    type: "3"
  },]
  radioData = [
    {
      name: "Option A",
      value: 'A',
      selected: true,
    },
    {
      name: "Option B",
      value: 'B',
      selected: false,
    },
    {
      name: "Option C",
      value: 'C',
      selected: false,
    },
    {
      name: "Option D",
      value: 'D',
      selected: false,
    },
    {
      name: "Option E",
      value: 'E',
      selected: false,
    },
  ];
  checkBoxData = [{
    name: "Option 1",
    value: "1",
    selected: false,
  }, {
    name: "Option 2",
    value: "2",
    selected: false,
  }, {
    name: "Option 3",
    value: "3",
    selected: false,
  }];
  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private surveyService: SurveysService
  ) {
    this.surveyResponseForm = this._formBuilder.group({
      question: ['']
    })
  }

  ngOnInit(): void {
    this.getSurveyData();
  }

  getSurveyData() {
    // this.surveyService.
  }

  onButtonClick(e: any, type: any) { }

  onChange(e: any) { }

  changeCheckbox(e: any) { }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  navigateInto(params: any) {
    if (params.text === "Surveys" || params.title === "Surveys") {
      this.location.back();
    }
  }

}
