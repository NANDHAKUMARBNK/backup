import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
import { Location } from "@angular/common";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { DialogRef, DialogService } from "@progress/kendo-angular-dialog";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { environment } from "environments/environment";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { createEvent, download } from "./ics-download-utils";
import { MeetingsDetailSendEmailUsersModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/send-email-modal/send-email-modal.component";
import { ROLES } from "lib-bw-svc-apis/src/lib/constant/commonConstant";
@Component({
  selector: "app-meeting-details",
  templateUrl: "./meeting-details.component.html",
  styleUrls: ["./meeting-details.component.scss"],
})
export class MeetingDetailsComponent implements OnInit {
  meetingDetailsForm: any;
  slForm: any;
  pageMode: any;
  meetingId: any;
  headerName: any = "Meeting Details";
  defaultItems: any = [
    {
      text: "Meetings & Events",
      title: "Meetings & Events",
    },
  ];
  meetingTitle: any;
  documentData: any = [];
  actions: any = ["Edit", "Delete"];
  boardName: any;
  startDate: any;
  endDate: any;
  meetingDate: any;
  mapUrl: any;
  meetingUrl: any;
  timeZone: any;
  meetingLocation: any;
  meetingArea: any;
  isShowToggle: boolean = false;
  isOnlineMeeting: boolean = false;
  selectAllData: any = [
    { name: "Select All", value: "Select All", selected: false },
  ];
  events: any;
  meetingDesc: any;
  start: any;
  end: any;
  errMessage: any;
  isError: boolean = false;
  st: any;
  ed: any;
  meetingData: any;
  isShowSelectAll: boolean = false;
  isShowDiscussions: boolean = false;
  isShowReplyDiscussions: boolean = false;
  showdeleteMeeting: boolean = false;
  discussionDetails: any;
  isAgendaFlag: boolean = false;
  role: any;
  rolesList: any;
  showLoader: boolean = false;
  fromPage: any;
  constructor(
    private activateRoute: ActivatedRoute,
    private meetingService: MeetingsService,
    private location: Location,
    private storage: StorageService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: DialogRef,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private viewFileDocService: ViewFileDocService
  ) {
    this.pageMode = this.activateRoute.snapshot.params.type;
    this.meetingId = this.activateRoute.snapshot.params.id;
    this.fromPage = this.activateRoute.snapshot.params.from;
    this.meetingDetailsForm = this.fb.group({
      documentIds: [""],
    });
    this.slForm = this.fb.group({
      selectAllIds: [""],
    });
    this.role = JSON.parse(window.sessionStorage['roles_data']);
    this.rolesList = ROLES;
    if (this.fromPage) {
      this.defaultItems[0].title = 'Home';
      this.defaultItems[0].text = 'Home'
    }
  }

  ngOnInit(): void {
    if (this.pageMode === "view") {
      this.getMeetingsById(this.meetingId);
      let loggedBoard: any = this.storage.getData("loggedInBoard");
      let overAllBoards: any = JSON.parse(this.storage.getData("boards"));
      let boardData: any = overAllBoards.filter(
        (item: any) => item.clientBoardId === loggedBoard
      );
      this.boardName = boardData ? boardData[0].title : "Not Specified";
    }
  }
  getMeetingsById(id: any) {
    this.meetingService.getMeetingDetails(id).subscribe((response: any) => {
      if (response && response.result && response.result.meetingEventItem) {
        let data: any = response.result.meetingEventItem;
        this.meetingData = response.result.meetingEventItem;
        this.meetingDesc = data.description;
        this.start = data.startDate;
        this.end = data.endDate;
        this.meetingTitle = data.title;
        this.mapUrl = data.mapUrl;
        this.isOnlineMeeting = data.isOnlineMeeting;
        this.meetingUrl = data.onlineMeetingUrl;
        this.timeZone = data.timeZone;
        this.st = data.startDateTime;
        this.ed = data.endDateTime;
        this.meetingLocation = data.location;
        let breadCrumbObject: any = [
          {
            title: this.meetingTitle,
            text: this.meetingTitle,
          },
        ];
        this.defaultItems = [...this.defaultItems, ...breadCrumbObject];
        this.startDate = this.commonService.formatDate(
          data.startDateTime,
          "meetingDetails"
        );
        this.endDate = this.commonService.getTime(data.endDateTime);
        this.meetingDate =
          this.startDate && this.endDate
            ? `${this.startDate} - ${this.endDate}`
            : "Not Specified";
        this.meetingArea =
          this.timeZone && `(UTC 05:00) ${this.timeZone} (US & Canada)`;
      }
      if (
        response &&
        response.result &&
        response.result.agendaAndItems &&
        response.result.agendaAndItems.length
      ) {
        if (response.result.agendaAndItems.length > 1) {
          this.isShowSelectAll = true;
        }
        this.documentData = response.result.agendaAndItems;
        this.documentData = this.documentData.map((c: any) => {
          return {
            value: c.documentId,
            selected: false,
            name: c.title,
            isenable: c.documentId ? false : true,
            documentId: c.documentId,
            fileName: c.fileName,
            fileSize: c.fileSize,
            title: c.title,
            type: c.type,
          };
        });
      }
    });
  }
  navigateInto(params: any) {
    if (
      params.text === "Meetings & Events" ||
      params.title === "Meetings & Events"
    ) {
      this.location.back();
    } else {
      this.router.navigate(["admin"]);
    }
  }
  meetingActions(e: any) {
    this.isShowToggle = !this.isShowToggle;
  }
  actionClick(e: any, type: any) {
    if (type === "attendanceReport") {
      this.router.navigate(["admin/meetings/attendance-reports"], {
        queryParams: { meetingId: this.meetingId },
      });
    } else if (type === "delete") {
      this.showdeleteMeeting = true;
    } else if (type === "copy") {
      this.router.navigate([`../newMetting/information`], {
        relativeTo: this.activateRoute,
        queryParams: {
          page: "info",
          type: "copy",
          meetingId: this.meetingId,
          commiteeId: this.meetingData.committeeId,
        },
      });
    } else if (type === "edit") {
      this.router.navigate([`../newMetting/information`], {
        relativeTo: this.activateRoute,
        queryParams: {
          page: "info",
          type: "edit",
          meetingId: this.meetingId,
          commiteeId: this.meetingData.committeeId,
        },
      });
    } else if (type === "addToCalendar") {
      this.meetingService
        .getMeetingAddToCalender(this.meetingId)
        .subscribe((res: any) => {
          console.log(res);
        });
      this.events = [
        {
          start: new Date(this.st),
          end: new Date(this.ed),
          summary: this.meetingTitle,
          description: this.meetingDesc,
          location: this.meetingLocation,
          url: this.isOnlineMeeting
            ? this.meetingUrl
            : "https://meet.google.com/ikn-sfhg-jgs",
        },
      ];
      let content: any = createEvent(this.events);
      if (content) download(`${this.meetingTitle}.ics`, content);
    } else if (type === "sendmail") {
      let dialogRef: any = this.dialogService.open({
        content: MeetingsDetailSendEmailUsersModalComponent,
      });
      let info: any = dialogRef.content.instance;
      info.headerTitle = "Send Email";
      info.bodyMessage = [];
      info.isEnableHeader = true;
      info.isEnableBody = true;
      info.isEnableFooter = true;
      info.meetingId = this.meetingId;
      dialogRef.result.subscribe((result: any) => {
        if (result.text == "Yes") {
          window.location.reload();
          this.isShowToggle = false;
        } else if (result.text == "send-email") {
          this.isShowToggle = false;
          this.toastr.showToastr("success", "Email Sent Successfully!");
          this.router.navigate(["admin/meetings"]);
        } else {
          this.isShowToggle = false;
        }
      });
    } else if (type === "discussions") {
      this.isShowDiscussions = true;
      this.isShowToggle = false;
    } else if (type === "downloadMeetingBook") {
      let url = `${environment.baseUrl}${apiConstant.meetings}/${this.meetingId}/${apiConstant.documents}/${apiConstant.boardBook}`;
      this.downloadDocuments(url, [], { fileName: "download-board-book.pdf" });
      // this.viewFileDocService.viewfile(
      //   {
      //     fileName: "download-board-book.pdf",
      //   },
      //   url
      // );
    }
  }
  deleteMeeting() {
    this.meetingService
      .deleteMeetingById(this.meetingId)
      .subscribe((res: any) => {
        if (res) {
          this.toastr.showToastr("success", "Meeting Deleted Successfully!");
          this.meetingService.meetingListAPICall.emit(true);
          this.router.navigate(["admin/meetings"]);
        }
      });
  }
  clickUrl(e: any, type: any) {
    if (type === "meeting") {
      window.open(this.meetingUrl, "_blank");
    } else if (type === "map") {
      window.open(this.mapUrl, "_blank");
    } else {
    }
  }
  changeCheckbox(e: any, type?: any) {
    this.setError([]);
    if (type === "items") {
      // this.meetingDetailsForm
      //   .get("documentIds")
      //   ?.setValue([...e.map((item: any) => item.value)]);
      this.documentData = this.documentData.map((c: any) => {
        let filterdata: any = e.filter((el: any) => el.name === c.name);
        if (filterdata.length > 0) {
          c["selected"] = true;
        } else {
          c["selected"] = false;
        }
        return c;
      });
      this.meetingDetailsForm
        .get("documentIds")
        .setValue([...this.documentData]);
      if (e.length === this.documentData.length) {
        this.selectAllData = [
          { name: "Select All", value: "Select All", selected: true },
        ];
        this.slForm.get("selectAllIds").setValue(this.selectAllData);
      } else {
        this.selectAllData = [
          { name: "Select All", value: "Select All", selected: false },
        ];
        this.slForm.get("selectAllIds").setValue(this.selectAllData);
      }
    } else {
      if (e && e.length != 0) {
        if (this.documentData) {
          (this.documentData = this.documentData.map((c: any) => {
            c["selected"] = true;
            return c;
          })),
            this.meetingDetailsForm
              .get("documentIds")
              .setValue([...this.documentData]);
        }
      } else {
        if (this.documentData) {
          (this.documentData = this.documentData.map((c: any) => {
            c["selected"] = false;
            return c;
          })),
            this.meetingDetailsForm
              .get("documentIds")
              .setValue([...this.documentData]);
        }
      }
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
  singleDocumentDownload(e: any) {
    this.setError([]);
    let url = `${environment.baseUrl}${apiConstant.meetings}/${this.meetingId}/${apiConstant.documents}/${e.value}`;
    this.downloadDocuments(url, [], { fileName: "sample.pdf" });
  }
  clickButton(type: any) {
    var intersection: any;
    if (type === "download") {
      intersection = this.documentData;
    } else if (type === "downloadBook") {
      // this.meetingService
      //   .downloadBoardBookMeetingById(this.meetingId)
      //   .subscribe((res: any) => {
      //     if (res) {
      //       this.toastr.showToastr(
      //         "success",
      //         "Board Book Download Successfully!"
      //       );
      //       this.meetingService.meetingListAPICall.emit(true);
      //       this.router.navigate(["admin/meetings"]);
      //     }
      //   });
      let url = `${environment.baseUrl}${apiConstant.meetings}/${this.meetingId}/${apiConstant.documents}/${apiConstant.boardBook}`;
      this.downloadDocuments(url, [], { fileName: "download-board-book.pdf" });
      // this.viewFileDocService.viewfile(
      //   {
      //     fileName: "download-board-book.pdf",
      //   },
      //   url
      // );
      // this.toastr.showToastr("success", "Board Book Download Successfully!");
      // this.meetingService.meetingListAPICall.emit(true);
      // this.router.navigate(["admin/meetings"]);
    } else {
      intersection = this.documentData.filter((ele: any) => ele.selected);
    }
    if (intersection && intersection.length > 0) {
      this.isAgendaFlag =
        intersection.filter((it: any) => it.type === "Agenda").length > 0
          ? true
          : false;
      intersection = intersection.filter(
        (r: any) => r.documentId && r.type === "AgendaItem"
      );
      let queryParams: any = "";
      intersection.map((item: any, i: any) => {
        if (i == intersection.length - 1) {
          queryParams += `${item.value}`;
        } else {
          queryParams += `${item.value}&`;
        }
      });
      const nonAgendaIdees: any =
        intersection && intersection.length > 0
          ? `documentIds=${queryParams}&`
          : "";
      let url = `${environment.baseUrl}${apiConstant.meetings}/${this.meetingId}/${apiConstant.documents}/Unified?${nonAgendaIdees}includeAgenda=${this.isAgendaFlag}`;
      this.downloadDocuments(url, [], { fileName: "sample.pdf" });
      // this.viewFileDocService.viewfile(
      //   {
      //     fileName: "sample.pdf",
      //   },
      //   url
      // );
    }
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
  closeDialog(e: any, category?: any) {
    const { type, data }: any = e;
    if (category && category == "reply") {
      this.discussionDetails = data;
      this.isShowDiscussions = true;
      this.isShowReplyDiscussions = false;
    } else if (type === "reply") {
      console.log("data", data);
      this.discussionDetails = data;
      this.isShowDiscussions = false;
      this.isShowReplyDiscussions = true;
    } else if (type === "replied") {
      this.isShowReplyDiscussions = false;
    } else if (type === "cancel") {
      this.isShowDiscussions = false;
      this.isShowReplyDiscussions = false;
    }
  }

  linksModalAction(t: any) {
    if (t == "delete") {
      this.deleteMeeting();
      this.isShowToggle = false;
      this.router.navigate(["admin/meetings"]);
    }
    this.showdeleteMeeting = false;
  }
}
