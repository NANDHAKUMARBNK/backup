import { Component, OnInit } from "@angular/core";
import { DatePipe, Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { StorageService } from "lib-bw-svc-apis/src/lib/storage/storage.service";
import { IExport } from "../meetings-events-list/IExport";
import { MapExportData } from "../meetings-events-list/MapExportData";
import { ExportColumnHeaders } from "../meetings-events-list/Export-header.modal";
import { ExportService } from "../meetings-events-list/Export.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-attendance-reports",
  templateUrl: "./attendance-reports.component.html",
  styleUrls: ["./attendance-reports.component.scss"],
  providers: [ExportService, DatePipe],
})
export class AttendanceReportsComponent implements OnInit {
  headerName: any = "Attendance Reports";
  startDateValue: any;
  endDateValue: any;

  attendanceReportsForm: FormGroup;
  attendanceDateForm: FormGroup;
  defaultItems: any = [
    {
      text: "Meetings & Events",
      title: "Meetings & Events",
    },
    {
      text: "Attendance Report",
      title: "Attendance Report",
    },
  ];
  // defaultItemAttendanceType: any = [
  //   {
  //     attendanceType: "Any",
  //   },
  // ];
  // range = {
  //   start: new Date(),
  //   end: new Date(),
  // };
  attendanceTypes: any = [
    {
      attendanceType: "In Person",
    },
    {
      attendanceType: "Online / Conf.Call",
    },
  ];
  statusData: any = [
    { statusType: "Accepted" },
    { statusType: "Rejected" },
    { statusType: "Tentative" },
  ];
  onCellClicked: any = [];
  gridData: any;
  isEnableSelectAll: boolean = false;
  isShowCheckbox: boolean = false;
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "title",
      title: "MEETING OR EVENT",
      filterType: "text",
      isEnableColumnOptions: true,
    },
    {
      field: "meetingDate",
      title: "DATE",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "committeeName",
      title: "COMMITTEE",
      filterType: "text",
      isEnableColumnOptions: true,
    },
    {
      field: "userName",
      title: "USER NAME",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "firstName",
      title: "FIRST NAME",
      filterType: "text",
      isEnableColumnOptions: true,
    },
    {
      field: "lastName",
      title: "LAST NAME",
      filterType: "text",
      isEnableColumnOptions: true,
    },
    {
      field: "status",
      title: "STATUS",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "attendanceReportsStatus",
      width: "240px"
    },
    {
      field: "attendanceType",
      title: "ATTENDANCE TYPE",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "comment",
      title: "COMMENT",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "attendanceReportsComments",
    },
  ];
  statusCombo: any = [
    {
      name: "Accept - In Person",
      value: "InPerson",
      selected: false,
    },
    {
      name: "Accept - Online / Conf.Call",
      value: "Online",
      selected: false,
    },
    { name: "Tentative", value: "Tentative", selected: false },
    { name: "Decline", value: "Decline", selected: false },
  ];
  attendanceStatusValue: any;
  errMessage: any;
  isError: boolean = false;
  isShowGrid: boolean = false;
  startDateTime: Date = new Date(2000, 2, 1, 8, 30, 0);
  endDateTime: Date = new Date(2000, 2, 1, 11, 30, 0);
  minDate: any;
  timePicker: boolean = true;
  meetingId: any;
  tempStatusValue: any;
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private meetingService: MeetingsService,
    private exportService: ExportService,
    private storage: StorageService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {
    this.attendanceDateForm = this.fb.group({
      startTime: [this.startDateTime],
      endTime: [this.endDateTime],
      StartDate: ["", Validators.required],
      EndDate: ["", Validators.required],
    });
    this.attendanceReportsForm = this.fb.group({
      title: [""],
      userName: [""],
      committeeName: [""],
      firstName: [""],
      lastName: [""],
      attendanceType: [""],
      status: [""],
    });
  }
  ngOnInit(): void {
    this.meetingId = this.activatedRoute.snapshot.queryParams.meetingId;
    if (this.meetingId) {
      this.getMeetingsById();
    }
  }
  ngAfterViewInit() {
    this.attendanceDateForm
      .get("StartDate")
      ?.valueChanges.subscribe((data: any) => {
        if (data) {
          this.isError = false;
          const day = data.getDate();
          const month = data.getMonth();
          const year = data.getFullYear();
          this.startDateTime = new Date(year, month, day, 8, 30, 0);
          this.attendanceDateForm.get("EndDate")?.setValue(data);
          this.minDate = data;
        }
      });
    this.attendanceDateForm
      .get("EndDate")
      ?.valueChanges.subscribe((data: any) => {
        if (data) {
          this.isError = false;
          const day = data.getDate();
          const month = data.getMonth();
          const year = data.getFullYear();
          this.endDateTime = new Date(year, month, day, 11, 30, 0);
        }
      });
  }
  navigateInto(params: any) {
    if (
      params.text === "Meetings & Events" ||
      params.title === "Meetings & Events"
    ) {
      this.location.back();
    }
  }
  exportProcess() {
    if (this.gridData) {
      var exportData: IExport = {
        data: this.gridData.map((x: any) =>
          MapExportData.mapItemsAttendanceReport(x)
        ),
        columnHeaders: ExportColumnHeaders.AttendanceReportGridColumns,
        columnHeaderNotToBeIncluded: [],
      };
      this.exportService.ExportToCSV(exportData);
    } else {
      alert("Grid has no data for export");
    }
  }
  exportToCSV(params: any) {
    this.requiredFieldsAndPayload();
    this.meetingService
      .getExportMeetingReport(
        this.attendanceDateForm.value,
        this.attendanceReportsForm.value
      )
      .subscribe(
        (response: any) => {
          this.exportProcess();
        },
        (err: any) => {
          if (err.status === 200) {
            this.exportProcess();
          } else {
            this.setError(err.error?.result.errorMessages);
          }
        }
      );
  }
  requiredFieldsAndPayload() {
    if (this.attendanceDateForm.invalid) {
      this.attendanceDateForm.markAllAsTouched();
      // this.setError(["Please Enter StartDate Or EndDate"]);
      return;
    }
    if (this.attendanceReportsForm.value.attendanceType === "In Person") {
      this.attendanceReportsForm.value.attendanceType = "InPerson";
    }
    if (
      this.attendanceReportsForm.value.attendanceType === "Online / Conf.Call"
    ) {
      this.attendanceReportsForm.value.attendanceType = "Online";
    }
  }
  changeAttendanceType(e?: any) {}
  changeStatus(e?: any) {}
  generateReport(params: any) {
    this.requiredFieldsAndPayload();
    this.meetingService
      .getMeetingAttendanceReport(
        this.attendanceDateForm.value,
        this.attendanceReportsForm.value
      )
      .subscribe(
        (response: any) => {
          if (response.result && response.result.length) {
            this.isShowGrid = true;
            response.result.map((res: any) => {
              res["meetingDate"] = this.commonService.formatDate(
                res.meetingDate
              );
            })
            this.gridData = response.result;
          } else {
            this.gridData = [];
            this.isShowGrid = true;
            this.setError([
              "No results returned For the Search Criteria you have entered",
            ]);
          }
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
        }
      );
  }
  attendanceStatusDropdown(e: any) {
    this.tempStatusValue = e;
    this.attendanceStatusValue =
      e === "Tentative" || e === "Decline" ? "NotSpecified" : e;
  }
  updateStatus(e: any) {
    const request: any = {
      userId: e.userId,
      // attendingStatus: e.status,
      attendingStatus:
        this.tempStatusValue === "Decline"
          ? "Rejected"
          : this.tempStatusValue === "Tentative"
          ? "Tentative"
          : "Accepted",
      attendingMode: this.attendanceStatusValue,
      responseMessage: e.comment,
    };
    this.meetingService.updateMeetingAttendance(request, e.meetingId).subscribe(
      (response: any) => {
        if (response.result) {
          alert("Updated Successfully");
          this.generateReport({});
        }
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  getMeetingsById() {
    // this.meetingService.getMeetingDetails(this.meetingId).subscribe((response: any) => {
    //   if (response.result && response.result.meetingEventItem) {
    //     this.isShowGrid = true;
    //     const gridDetails = [];
    //     response.result.meetingEventItem['meetingDate'] = response.result.meetingEventItem.startDate;
    //     gridDetails.push(response.result.meetingEventItem);
    //     this.attendanceDateForm.patchValue({
    //       StartDate: new Date(response.result.meetingEventItem.startDate),
    //       EndDate: new Date(response.result.meetingEventItem.endDate),
    //     });
    //     this.attendanceReportsForm.get("title")?.setValue(response.result.meetingEventItem.title);
    //     this.attendanceReportsForm.get("committeeName")?.setValue(response.result.meetingEventItem.committeeName);
    //     this.gridData = gridDetails;
    //   }
    // });

    this.meetingService
      .getMeetingDetails(this.meetingId)
      .subscribe((response: any) => {
        if (response.result && response.result.meetingEventItem) {
          response.result.meetingEventItem["meetingDate"] =
            response.result.meetingEventItem.startDate;
          this.attendanceDateForm.patchValue({
            StartDate: new Date(response.result.meetingEventItem.startDate),
            EndDate: new Date(response.result.meetingEventItem.endDate),
          });
          this.attendanceReportsForm.patchValue({
            title: response.result.meetingEventItem.title,
            committeeName: response.result.meetingEventItem.committeeName,
          });

          this.getMeetingAttendanceReportById();
        }
      });
  }

  getMeetingAttendanceReportById() {
    this.meetingService
      .getMeetingAttendanceReportById(
        this.meetingId,
        this.attendanceDateForm.value,
        this.attendanceReportsForm.value
      )
      .subscribe((response: any) => {
        if (response.result && response.result.length) {
          this.isShowGrid = true;
          this.gridData = response.result;
        } else {
          this.gridData = [];
          this.isShowGrid = true;
          this.setError([
            "No results returned For the Search Criteria you have entered",
          ]);
        }
      });
  }
}
