import { CommonService } from 'lib-bw-svc-apis/src/lib/common/common.service';
import { ToastrService } from "./../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationsService } from 'lib-bw-svc-apis/src/lib/evaluations/evaluations.service';

@Component({
  selector: 'app-edit-evalution',
  templateUrl: './edit-evalution.component.html',
  styleUrls: ['./edit-evalution.component.scss']
})
export class EditEvalutionComponent implements OnInit {
  actions: any = ["Edit", "Delete"];
  showEditQuestion = false;
  pageType = "";
  evaluationQuestionId = "";
  emailalertControl = new FormControl(false)
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
    {
      title: "Type",
      field: "type",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      title: "Is Condtional",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "readAccess"
    },
    {
      title: "Is Required",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "writeAccess"
    },
    {
      field: "isShowManage",
      title: "",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "action",
      buttonName: "Action",
      width: "150px",
    },

    {

      //component: 'useTemplate',
      isEnableColumnOptions: false,
      component: "icon",
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
  evaluationId: any;
  evaluationType: any;
  evaluationData: any;
  templateScreen: boolean = false;
  unPublishScreen: boolean = false;
  emailCheckBox = [

    {
      name: "Send Email Notification",
      value: "Send Email Notification",
      selected: false,
    },

  ]
  emailSelectedValue: any;
  showReorderModal: boolean = false;
  showdeleteEvalution: boolean = false;
  showdeleteResponse: boolean = false;
  showDeleteQuestion: boolean = false;
  documents: any = [];
  constructor(
    private evaluationsService: EvaluationsService, 
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService) { 
      // if (this.evaluationsService.documentData && this.evaluationsService.documentData.length > 0) {
      //   this.documents = this.evaluationsService.documentData;
      // }
    }

  ngOnInit(): void {
    this.evaluationId = this.activatedRoute.snapshot.queryParams.id;
    this.evaluationType = this.activatedRoute.snapshot.queryParams.type;
    this.getEvalutionById();
    this.getQuestions();

    if (this.evaluationType == 'template') {
      this.templateScreen = true;

    }
    if (this.evaluationType == 'unpublish') {
      this.unPublishScreen = true;

    }
  }

  getQuestions() {
    this.evaluationsService.getQuestions(this.evaluationId).subscribe((data: any) => {
      let griddata = data.result.evaluationQuestionItems;
      griddata && griddata.forEach((res: any, index: any) => {
        res.linkTextName = res.question;

        res.parentReadselected = res.isRestrictedQuestion;
        res.parentWriteselected = res.isRequired;
        res.reOrder = index;
      });
      this.gridData = griddata;
    })

  }

  getEvalutionById() {
    this.evaluationsService.getEvalutionsById(this.evaluationId).subscribe((data: any) => {
      //let resultdata=data;
      this.evaluationData = data;


      if (data.isPublished) {
        this.buttonName = "UnPublished";
        this.actions = ["Edit"];
        this.unPublishScreen = false;


      } else {
        this.buttonName = "Published";
        this.actions = ["Edit", "Delete"];
        this.unPublishScreen = true;


      }
      // if (this.evaluationsService.documentsRetain) {
      //   const { data, grid }: any = this.evaluationsService.documentsRetain;
      // }

    })
  }

  buttonClick(e: any, type: any) {
    console.log(type, 'typetype');

    switch (type) {
      case "seetings":
        this.router.navigate(["admin/evaluations/newEvaluation"], {
          queryParams: { id: this.evaluationId, type: 'edit' },
        });
        break;
      case "Published":
        this.published()
        break;
      case "UnPublished":
        this.published()
        break;
      case "reOrder":
        this.showReorderModal = true
        break;
      case "delete":
        this.showdeleteEvalution = true;
        break;
      case "deleteResponse":
        this.showdeleteResponse = true;
        break;
      case "newQuestion":
        this.router.navigate(['admin/evaluations/newQuestion'], {
          queryParams: { id: this.evaluationId },
        })
        break;

    }
  }


  published() {
    const reqObj = {
      "isPublished": !this.evaluationData.isPublished,
      "sendAlert": this.emailSelectedValue

    }
    this.evaluationsService.putPublished(this.evaluationId, reqObj).subscribe((data: any) => {
      this.getQuestions();
      this.getEvalutionById();
    })
  }

  // unPublished() {
  //   const reqObj = {
  //     "isPublished": this.evaluationData.isPublished,
  //     "sendAlert": false
  //   }
  //   this.evaluationsService.putUnPublished(this.evaluationId,reqObj).subscribe((data: any) => {
  //     this.getQuestions();
  //     this.getEvalutionById();
  //   })
  // }


  readAccessClick(data: any) {
    if (data.event.target.checked) {
      data.selected.parentReadselected = true;
    } else {
      data.selected.parentReadselected = false;

    }

    this.updateParentSelection();

  };

  writeAccessClick(data: any) {
    if (data.event.target.checked) {
      data.selected.parentWriteselected = true;
    } else {
      data.selected.parentWriteselected = false;
    }

    this.updateParentSelection();
  };


  updateParentSelection() {

    this.gridData.forEach((element: any) => {
      element.parentReadselected = false;
      element.parentWriteselected = false;

      let writechildSelected = 0;
      let readChildSelected = 0;

      if (element.users != null && element.users.length > 0) {
        element.users.forEach((child: any) => {
          if (child.childReadselected) {
            readChildSelected += 1

          }
          if (child.childWriteselected)
            writechildSelected += 1
        });

        if (readChildSelected == element.users.length) {
          element.parentReadselected = true
        }
        if (writechildSelected == element.users.length) {
          element.parentWriteselected = true
        }

      }


    });
  }


  changeCheckbox(e: any) {
    this.emailSelectedValue = e;
  }

  reordeerModalAction(e: any) {
    if (e == 'cancel') {
      this.showReorderModal = false;
    } else {
      
    }
  }
  deleteEvalution(e: any) {
    if (e == 'cancel') {
      this.showdeleteEvalution = false;
    } else {
      this.evaluationsService.deleteEvalution(this.evaluationId).subscribe((data: any) => {
        this.showdeleteEvalution = false;
        this.getQuestions()
      })
    }

  }

  deleteEvaluationQuestion(e: any) {
    if (e == "cancel") {
      this.showDeleteQuestion = false;
    } else {
      this.evaluationsService
      .deleteEvaluationQuestion(this.evaluationId, this.evaluationQuestionId)
      .subscribe((data: any) => {
        if(data.result){
          this.showDeleteQuestion = false;
          this.toastr.showToastr("success", "Question Deleted Successfully!");
            this.getQuestions();
        }
        else {
          this.showDeleteQuestion = false;
          this.toastr.showToastr("info", "No Response Available!");
        }
      });
    }
  }

  deleteResponse(e: any) {
    if (e == 'cancel') {
      this.showdeleteResponse = false;
    } else {
      this.evaluationsService.deleteResponse(this.evaluationId).subscribe((data: any) => {
        this.showdeleteResponse = false
      })
    }

  }

  /*onClickLink(data: any) {
    console.log(data, 'dataaa');
    this.router.navigate(["admin/evaluations/newQuestion"], {
      queryParams: { id: this.evaluationId, questionId: data.data.evaluationQuestionId, type: 'edit' },
    });

  }*/

  onClickLink(data: any) {
    this.pageType = "edit";
    this.evaluationQuestionId = data.evaluationQuestionId;
    // this.showEditQuestion = true;
    this.router.navigate(["admin/evaluations/newQuestion"], {
      queryParams: { id: this.evaluationId, questionId: this.evaluationQuestionId, type: 'edit' },
    });
  }

  backNavigation() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute })
  }
  ngOnChanges(): void {
    console.log(this.gridData, 'ngOnChanges');

    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }
  reOrderEvalution(e: any) {
    console.log(this.gridData, 'dataaa');
    if (e == 'cancel') {
      this.showReorderModal = false;
    } else {
      let temparray: any = [];
      this.gridData.data.forEach((element: any) => {
        let obj = {
          evaluationQuestionId: element.evaluationQuestionId,
          order: element.reOrder
        }
        temparray.push(obj)
      });
      const reqObj = {
        "questionOrderList": temparray
      }
      this.evaluationsService.reorderQuestions(this.evaluationId, reqObj).subscribe((data: any) => {
        this.showReorderModal = false;
      })
    }

  }

  dragAndDropGrid(data: any) {
    this.gridData = data;
    console.log(data, 'dataaaaaaaaa');

  }

  childLinkClick(e: any) {
    console.log(e, 'eeee');

    this.router.navigate(["admin/evaluations/newQuestion"], {
      queryParams: { id: this.evaluationId, questionId: e.child.evaluationQuestionId, type: 'edit' },
    });

  }

  ationTaken(e: any) {
    if (e.action === "Edit") {
      this.onClickLink(e.data);
    } else if (e.action === "Delete") {
      this.evaluationQuestionId = e.data.evaluationQuestionId;
      this.showDeleteQuestion = true;
    }
  }

  addDocument(e: any) {
    console.log(e);    
    this.evaluationsService.documentsRetain = {
      data: e.value,
      grid: this.gridData,
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
      // this.evaluationsService
      //   .deleteDocumentById(this.evaluationId, item.DocumentId)
      //   .subscribe(
      //     (res) => {
      //       if (res) {
      //         this.toastr.showToastr(
      //           "success",
      //           "Document Deleted Successfully!"
      //         );
      //       }
      //     },
      //     (err: any) => {
      //       this.setError(err.error.result.errorMessages);
      //     }
      //   );
    }
  }
}
