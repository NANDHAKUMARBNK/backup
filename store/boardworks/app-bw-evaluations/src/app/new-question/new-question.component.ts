import { ToastrService } from './../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'lib-bw-svc-apis/src/lib/common/common.service';
import { EvaluationsService } from 'lib-bw-svc-apis/src/lib/evaluations/evaluations.service';

@Component({
  selector: "app-new-question",
  templateUrl: "./new-question.component.html",
  styleUrls: ["./new-question.component.scss"],
})
export class NewQuestionComponent implements OnInit {
  breadCrumb = "Add Evaluation Question";
  errMessage: any;
  isError: boolean = false;
  questionDataForm: FormGroup;
  agendaRadio = [
    {
      name: "Yes",
      value: true,
      selected: false,
    },
    {
      name: "No",
      value: false,
      selected: false,
    },
  ];

  defaultBoolRadio = [
    {
      name: "yes",
      value: true,
      selected: false,
    },
    {
      name: "no",
      value: false,
      selected: false,
    },
  ];

  answerBooleanRadio = [
    {
      name: "Yes",
      value: true,
      selected: false,
    },
    {
      name: "No",
      value: false,
      selected: false,
    },
  ];
  dateRadio = [
    {
      name: "None",
      value: "None",
      selected: false,
    },
    {
      name: "Today's Date",
      value: "today",
      selected: false,
    },
    {
      name: "Other",
      value: "Other",
      selected: false,
    },
  ];

  ChoiceMenu = [
    {
      name: "Drop-Down Menu",
      value: "Combo",
      selected: false,
    },
    {
      name: "Radio Buttons",
      value: "Radio",
      selected: false,
    },
    {
      name: "Checkboxes (allow selections)",
      value: "Check",
      selected: false,
    },
  ];
  appointmentData: any;
  committeeData: any;
  questionData: any;
  appointments = [
    {
      name: "Specific Appointment",
      value: "Specific Appointment",
      selected: false,
    },
  ];
  committees = [
    {
      name: "Specific Committee",
      value: "Specific Committee",
      selected: false,
    },
  ];
  questions = [
    {
      name: "Previous Question",
      value: "Previous Question",
      selected: false,
    },
  ];
  choiceOpinion = [
    {
      name: "",
      value: "anonymous",
      selected: false,
    },
  ];
  answersData = [
    {
      name: "Single line of text",
      type: "TextSingleLine",
    },
    {
      name: "Multiple lines of text",
      type: "TextMultiLine",
    },
    {
      name: "Choice (menu to choose from)",
      type: "Choice",
    },
    {
      name: "Choice (Opinion)",
      type: "Opinion",
    },
    {
      name: "Number",
      type: "Number",
    },
    {
      name: "Date",
      type: "Date",
    },
    {
      name: "Yes/No (Radio Button)",
      type: "Boolean",
    },
  ];
  textSingleLine: boolean = false;
  textMultiLine: boolean = false;
  choice: boolean = false;
  opinion: boolean = false;
  number: boolean = false;
  date: boolean = false;
  boolean: boolean = false;
  evaluationId: any;
  restrictCheck: boolean = false;
  appointmentCheck: boolean = false;
  neutralCheck: boolean = false;

  committeesCheck: boolean = false;
  pageType: any;
  questionId: any;
  editQuestionData: any;
  filterAnswerData: any;
  answerFilterNumber: boolean = false;
  answerFilterBoolean: boolean = false;
  answerFilterOpinion: boolean = false;
  answerFilterChoice: boolean = false;

  queCheck: boolean = false;
  filterDataListAnswer: any;
  dataComitteesItems: any;
  documents: any = [];
  constructor(private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private evaluationsService: EvaluationsService,
    private toastr: ToastrService) {
    this.questionDataForm = this.fb.group({
      question: ["", [Validators.required]],
      description: [""],
      required: [""],
      questions: [null],
      committee: [null],
      appointment: [null],
      appointmentCheck: [''],
      committeeCheck: [''],
      questionsCheck: [''],
      noofchar: [''],
      defaultValue: [''],
      noofLines: [''],
      separateLine: [''],
      choiceMenu: [''],
      choiceOpinion: [''],
      default: [''],
      minValues: [''],
      maxValue: [''],
      answerType: ['',[Validators.required]],
      defaultBool: [''],
      defaultDate: [''],
      otherDate: [''],
      answerBoolean: [''],
      answerFilterNumber: [''],
      answerFilterOpinionChoice: ['']
    })
    if (this.evaluationsService.documentData && this.evaluationsService.documentData.length > 0) {
      this.documents = this.evaluationsService.documentData;
    }
  }

  ngOnInit(): void {
    this.evaluationId = this.activatedRoute.snapshot.queryParams.id;
    this.pageType = this.activatedRoute.snapshot.queryParams.type;
    this.questionId = this.activatedRoute.snapshot.queryParams.questionId
    this.questionDataForm.get('questions')?.disable()
    this.questionDataForm.get('committee')?.disable()
    this.questionDataForm.get('appointment')?.disable()
    this.questionDataForm.get('required')?.setValue(false)
    this.getCommittes();
    this.getAppointment();
    this.getPreviousQuestions();
    if (this.pageType) {
      this.getquestionById();
      this.getDocuments();
    }
  }

  getquestionById() {
    this.evaluationsService
      .getQuestionsById(this.evaluationId, this.questionId)
      .subscribe((data: any) => {
        this.editQuestionData = data.result;
        this.setFormControl(this.editQuestionData);
      });
  }

  getDocuments() {
    this.evaluationsService.getEvalDocuments(this.evaluationId).subscribe((data: any) => {
      if (data.result) {
        this.documents.push(data.result);
      }
    })
  }

  setFormControl(data: any) {
    this.questionDataForm.get("question")?.setValue(data.question);
    this.questionDataForm.get("description")?.setValue(data.description);
    this.questionDataForm.get("required")?.setValue(data.isRequired);
    let separateLine;
    let committeeId;
    let tempComitteArray: any = [];

    data.data.choices.forEach((element: any) => {
      separateLine = element;
    });
    console.log(data.data.min, "typeof");
    if (data.type == "Opinion") {
      this.choiceOpinion = this.choiceOpinion.map((element: any) => {
        let checkopinion = data.data.choices.filter(
          (item: any) => item == "neutral"
        );
        element["selected"] = checkopinion.length > 0 ? true : true;
        return element;
      });
    }
    if (
      data.restrictedTo.appointmentId != null &&
      data.restrictedTo.appointmentId.length > 0
    ) {
      this.questionDataForm.get("appointment")?.enable();

      this.appointments = this.appointments.map((element: any) => {
        element["selected"] = true;
        return element;
      });
    }
    if (
      data.restrictedTo.committeeId != null &&
      data.restrictedTo.committeeId.length > 0
    ) {
      this.questionDataForm.get("committee")?.enable();

      this.committees = this.committees.map((element: any) => {
        element["selected"] = true;
        return element;
      });

      this.committeeData.forEach((element: any) => {
        data.restrictedTo.committeeId.forEach((item: any) => {
          if (element.id == item) {
            let obj = { id: item };
            tempComitteArray.push(obj);
            this.dataComitteesItems = tempComitteArray;
          }
        });
      });
      console.log(tempComitteArray, "tempComitteArray");
    }
    if (data.parentQuestionId) {
      this.questionDataForm.get("questions")?.enable();

      this.questions = this.questions.map((element: any) => {
        element["selected"] = true;
        return element;
      });
    }

    this.questionDataForm.patchValue({
      question: data.question,
      description: data.description,
      required: data.isRequired,
      questions: data.parentQuestionId,
      committee: tempComitteArray,
      // appointment: data.restrictedTo.appointmentId,
      appointmentCheck: this.appointments,
      committeeCheck: this.committees,
      questionsCheck: this.questions,
      noofchar: data.data.maxChar,
      defaultValue: data.data.default,
      noofLines: data.data.numLines,
      separateLine: separateLine && separateLine ? separateLine : null,
      choiceMenu: data.data.subType,
      choiceOpinion: this.choiceOpinion,
      default: data.data.default,
      minValues: data.data.min,
      maxValue: data.data.max,
      answerType: data.type,
      defaultBool: Boolean(data.data.default),
      defaultDate: data.data.default,
      otherDate: new Date(data.data.default),
    });
    // this.questionDataForm.get('required')?.setValue(data.question);

    this.onEditChange(data.type, "answerType");
  }

  onEditChange(data: any, type: any) {
    if (type == "answerType") {
      if (data == "Number") {
        this.number = true;
      } else if (data == "TextSingleLine") {
        this.textSingleLine = true;
      } else if (data == "Boolean") {
        this.boolean = true;
      } else if (data == "Date") {
        this.date = true;
      } else if (data == "Opinion") {
        this.opinion = true;
      } else if (data == "Choice") {
        this.choice = true;
      } else if (data == "TextMultiLine") {
        this.textMultiLine = true;
      }
    }
  }
  getCommittes() {
    this.commonService.getentitiesCommittees().subscribe((data: any) => {
      this.committeeData = data.result;
    });
  }

  getAppointment() {
    this.commonService.getEntitiesAppotiment().subscribe((data: any) => {
      this.appointmentData = data.result;
    });
  }
  getPreviousQuestions() {
    this.evaluationsService
      .parentQuestions(this.evaluationId)
      .subscribe((data: any) => {
        this.questionData = data.result;
      });
  }

  backNavigation() {
    this.router.navigate(["../"], { relativeTo: this.activatedRoute });
  }

  cancel(e: any) {
    this.router.navigate(["../"], { relativeTo: this.activatedRoute });
  }

  createQuestion(e: any, t: any) {
    let choice = [];
    let defaultValue;
    let hasDefaultValue;
    let type = this.questionDataForm.get("answerType")?.value;
    if (type == "TextSingleLine") {
      defaultValue = this.questionDataForm.get("defaultValue")?.value;
      hasDefaultValue = true;
    } else if (type == "Number") {
      defaultValue = this.questionDataForm.get("default")?.value;
      hasDefaultValue = true;
    } else if (type == "Boolean") {
      defaultValue = this.questionDataForm.get("defaultBool")?.value.toString();
      hasDefaultValue = true;
    } else if (type == "Date") {
      hasDefaultValue = true;

      let dates = this.questionDataForm.get("defaultDate")?.value;
      console.log(dates, "dates");

      if (dates == "today") {
        defaultValue = new Date();
      } else if (dates == "Other") {
        defaultValue = this.questionDataForm.get("otherDate")?.value;
      } else {
        defaultValue = "None";
      }
    } else if (type == "Opinion") {
      if (this.neutralCheck) {
        choice.push(
          "Strongly Agree",
          "Agree",
          "Neutral",
          "Disagree",
          "Strongly Disagree"
        );
      } else {
        choice.push("Strongly Agree", "Agree", "Disagree", "Strongly Disagree");
      }
    } else if (type == "Choice") {
      console.log(this.questionDataForm.get("separateLine")?.value, "valuess");

      const lines = this.questionDataForm
        .get("separateLine")
        ?.value.split(/\n/);

      for (var i = 0; i < lines.length; i++) {
        // only push this line if it contains a non whitespace character.
        if (/\S/.test(lines[i])) {
          choice.push(lines[i]);
        }
      }
    }
    let prevAnswerValues: any = [];

    if (this.filterAnswerData) {
      let prevquestionType = this.filterAnswerData[0];
      if (prevquestionType.type == "Number") {
        prevAnswerValues.push(
          this.questionDataForm.get("answerFilterNumber")?.value
        );
      } else if (prevquestionType.type == "Boolean") {
        prevAnswerValues.push(
          this.questionDataForm.get("answerBoolean")?.value
        );
      } else if (
        prevquestionType.type == "Choice" ||
        prevquestionType.type == "Opinion"
      ) {
        prevAnswerValues.push(
          this.questionDataForm.get("answerFilterOpinionChoice")?.value
        );
      }
    }

    console.log(prevAnswerValues, "prevAnswerValues");

    const reqObj = {
      evaluationQuestionId:
        this.editQuestionData && this.editQuestionData.evaluationQuestionId
          ? this.editQuestionData.evaluationQuestionId
          : null,
      question: this.questionDataForm.get("question")?.value,
      description: this.questionDataForm.get("description")?.value,
      order:
        this.editQuestionData && this.editQuestionData.order
          ? this.editQuestionData.order
          : 0,
      type: this.questionDataForm.get("answerType")?.value,
      isRequired: this.questionDataForm.get("required")?.value,
      hasDefaultValue: hasDefaultValue,
      data: {
        type: this.questionDataForm.get("answerType")?.value,
        max: this.questionDataForm.get("maxValue")?.value,
        numLines: this.questionDataForm.get("noofLines")?.value,
        min: this.questionDataForm.get("minValues")?.value,
        subType: this.questionDataForm.get("choiceMenu")?.value,
        choices: choice,
        maxChar: this.questionDataForm.get("noofchar")?.value,
        default: defaultValue,
      },
      isRestrictedQuestion: this.restrictCheck,
      restrictionData: {
        committeeId: this.questionDataForm.get("committee")?.value,
        appointmentId: this.questionDataForm.get("appointment")?.value,
        prevAnswerValues:
          prevAnswerValues && prevAnswerValues.length > 0
            ? [`${prevAnswerValues[0]}`]
            : null,
        userIds: this.questionDataForm.get("questions")?.value && null,
      },
      "parentQuestionId": this.questionDataForm.get('questions')?.value,
      "evaluationDocumentIds": [...this.documents.map((item: any) => item.DocumentId)]
    }
    console.log(this.questionDataForm.value);
    console.log(reqObj, "reqObj");

    if (this.questionId) {
      this.evaluationsService.updateQuestion(this.evaluationId, reqObj).subscribe((data: any) => {
        if (t == 'newQuestion') {
          window.location.reload();
        } else {
          this.router.navigate(['admin/evaluations/editEvaluation'], { queryParams: { id: this.evaluationId } })
        }
        this.evaluationsService.documentData = {};
        this.evaluationsService.documentsRetain = {};
      },
        err => {
          this.setError(err.error.result.errorMessages)

        }
      )

    } else {
      if (this.questionDataForm.valid) {
        this.evaluationsService
          .createNewQuestion(this.evaluationId, reqObj)
          .subscribe(
            (data: any) => {
              if (t == "newQuestion") {
                window.location.reload();
              } else {
                this.router.navigate(["admin/evaluations/editEvaluation"], {
                  queryParams: { id: this.evaluationId },
                });
              }
            },
            (err) => {
              this.setError(err.error.result.errorMessages);
            }
          );
      }
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  onChange(e: any, type: any) {
    if (type == "answerType") {
      if (e == "TextSingleLine") {
        this.textSingleLine = true;
        this.textMultiLine = false;
        this.choice = false;
        this.opinion = false;
        this.number = false;
        this.date = false;
        this.boolean = false;
        this.questionDataForm.get("noofchar")?.setValue("255");
        this.questionDataForm.get("maxValue")?.reset(),
          this.questionDataForm.get("noofLines")?.reset(),
          this.questionDataForm.get("minValues")?.reset(),
          this.questionDataForm.get("choiceMenu")?.reset(),
          this.questionDataForm.get("subType")?.reset();
      } else if (e == "TextMultiLine") {
        this.textMultiLine = true;
        this.textSingleLine = false;
        this.choice = false;
        this.opinion = false;
        this.number = false;
        this.date = false;
        this.boolean = false;
        this.questionDataForm.get("maxValue")?.reset(),
          this.questionDataForm.get("noofLines")?.setValue("5"),
          this.questionDataForm.get("minValues")?.reset(),
          this.questionDataForm.get("choiceMenu")?.reset(),
          this.questionDataForm.get("noofchar")?.reset();
        this.questionDataForm.get("subType")?.reset();
      } else if (e == "Choice") {
        this.choice = true;
        this.textMultiLine = false;
        this.textSingleLine = false;
        this.opinion = false;
        this.number = false;
        this.date = false;
        this.boolean = false;
        this.questionDataForm.get("maxValue")?.reset(),
          this.questionDataForm.get("noofLines")?.reset(),
          this.questionDataForm.get("minValues")?.reset(),
          this.questionDataForm.get("choiceMenu")?.setValue("Radio"),
          this.questionDataForm.get("noofchar")?.reset();
        this.questionDataForm.get("subType")?.reset();
      } else if (e == "Opinion") {
        this.opinion = true;
        this.choice = false;
        this.textMultiLine = false;
        this.textSingleLine = false;
        this.number = false;
        this.date = false;
        this.boolean = false;
        this.questionDataForm.get("maxValue")?.reset(),
          this.questionDataForm.get("noofLines")?.reset(),
          this.questionDataForm.get("minValues")?.reset(),
          this.questionDataForm.get("choiceMenu")?.reset(),
          this.questionDataForm.get("noofchar")?.reset();
        this.questionDataForm.get("subType")?.reset();
      } else if (e == "Number") {
        this.number = true;
        this.opinion = false;
        this.choice = false;
        this.textMultiLine = false;
        this.textSingleLine = false;
        this.date = false;
        this.boolean = false;
        this.questionDataForm.get("maxValue")?.reset(),
          this.questionDataForm.get("noofLines")?.reset(),
          this.questionDataForm.get("minValues")?.reset(),
          this.questionDataForm.get("choiceMenu")?.reset(),
          this.questionDataForm.get("noofchar")?.reset();
        this.questionDataForm.get("subType")?.reset();
      } else if (e == "Date") {
        this.date = true;
        this.number = false;
        this.opinion = false;
        this.choice = false;
        this.textMultiLine = false;
        this.textSingleLine = false;
        this.boolean = false;
        this.questionDataForm.get("maxValue")?.reset(),
          this.questionDataForm.get("noofLines")?.reset(),
          this.questionDataForm.get("minValues")?.reset(),
          this.questionDataForm.get("choiceMenu")?.reset(),
          this.questionDataForm.get("noofchar")?.reset();
        this.questionDataForm.get("subType")?.reset();
        this.questionDataForm.get("defaultDate")?.setValue("today");
      } else if (e == "Boolean") {
        this.boolean = true;
        this.date = false;
        this.number = false;
        this.opinion = false;
        this.choice = false;
        this.textMultiLine = false;
        this.textSingleLine = false;
        this.questionDataForm.get("maxValue")?.reset(),
          this.questionDataForm.get("noofLines")?.reset(),
          this.questionDataForm.get("minValues")?.reset(),
          this.questionDataForm.get("choiceMenu")?.reset(),
          this.questionDataForm.get("noofchar")?.reset();
        this.questionDataForm.get("subType")?.reset();
        this.questionDataForm.get("defaultBool")?.setValue(true);
      }
    } else if (type == "que") {
      console.log(e, "eeeeee");
      this.filterAnswerData = this.questionData.filter(
        (item: any) => item.evaluationQuestionId == e
      );
      console.log(
        this.filterAnswerData[0].data.choices,
        "  this.filterAnswerData"
      );
      let tempArray: any = [];
      this.filterAnswerData[0].data.choices.map((item: any) => {
        let obj = {
          name: item,
        };
        tempArray.push(obj);
      });
      console.log(tempArray, "tempArray");
      this.filterDataListAnswer = tempArray;

      if (this.filterAnswerData[0].type == "Number") {
        this.answerFilterNumber = true;
      } else {
        this.answerFilterNumber = false;
      }
      if (this.filterAnswerData[0].type == "Boolean") {
        this.answerFilterBoolean = true;
      } else {
        this.answerFilterBoolean = false;
      }
      if (
        this.filterAnswerData[0].type == "Opinion" ||
        this.filterAnswerData[0].type == "Choice"
      ) {
        this.answerFilterOpinion = true;
      } else {
        this.answerFilterOpinion = false;
      }
    }
  }
  changeAllDayCheckbox(e: any, type: any) {
    console.log(e, "ee", type, "typeeee");
    if (type == "Restrict") {
      if (e.length > 0) {
        this.restrictCheck = true;
        this.appointmentCheck = true;
        this.questionDataForm.get("appointment")?.enable();
      } else {
        this.questionDataForm.get("appointment")?.disable();
        this.restrictCheck = false;
        this.appointmentCheck = false;
      }
    }
    if (type == "committees") {
      if (e.length > 0) {
        this.restrictCheck = true;
        this.committeesCheck = true;
        this.questionDataForm.get("committee")?.enable();
      } else {
        this.committeesCheck = false;
        this.restrictCheck = false;
        this.questionDataForm.get("committee")?.disable();
      }
    }
    if (type == "questions") {
      if (e.length > 0) {
        this.restrictCheck = true;
        this.queCheck = true;
        this.questionDataForm.get("questions")?.enable();
      } else {
        this.restrictCheck = false;
        this.queCheck = false;
        this.questionDataForm.get("questions")?.disable();
      }
    }
    if (type == "neutral") {
      if (e.length > 0) {
        this.neutralCheck = true;
      } else {
        this.neutralCheck = false;
      }
    }
  }

  addDocument(e: any) {
    console.log(e);    
    this.evaluationsService.documentsRetain = {
      data: e.value,
      // grid: this.gridData,
    };
    this.router.navigate(["../add-document"], {
      relativeTo: this.activatedRoute,
    });
  }

  deleteIcon(index: any, item: any) {
    this.documents.splice(index, 1);
    this.commonService
      .deleteDocumentcache(item.DocumentId)
      .subscribe((res: any) => {});
    if (this.evaluationId && item.DocumentId) {
      this.evaluationsService
        .deleteDocumentById(this.evaluationId, item.DocumentId)
        .subscribe(
          (res) => {
            if (res) {
              this.toastr.showToastr(
                "success",
                "Document Deleted Successfully!"
              );
            }
          },
          (err: any) => {
            this.setError(err.error.result.errorMessages);
          }
        );
    }
  }

}
