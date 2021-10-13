import { SurveysService } from "./../../../../lib-bw-svc-apis/src/lib/surveys/surveys.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { Location } from "@angular/common";
import { EVALUATION_QUESTIONS_TYPE } from "lib-bw-svc-apis/src/lib/constant/commonConstant";

@Component({
  selector: "app-view-survey",
  templateUrl: "./view-survey.component.html",
  styleUrls: ["./view-survey.component.scss"],
})
export class ViewSurveyComponent implements OnInit {
  defaultItems: any = [
    {
      text: "Surveys",
      title: "Surveys",
    },
  ];
  headerName: any;
  questionForm: FormGroup;
  type: any;
  textElement: any;
  textAreaElement: any;
  items: any;
  checkboxElement: any;
  mappedData: any = [];
  booleanRadios: any = [
    {
      name: "Yes",
      value: "true",
      selected: false,
    },
    {
      name: "No",
      value: "false",
      selected: false,
    },
  ];
  checkboxInfo: any;
  radioInfo: any;
  surveyId: any;
  errMessage: any;
  isError: boolean = false;
  showButton: boolean = false;
  constructor(
    private _formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private surveyService: SurveysService,
    private toastr: ToastrService,
    private location: Location
  ) {
    const {
      snapshot: {
        params: { type, title, id },
      },
    }: any = this.activateRoute;
    this.questionForm = this._formBuilder.group({
      opinion: [""],
      checkbox: [""],
      pickDateTime: [""],
      yesOrNo: [""],
      content: [""],
      integer: [""],
      textarea: [""],
      combo: [""],
      radioSub: [""],
    });
    this.type = type;
    this.headerName = title;
    if (this.headerName) {
      this.defaultItems = [
        ...this.defaultItems,
        ...[{ title: this.headerName, text: this.headerName }],
      ];
    }
    this.surveyId = id;
    this.getQuestionsById(this.surveyId);
  }

  ngOnInit(): void {}

  async handleClick(e: any) {
    if (e === "save") {
      let payloadArr: any = [];
      this.items.map((it: any) => {
        payloadArr.push({
          questionId: it.questionId,
          response: it.response ? it.response : it.questionData.defaultValue,
        });
      });
      const requestBody: any = {
        questionResponses: payloadArr,
      };
      await this.surveyService
        .createResponseById(this.surveyId, requestBody)
        .subscribe(
          (response: any) => {
            console.log(response);
            if (response.result) {
              this.toastr.showToastr("success", "Responded Successfully!");
              this.location.back();
            }
          },
          (err: any) => {
            this.setError(err.error.result.errorMessages);
          }
        );
    } else {
      this.location.back();
    }
  }

  changeRadio(e: any, params: any) {
    const { questionId }: any = params;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.questionId === questionId) {
          item["response"] = e;
        }
      });
    }
  }

  changeCheckbox(e: any, params: any) {
    const { questionId }: any = params;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.questionId === questionId) {
          let q: any = "";
          if (e && e.length > 0) {
            e.map((el: any, i: any) => {
              if (i == e.length - 1) {
                q += `${el.name}`;
              } else {
                q += `${el.name},`;
              }
            });
          }
          item["response"] = q;
        }
      });
    }
  }

  comboChange(e: any, params: any) {
    const { questionId }: any = params;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.questionId === questionId) {
          item["response"] = e;
        }
      });
    }
  }

  changeRadioSub(e: any, params: any) {
    const { questionId }: any = params;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.questionId === questionId) {
          item["response"] = e;
        }
      });
    }
  }
  order(params: any) {
    return `${params} .`;
  }

  inputChange(params: any) {
    console.log(params, "Hello");
    const { questionId }: any = params;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.questionId === questionId) {
          item["response"] = this.questionForm.get("content")?.value;
        }
      });
    }
  }

  noteChange(params: any) {
    console.log(params, "Hi");
    const { questionId }: any = params;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.questionId === questionId) {
          item["response"] = this.questionForm.get("textarea")?.value;
        }
      });
    }
  }

  dateChange(params: any) {
    const { questionId }: any = params;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.questionId === questionId) {
          item["response"] = this.questionForm.get("pickDateTime")?.value;
        }
      });
    }
  }

  numberChange(params: any) {
    const { questionId }: any = params;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.questionId === questionId) {
          item["response"] = this.questionForm.get("integer")?.value;
        }
      });
    }
  }

  loopForChildQuestions(data: any) {
    data.childQuestions.map((subInfo: any) => {
      this.mappedData.push(subInfo);
      if (subInfo.childQuestions && subInfo.childQuestions.length > 0) {
        this.loopForChildQuestions(subInfo);
      }
    });
  }

  getQuestionsById(id: any) {
    this.surveyService
      .getSurveyQuestionsBasedOnId(id)
      .subscribe((response: any) => {
        if (response.result) {
          if (response.result && response.result.length > 0) {
            this.showButton = true;
            if (response.result) {
              response.result.filter((res: any) => {
                if (res.childQuestions && res.childQuestions.length > 0) {
                  this.loopForChildQuestions(res);
                }
              });
              this.mappedData.map((result: any) => {
                response.result.push(result);
              });
              response.result.map((item: any) => {
                if (
                  item.type.toLowerCase() ===
                    EVALUATION_QUESTIONS_TYPE.text.toLowerCase() &&
                  item.questionData.defaultValue
                ) {
                  this.questionForm.patchValue({
                    content: item.questionData.defaultValue,
                  });
                }
                if (
                  item.type.toLowerCase() ===
                    EVALUATION_QUESTIONS_TYPE.textArea.toLowerCase() &&
                  item.questionData.defaultValue
                ) {
                  this.questionForm.patchValue({
                    textarea: item.questionData.defaultValue,
                  });
                }
                if (
                  item.type.toLowerCase() ===
                    EVALUATION_QUESTIONS_TYPE.checkbox.toLowerCase() &&
                  item.questionData.defaultValue
                ) {
                  this.questionForm.patchValue({
                    checkbox: item.questionData.defaultValue,
                  });
                }
                if (
                  item.type.toLowerCase() ===
                    EVALUATION_QUESTIONS_TYPE.dateTimePicker.toLowerCase() &&
                  item.questionData.defaultValue
                ) {
                  this.questionForm.patchValue({
                    pickDateTime: item.questionData.defaultValue,
                  });
                }
                if (
                  item.type.toLowerCase() ===
                    EVALUATION_QUESTIONS_TYPE.opinion.toLowerCase() &&
                  item.questionData.defaultValue
                ) {
                  this.questionForm.patchValue({
                    opinion: item.questionData.defaultValue,
                  });
                }
                if (
                  item.type.toLowerCase() ===
                    EVALUATION_QUESTIONS_TYPE.boolean.toLowerCase() &&
                  item.questionData.defaultValue
                ) {
                  this.questionForm.patchValue({
                    yesOrNo: item.questionData.defaultValue
                      .toString()
                      .toLowerCase(),
                  });
                }
                if (
                  item.type.toLowerCase() ===
                    EVALUATION_QUESTIONS_TYPE.textSingleLine.toLowerCase() &&
                  item.questionData.defaultValue
                ) {
                  this.questionForm.patchValue({
                    content: item.questionData.defaultValue,
                  });
                }
                if (
                  item.type.toLowerCase() ===
                    EVALUATION_QUESTIONS_TYPE.textMultiLine.toLowerCase() &&
                  item.questionData.data &&
                  item.questionData.data.length > 0
                ) {
                  let custom: any = item.questionData.data.map((c: any) => {
                    return c;
                  });
                  this.questionForm.patchValue({
                    textarea: custom,
                  });
                }
                if (
                  item.type.toLowerCase() ===
                    EVALUATION_QUESTIONS_TYPE.date.toLowerCase() &&
                  item.questionData.defaultValue
                ) {
                  this.questionForm.patchValue({
                    integer: item.questionData.defaultValue,
                  });
                }
                if (
                  item.type.toLowerCase() ===
                    EVALUATION_QUESTIONS_TYPE.number.toLowerCase() &&
                  item.questionData.defaultValue
                ) {
                  this.questionForm.patchValue({
                    pickDateTime: item.questionData.defaultValue,
                  });
                }
                if (
                  item.questionData.data &&
                  item.questionData.data.length > 0
                ) {
                  let custom: any = item.questionData.data.map((c: any) => {
                    return {
                      name: c,
                      value: c,
                      selected: false,
                    };
                  });
                  item.questionData.data = custom;
                }
              });
            }
            this.items = response.result;
          }
        }
      });
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  navigateInto(params: any) {
    const { text, title }: any = params;
    if (text === "Surveys" || title === "Surveys") {
      this.location.back();
    }
  }
}
