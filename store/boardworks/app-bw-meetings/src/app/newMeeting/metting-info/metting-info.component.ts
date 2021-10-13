import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FormatSettings } from "@progress/kendo-angular-dateinputs";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";

@Component({
  selector: "app-metting-info",
  templateUrl: "./metting-info.component.html",
  styleUrls: ["./metting-info.component.scss"],
  providers: [DatePipe],
})
export class MettingInfoComponent implements OnInit {
  mettingInfoForm: any;
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
      name: "Make this an all-day activity that doesn't start or end at a specific hour.",
      value:
        "Make this an all-day activity that doesn't start or end at a specific hour.",
      selected: false,
    }
  ];
  attendanceCheckBox = [
    {
      name: "In Person",
      value: "InPerson",
      selected: false,
    },
    {
      name: "Online",
      value: "Online",
      selected: false,
    },
  ];
  timePicker: boolean = true;
  inPerson: boolean = false;
  startDateTime: Date = new Date(2000, 2, 1, 8, 30, 0);
  endDateTime: Date = new Date(2000, 2, 1, 11, 30, 0);
  minDate: any;
  public format: FormatSettings = {
    displayFormat: "dd/MM/yyyy",
    inputFormat: "dd/MM/yy",
  };
  errMessage: any;
  isError: boolean = false;
  submitted: boolean = false;
  pageMode: any;
  meetingId: any;
  meetingDetails: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private commonService: CommonService,
    private datePipe: DatePipe,
    private meetingsService: MeetingsService,
    private activateRoute: ActivatedRoute
  ) {
    this.mettingInfoForm = this.fb.group({
      committee: ["", Validators.required],
      title: ["", Validators.required],
      timeZoneId: ["", Validators.required],
      attendance: [""],
      location: [null],
      mapurl: [null],
      notes: [""],
      onlinemettingurl: [null],
      allDay: [],
      startTime: [this.startDateTime],
      endTime: [this.endDateTime],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
    });
    this.pageMode = this.activateRoute.snapshot.queryParams.type;
    this.meetingId = this.activateRoute.snapshot.queryParams.meetingId;
  }

  ngOnInit(): void {
    let date = new Date();
    // this.startDateTime = this.datePipe.transform(date, "8:30 AM" )
    this.getCommitee();
    this.getTimezones();
    // if (this.meetingId) {
    //   this.getMeetingById()
    // }


    if (this.pageMode && (this.pageMode == "edit" || this.pageMode == 'attendesSucess')) {
      this.getMeetingDetailsForEditById(this.meetingId);
    } else if (this.pageMode && this.pageMode == "copy") {
      this.getMeetingDetailsForCopyById(this.meetingId);
    }
  }

  getMeetingById() {

    this.meetingsService.getMeetingDetails(this.meetingId).subscribe((response: any) => {
      let result: any = response.result.meetingEventItem;

      this.mettingInfoForm.patchValue({
        title: result.title,
        location: result.location,
        committee: result.committeeId,
        timeZoneId: result.timeZone,
        notes: result.description,
        attendance: this.attendanceCheckBox,
        allDay: this.allDayCheckBox,
        mapurl: result.isInPersonMeeting ? result.mapUrl : null,
        startDate: new Date(result.startDate),
        endDate: new Date(result.endDate),
        onlinemettingurl: result.isOnlineMeeting ? result?.onlineMeetingUrl : null,
        startTime: new Date(result.startDateTime),
        endTime: new Date(result.endDateTime),
      });

    });

  }
  getMeetingDetailsForEditById(id: any) {
    this.meetingsService.getMeetingDetails(id).subscribe((response: any) => {
      if (response.result) {
        let result: any = response.result.meetingEventItem;
        this.meetingDetails = response.result.meetingEventItem;
        if (result.isAllDayEvent) {
          this.allDayCheckBox = this.allDayCheckBox.map((element: any) => {
            element["selected"] = true;
            return element
          })
        }
        if (result.isOnlineMeeting || result.isInPersonMeeting) {
          this.attendanceCheckBox = this.attendanceCheckBox.map((item: any) => {
            if (result.isOnlineMeeting) {
              if (item.value == "Online") {
                item["selected"] = true;
                this.onlineSelect = true;
              }

            }
            if (result.isInPersonMeeting) {
              if (item.value == "InPerson") {
                this.inPerson = true
                item["selected"] = true;
              }
            }
            return item
          })
        }
        this.mettingInfoForm.patchValue({
          title: result.title,
          location: result.location,
          committee: result.committeeId,
          timeZoneId: result.timeZone,
          notes: result.description,
          attendance: this.attendanceCheckBox,
          allDay: this.allDayCheckBox,
          mapurl: result.isInPersonMeeting ? result.mapUrl : null,
          startDate: new Date(result.startDate),
          endDate: new Date(result.endDate),
          onlinemettingurl: result.isOnlineMeeting ? result?.onlineMeetingUrl : null,
          startTime: new Date(result.startDateTime),
          endTime: new Date(result.endDateTime),
        });
        if (result.isPublished || result.isArchived){
          this.mettingInfoForm.disable()

        }else{
          this.mettingInfoForm.enable()

        }
      }
    });
  }
  getMeetingDetailsForCopyById(id: any) {
    this.meetingsService
      .getMeetingDetailsCopyById(id)
      .subscribe((response: any) => {
        this.meetingDetails = response.result.meetingEventItem;

        if (response.result) {
          if (response.result.isAllDayEvent) {
            this.allDayCheckBox = this.allDayCheckBox.map((element: any) => {
              element["selected"] = true;
              return element
            })
          }
          if (response.result.isOnlineMeeting || response.result.isInPersonMeeting) {
            this.attendanceCheckBox = this.attendanceCheckBox.map((item: any) => {
              if (response.result.isOnlineMeeting) {
                if (item.value == "Online")
                  item["selected"] = true;
                this.onlineSelect = true;

              }
              if (response.result.isInPersonMeeting) {
                if (item.value == "InPerson")
                  this.inPerson = true
                item["selected"] = true;

              }
              return item
            })
          }
          this.mettingInfoForm.patchValue({
            title: `Copy Of ${response.result.title}`,
            location: response.result.isInPersonMeeting ? response.result.location : null,
            committee: response.result.committeeId,
            timeZoneId: response.result.timeZone,
            notes: response.result.description,
            attendance: this.attendanceCheckBox,
            allDay: this.allDayCheckBox,
            mapurl: response.result.isInPersonMeeting ? response.result.mapUrl : null,
            startDate: new Date(response.result.startDate),
            endDate: new Date(response.result.endDate),
            onlinemettingurl: response.result.isOnlineMeeting ? response.result?.onlineMeetingUrl : null,
            startTime: new Date(response.result.startDateTime),
            endTime: new Date(response.result.endDateTime),

          });
          // this.mettingInfoForm.get('attendance')?.setValue([...this.attendanceCheckBox])
          this.mettingInfoForm.get("title")?.disable();

        }
        console.log(this.mettingInfoForm.value, 'valesss');
        if (response.result.isPublished || response.result.isArchived){
          this.mettingInfoForm.disable()

        }else{
          this.mettingInfoForm.enable()

        }
      });
  }
  seterror(e: any) { }
  get f() {
    return this.mettingInfoForm.controls;
  }

  getCommitee() {
    this.commonService.entitiesCommittees().subscribe((data: any) => {
      this.committeeData = data.result;
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
  this.mettingInfoForm.get('timeZoneId').setValue(data.id)
     // this.timezones = data;
    });
  }
  

  clickButton(type: any) {
    if (type == "cancel") {
      this.router.navigate(['admin/meetings']);
    }
    else {
      if (this.mettingInfoForm.invalid) {
        this.mettingInfoForm.markAllAsTouched()
        return
      }
      const startTime = this.datePipe.transform(this.timePicker ? this.startDateTime : this.mettingInfoForm.get('startDate')?.value, 'YYYY-MM-ddTHH:mm:ss');
      const endDateTime = this.datePipe.transform(this.timePicker ? this.endDateTime : this.mettingInfoForm.get('endDate')?.value, 'YYYY-MM-ddTHH:mm:ss');
      const reqObj = {
        meetingTitle: this.mettingInfoForm.get("title")?.value,
        startDate: startTime,
        endDate: endDateTime,
        committeeId: this.mettingInfoForm.get("committee")?.value,
        timeZone: this.mettingInfoForm.get("timeZoneId")?.value,
        allDayEvent: !this.timePicker,
        isInPerson: this.inPerson,
        isOnline: this.onlineSelect,
        onlineMeetingLink: this.mettingInfoForm.get("onlinemettingurl")?.value,
        location: this.mettingInfoForm.get("location")?.value,
        mapUrl: this.mettingInfoForm.get("mapurl")?.value,
        description: this.mettingInfoForm.get("notes")?.value,
      };
      if (this.pageMode == "edit") {
        this.meetingsService.PutMeetingInfo(this.meetingId, reqObj).subscribe((data: any) => {
          if (type == "save") {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['admin/meetings/newMetting/information'], { queryParams: { type: "edit", meetingId: this.meetingId, commiteeId: this.mettingInfoForm.get('committee')?.value } })

            })
            //this.getMeetingDetailsForEditById(this.meetingId);
          } else {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['admin/meetings/newMetting/attendee'], { queryParams: { page: "attendee", type: "edit", meetingId: this.meetingId, commiteeId: this.mettingInfoForm.get('committee')?.value } })
            })
          }

        }, (err: any) => {
          this.setError(err.error.result.errorMessages)
        }
        )
      }
      else {
        this.meetingsService.saveMeetingInfo(reqObj).subscribe((data: any) => {
          if (type == "save") {
            // if (this.pageMode == 'copy') {
            //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            //     this.router.navigate(['admin/meetings/newMetting/information'], { queryParams: { page: "info", type: this.pageMode, meetingId: data.result,commiteeId: this.mettingInfoForm.get('committee')?.value } })
            //   })
            // } else {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['admin/meetings/newMetting/information'], { queryParams: { type: "edit", page: "info", meetingId: data.result, commiteeId: this.mettingInfoForm.get('committee')?.value } })
            })
            // }

          } else {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['admin/meetings/newMetting/attendee'], { queryParams: { page: "attendee", type: "edit", meetingId: data.result, commiteeId: this.mettingInfoForm.get('committee')?.value } })
            })
          }

        }, (err: any) => {
          this.setError(err.error.result.errorMessages)
        }
        )
      }
    }
  }

  ngAfterViewInit(): void {
    this.mettingInfoForm
      ?.get("startDate")
      ?.valueChanges.subscribe((data: any) => {
        if (data) {
          console.log(data, "dataaa");
          const day = data.getDate();
          const month = data.getMonth();
          const year = data.getFullYear();
          if (!this.pageMode) {
            this.startDateTime = new Date(year, month, day, 8, 30, 0);
            // this.startDateTime =  data;
            this.mettingInfoForm.get("endDate")?.setValue(data);
          }
          this.minDate = data;
        }
      });
    this.mettingInfoForm
      ?.get("endDate")
      ?.valueChanges.subscribe((data: any) => {
        if (data) {
          const day = data.getDate();
          const month = data.getMonth();
          const year = data.getFullYear();
          if (!this.pageMode) {
            this.endDateTime = new Date(year, month, day, 11, 30, 0);
          }
        }
      });
  }

  changeAttendaceCheckbox(data: any) {
    console.log(data, "data");
    let attendanceOnlinefilter = data.filter((item: any) => item.name == 'Online');
    let attendanceinPersonfilter = data.filter((item: any) => item.value == 'InPerson');
    console.log(attendanceOnlinefilter, 'attendanceOnlinefilter');
    console.log(attendanceinPersonfilter, 'attendanceinPersonfilter');

    if (attendanceinPersonfilter.length > 0 && attendanceOnlinefilter.length > 0) {
      this.inPerson = true;
      this.onlineSelect = true;
      this.mettingInfoForm
        .get("location")
        ?.setValidators(Validators.required);
    }
    if (attendanceOnlinefilter.length > 0) {
      this.onlineSelect = true;
      this.mettingInfoForm
        .get("location")
        ?.clearValidators();
      this.mettingInfoForm
        .get("location")
        ?.updateValueAndValidity();

    } else {
      this.onlineSelect = false;
    }

    if (attendanceinPersonfilter.length > 0) {
      this.mettingInfoForm
        .get("location")
        ?.setValidators(Validators.required);
      this.inPerson = true;
    } else {
      this.inPerson = false;
      this.mettingInfoForm
        .get("location")
        ?.clearValidators();
      this.mettingInfoForm
        .get("location")
        ?.updateValueAndValidity();


    }
    console.log(this.mettingInfoForm, ' this.mettingInfoForm');


  }

  changeAllDayCheckbox(data: any) {
    console.log(data, "data");
    data.length > 0 ? (this.timePicker = false) : (this.timePicker = true);
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
