import { SurveysService } from "lib-bw-svc-apis/src/lib/surveys/surveys.service";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { DialogContentBase, DialogRef } from "@progress/kendo-angular-dialog";

@Component({
  selector: "bw-new-question-surveys",
  templateUrl: "./new-question.component.html",
  styleUrls: ["./new-question.component.scss"],
})
export class NewQuestionComponent extends DialogContentBase implements OnInit {
  @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
  @Output() onCancelClick: EventEmitter<any> = new EventEmitter();

  // @Input() meetingId: any;
  @Input() surveyId: any;
  @Input() questionId: any;
  @Input() pageType: any;

  breadCrumb = "Add Survey Question";
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
    // {
    //   name: "Choice (Opinion)",
    //   type: "Opinion",
    // },
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
  // opinion: boolean = false;
  number: boolean = false;
  date: boolean = false;
  boolean: boolean = false;
  restrictCheck: boolean = false;
  appointmentCheck: boolean = false;
  neutralCheck: boolean = false;
  committeesCheck: boolean = false;
  editQuestionData: any;
  filterAnswerData: any;
  answerFilterNumber: boolean = false;
  answerFilterBoolean: boolean = false;
  answerFilterOpinion: boolean = false;
  answerFilterChoice: boolean = false;
  queCheck: boolean = false;
  filterDataListAnswer: any;
  dataCommitteesItems: any;

  constructor(
    public dialog: DialogRef,
    private _formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private surveyService: SurveysService
  ) {
    super(dialog);

    this.questionDataForm = this._formBuilder.group({
      question: ["", [Validators.required]],
      description: [""],
      required: [""],
      noofchar: [""],
      defaultValue: [""],
      noofLines: [""],
      separateLine: [""],
      choiceMenu: [""],
      // choiceOpinion: [""],
      default: [""],
      minValues: [""],
      maxValue: [""],
      answerType: ["", [Validators.required]],
      defaultBool: [""],
      defaultDate: [""],
      otherDate: [new Date()],
      answerBoolean: [""],
      answerFilterNumber: [""],
      answerFilterOpinionChoice: [""],
    });
  }

  ngOnInit(): void {
    this.questionDataForm.get("questions")?.disable();
    this.questionDataForm.get("committee")?.disable();
    this.questionDataForm.get("appointment")?.disable();
    this.questionDataForm.get("required")?.setValue(false);
    this.getCommittes();
    this.getAppointment();
    this.getPreviousQuestions();
    if (this.pageType) {
      this.getquestionById();
    }
  }

  getquestionById() {
    this.surveyService
      .getQuestionsById(this.surveyId, this.questionId)
      .subscribe((data: any) => {
        this.editQuestionData = data.result;
        this.setFormControl(this.editQuestionData);
      });
  }

  setFormControl(data: any) {
    this.questionDataForm.patchValue(data);
    let separateLine;
    let tempComitteArray: any = [];

    data.questionData.data.forEach((element: any) => {
      separateLine = element;
    });
    console.log(data.questionData.min, "typeof");
    // if (data.type == "Opinion") {
    //   this.choiceOpinion = this.choiceOpinion.map((element: any) => {
    //     let checkopinion = data.questionData.data.filter(
    //       (item: any) => item == "neutral"
    //     );
    //     element["selected"] = checkopinion.length > 0 ? true : true;
    //     return element;
    //   });
    // }

    console.log(tempComitteArray, "data.restrictedTo.committeeId");
    this.questionDataForm.patchValue({
      question: data.question,
      description: data.description,
      required: data.required,
      noofchar: data.questionData.maxChar,
      defaultValue: data.questionData.defaultValue,
      noofLines: separateLine && separateLine ? separateLine : null,
      separateLine: separateLine && separateLine ? separateLine : null,
      choiceMenu: data.questionData.inputType,
      // choiceOpinion: this.choiceOpinion,
      default: data.questionData.defaultValue,
      minValues: data.questionData.min,
      maxValue: data.questionData.max,
      answerType: data.type,
      defaultBool: data.questionData.defaultValue,
      defaultDate: data.questionData.defaultValue,
      otherDate: this.isDate(data.questionData.defaultValue) ? new Date(data.questionData.defaultValue) : null,
      // otherDate:  data.data.default ?new Date(data.data.default) : null

    });
console.log(data.questionData.defaultValue , new Date(data.questionData.defaultValue), this.isDate(data.questionData.defaultValue));

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
      } 
      // else if (data == "Opinion") {
        // this.opinion = true;
      // }
       else if (data == "Choice") {
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
    this.surveyService
      .getSurveyQuestionsBasedOnId(this.surveyId)
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
        defaultValue = this.isDate(this.questionDataForm.get("otherDate")?.value) ? this.questionDataForm.get("otherDate")?.value : new Date() ;
      } else {
        defaultValue = "None";
      }
    } 
    // else if (type == "Opinion") {
    //   if (this.neutralCheck) {
    //     choice.push(
    //       "Strongly Agree",
    //       "Agree",
    //       "Neutral",
    //       "Disagree",
    //       "Strongly Disagree"
    //     );
    //   } else {
    //     choice.push("Strongly Agree", "Agree", "Disagree", "Strongly Disagree");
    //   }
    // } 
    else if (type == "Choice") {
      console.log(this.questionDataForm.get("separateLine")?.value, "values");
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
          this.questionDataForm.get("answerBoolean")?.value);
      } else if (
        prevquestionType.type == "Choice" 
        // ||
        // prevquestionType.type == "Opinion"
      ) {
        prevAnswerValues.push(
          this.questionDataForm.get("answerFilterOpinionChoice")?.value
        );
      }
    }
    console.log(prevAnswerValues, "prevAnswerValues");
    const reqObj = {
      question: this.questionDataForm.get("question")?.value,
      description: this.questionDataForm.get("description")?.value,
      type: this.questionDataForm.get("answerType")?.value,
      isRequired: this.questionDataForm.get("required")?.value,
      data: {
        type: this.questionDataForm.get("answerType")?.value,
        inputType: this.questionDataForm.get("choiceMenu")?.value,
        isRequired: this.questionDataForm.get("required")?.value,
        max: this.questionDataForm.get("maxValue")?.value,
        numLines: this.questionDataForm.get("noofLines")?.value,
        min: this.questionDataForm.get("minValues")?.value,
        hasDefaultValue: hasDefaultValue,
        data: choice,
        maxChar: this.questionDataForm.get("noofchar")?.value,
        defaultValue: defaultValue ? defaultValue.toString() : "",
      },
      // "restrictionData": {
      //   "committeeId": this.questionDataForm.get('committee')?.value,
      //   "appointmentId": this.questionDataForm.get('appointment')?.value,
      //   "prevAnswerValues": prevAnswerValues && prevAnswerValues.length > 0 ? prevAnswerValues : null
      // },
      // "parentQuestionId": this.questionDataForm.get('questions')?.value
    };
    console.log(this.questionDataForm.value);
    console.log(reqObj, "reqObj");
    if (this.questionId) {
      ///
      this.surveyService
        .updateQuestion(this.surveyId, reqObj, this.questionId)
        .subscribe(
          (data: any) => {
            if (t == "newQuestion") {
              // window.location.reload();
              this.questionDataForm.get("required")?.setValue(false);
              this.questionDataForm.reset();
            } else {
              this.onConfirmAction();
            }
          },
          (err: any) => {
            this.setError(err.error.result.errorMessages);
          }
        );
    } else {
      if (this.questionDataForm.valid) {
        this.surveyService.createNewQuestion(this.surveyId, reqObj).subscribe(
          (data: any) => {
            if (t == "newQuestion") {
              // window.location.reload();
              this.questionDataForm.reset();
            } else {
              this.onConfirmAction();
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
        // this.opinion = false;
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
        // this.opinion = false;
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
        // this.opinion = false;
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
        // this.opinion = true;
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
        // this.opinion = false;
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
        // this.opinion = false;
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
        // this.opinion = false;
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

  public onCancelAction(): void {
    this.onCancelClick.emit("cancel");
  }
  public onConfirmAction(): void {
    this.onConfirmClick.emit("confirm");
  }

  isDate(date:any) {
    return ((new Date(date)).toString() !== "Invalid Date");
  }

}

