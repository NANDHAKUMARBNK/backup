import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { Location } from "@angular/common";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
import { DialogRef, DialogService } from "@progress/kendo-angular-dialog";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
import { createEvent, download } from "../meeting-details/ics-download-utils";
import { environment } from "environments/environment";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { ROLES } from 'lib-bw-svc-apis/src/lib/constant/commonConstant';

@Component({
  selector: "app-event-details",
  templateUrl: "./event-details.component.html",
  styleUrls: ["./event-details.component.scss"],
})
export class EventDetailsComponent implements OnInit {
  eventDetailsForm: FormGroup;
  slForm: FormGroup;
  pageMode: any;
  eventId: any;
  headerName: any = "Event Details";
  defaultItems: any = [
    {
      text: "Meetings & Events",
      title: "Meetings & Events",
    },
  ];
  eventTitle: any;
  documentData: any = [];
  actions: any = ["Edit", "Delete"];
  boardName: any;
  startDate: any;
  endDate: any;
  eventDate: any;
  mapUrl: any;
  meetingUrl: any;
  timeZone: any;
  eventLocation: any;
  eventArea: any;
  isShowToggle: boolean = false;
  isOnlineMeeting: boolean = false;
  selectAllData: any = [
    { name: "Select All", value: "Select All", selected: false },
  ];
  events: any;
  eventDesc: any;
  start: any;
  end: any;
  errMessage: any;
  isError: boolean = false;
  st: any;
  ed: any;
  eventData: any;
  isShowSelectAll: boolean = false;
  onCellClicked: any = [];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "title",
      title: "Title",
      filterType: "text",
      component: "link",
      isEnableColumnOptions: false,
    },
    {
      field: "fileSize",
      title: "File Size",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "displayDate",
      title: "Modified Date",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "modifiedBy",
      title: "Modified By",
      isEnableColumnOptions: false,
    },
  ];
  gridData: any;
  fromPage: any;
  showLoader: boolean = false;
  role: any;
  isAdminPermission = true;
  userPermission: any;
  constructor(
    private activateRoute: ActivatedRoute,
    private meetingService: MeetingsService,
    private location: Location,
    private storage: StorageService,
    private commonService: CommonService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    public dialog: DialogRef,
    private dialogService: DialogService,
    private viewFileDocService: ViewFileDocService
  ) {
    this.pageMode = this.activateRoute.snapshot.params.type;
    this.eventId = this.activateRoute.snapshot.params.id;
    this.fromPage = this.activateRoute.snapshot.params.from;
    this.eventDetailsForm = this.fb.group({
      documentIds: [""],
    });
    this.slForm = this.fb.group({
      selectAllIds: [""],
    });
    if (this.fromPage) {
      this.defaultItems[0].title = 'Home';
      this.defaultItems[0].text = 'Home'
    }

    this.role = JSON.parse(window.sessionStorage['roles_data']);
    this.userPermission = JSON.parse(window.sessionStorage['rolePermission']);
    if (this.role.type == ROLES.administrators ||
      this.role.type == ROLES.documentAdmins ||
      this.role.type == ROLES.userAdmins ||
      this.role.type == ROLES.committeeAdmins) {
     
      this.isAdminPermission = true
    } else {
      this.isAdminPermission = false
    }
  }

  ngOnInit(): void {
    if (this.pageMode === "view") {
      this.getEventsById(this.eventId);
      let loggedBoard: any = this.storage.getData("loggedInBoard");
      let overAllBoards: any = JSON.parse(this.storage.getData("boards"));
      let boardData: any = overAllBoards.filter(
        (item: any) => item.clientBoardId === loggedBoard
      );
      this.boardName = boardData ? boardData[0].title : "Not Specified";
    }
  }
  getEventsById(id: any) {
    this.meetingService.getEventDetails(id).subscribe((response: any) => {
      if (response && response.result && response.result.eventItem) {
        let data: any = response.result.eventItem;
        this.eventData = response.result.eventItem;
        this.eventDesc = data.description;
        this.start = data.startDate;
        this.end = data.endDate;
        this.eventTitle = data.title;
        this.timeZone = data.timeZone;
        this.st = data.startDateTime;
        this.ed = data.endDateTime;
        this.eventLocation = data.location;
        let breadCrumbObject: any = [
          {
            title: this.eventTitle,
            text: this.eventTitle,
          },
        ];
        this.defaultItems = [...this.defaultItems, ...breadCrumbObject];
        this.startDate = this.commonService.formatDate(
          data.startDateTime,
          "meetingDetails"
        );
        this.endDate = this.commonService.getTime(data.endDateTime);
        this.eventDate =
          this.startDate && this.endDate
            ? `${this.startDate} - ${this.endDate}`
            : "Not Specified";
        this.eventArea =
          this.timeZone && `(UTC 05:00) ${this.timeZone} (US & Canada)`;
      }
      if (
        response &&
        response.result &&
        response.result.attachmentItems &&
        response.result.attachmentItems.length
      ) {
        if (response.result.attachmentItems.length > 1) {
          this.isShowSelectAll = true;
        }
        this.documentData = response.result.attachmentItems;
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
            linkTextName : c.title,
            TwolinkTextName: c.title,
            displayDate:
              this.commonService.formatDate(c.modifiedDate) +
              " " +
              this.commonService.getTime(c.modifiedDate, "without"),
            modifiedBy: c.modifiedBy,
          };
        });
        this.gridData = this.documentData;
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
  eventActions(e: any) {
    this.isShowToggle = !this.isShowToggle;
  }
  actionClick(e: any, type: any) {
    if (type === "delete") {
      const dialogRef = this.dialogService.open({
        content: ConfirmModalComponent,
      });
      const info = dialogRef.content.instance;
      info.headerTitle = "Delete Confirmation";
      info.customMessage = "Are you sure you want to delete this Event?";
      info.bodyMessage =
        "Deleting this Events will remove the events and any activities that has been associated with it from BoardWorks and any linked devices.";
      info.isEnableHeader = true;
      info.isCustomBody = true;
      info.isDeleteBody = true;
      info.isEnableFooter = true;
      dialogRef.result.subscribe((result: any) => {
        if (result.text == "SAVE") {
          this.deleteEvent();
          this.isShowToggle = false;
          this.router.navigate(["admin/meetings"]);
        } else {
          this.isShowToggle = false;
        }
      });
    } else if (type === "copy") {
      this.router.navigate([`../newEvent/information`], {
        relativeTo: this.activateRoute,
        queryParams: {
          page: "info",
          type: "copy",
          eventId: this.eventId,
          commiteeId: this.eventData.committeeId,
        },
      });
    } else if (type === "edit") {
      this.router.navigate([`../newEvent/information`], {
        relativeTo: this.activateRoute,
        queryParams: {
          page: "info",
          type: "edit",
          eventId: this.eventId,
          commiteeId: this.eventData.committeeId,
        },
      });
    } else if (type === "addToCalendar") {
      this.meetingService
        .getEventAddToCalender(this.eventId)
        .subscribe((res: any) => {
          console.log(res);
        });
      this.events = [
        {
          start: new Date(this.st),
          end: new Date(this.ed),
          summary: this.eventTitle,
          description: this.eventDesc,
          location: this.eventLocation,
          url: this.isOnlineMeeting
            ? this.meetingUrl
            : "",
        },
      ];
      let content: any = createEvent(this.events);
      if (content) download(`${this.eventTitle}.ics`, content);
    }
  }
  deleteEvent() {
    this.meetingService
      .deleteMeetingById(this.eventId)
      .subscribe((res: any) => {
        if (res) {
          this.toastr.showToastr("success", "Event Deleted Successfully!");
          this.meetingService.meetingListAPICall.emit(true);
          this.router.navigate(["admin/meetings"]);
        }
      });
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  onClickLink(e: any) {
    const { type, data }: any = e;
    data['fileType'] = null;
    if (type === "link") {
      let url = `${environment.baseUrl}${apiConstant.meetings}/${this.eventId}/${apiConstant.documents}/${data.documentId}`;
      console.log(url, data);      
      // this.viewFileDocService.viewfile(
      //   data,
      //   url
      // );
      this.downloadDocuments(url, [], data);
    }
  }

  onClickAction(e: any) {}

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
