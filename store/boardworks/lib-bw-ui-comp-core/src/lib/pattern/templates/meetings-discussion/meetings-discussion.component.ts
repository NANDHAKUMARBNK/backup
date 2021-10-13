import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DialogRef, DialogContentBase } from "@progress/kendo-angular-dialog";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
import { DatePipe } from "@angular/common";
@Component({
  selector: "bw-meetings-discussion",
  templateUrl: "./meetings-discussion.component.html",
  styleUrls: ["./meetings-discussion.component.scss"],
  providers: [DatePipe],
})
export class MeetingsDiscussionComponent
  extends DialogContentBase
  implements OnInit {
  actions: any = ["Edit"];
  @Output() closeDialog: any = new EventEmitter<any>();
  @Input() meetingId: any;
  errMessage: any;
  isError: boolean = false;
  title: any = "StandUp";
  headerTitle: any = "Discussions";
  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: true,
    lock: false,
    stick: false,
  };
  gridData: any = [];
  columnsData: any = [
    {
      title: "DISCUSSION",
      filterType: "text",
      width: "300px",
      isEnableColumnOptions: false,
      field: "linkTextName",
      component: 'link'
    },
    {
      field: "replyCount",
      title: "RESPONSES",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "createdBy",
      title: "POSTED BY",
      isEnableColumnOptions: false,
    },
    {
      field: "modifiedDate",
      title: "LAST MODIFIED",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "reply",
      title: "Replies",
      width: "100px",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "iconAction",
    },
    {
      isEnableColumnOptions: false,
      component: "icon",
    },
  ];
  isShowReplyDiscussions: boolean = false;
  discussionDetails: any = [];
  isUpdateDiscussion: boolean = false;
  gridDetails: any;
  tempDiscussionArray: any = [];
  constructor(
    public dialog: DialogRef,
    private meetingService: MeetingsService,
    private datePipe: DatePipe
  ) {
    super(dialog);
  }
  ngOnInit(): void {
    this.fetchDiscussions();
  }
  fetchDiscussions() {
    this.tempDiscussionArray = [];
    this.meetingService
      .getDiscussions(this.meetingId)
      .subscribe((response: any) => {
        const { result }: any = response;
        result.filter((res: any) => {
          res['showIcon'] = true;
          if (res.discussions.length === 0) {
            res["isUpDown"] = false;
          } else {
            this.getReplyDiscussionsData(res, 0);
            res.discussions = this.tempDiscussionArray;            
          }
          res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
          res["isUpiconClass"] = "mdi mdi-chevron-up f-30";
          res["isUpDown"] = true;
          res['linkTextName'] = res.subject;
          res["isSelected"] = false;
          res.modifiedDate = this.datePipe.transform(
            res.modifiedDate,
            "MMM dd YYYY hh:mm:ss"
          );
        });
        console.log(result);        
        this.gridData = result;
      });
  }
  getReplyDiscussionsData(data: any, i: any) {
    if (data.discussions.length > 0) {
      data.discussions.map((ele: any, index: any) => {
        ele['index'] = 0;
        const subject = ele.subject.split(/\W+/g);
        subject.find((word: any, idx: any) =>
          subject.slice(0, idx).includes(word)
        );
        subject.map((re: any) => {
          if (re == 'Re') { ele.index++; }
        });
        const linkClass = ele['index'] && ele['index'] > 4 ? 'ms-5' : `ms-${ele['index'] + 1}`
        ele.modifiedDate = this.datePipe.transform(ele.modifiedDate, "MMM dd YYYY");
        ele["editLinkText"] = ele.subject;
        ele['linkTextName'] = ele.subject;
        ele['showIcon'] = true;
        ele['childLinkClassName'] = linkClass;
        this.tempDiscussionArray.push(ele);
        this.getReplyDiscussionsData(ele, index);
      })
    }
  }
  public onAction(type: any, e?: any): void {
    if (type === "cancel") {
      const req: any = {
        type: "cancel",
        data: null,
      };
      this.closeDialog.emit(req);
    } else if (type == 'discussionCancel') {
      this.fetchDiscussions();
      this.isShowReplyDiscussions = false;
    }
  }
  onHandleClick(type: any) {
    if (type == 'new-discussion') {
      this.isShowReplyDiscussions = true;
    } else if (type == 'expand-all') {
      this.gridData.forEach((item: any, idx: any) => {
        this.gridDetails.expandRow(idx);
      });
    } else if (type == 'collapse-all') {
      this.gridData.forEach((item: any, idx: any) => {
        this.gridDetails.collapseRow(idx);
      });
    }
  }
  expandAndCollapseGrid(event: any) {
    this.gridDetails = event;
  }
  accrodianClick(e: any) {
    console.log(e);
    if (e.event.isSelected) {
      e.grid.collapseRow(e.rowIndex)
    } else if (e.event.isSelected == false) {
      e.grid.expandRow(e.rowIndex);
    }

    this.gridData.forEach((element: any, index: any) => {
      if (e.event.collaborationId == element.collaborationId) {
        element.isUpDown = !element.isUpDown
        element.isSelected = !element.isSelected;
      }
    });
  }
  onClickAction(e: any) { }
  onClickLink(e: any) {
    console.log(e);
    switch (e.type) {
      case 'iconAction':
        this.iconClick(e);
        break;
      case 'link':
        this.discussionDetails = e.data
        this.isShowReplyDiscussions = true;
        this.isUpdateDiscussion = true;
        console.log(this.meetingId, this.discussionDetails);
        break;
      case 'childIcon':
        this.iconClick(e);
        break;
    }
  }

  iconClick(e: any) {
    const { type, data }: any = e;
    const req: any = {
      type: "reply",
      data: data,
    };
    this.closeDialog.emit(req);
  }
  seterror(e?: any) { }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
