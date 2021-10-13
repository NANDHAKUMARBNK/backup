import { ROLES } from "./../../../../lib-bw-svc-apis/src/lib/constant/commonConstant";
import { CommonService } from "./../../../../lib-bw-svc-apis/src/lib/common/common.service";
import { EntitiesService } from "lib-bw-svc-apis/src/lib/entities/entities.service";
import { MeetingsService } from "./../../../../lib-bw-svc-apis/src/lib/meetings/meetings.service";
import { CommitteesService } from "./../../../../lib-bw-svc-apis/src/lib/committees/committees.service";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormBuilder } from "@angular/forms";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
import { DialogRef, DialogService } from "@progress/kendo-angular-dialog";
import { IExport } from "./IExport";
import { MapExportData } from "./MapExportData";
import { ExportColumnHeaders } from "./Export-header.modal";
import { ExportService } from "./Export.service";
import { MEETING_EVENT_STATUS } from "lib-bw-svc-apis/src/lib/constant/meetingEventsConstant";
import { ActivatedRoute, Router } from "@angular/router";
import { createEvent, download } from "../meeting-details/ics-download-utils";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { MeetingsDetailSendEmailUsersModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/send-email-modal/send-email-modal.component";
import { DatePipe } from "@angular/common";
import { environment } from "environments/environment";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";

@Component({
  selector: "app-meetings-events-list",
  templateUrl: "./meetings-events-list.component.html",
  styleUrls: ["./meetings-events-list.component.scss"],
  providers: [ExportService, DatePipe],
})
export class MeetingsEventsListComponent implements OnInit {
  meetingEventsForm!: any;
  // meetingActions: any = [
  //   "Attendance Report",
  //   "Export List",
  //   "New Event",
  //   "New Meeting",
  // ];
  // newMeetingActions: any = ["New Event", "New Meeting"];
  // buttonProperties: any = [
  //   {
  //     buttonText: "ACTION",
  //     className:
  //       "btn-base btn-contained secondary-btn-outlined btn-lg bw-font-sec-bold m-2",
  //     buttonAction: "action",
  //     isDisable: false,
  //     withIcon: false,
  //     showButton: true,
  //   },
  // {
  //   buttonText: "NEW",
  //   className:
  //     "btn-base btn-contained secondary-btn-contained btn-lg bw-font-sec-bold m-2",
  //   buttonAction: "new",
  //   isDisable: false,
  //   withIcon: false,
  //   showButton: true,
  // },
  // ];
  defaultSortItem = { name: "Meetings", value: "Meeting" };
  selectField = new FormControl();
  types = [
    { name: "Events", value: "Event" },
    { name: "Meetings & Events", value: "" },
  ];
  date = [{ name: "Select Date", value: "date" }];
  show = false;
  public value: Date = new Date(2000, 2, 10);
  committees: any;
  timezones = [];
  statusPlaceholder = "Status"; //  { name: "Status", value: null };
  timeZonePlaceholder = { displayName: "Change Timezone", id: null };
  datePlaceholder = { name: "Date", value: null };
  committeePlaceholder = "Committees"; //  { committeeName: "Committees", committeeId: null }
  status: any;
  onCellClicked: any = [];
  actions: any = ["Add to Calendar", "Copy", "Delete", "Edit", "Archived"];
  toggleChecked = false;
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "linkTextName",
      title: "Title",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "link",
    },
    {
      field: "type",
      title: "Type",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "startDateTime",
      title: "DATE/TIME",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "committeeName",
      title: "COMMITTEE",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "status",
      title: "STATUS",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "action",
      title: "ACTIONS",
      component: "action",
      isEnableColumnOptions: false,
    },
  ];
  gridData: any = [];
  openTimezoneModal = false;
  range = {
    start: new Date(),
    end: new Date(),
  };
  viewType: any = "grid";
  meetingAndEventsExportCSV: boolean = false;
  isEnablePagination: boolean = true;
  errMessage: any;
  isError: boolean = false;
  tabName = "1month";
  tabsData: any = [
    {
      title: "1 Month",
      content: "",
      isSelected: true,
      isDisabled: true,
    },
    {
      title: "4 Months",
      content: "",
      isSelected: false,
      isDisabled: false,
    },
  ];
  isCalender = this.ac.snapshot.queryParams.calender;
  events: any;
  timeZoneValue: any;
  invalidDate: boolean = false;
  isShowToggle: boolean = false;
  isShowToggleAction: boolean = false;
  role: any;
  deleteUpcomingME: boolean = false;
  selectedData: any;
  deleteMsg: any;
  showLoader: boolean = false;
  constructor(
    private meetingService: MeetingsService,
    private entitiesService: EntitiesService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private exportService: ExportService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: DialogRef,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private ac: ActivatedRoute,
    private commonService: CommonService,
    private viewFileDocService: ViewFileDocService,
    private storage: StorageService
  ) {
    this.createForm();
    this.status = MEETING_EVENT_STATUS;
    this.role = JSON.parse(window.sessionStorage["roles_data"]);
    if (this.role.type == ROLES.directors) {
      const statusList: any = [];
      MEETING_EVENT_STATUS.map((status) => {
        if (status.value == "all" || status.value == "Published") {
          statusList.push(status);
        }
      });
      this.status = statusList;
    } else {
      this.status = MEETING_EVENT_STATUS;
    }
  }

  ngOnInit(): void {
    this.getAdminUserById();
    this.getCommittees();
    this.getMeetings();
    this.getTimeZones();
    this.seTabOfCalender();
    this.getDefaultTimeZone();
    this.meetingService.meetingListAPICall.subscribe((res: any) => {
      if (res) {
        this.getMeetings();
      }
    });
  }

  createForm() {
    this.meetingEventsForm = this.formBuilder.group({
      types: [""],
      dateStart: [""],
      dateEnd: [""],
      commiteeIds: [""],
      statuses: [""],
      timeZoneId: [""],
    });
  }

  seTabOfCalender() {
    if (this.isCalender) {
      this.viewType = "calendar";
      this.toggleChecked = true;
      if (this.isCalender === "fourMonths") {
        this.tabsData[0].isSelected = false;
        this.tabsData[1].isSelected = true;
        this.tabName = "4months";
      }
    }
  }

  getCommittees() {
    const data = {
      withUsers: false,
      onlyMeetingCommittees: true,
    };
    let committeesArray = [
      { committeeId: "all", name: "All" },
      { committeeId: "allUsers", name: "All Users" },
    ];
    this.entitiesService
      .getCommittee(data.withUsers, data.onlyMeetingCommittees)
      .subscribe(
        (res) => {
          if (res) {
            res.result.map((response: any) => {
              committeesArray.push(response);
            });
            // this.committees = res.result;
            this.committees = committeesArray;
          }
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
        }
      );
  }

  getMeetings() {
    this.gridData = [];
    let committeeIds: any = "";
    const statuses =
      this.meetingEventsForm.value.statuses == "" ||
      this.meetingEventsForm.value?.statuses?.includes("all")
        ? []
        : this.meetingEventsForm.value.statuses;
    if (this.meetingEventsForm.value?.commiteeIds?.includes("allUsers") || this.meetingEventsForm.value?.commiteeIds?.includes("all")) {
      committeeIds = null;
    } else if (
      this.meetingEventsForm.value.commiteeIds == ""
    ) {
      committeeIds = [];
    }
    const data = {
      dateStart:
        this.meetingEventsForm.value.dateStart !== ""
          ? this.meetingEventsForm.value.dateStart
          : null,
      dateEnd:
        this.meetingEventsForm.value.dateEnd !== ""
          ? this.meetingEventsForm.value.dateEnd
          : null,
      commiteeIds: this.meetingEventsForm.value.commiteeIds !== ""
        ? (committeeIds === null ? null :this.meetingEventsForm.value.commiteeIds)
        : committeeIds,
      types:
        this.meetingEventsForm.value.types !== ""
          ? [this.meetingEventsForm.value.types]
          : [],
      statuses: statuses,
      timeZoneId: this.meetingEventsForm.value.timeZoneId,
    };
    this.meetingService.getMeetingsList(data).subscribe((res: any) => {
      const grid: any = [];
      if (res && res.result && res.result.length > 0) {
        res.result.map((response: any) => {
          response.meetingsEvents.map((me: any) => {
            this.actions = ["Add to Calendar", "Copy", "Delete", "Edit"];
            me["actions"] = this.actions;
            if (me.location) {
              me.actions.push("Location Map");
            }
            if ((me.isOnlineMeeting && me.onlineMeetingUrl) || me.mapUrl) {
              me.actions.push("Online Meeting URL");
            }
            if (me.type == "Event") {
              if (me.isArchived) {
                me.actions.push("UnArchive");
              } else {
                me.actions.push("Archive");
              }
            }
            if (me.committeeId == null) {
              me["committeeName"] = "All Users";
            }

            if (!me.canEdit) {
              const index = this.actions.indexOf("Edit");
              if (index > -1) {
                this.actions.splice(index, 1);
              }
            }
            if (!me.canDelete) {
              const index = this.actions.indexOf("Delete");
              if (index > -1) {
                this.actions.splice(index, 1);
              }
            }
            if (!me.canCopy) {
              const index = this.actions.indexOf("Copy");
              if (index > -1) {
                this.actions.splice(index, 1);
              }
            }
            if (me.type == "Meeting") {
              me.actions.push("Download Board Book");
              // me.actions.push("Preview Agenda");
              if (this.role.type.includes("Admin")) {
                me.actions.push("Attendance Report");
              }
            }

            // me["dateTime"] = this.commonService.formatDate(me.startDate, 'withTime')
            me["startDateTime"] = this.datePipe.transform(
              me.startDateTime,
              "MMM dd, YYYY hh:mm:ss a"
            );
            // console.log(me);
            me["committeeId"] = me.committeeId;
            me["linkTextName"] = me.title;
            grid.push(me);
          });
          this.gridData = grid;
        });
      } else {
        this.gridData = [];
      }
    });
  }

  getTimeZones() {
    this.entitiesService.getTimezones().subscribe(
      (res: any) => {
        if (res) {
          this.timezones = res;
        }
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }

  clickButton(e: any) {
    if (e == "action") {
      /// TODO
    } else if (e == "new") {
      /// TODO
      this.route.navigate(["newMetting/information"], {
        relativeTo: this.activatedRoute,
        queryParams: { page: "info" },
      });
    }
  }

  onClickAction(event: any) {
    console.log(event);
    this.deleteMsg = `Deleting this ${event.data.type} will remove the ${event.data.type} and any activities that has been associated with it from BoardWorks and any linked devices.`;
    const navigateTo = event.data.type == "Event" ? "newEvent" : "newMetting";
    let {
      startDateTime,
      endDateTime,
      title,
      description,
      location,
      onlineMeetingLink,
      isOnlineMeeting,
      meetingId,
      committeeId,
      type,
      mapUrl,
    }: any = event.data;
    console.log(event.data, "event.dataevent.data");

    if (event.action == "Add to Calendar") {
      this.meetingService
        .getMeetingAddToCalender(meetingId)
        .subscribe((res: any) => {
          console.log(res);
        });
      this.events = [
        {
          start: new Date(startDateTime),
          end: new Date(endDateTime),
          summary: title,
          description: description,
          location: location,
          url: isOnlineMeeting
            ? onlineMeetingLink
            : "https://meet.google.com/ikn-sfhg-jgs",
        },
      ];
      let content: any = createEvent(this.events);
      if (content) download(`${title}.ics`, content);
    } else if (event.action === "Delete") {
      this.deleteUpcomingME = true;
      this.selectedData = event.data;
      // const dialogRef = this.dialogService.open({
      //   content: ConfirmModalComponent,
      // });
      // const info = dialogRef.content.instance;
      // info.headerTitle = "Delete Confirmation";
      // info.customMessage = `Are you sure you want to delete this ${event.data.type}?`;
      // info.bodyMessage = `Deleting this ${event.data.type} will remove the ${event.data.type} and any activities that has been associated with it from BoardWorks and any linked devices.`;
      // info.isEnableHeader = true;
      // info.isCustomBody = true;
      // info.isDeleteBody = true;
      // info.isEnableFooter = true;
      // dialogRef.result.subscribe((result: any) => {
      //   if (result.text == "Yes") {
      //     this.meetingService
      //       .deleteMeetingById(meetingId)
      //       .subscribe((res: any) => {
      //         if (res) {
      //           this.toastr.showToastr(
      //             "success",
      //             "Meeting Deleted Successfully!"
      //           );
      //           this.getMeetings();
      //         }
      //       });
      //   } else {
      //   }
      // });
    } else if (event.action === "Copy") {
      const params = {
        page: "info",
        type: "copy",
        meetingId: meetingId,
        eventId: meetingId,
        commiteeId: committeeId,
        status: event.data.status,

      };
      event.data.type == "Event"
        ? delete params.meetingId
        : delete params.eventId;
      this.route.navigate([`./${navigateTo}/information`], {
        relativeTo: this.activatedRoute,
        queryParams: params,
      });
    } else if (event.action === "Edit") {
      const params = {
        page: "info",
        type: "edit",
        meetingId: meetingId,
        eventId: meetingId,
        commiteeId: committeeId,
        status: event.data.status,
      };
      event.data.type == "Event"
        ? delete params.meetingId
        : delete params.eventId;
      this.route.navigate([`./${navigateTo}/information`], {
        relativeTo: this.activatedRoute,
        queryParams: params,
      });
    } else if (event.action == "Location Map") {
      if (event.data.location && event.data.location !== "") {
        // const mapUrl = `http://maps.google.com/?q=49.46800006494457,17.11514008755796` /// with lat, long
        const mapUrl = `http://maps.google.com/maps/place/${event.data.location}`;
        window.open(mapUrl, "_blank");
      }
    } else if (event.action == "Online Meeting URL") {
      if (event.data.isOnlineMeeting && event.data.onlineMeetingUrl) {
        window.open(event.data.onlineMeetingUrl, "_blank");
      }
      if (event.data.mapUrl) {
        window.open(event.data.mapUrl, "_blank");
      }
    } else if (event.action == "Archive" || event.action == "UnArchive") {
      this.archiveOrUnarchiveEvent(event.action, event.data.meetingId);
    } else if (event.action == "Attendance Report") {
      this.route.navigate(["admin/meetings/attendance-reports"], {
        queryParams: { meetingId: meetingId },
      });
    } else if (event.action == "Download Board Book") {
      let url = `${environment.baseUrl}${apiConstant.meetings}/${meetingId}/${apiConstant.documents}/${apiConstant.boardBook}`;
      // this.viewFileDocService.viewfile(
      //   {
      //     fileName: "download-board-book.pdf",
      //   },
      //   url
      // );
      this.downloadDocuments(url, [], { fileName: "download-board-book.pdf" });
    }
  }

  linksModalAction(e: any) {
    console.log(e);
    if (e.toLowerCase() == "save") {
      this.deleteUpcomingMEApi(this.selectedData.meetingId);
    } else {
      this.deleteUpcomingME = false;
    }
  }

  deleteUpcomingMEApi(id: any) {
    this.meetingService.deleteMeetingById(id).subscribe((res: any) => {
      if (res) {
        this.deleteUpcomingME = false;
        this.toastr.showToastr(
          "success",
          `${this.selectedData.type} Deleted Successfully!`
        );
        this.getMeetings();
      }
    });
  }

  archiveOrUnarchiveEvent(type: any, id: any) {
    const URL =
      type == "Archive"
        ? this.meetingService.archiveEvent(id)
        : this.meetingService.unarchiveEvent(id);
    URL.subscribe((res) => {
      if (res) {
        this.toastr.showToastr("success", `Event ${type}d Successfully!`);
        this.getMeetings();
      }
    });
  }

  onClickLink(event: any) {
    console.log(event);
    if (event.data && event.data.type && event.data.type == "Meeting") {
      this.route.navigate(
        [`meeting-details`, { type: "view", id: event.data.meetingId }],
        { relativeTo: this.activatedRoute }
      );
    } else if (event.data && event.data.type && event.data.type == "Event") {
      this.route.navigate(
        [`event-details`, { type: "view", id: event.data.meetingId }],
        { relativeTo: this.activatedRoute }
      );
    }
  }

  onSelect(e: any, type?: any) {
    // console.log(e, type, this.meetingEventsForm);
    switch (type) {
      case "type":
        this.meetingEventsForm.get("types").patchValue(e);
        this.getMeetings();
        break;
      case "committee":
        this.meetingEventsForm.get("commiteeIds").patchValue(e);
        this.getMeetings();
        break;
      case "date":
        this.show = !this.show;
        break;
      case "status":
        this.meetingEventsForm.get("statuses").patchValue(e);
        this.getMeetings();
        break;
      case "timezone":
        this.openTimezoneModal = true;
        break;
    }
  }

  changeArchived(e?: any) {
    if (e) {
      this.viewType = "calendar";
      this.tabName = "1month";
      this.route.navigate(["."], {
        relativeTo: this.ac,
        queryParams: { calender: "month" },
      });
    } else {
      this.viewType = "grid";
      this.route.navigate(["."], { relativeTo: this.ac });
    }
  }

  datesModalAction(type?: any, e?: any) {
    if (type == "apply") {
      this.meetingEventsForm.get("dateStart").setValue(this.range.start);
      this.meetingEventsForm.get("dateEnd").setValue(this.range.end);
      this.show = !this.show;
      this.getMeetings();
    }
  }

  timezoneModalAction(type?: any) {
    if (type == "apply") {
      this.getMeetings();
    }
    this.openTimezoneModal = false;
  }
  clickActions(e: any) {
    if (e === "Export List") {
      const req = {
        dateStart:
          this.meetingEventsForm.value.dateStart !== ""
            ? this.meetingEventsForm.value.dateStart
            : null,
        dateEnd:
          this.meetingEventsForm.value.dateEnd !== ""
            ? this.meetingEventsForm.value.dateEnd
            : null,
        commiteeIds:
          this.meetingEventsForm.value.commiteeIds !== ""
            ? [this.meetingEventsForm.value.commiteeIds]
            : [],
        types:
          this.meetingEventsForm.value.types !== ""
            ? [this.meetingEventsForm.value.types]
            : [],
        statuses:
          this.meetingEventsForm.value.statuses !== ""
            ? [this.meetingEventsForm.value.statuses]
            : [],
        timeZoneId: this.meetingEventsForm.value.timeZoneId,
      };
      this.meetingService.postMeetingAndEventsExport(req).subscribe(
        (response: any) => {
          this.exportToCSV();
        },
        (err: any) => {
          if (err.error && err.error.result) {
            this.setError(err.error.result.errorMessages);
          } else {
            this.exportToCSV();
          }
        }
      );
    } else if (e === "Attendance Report") {
      this.route.navigate([`admin/meetings/attendance-reports`]);
    } else if (e === "Event") {
      this.route.navigate(["newEvent/information"], {
        relativeTo: this.activatedRoute,
        queryParams: { page: "info" },
      });
    } else if (e === "Meeting") {
      // alert("New Meeting Page Works");
      this.route.navigate(["newMetting/information"], {
        relativeTo: this.activatedRoute,
        queryParams: { page: "info" },
      });
    }
  }

  exportToCSV() {
    if (this.gridData && this.gridData.length) {
      var exportData: IExport = {
        data: this.gridData.map((x: any) => MapExportData.mapItems(x)),
        columnHeaders: ExportColumnHeaders.GridColumns,
        columnHeaderNotToBeIncluded: [],
      };
      this.exportService.ExportToCSV(exportData);
    } else {
      alert("Grid has no data");
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  tabChange(event: any) {
    this.tabName = event.title;
    if (event.title == "1 Month") {
      this.tabName = "1month";
      this.route.navigate(["."], {
        relativeTo: this.ac,
        queryParams: { calender: "month" },
      });
    } else {
      this.tabName = "4months";
      this.route.navigate(["."], {
        relativeTo: this.ac,
        queryParams: { calender: "fourMonths" },
      });
    }
  }

  handleTimezone(e: any) {
    let a: any = this.timezones.filter((item: any) => item.id === e);
    this.timeZoneValue = a[0].displayName;
  }

  onDateChange(e: any, type: any) {
    console.log(e, type, this.range);
    const diff = this.commonService.calculateDatesDuration(
      this.range.start,
      this.range.end
    );
    if (diff < 0) {
      this.invalidDate = true;
    } else {
      this.invalidDate = false;
    }
  }
  newActions(e: any) {
    this.isShowToggle = !this.isShowToggle;
    this.isShowToggleAction = false;
  }

  action(e: any) {
    this.isShowToggleAction = !this.isShowToggleAction;
    this.isShowToggle = false;
  }

  getDefaultTimeZone() {
    this.commonService.defaultTimeZone().subscribe((data: any) => {
      this.timeZoneValue = data.displayName;
    });
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

  getAdminUserById() {
    const UserId = JSON.parse(this.storage.getData("user"))?.userId;
    this.meetingService.getAdminUserById(UserId, 'noNavigate').subscribe(
      (res) => {
        if (res && res.result) {
          this.toggleChecked = res?.result?.isMeetingCalendarView;
          res?.result?.isMeetingCalendarView
            ? (this.viewType = "calendar")
            : (this.viewType = "grid");
        }
      },
      (err) => {
        console.error("error receiving default view");
      }
    );
  }

}
