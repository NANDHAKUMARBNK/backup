import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { EVALUATION_QUESTIONS_TYPE } from "lib-bw-svc-apis/src/lib/constant/commonConstant";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { VotingsServiceService } from "lib-bw-svc-apis/src/lib/votings/votings-service.service";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";
import { environment } from "environments/environment";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
@Component({
  selector: "app-view-votings",
  templateUrl: "./view-votings.component.html",
  styleUrls: ["./view-votings.component.scss"],
})
export class ViewVotingsComponent implements OnInit {
  defaultItems: any = [
    {
      text: "Votings",
      title: "Votings",
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
  voteId: any;
  errMessage: any;
  isError: boolean = false;
  docItems: any;
  showLoader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private location: Location,
    private votingService: VotingsServiceService,
    private toastr: ToastrService,
    private viewFileDocService: ViewFileDocService,
    private meetingService: MeetingsService
  ) {
    const {
      snapshot: {
        params: { type, title, id },
      },
    }: any = this.activateRoute;

    this.questionForm = this.fb.group({
      // opinion: [""],
      // checkbox: [""],
      // pickDateTime: [""],
      // yesOrNo: [""],
      // content: [""],
      // integer: [""],
      // textarea: [""],
      combo: [""],
      // radioSub: [""],
      supportDocuments: [[]],
    });

    this.type = type;
    this.headerName = title;

    if (this.headerName) {
      this.defaultItems = [
        ...this.defaultItems,
        ...[{ title: this.headerName, text: this.headerName }],
      ];
    }

    this.voteId = id;
    this.getQuestionsById(this.voteId);
  }

  ngOnInit(): void {}

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  navigateInto(params: any) {
    const { text, title }: any = params;
    if (text === "Votings" || title === "Votings") {
      this.location.back();
    }
  }

  async handleClick(e: any) {
    if (e === "save") {
      let payloadArr: any = [];
      this.items.map((it: any) => {
        payloadArr.push({
          questionId: it.questionId,
          questionName: it.question,
          response: it.response ? it.response : "",
        });
      });
      const requestBody: any = {
        responses: payloadArr,
      };
      await this.votingService
        .postResponseById(this.voteId, requestBody)
        .subscribe(
          (response: any) => {
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

  // changeRadio(e: any, params: any) {
  //   const { evaluationQuestionId }: any = params;
  //   if (this.items) {
  //     this.items.map((item: any) => {
  //       if (item.evaluationQuestionId === evaluationQuestionId) {
  //         item["response"] = e;
  //       }
  //     });
  //   }
  // }

  // changeCheckbox(e: any, params: any) {
  //   const { evaluationQuestionId }: any = params;
  //   if (this.items) {
  //     this.items.map((item: any) => {
  //       if (item.evaluationQuestionId === evaluationQuestionId) {
  //         let q: any = "";
  //         if (e && e.length > 0) {
  //           e.map((el: any, i: any) => {
  //             if (i == e.length - 1) {
  //               q += `${el.name}`;
  //             } else {
  //               q += `${el.name},`;
  //             }
  //           });
  //         }
  //         item["response"] = q;
  //       }
  //     });
  //   }
  // }

  comboChange(e: any, params: any) {
    const { questionId, votingId }: any = params;
    if (this.items) {
      this.items.map((item: any) => {
        if (item.questionId === questionId) {
          item["response"] = e;
        }
      });
    }
  }

  // changeRadioSub(e: any, params: any) {
  //   const { evaluationQuestionId }: any = params;
  //   if (this.items) {
  //     this.items.map((item: any) => {
  //       if (item.evaluationQuestionId === evaluationQuestionId) {
  //         item["response"] = e;
  //       }
  //     });
  //   }
  // }
  order(params: any) {
    return `${params} .`;
  }

  // inputChange(params: any) {
  //   const { evaluationQuestionId }: any = params;
  //   if (this.items) {
  //     this.items.map((item: any) => {
  //       if (item.evaluationQuestionId === evaluationQuestionId) {
  //         item["response"] = this.questionForm.get("content")?.value;
  //       }
  //     });
  //   }
  // }

  // noteChange(params: any) {
  //   const { evaluationQuestionId }: any = params;
  //   if (this.items) {
  //     this.items.map((item: any) => {
  //       if (item.evaluationQuestionId === evaluationQuestionId) {
  //         item["response"] = this.questionForm.get("textarea")?.value;
  //       }
  //     });
  //   }
  // }

  // dateChange(params: any) {
  //   const { evaluationQuestionId }: any = params;
  //   if (this.items) {
  //     this.items.map((item: any) => {
  //       if (item.evaluationQuestionId === evaluationQuestionId) {
  //         item["response"] = this.questionForm.get("pickDateTime")?.value;
  //       }
  //     });
  //   }
  // }

  // numberChange(params: any) {
  //   const { evaluationQuestionId }: any = params;
  //   if (this.items) {
  //     this.items.map((item: any) => {
  //       if (item.evaluationQuestionId === evaluationQuestionId) {
  //         item["response"] = this.questionForm.get("integer")?.value;
  //       }
  //     });
  //   }
  // }

  // loopForChildQuestions(data: any) {
  //   data.childQuestions.map((subInfo: any) => {
  //     this.mappedData.push(subInfo);
  //     if (subInfo.childQuestions && subInfo.childQuestions.length > 0) {
  //       this.loopForChildQuestions(subInfo);
  //     }
  //   });
  // }

  getQuestionsById(id: any) {
    this.votingService.getQuestionsBasedOnId(id).subscribe((response: any) => {
      if (response) {
        const {
          result: { questions, documents },
        }: any = response;
        if (questions && questions.length > 0) {
          // if (questions) {
          //   questions.filter((res: any) => {
          //     if (res.childQuestions && res.childQuestions.length > 0) {
          //       this.loopForChildQuestions(res);
          //     }
          //   });
          //   this.mappedData.map((result: any) => {
          //     questions.push(result);
          //   });
          //   questions.map((item: any) => {
          //     if (
          //       item.type.toLowerCase() ===
          //         EVALUATION_QUESTIONS_TYPE.text.toLowerCase() &&
          //       item.data.default
          //     ) {
          //       this.questionForm.patchValue({
          //         content: item.data.default,
          //       });
          //     }
          //     if (
          //       item.type.toLowerCase() ===
          //         EVALUATION_QUESTIONS_TYPE.textArea.toLowerCase() &&
          //       item.data.default
          //     ) {
          //       this.questionForm.patchValue({
          //         textarea: item.data.default,
          //       });
          //     }
          //     if (
          //       item.type.toLowerCase() ===
          //         EVALUATION_QUESTIONS_TYPE.checkbox.toLowerCase() &&
          //       item.data.default
          //     ) {
          //       this.questionForm.patchValue({
          //         checkbox: item.data.default,
          //       });
          //     }
          //     if (
          //       item.type.toLowerCase() ===
          //         EVALUATION_QUESTIONS_TYPE.dateTimePicker.toLowerCase() &&
          //       item.data.default
          //     ) {
          //       this.questionForm.patchValue({
          //         pickDateTime: item.data.default,
          //       });
          //     }
          //     if (
          //       item.type.toLowerCase() ===
          //         EVALUATION_QUESTIONS_TYPE.opinion.toLowerCase() &&
          //       item.data.default
          //     ) {
          //       this.questionForm.patchValue({
          //         opinion: item.data.default,
          //       });
          //     }
          //     if (
          //       item.type.toLowerCase() ===
          //         EVALUATION_QUESTIONS_TYPE.boolean.toLowerCase() &&
          //       item.data.default
          //     ) {
          //       this.questionForm.patchValue({
          //         yesOrNo: item.data.default.toString().toLowerCase(),
          //       });
          //     }
          //     if (
          //       item.type.toLowerCase() ===
          //         EVALUATION_QUESTIONS_TYPE.number.toLowerCase() &&
          //       item.data.default
          //     ) {
          //       this.questionForm.patchValue({
          //         integer: item.data.default,
          //       });
          //     }
          //     if (item.data.choices && item.data.choices.length > 0) {
          //       let custom: any = item.data.choices.map((c: any) => {
          //         return {
          //           name: c,
          //           value: c,
          //           selected: false,
          //         };
          //       });
          //       item.data.choices = custom;
          //     }
          //   });
          // }
          let tArr: any = [];
          questions.map((item: any) => {
            tArr.push({
              questionId: item.questionId,
              votingId: item.votingId,
              question: item.qustion,
              modifiedDate: item.modifiedDate,
              choices: [
                {
                  name: "Yes",
                  value: "Yes",
                  selected: false,
                },
                {
                  name: "No",
                  value: "No",
                  selected: false,
                },
                {
                  name: "Abstain",
                  value: "Abstain",
                  selected: false,
                },
              ],
            });
          });
          this.items = tArr;
        }
        if (documents && documents.length > 0) {
          this.docItems = documents;
        }
      }
    });
  }
  clickOnDocument(e: any) {
    let url = ` ${environment.baseUrl}${apiConstant.votings}/Documents/${e.documentId}`;
    // this.viewFileDocService.viewfile(e, url);
    this.downloadDocuments(url, [], e);
  }

  downloadDocuments(url: any, arr?: any, params?: any) {
    this.showLoader = true;
    this.meetingService.getStatusCodeFromUrl(url).subscribe(
      (response: any) => {
        this.showLoader = false;
        if (arr && arr.length) {
          arr.map((int: any) => {
            this.viewFileDocService.viewfile(int, url);
          });
        } else {
          this.viewFileDocService.viewfile(params, url);
        }
      },
      (err: any) => {
        this.showLoader = false;
        if (err.status === 200) {
          this.viewFileDocService.viewfile(params, url);
        } else {
          if (
            err.error &&
            err.error.result &&
            err.error.result.errorMessages &&
            err.error.result.errorMessages.length > 0
          ) {
            this.setError(err.error.result.errorMessages);
          } else {
            this.setError([`${err.error.error}`]);
          }
        }
      }
    );
  }
}
