import { ViewFileDocService } from 'lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CollaborationService } from 'lib-bw-svc-apis/src/lib/collaboration/collaboration.service';
import { apiConstant } from 'lib-bw-svc-apis/src/lib/constant/apiConstant';
import { environment } from "environments/environment";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";

@Component({
  selector: 'app-collaboration-all',
  templateUrl: './collaboration-all.component.html',
  styleUrls: ['./collaboration-all.component.scss'],
})
export class CollaborationAllComponent implements OnInit {
  @Input() pageType: any;
  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: true,
    lock: false,
    stick: false,
  };


  gridData: any = [];
  showLoader: boolean = false;
  errMessage: any;
  isError: boolean = false;
  columnsData: any = [
    {
      field: "workspace",
      title: "Collaboration Workspace",
      filterType: "text",
      isEnableColumnOptions: false,
      width: "220px"
      //component:"collaboration"
    },
    {
      field: "title",
      title: "Meeting Title",
      filterType: "text",
      isEnableColumnOptions: false,
      width: "130px"
      //component:"collaboration"
    },
    {
      field: "fileName",
      title: "file Name",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "fileSize",
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
      width: "130px",
      isEnableColumnOptions: false,
    },

    {
      field: "  ",
      title: " ",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "link",

    },
    {
      field: "",
      title: "",
      //component: 'useTemplate',
      isEnableColumnOptions: false,
      component: "icon",
    },





  ];

  @Output() onSelectClick = new EventEmitter();
  constructor(
    private collaborationService: CollaborationService,
    private viewFileDocService: ViewFileDocService,
    private meetingService: MeetingsService
  ) { }

  ngOnInit(): void {
    this.getCollaboration();
  }


  getCollaboration() {
    this.collaborationService.getCollaborations().subscribe((data: any) => {
      // this.ollaborations
      data.result.filter((res: any) => {
        if (res.documents.length == 0) {
          res["isUpDown"] = false;
        } else {
          res.documents.filter((ele: any) => {
            // ele.modifiedDate = this.datePipe.transform(ele.modifiedDate, 'MMM dd YYYY');
            if (this.pageType == 'openAgendaworkspaceModal') {
              ele.feildText = "Select"

            } else if (this.pageType == 'documentCollaboration') {
              ele.feildText = "checkbox";
              ele.docChecked = false;

            } else {
              ele.feildText = "empty";

            }
          })
          res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
          res["isUpiconClass"] = "mdi mdi-chevron-up f-30"
          res["isUpDown"] = true;
        };

        //res.modifiedDate = this.datePipe.transform(res.modifiedDate, 'MMM dd YYYY');


        res["isSelected"] = false;


      })
      // this.gridData = [
      //   {
      //     collaboration:   data.result
      //   },
      // ];
      this.gridData = data.result;
    },

      (error: any) => {

      }
    )
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

  selectClick(e: any) {
    console.log(e, 'eeeeeee');


    this.onSelectClick.emit(e)

  }

  onClickLink(e: any) {
    console.log(e, 'eeee');
    if (e.type === "file") {
      let url = ` ${environment.baseUrl}${apiConstant.collaborations}/Documents/${e.data.documentId}`
      // this.viewFileDocService.viewfile(e.data, url)
      this.downloadDocuments(url, [], e.data);
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
