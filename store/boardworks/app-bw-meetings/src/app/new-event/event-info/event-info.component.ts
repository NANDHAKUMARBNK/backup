import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { FormatSettings } from "@progress/kendo-angular-dateinputs";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { DatePipe, Location } from "@angular/common";

@Component({
  selector: "app-event-info",
  templateUrl: "./event-info.component.html",
  styleUrls: ["./event-info.component.scss"],
  providers: [DatePipe],
})
export class EventInfoComponent implements OnInit {
  eventInfoForm: any;
  committeeData: any;
   timeZonePlaceholder = { displayName: "Select Timezone", id: null };
  timezones: any;
  onlineSelect: boolean = false;
  attendanceRadio = [
    {
      name: "In Person",
      value: true,
      selected: false,
    },
    {
      name: "Online",
      value: false,
      selected: false,
    },
  ];

  allDayCheckBox = [
    {
      name: "All Day Event",
      value: "All Day Event",
      selected: false,
    },
  ];
  allUserCheckBox = [
    {
      name: "Select All Users",
      value: "Select All Users",
      selected: false,
    },
  ];
  timePicker: boolean = false;
  inPerson: boolean = false;
  startDateTime: Date = new Date(2000, 2, 1, 8, 30, 0);
  endDateTime: Date = new Date(2000, 2, 1, 11, 30, 0);
  minDate: any = new Date(1980, 1, 1);
  maxDate: any = new Date(2099, 1, 1);
  public format: FormatSettings = {
    displayFormat: "dd/MM/yyyy",
    inputFormat: "dd/MM/yy",
  };
  errMessage: any;
  isError: boolean = false;
  submitted: boolean = false;
  pageMode: any;
  meetingId: any;
  eventId: any;
  committeeId: any;
  isPublished: any = false;
  eventTitle: any;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private meetingService: MeetingsService,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {
    this.eventInfoForm = this.fb.group({
      committeeId: ["", Validators.required],
      eventTitle: ["", Validators.required],
      timeZone: ["", Validators.required],
      location: [null, Validators.required],
      mapUrl: [null],
      description: [""],
      allDayEvent: [false],
      allUsers: [false],
      // startTime: [this.startDateTime],
      // endTime: [this.endDateTime],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });
    this.pageMode = this.activateRoute.snapshot.queryParams.type;
    this.eventId = this.activateRoute.snapshot.queryParams.eventId || this.activateRoute.snapshot.queryParams.meetingId;
    this.committeeId = this.activateRoute.snapshot.queryParams.commiteeId;
  }

  ngOnInit(): void {
    this.getCommitee();
    this.getTimezones();
    if (this.pageMode && this.pageMode == "edit") {
      this.getEventDetailsForEdit(this.eventId);
    } else if (this.pageMode && this.pageMode == "copy") {
      this.getEventDetailsForCopy(this.eventId);
    }
  }

  getCommitee() {
    this.commonService.entitiesCommittees().subscribe((data: any) => {
      this.committeeData = data.result;
      data.result.map((res: any) => {
        if (res.name == this.committeeId) {
          this.committeeId = res.committeeId;
        }
      });
    });
  }

  getTimezones() {
    this.commonService.timezones().subscribe((data: any) => {
      this.timezones = data;
      this.getDefaultTimeZone();
    });
  }

  getDefaultTimeZone(){
    this.commonService.defaultTimeZone().subscribe((data: any) => {
    this.eventInfoForm.get('timeZone').setValue(data.id)
     
    });
  }

  getEventDetailsForEdit(id: any) {
    this.meetingService.getEventInfo(id).subscribe((res: any) => {
      if (res.result) {
        this.isPublished = res.result.isPublished;
        // this.eventId = res.correlationId
        if (res.result.isAllDayEvent) {
          this.allDayCheckBox = this.allDayCheckBox.map((element: any) => {
            element["selected"] = true;
            return element;
          });
        }
        this.eventInfoForm.patchValue({
          eventTitle: res.result.title,
          location: res.result.location,
          committeeId: res.result.committeeId,
          timeZone: res.result.timeZone,
          description: res.result.description,
          allUsers: false,
          allDayEvent: this.allDayCheckBox,
          mapUrl: res.result.mapUrl,
          startDate: new Date(res.result.startDate),
          endDate: new Date(res.result.endDate),
          // startTime: new Date(res.result.startDateTime),
          // endTime: new Date(res.result.endDateTime),
        });
      }
    });
  }

  getEventDetailsForCopy(id: any) {
    this.meetingService.getEventDetailsToCopyById(id).subscribe((res: any) => {
      if (res.result) {
        this.isPublished = res.result.isPublished;
        // this.eventId = res.correlationId;
        if (res.result.isAllDayEvent) {
          this.allDayCheckBox = this.allDayCheckBox.map((element: any) => {
            element["selected"] = true;
            return element;
          });
        }
        this.eventInfoForm.patchValue({
          eventTitle: `Copy Of ${res.result.title}`,
          location: res.result.location,
          committeeId: res.result.committeeId,
          timeZone: res.result.timeZone,
          description: res.result.description,
          allUsers: false,
          allDayEvent: this.allDayCheckBox,
          mapUrl: res.result.mapUrl,
          startDate: new Date(res.result.startDate),
          endDate: new Date(res.result.endDate),
          // startTime: new Date(res.result.startDateTime),
          // endTime: new Date(res.result.endDateTime),
        });
        this.eventTitle = this.eventInfoForm.get("eventTitle")?.value;
        this.eventInfoForm.get("eventTitle")?.disable();
      }
    });
  }

  clickButton(type: any) {
    switch (type) {
      case "cancel":
        this.router.navigate(["admin/meetings"]);
        break;
      case "save":
        // if (this.pageMode == "edit") {
        //   this.toastr.showToastr("success", `Event updated Successfully!`);
        // } else {
        //   this.toastr.showToastr("success", `Event created Successfully!`);
        // }
        if (this.eventInfoForm.invalid) {
          this.eventInfoForm.markAllAsTouched();
          return;
        } else {
          this.saveAndUnPublishEvent(type);
        }
        break;
      case "add":
        if (this.eventInfoForm.invalid) {
          this.eventInfoForm.markAllAsTouched();
          return;
        } else {
          this.saveAndUnPublishEvent(type);
        }
        break;
    }
  }

  saveAndUnPublishEvent(btnType?: any) {
    if (this.eventTitle && this.pageMode == "copy") {
      this.eventInfoForm.get("eventTitle")?.setValue(this.eventTitle);
      this.eventInfoForm.get("eventTitle")?.enable();
    }    
    const message =
      this.pageMode == "edit" || this.pageMode == "copy"
        ? "Updated"
        : "Created";
    this.eventInfoForm
      .get("allDayEvent")
      ?.setValue(this.allDayCheckBox[0]["selected"]);
    const startTime = this.datePipe.transform(
      this.timePicker
        ? this.startDateTime
        : this.eventInfoForm.get("startDate")?.value,
      "YYYY-MM-ddTHH:mm:ss"
    );
    const endDateTime = this.datePipe.transform(
      this.timePicker
        ? this.endDateTime
        : this.eventInfoForm.get("endDate")?.value,
      "YYYY-MM-ddTHH:mm:ss"
    );
    // let reqObj = this.eventInfoForm.value;
    // reqObj["startDate"] = startTime;
    // reqObj["endDate"] = endDateTime;
    const apiURL =
      this.pageMode && (this.pageMode == "edit" || this.pageMode == "copy")
        ? this.meetingService.updateEventInfo(
            this.eventInfoForm.value,
            this.eventId
          )
        : this.meetingService.addEvents(this.eventInfoForm.value);
    apiURL.subscribe((res) => {
      if (res) {
        this.pageMode == "edit" || this.pageMode == "copy"
          ? ""
          : (this.eventId = res.result);
        this.meetingService
          .unPublishEvent(this.eventId)
          .subscribe((response) => {
            if (btnType == "add") {
              this.router.navigate(["admin/meetings/newEvent/attendee"], {
                queryParams: {
                  page: "attendee",
                  type: "edit",
                  eventId: this.eventId,
                  commiteeId: this.eventInfoForm.get("committeeId")?.value,
                  },
              });
            } else {
              this.router
                .navigateByUrl("/", { skipLocationChange: true })
                .then(() => {
                  // this.router.navigate(['admin/meetings/newEvent/attendee'], { queryParams: { page: "attendee", type: this.pageMode, eventId: this.eventId, commiteeId: this.eventInfoForm.get('committeeId')?.value } })
                  this.toastr.showToastr(
                    "success",
                    `Event ${message} Successfully!`
                  );
                  this.router.navigate(["admin/meetings"]);
                });
            }
          });
      }
    });
  }

  changeCheckbox(e: any, type?: any) {
    let value = false;
    switch (type) {
      case "allDay":
        e.length > 0 ? (value = true) : (value = false);
        this.eventInfoForm.get("allDayEvent")?.setValue(value);
        break;
      case "allUsers":
        e.length > 0 ? (value = true) : (value = false);
        this.eventInfoForm.get("allUsers")?.setValue(value);
        break;
    }
  }

  seterror(e: any) {}

  get f() {
    return this.eventInfoForm.controls;
  }
}
