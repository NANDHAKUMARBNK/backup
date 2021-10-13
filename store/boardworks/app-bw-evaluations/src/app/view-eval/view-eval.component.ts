import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { EvaluationsService } from "lib-bw-svc-apis/src/lib/evaluations/evaluations.service";
import { EVALUATION_QUESTIONS_TYPE } from "../../../../lib-bw-svc-apis/src/lib/constant/commonConstant";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
@Component({
  selector: "app-view-eval",
  templateUrl: "./view-eval.component.html",
  styleUrls: ["./view-eval.component.scss"],
})
export class ViewEvalComponent implements OnInit {
  defaultItems: any = [
    {
      text: "Evaluations",
      title: "Evaluations",
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
  evaId: any;
  errMessage: any;
  isError: boolean = false;
  formValues: any;

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private location: Location,
    private evaluationsService: EvaluationsService,
    private toastr: ToastrService
  ) {
    const {
      snapshot: {
        params: { type, title, id },
      },
    }: any = this.activateRoute;

    this.questionForm = this.fb.group({
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

    this.evaId = id;
    this.getQuestionsById(this.evaId);
  }

  ngOnInit(): void { }

  ngOnChanges(): void {
    console.log(this.questionForm.value);    
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  navigateInto(params: any) {
    const { text, title }: any = params;
    if (text === "Evaluations" || title === "Evaluations") {
      this.location.back();
    }
  }

  async handleClick(e: any) {
    if (e === "save") {
      let payloadArr: any = [];
      this.items.map((it: any) => {
        payloadArr.push({
          questionId: it.evaluationQuestionId,
          questionName: it.question,
          response: it.response ? it.response : it.data.default,
        });
      });
      const requestBody: any = {
        questionResponses: payloadArr,
      };
      await this.evaluationsService
        .postResponseById(this.evaId, requestBody)
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

  changeRadio(e: any, params?: any) {
    this.formValues = this.questionForm.value
    console.log(e, params);    
    const { evaluationQuestionId }: any = params.e.evaluationQuestionId;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.evaluationQuestionId === params.e.evaluationQuestionId) {
          item["response"] = e;
        }
      });
    }
  }

  changeCheckbox(event: any, params?: any) {
    this.formValues = this.questionForm.value
    console.log(event, params);
    const { evaluationQuestionId }: any = event.e;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.evaluationQuestionId === event.e.evaluationQuestionId) {
          let q: any = "";
          if (event && event.length > 0) {
            event.map((el: any, i: any) => {
              if (i == event.length - 1) {
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

  comboChange(event: any, params?: any) {
    this.formValues = this.questionForm.value
    console.log(event, params);
    const { evaluationQuestionId }: any = event.e;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.evaluationQuestionId === event.e.evaluationQuestionId) {
          item["response"] = event.e;
        }
      });
    }
  }

  changeRadioSub(event: any) {
    this.formValues.radioSub = event.e
    console.log(event);
    // const { evaluationQuestionId }: any = event;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.evaluationQuestionId === event.value.evaluationQuestionId) {
          item["response"] = event.e;
        }
      });
    }
  }
  order(params: any) {
    return `${params} .`;
  }

  inputChange(params: any) {
    this.formValues = this.questionForm.value
    const { evaluationQuestionId }: any = params.e;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.evaluationQuestionId === params.e.evaluationQuestionId) {
          item["response"] = params.value.content;
        }
      });
    }
  }

  noteChange(params: any) {
    this.formValues.textarea = params.value.textarea
    console.log(params);
    const { evaluationQuestionId }: any = params.e;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.evaluationQuestionId === params.e.evaluationQuestionId) {
          item["response"] = params.value.textarea;
        }
      });
    }
  }

  dateChange(params: any) {
    this.formValues.pickDateTime = params.value.pickDateTime
    console.log(params);
    const { evaluationQuestionId }: any = params.e;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.evaluationQuestionId === params.e.evaluationQuestionId) {
          item["response"] = params.value.pickDateTime;
        }
      });
    }
  }

  numberChange(params: any) {
    this.formValues.integer = params.value.integer
    console.log(params, this.questionForm, this.formValues, this.items);   
    const { evaluationQuestionId }: any = params.e;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.evaluationQuestionId === params.e.evaluationQuestionId) {
          item["response"] = params.value.integer;
        }
      });
    }
  }

  loopForChildQuestions(evaluationQuestionItems: any, data?: any) {
    // data.childQuestions.map((subInfo: any) => {
    //   this.mappedData.push(subInfo);
    //   if (subInfo.childQuestions && subInfo.childQuestions.length > 0) {
    //     this.loopForChildQuestions(subInfo);
    //   }
    // });
    this.mapEvalQuestionItems(evaluationQuestionItems);
    evaluationQuestionItems.map((item: any) => {
      if (item.childQuestions && item.childQuestions.length > 0) {
        this.loopForChildQuestions(item.childQuestions);
      }
    })
  }

  getQuestionsById(id: any) {
    this.evaluationsService
      .getQuestionsBasedOnId(id)
      .subscribe((response: any) => {
        if (response) {
          const {
            result: { evaluationQuestionItems },
          }: any = response;
          if (evaluationQuestionItems && evaluationQuestionItems.length > 0) {
            if (evaluationQuestionItems) {
              evaluationQuestionItems.filter((res: any) => {
                this.mapFormWithItem(res);
                if (res.childQuestions && res.childQuestions.length > 0) {
                  // this.loopForChildQuestions(res);
                }
              });
              this.mappedData.map((result: any) => {
                evaluationQuestionItems.push(result);
              });
              this.loopForChildQuestions(evaluationQuestionItems);
              // this.mapEvalQuestionItems(evaluationQuestionItems);
              // evaluationQuestionItems.map((item: any) => {
              //   this.mapEvalQuestionItems(item.childQuestions);
              // })
            }
            console.log(evaluationQuestionItems);
            this.items = evaluationQuestionItems;
          }
        }
      });
  }

  mapFormWithItem(item: any) {
    if (item.type === 'Text') {
      item['formGroupValueName'] = 'content'
    } else if (item.type === 'Choice' &&
    item.data.subType !== 'Combo' &&
    item.data.subType !== 'Radio') {
      item['formGroupValueName'] = 'checkbox'
    } else if (item.type === 'Opinion') {
      item['formGroupValueName'] = 'opinion'
    } else if (item.type === 'Boolean') {
      item['formGroupValueName'] = 'yesOrNo'
    } else if (item.type === 'Note') {
      item['formGroupValueName'] = 'textarea'
    } else if (item.type === 'DateTime') {
      item['formGroupValueName'] = 'pickDateTime'
    } else if (item.type === 'Number') {
      item['formGroupValueName'] = 'integer'
    } else if (item.type === 'Choice' && item.data.subType === 'Combo') {
      item['formGroupValueName'] = 'combo'
    } else if (item.type === 'Choice' && item.data.subType === 'Radio') {
      item['formGroupValueName'] = 'radioSub'
    }
  }

  mapEvalQuestionItems(items: any) {
    if (items) {
      items.map((item: any) => {
        if (
          item.type.toLowerCase() ===
          EVALUATION_QUESTIONS_TYPE.text.toLowerCase() &&
          item.data.default
        ) {
          this.questionForm.patchValue({
            content: item.data.default,
          });
        }
        if (
          item.type.toLowerCase() ===
          EVALUATION_QUESTIONS_TYPE.textArea.toLowerCase() &&
          item.data.default
        ) {
          this.questionForm.patchValue({
            textarea: item.data.default,
          });
        }
        if (
          item.type.toLowerCase() ===
          EVALUATION_QUESTIONS_TYPE.checkbox.toLowerCase() &&
          item.data.default
        ) {
          this.questionForm.patchValue({
            checkbox: item.data.default,
          });
        }
        if (
          item.type.toLowerCase() ===
          EVALUATION_QUESTIONS_TYPE.dateTimePicker.toLowerCase() &&
          item.data.default
        ) {
          this.questionForm.patchValue({
            pickDateTime: item.data.default,
          });
        }
        if (
          item.type.toLowerCase() ===
          EVALUATION_QUESTIONS_TYPE.opinion.toLowerCase() &&
          item.data.default
        ) {
          this.questionForm.patchValue({
            opinion: item.data.default,
          });
        }
        if (
          item.type.toLowerCase() ===
          EVALUATION_QUESTIONS_TYPE.boolean.toLowerCase() &&
          item.data.default
        ) {
          this.questionForm.patchValue({
            yesOrNo: item.data.default.toString().toLowerCase(),
          });
        }
        if (
          item.type.toLowerCase() ===
          EVALUATION_QUESTIONS_TYPE.number.toLowerCase() &&
          item.data.default
        ) {
          this.questionForm.patchValue({
            integer: item.data.default,
          });
        }
        if (item.data.choices && item.data.choices.length > 0) {
          let custom: any = item.data.choices.map((c: any) => {
            return {
              name: c,
              value: c,
              selected: false,
            };
          });
          item.data.choices = custom;
        }
      });
      this.formValues = this.questionForm.value
    }
  }
}
