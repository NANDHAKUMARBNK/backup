import { Component, OnInit, ViewChild } from '@angular/core';
import { CollaborationService } from 'lib-bw-svc-apis/src/lib/collaboration/collaboration.service';
import { DatePipe } from "@angular/common";
import { StorageService } from 'lib-bw-svc-apis/src/lib/storage/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "environments/environment";
import { apiConstant } from 'lib-bw-svc-apis/src/lib/constant/apiConstant';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewFileDocService } from 'lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service';
import { ConfirmModalComponent } from 'lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component';
import { DialogService } from '@progress/kendo-angular-dialog';
import { ToastrService } from 'lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";

@Component({
  selector: 'app-view-collaboration',
  templateUrl: './view-collaboration.component.html',
  styleUrls: ['./view-collaboration.component.scss'],
  providers: [DatePipe]
})
export class ViewCollaborationComponent implements OnInit {
  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: true,
    lock: false,
    stick: false,
  };


  gridData: any = []

  // columnsData: any = [
  //   {
  //     field: "workspace",
  //     title: "Collaboration Workspace",
  //     filterType: "text",
  //     isEnableColumnOptions: false,
  //     width: "250px"
  //     //component:"collaboration"
  //   },
  //   {
  //     field: "meetingTitle",
  //     title: "Meeting Title",
  //     filterType: "text",
  //     isEnableColumnOptions: false,
  //     width: "140px"
  //     //component:"collaboration"
  //   },
  //   {
  //     field: "fileName",
  //     title: "file Name",
  //     filterType: "text",
  //     isEnableColumnOptions: false,
  //   },
  //   {
  //     field: "totalFileSize",
  //     title: "file Size",
  //     filterType: "text",
  //     isEnableColumnOptions: false,
  //   },
  //   {
  //     field: "modifiedDate",
  //     title: "Modified",
  //     filterType: "text",
  //     isEnableColumnOptions: false,
  //   },

  //   {
  //     field: "modifiedBy",
  //     title: "Modified by",
  //     filterType: "text",
  //     width: "120px",
  //     isEnableColumnOptions: false,
  //   },

  //   {
  //     field: "linkTextName ",
  //     title: "Actions",
  //     filterType: "text",
  //     isEnableColumnOptions: false,
  //     component: "link",

  //   },

  //   {
  //     field: "TwolinkTextName ",
  //     title: "",
  //     filterType: "text",
  //     isEnableColumnOptions: false,
  //     component: "TwolinkTextName",

  //   },

  //   {
  //     field: "useTemplate",
  //     title: "",
  //     component: 'useTemplate',
  //     isEnableColumnOptions: false,
  //   },
  //   {
  //     field: "",
  //     title: "",
  //     //component: 'useTemplate',
  //     isEnableColumnOptions: false,
  //     component: "icon",
  //   },

  // ];
  columnsData: any;
  userPermission: any;
  addWorkspaceBtn: boolean = false;
  addEditDeleteDocument: boolean = false;
  showdeleteFloder: boolean = false;
  selectedData: any;
  showdeleteChild: boolean = false;
  selectedChildData: any;
  showLoader: boolean = false;
  errMessage: any;
  isError: boolean = false;
  constructor(private collaborationService: CollaborationService,
    private datePipe: DatePipe,
    private storge: StorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storageService: StorageService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private viewFileDocService: ViewFileDocService,
    private dialogService: DialogService,
    private toastrService: ToastrService,
    private meetingService: MeetingsService

  ) { }

  ngOnInit(): void {
    this.userPermission = this.storge.getData('rolePermission') && JSON.parse(this.storge.getData('rolePermission'));
    this.userPermission && this.userPermission.permission && this.userPermission.permission.Collaboration && this.userPermission.permission.Collaboration.forEach((element: any) => {
      console.log(element);
      if (element.action == "AddWorkspace" && element.permission == "Allow") {
        this.addWorkspaceBtn = true;

        this.columnsData = [
          {
            field: "workspace",
            title: "Collaboration Workspace",
            filterType: "text",
            isEnableColumnOptions: false,
            width: "250px"
            //component:"collaboration"
          },
          {
            field: "meetingTitle",
            title: "Meeting Title",
            filterType: "text",
            isEnableColumnOptions: false,
            width: "140px"
            //component:"collaboration"
          },
          {
            field: "fileName",
            title: "file Name",
            filterType: "text",
            isEnableColumnOptions: false,
          },
          {
            field: "totalFileSize",
            title: "file Size",
            filterType: "text",
            isEnableColumnOptions: false,
          },
          {
            field: "modifiedDate",
            title: "Modified",
            filterType: "text",
            isEnableColumnOptions: false,
          },
          {
            field: "modifiedBy",
            title: "Modified by",
            filterType: "text",
            width: "120px",
            isEnableColumnOptions: false,
          },
          {
            field: "linkTextName ",
            title: "Actions",
            filterType: "text",
            isEnableColumnOptions: false,
            component: "link",
          },
          {
            field: "TwolinkTextName ",
            title: "",
            filterType: "text",
            isEnableColumnOptions: false,
            component: "TwolinkTextName",
          },
          {
            field: "useTemplate",
            title: "",
            component: 'useTemplate',
            isEnableColumnOptions: false,
          },
          {
            field: "",
            title: "",
            //component: 'useTemplate',
            isEnableColumnOptions: false,
            component: "icon",
          },
        ];
      }

      if (element.action != "AddWorkspace" && element.permission != "Allow") {
        this.columnsData = [
          {
            field: "workspace",
            title: "Collaboration Workspace",
            filterType: "text",
            isEnableColumnOptions: false,
            width: "250px"
            //component:"collaboration"
          },
          {
            field: "meetingTitle",
            title: "Meeting Title",
            filterType: "text",
            isEnableColumnOptions: false,
            width: "140px"
            //component:"collaboration"
          },
          {
            field: "fileName",
            title: "file Name",
            filterType: "text",
            isEnableColumnOptions: false,
          },
          {
            field: "totalFileSize",
            title: "file Size",
            filterType: "text",
            isEnableColumnOptions: false,
          },
          {
            field: "modifiedDate",
            title: "Modified",
            filterType: "text",
            isEnableColumnOptions: false,
          },
          {
            field: "modifiedBy",
            title: "Modified by",
            filterType: "text",
            width: "120px",
            isEnableColumnOptions: false,
          },
          {
            field: "TwolinkTextName ",
            title: "",
            filterType: "text",
            isEnableColumnOptions: false,
            component: "TwolinkTextName",
          },
          {
            field: "useTemplate",
            title: "",
            component: 'useTemplate',
            isEnableColumnOptions: false,
          },
          {
            field: "",
            title: "",
            //component: 'useTemplate',
            isEnableColumnOptions: false,
            component: "icon",
          },
        ];
      }

      if (element.action == "AddEditDeleteDocument" && element.permission == "AllowPrivate") {
        this.addEditDeleteDocument = true
      }
    })
    this.getCollaboration();
  }


  getCollaboration() {
    this.collaborationService.getCollaborations().subscribe((data: any) => {
      // this.ollaborations
      let result: any = data.result.sort(function (a: any, b: any) {
        let B: any = new Date(b.modifiedDate);
        let A: any = new Date(a.modifiedDate);
        return B - A;
      });
      console.log(result, 'result');

      result.filter((res: any) => {
        // res.documents.filter((ele: any) => {
        //   delete ele.title;
        // })

        if (res.documents.length == 0) {
          res["isUpDown"] = false;
        } else {
          res.documents.filter((ele: any) => {
            ele.modifiedDate = this.datePipe.transform(ele.modifiedDate, 'MMM dd YYYY');

          })
          res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
          res["isUpiconClass"] = "mdi mdi-chevron-up f-30"
          res["isUpDown"] = true;
        };

        res.modifiedDate = this.datePipe.transform(res.modifiedDate, 'MMM dd YYYY');

        // if (res.canEdit && res.canDelete) {
        //   res["linkTextName"] = "EDIT";
        //   res["TwolinkTextName"] = "DELETE"
        // } 
        if (res.canDelete) {
          res["TwolinkTextName"] = "DELETE";
          res.linkText = true;

        }
        if (res.canEdit) {
          res["linkTextName"] = "EDIT";

        }
        //res["useTemplate"] = "ADD FILE";

        if (res.canChangeDocuments) {
          res["useTemplate"] = "ADD FILE";
        }
        res["isSelected"] = false;


      });
      // this.gridData = [
      //   {
      //     collaboration:   data.result
      //   },
      // ];
      console.log(result, 'resultresultresult');

      this.gridData = result;
    },
      error => {

      }
    )
  }

  newCollaboration(event: any) {
    this.router.navigate(['addWorkSpace'], { relativeTo: this.activatedRoute })
  }


  insideAccordion(e: any) {

  }

  accrodianClick(data: any) {

    if (data.event.isSelected) {
      data.grid.collapseRow(data.rowIndex)
    } else if (data.event.isSelected == false) {
      data.grid.expandRow(data.rowIndex);
    }

    this.gridData.forEach((element: any, index: any) => {
      if (data.event.collaborationId == element.collaborationId) {
        element.isUpDown = !element.isUpDown
        element.isSelected = !element.isSelected;
      }
    });
  }

  onClickLink(e: any) {
    console.log(e, 'eeee');

    if (e.type === "ADD FILE") {
      this.router.navigate([`admin/collaborations/addDocument/${e.data.collaborationId}`])
    };
    if (e.type === "link") {
      this.router.navigate([`admin/collaborations/editWorkSpace/${e.data.collaborationId}`])
    };
    if (e.type === "TwolinkTextName") {
      this.selectedData = e;
      this.showdeleteFloder = true;
      // const dialogRef = this.dialogService.open({ content: ConfirmModalComponent });
      // const info = dialogRef.content.instance;
      // info.headerTitle = 'Delete Confirmation';
      // info.bodyMessage = "Are you sure you want to delete it?"
      // info.bodyDescrption = "bodyDescrption";
      // info.isEnableHeader = true;
      // info.isDeleteBody = true;
      // info.isEnableFooter = true;
      // dialogRef.result.subscribe((result: any) => {
      //   if (result.text == 'Yes') {
      //     this.deleteRootCall(e.data.collaborationId)
      //   }
      // });
    };

    if (e.type === "file") {
      let url = ` ${environment.baseUrl}${apiConstant.collaborations}/Documents/${e.data.documentId}`
      // this.viewFileDocService.viewfile(e.data, url)
      this.downloadDocuments(url, [], e.data);
    }
  }

  deleteRootCall(id: any) {
    this.collaborationService.deleteCollabortion(id).subscribe((data: any) => {
      this.getCollaboration();
      this.showdeleteFloder = false;
    },
      error => {
        this.toastrService.showToastr(
          "error",
          error.error.result.errorMessages
        );
      }
    )

  };

  deleteChildCall(data: any) {
    console.log(data);

    this.collaborationService.deleteDocumentCollabortion(data.parentData.collaborationId, data.child.documentId).subscribe((data: any) => {
      this.getCollaboration();
      this.showdeleteChild = false
    },
      error => {
        this.toastrService.showToastr(
          "error",
          error.error.result.errorMessages
        );
      }
    )
  };

  childDeleteClick(data: any) {
    this.showdeleteChild = true;
    this.selectedChildData = data;

    // const dialogRef = this.dialogService.open({ content: ConfirmModalComponent });
    // const info = dialogRef.content.instance;
    // info.headerTitle = 'Delete Confirmation';
    // info.bodyMessage = "Are you sure you want to delete it?"
    // info.bodyDescrption = "bodyDescrption";
    // info.isEnableHeader = true;
    // info.isDeleteBody = true;
    // info.isEnableFooter = true;
    // dialogRef.result.subscribe((result: any) => {
    //   if (result.text == 'Yes') {
    //     this.deleteChildCall(data)
    //   }
    // });
  }


  deleteModalAction(type: any) {
    console.log(type, 'typeeeee');
    if (type == 'save') {
      this.deleteRootCall(this.selectedData.data.collaborationId)
    } else {
      this.showdeleteFloder = false;
      this.selectedData = "";

    }
  }

  deleteChildModalAction(type: any) {
    console.log(type, 'typeeeee');
    if (type == 'save') {
      this.deleteChildCall(this.selectedChildData)
    } else {
      this.showdeleteChild = false
      this.selectedData = "";

    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
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
