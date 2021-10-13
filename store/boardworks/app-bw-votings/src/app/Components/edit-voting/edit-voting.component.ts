import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { VotingsServiceService } from "lib-bw-svc-apis/src/lib/votings/votings-service.service";
import { environment } from "environments/environment";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
@Component({
  selector: "app-edit-voting",
  templateUrl: "./edit-voting.component.html",
  styleUrls: ["./edit-voting.component.scss"],
})
export class EditVotingComponent implements OnInit {
  actions: any = ["View", "Delete"];
  actions2: any = ["Edit", "Delete"];
  emailalertControl = new FormControl(false);
  buttonName = "UnPublished";
  columnsData: any = [
    // {
    //   field: "question",
    //   title: "Question",
    //   filterType: "text",
    //   isEnableColumnOptions: false,
    //   width: "200px",
    //   component:"link",

    // },

    {
      field: "linkTextName",
      title: "Title",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "link",
    },
    // {
    //   title: "Type",
    //   field: "type",
    //   filterType: "text",
    //   isEnableColumnOptions: false,
    // },
    {
      title: "",
      field: "type",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "action",
    },
  ];

  docColumnsData = [
    // {
    //   field: "question",
    //   title: "Question",
    //   filterType: "text",
    //   isEnableColumnOptions: false,
    //   width: "200px",
    //   component:"link",

    // },

    {
      field: "linkTextName",
      title: "Title",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "link",
    },
    {
      title: "",
      field: "type",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "action",
    },
  ];

  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: true,
    lock: false,
    stick: false,
  };
  gridData: any;
  docGridData: any;
  votingId: any;
  votingType: any;
  votingData: any;
  templateScreen: boolean = false;
  unPublishScreen: boolean = false;
  emailCheckBox = [
    {
      name: "Send Email Notification",
      value: "Send Email Notification",
      selected: false,
    },
  ];
  emailSelectedValue: any;
  showReorderModal: boolean = false;
  showdeleteVoting: boolean = false;
  showdeleteResponse: boolean = false;
  defaultItems: any = [];
  showAddDocument: boolean = false;
  newQuestionModal: boolean = false;
  questionControl = new FormControl("");
  votersControl = new FormControl("");

  votersRadio = [
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
  questionIdData: any;

  errMessage: any;
  isError: boolean = false;
  deleteDocument: boolean = false;
  deleteMsg: any = "";
  deleteMsgQuestion: any = "";
  documentId: any;
  deleteQuestion: boolean = false;
  questionId: any;
  showLoader: boolean = false;
  constructor(
    private votingService: VotingsServiceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private commonService: CommonService,
    private viewFileDocService: ViewFileDocService,
    private meetingService: MeetingsService
  ) {}

  ngOnInit(): void {
    this.votingId = this.activatedRoute.snapshot.queryParams.id;
    this.votingType = this.activatedRoute.snapshot.queryParams.type;
    this.getVotingById();
    this.getQuestions();

    if (this.votingType == "template") {
      this.templateScreen = true;
    }
    if (this.votingType == "unpublish") {
      this.unPublishScreen = true;
    }
  }

  getQuestions() {
    this.votingService.getQuestions(this.votingId).subscribe((data: any) => {
      let griddata = data.result.questions;
      let docGridData = data.result.documents;
      griddata &&
        griddata.forEach((res: any, index: any) => {
          res.linkTextName = res.qustion;

          res.parentReadselected = res.isRestrictedQuestion;
          res.parentWriteselected = res.isRequired;
          res.reOrder = index;
        });
      this.gridData = griddata;

      docGridData &&
        docGridData.forEach((res: any, index: any) => {
          let title = res.title + "  " + "(" + res.fileName + ")";
          res.linkTextName = title;
          // res.TwolinkTextName = "View File";

          res.reOrder = index;
        });
      this.docGridData = docGridData;
    });
  }

  getVotingById() {
    this.votingService.getVotingsById(this.votingId).subscribe((data: any) => {
      //let resultdata=data;
      this.votingData = data;
      if (this.votingData) {
        this.defaultItems = [
          {
            text: "Votings",
            title: "Votings",
          },
          {
            text: this.votingData.result.votingName,
            title: this.votingData.result.votingName,
          },
        ];
      }
      if (data.result.isPublished) {
        this.buttonName = "UnPublished";
        this.unPublishScreen = false;
      } else {
        this.buttonName = "Published";
        this.unPublishScreen = true;
      }
    });
  }

  buttonClick(e: any, type: any) {
    switch (type) {
      case "seetings":
        this.router.navigate(["admin/votings/create-vote"], {
          queryParams: { id: this.votingId, type: "edit" },
        });
        break;
      case "Published":
        this.published();
        break;
      case "UnPublished":
        this.published();
        break;
      case "reOrder":
        this.showReorderModal = true;
        break;
      case "delete":
        this.showdeleteVoting = true;
        break;
      case "deleteResponse":
        this.showdeleteResponse = true;
        break;
      case "newQuestion":
        this.questionControl.setValue("");
        this.votersControl.setValue(true);
        this.newQuestionModal = true;
        break;
      case "addDocument":
        this.showAddDocument = true;
        break;
    }
  }

  published() {
    this.votingService
      .putPublished(this.votingId, !this.votingData.result.isPublished)
      .subscribe((data: any) => {
        this.getQuestions();
        this.getVotingById();
      });
  }

  readAccessClick(data: any) {
    if (data.event.target.checked) {
      data.selected.parentReadselected = true;
    } else {
      data.selected.parentReadselected = false;
    }

    this.updateParentSelection();
  }

  writeAccessClick(data: any) {
    if (data.event.target.checked) {
      data.selected.parentWriteselected = true;
    } else {
      data.selected.parentWriteselected = false;
    }

    this.updateParentSelection();
  }

  updateParentSelection() {
    this.gridData.forEach((element: any) => {
      element.parentReadselected = false;
      element.parentWriteselected = false;

      let writechildSelected = 0;
      let readChildSelected = 0;

      if (element.users != null && element.users.length > 0) {
        element.users.forEach((child: any) => {
          if (child.childReadselected) {
            readChildSelected += 1;
          }
          if (child.childWriteselected) writechildSelected += 1;
        });

        if (readChildSelected == element.users.length) {
          element.parentReadselected = true;
        }
        if (writechildSelected == element.users.length) {
          element.parentWriteselected = true;
        }
      }
    });
  }

  changeCheckbox(e: any) {
    this.emailSelectedValue = e;
  }

  reordeerModalAction(e: any) {
    if (e == "cancel") {
      this.showReorderModal = false;
    } else {
    }
  }
  deleteVoting(e: any) {
    if (e == "cancel") {
      this.showdeleteVoting = false;
    } else {
      this.votingService.deleteVoting(this.votingId).subscribe(
        (data: any) => {
          this.showdeleteVoting = false;
          this.getQuestions();
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
        }
      );
    }
  }
  deleteResponse(e: any) {
    if (e == "cancel") {
      this.showdeleteResponse = false;
    } else {
      this.votingService.deleteResponse(this.votingId).subscribe(
        (data: any) => {
          this.showdeleteResponse = false;
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
        }
      );
    }
  }

  onClickLink(e: any, mode: any) {
    const { type, data }: any = e;
    if (mode === "questions") {
      this.newQuestionModal = true;
      this.votingService
        .getQuestionsById(this.votingId, data.questionId)
        .subscribe((data: any) => {
          this.questionIdData = data.result;
          this.questionControl.setValue(this.questionIdData.qustion);
          this.votersControl.setValue(this.questionIdData.isAbstainEnabled);
        });
    } else {
      let url = ` ${environment.baseUrl}${apiConstant.alertsDocument}/${data.documentId}`;
      // this.viewFileDocService.viewfile(data, url);
      this.downloadDocuments(url, [], data);
    }
  }

  backNavigation() {
    this.router.navigate(["../"], { relativeTo: this.activatedRoute });
  }
  ngOnChanges(): void {}
  reOrderVoting(e: any) {
    if (e == "cancel") {
      this.showReorderModal = false;
    } else {
      let temparray: any = [];
      this.gridData.data.forEach((element: any) => {
        let obj = {
          questionId: element.questionId,
          order: element.reOrder,
        };
        temparray.push(obj);
      });
      const reqObj = {
        questionOrderList: temparray,
      };
      this.votingService.reorderQuestions(this.votingId, reqObj).subscribe(
        (data: any) => {
          this.showReorderModal = false;
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
        }
      );
    }
  }

  dragAndDropGrid(data: any) {
    this.gridData = data;
  }

  childLinkClick(e: any) {
    this.router.navigate(["admin/votings/newQuestion"], {
      queryParams: {
        id: this.votingId,
        questionId: e.child.questionId,
        type: "edit",
      },
    });
  }
  navigateInto(params: any) {
    if (params.text === "Votings" || params.title === "Votings") {
      this.backNavigation();
    }
  }

  newQuestionVoting(e: any) {
    if (e == "save") {
      const reqOBj = {
        question: this.questionControl.value,
        isAbstainEnabled: this.votersControl.value,
      };
      if (this.questionIdData) {
        this.votingService
          .putQuestions(this.votingId, reqOBj, this.questionIdData.questionId)
          .subscribe((data: any) => {
            this.newQuestionModal = false;
            this.getQuestions();
            this.questionIdData = null;
            this.questionControl.setValue("");
          });
      } else {
        this.votingService
          .postQuestions(this.votingId, reqOBj)
          .subscribe((data: any) => {
            this.newQuestionModal = false;
            this.getQuestions();
            this.questionControl.setValue("");
          });
      }
    } else {
      this.newQuestionModal = false;
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
  onClickAction(e: any) {
    const { data, action }: any = e;
    if (action.toLowerCase() === "delete") {
      this.deleteDocument = true;
      this.documentId = data.documentId;
    } else if (action.toLowerCase() === "view") {
      let url = ` ${environment.baseUrl}${apiConstant.alertsDocument}/${data.documentId}`;
      // this.viewFileDocService.viewfile(data, url);
      this.downloadDocuments(url, [], data);
    }
  }
  onClickAction2(e: any) {
    const { data, action }: any = e;
    if (action.toLowerCase() === "delete") {
      this.deleteQuestion = true;
      this.questionId = data.questionId;
    } else if (action.toLowerCase() === "edit") {
      // this.router.navigate(["admin/votings/newQuestion"], {
      //   queryParams: {
      //     id: data.votingId,
      //     questionId: data.questionId,
      //     type: "edit",
      //   },
      // });
      this.newQuestionModal = true;
      this.votingService
        .getQuestionsById(this.votingId, data.questionId)
        .subscribe((data: any) => {
          this.questionIdData = data.result;
          this.questionControl.setValue(this.questionIdData.qustion);
        });
    }
  }
  linksModalAction(e: any) {
    if (e.toLowerCase() === "yes") {
      this.votingService
        .deleteDocumentById(this.votingId, this.documentId)
        .subscribe((res: any) => {
          if (res) {
            this.getQuestions();
            this.deleteDocument = false;
          }
        });
    } else {
      this.deleteDocument = false;
    }
  }
  linksModalActionQuestion(e: any) {
    if (e.toLowerCase() === "save") {
      this.votingService
        .deleteQuestionById(this.votingId, this.questionId)
        .subscribe(
          (res: any) => {
            this.getQuestions();
            this.deleteQuestion = false;
          },
          (err: any) => {
            this.deleteQuestion = false;
            this.setError(err.error.result.errorMessages);
          }
        );
    } else {
      this.deleteQuestion = false;
    }
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
