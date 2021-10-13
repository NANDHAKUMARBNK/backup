import { ToastrService } from 'lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';
import { CommonService } from './../../../../../lib-bw-svc-apis/src/lib/common/common.service';
import { MeetingsService } from 'lib-bw-svc-apis/src/lib/meetings/meetings.service';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-attendees',
  templateUrl: './event-attendees.component.html',
  styleUrls: ['./event-attendees.component.scss']
})
export class EventAttendeesComponent implements OnInit {
  gridData: any = [];
  readChildtempArray: any;
  columnsData: any = [
    {
      field: "title",
      title: "Board",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      title: "Users",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      title: "Access",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "writeAccess",
    },
    {
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
  security = [
    {
      name: "Enabling Group Access will allow new Committee members to access the event. If you want to limit this event to only current Committee members, do not click this checkbox.",
      value: "Enable",
      selected: true,
    },

  ];
  sendEmail: any = [{
    name: "Send Email to all current attendees",
    value: "Send Email to all current attendees",
    selected: false,
  }];
  securityControl = new FormControl('')
  meetingId: any;
  groupAccess: boolean = true;
  commiteeId: any;
  attendeeIds: any;
  errMessage: any = [];
  isError: boolean = false;
  eventAttendeesForm: FormGroup;
  eventId: any;
  pageMode: any;
  isPublished: any = false;
  status: any;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private meetingsService: MeetingsService,
    private commonService: CommonService,
    private toastr: ToastrService
  ) {
    this.eventId = this.activatedRoute.snapshot.queryParams.eventId;
    this.pageMode = this.activatedRoute.snapshot.queryParams.type;
    this.meetingId = this.activatedRoute.snapshot.queryParams.meetingId;
    this.commiteeId = this.activatedRoute.snapshot.queryParams.commiteeId;
    this.status = this.activatedRoute.snapshot.queryParams.status;
    this.eventAttendeesForm = this._formBuilder.group({
      emailSubject: [''],
      emailBody: [''],
      sendEmail: [false]
    })
    this.getCommitee();
  }

  ngOnInit(): void {
    if ((this.pageMode && this.pageMode == "edit") || (this.pageMode && this.pageMode == "copy")) {
      this.getEventAttendees();
    }
  }

  getCommitee() {
    this.commonService.entitiesCommittees().subscribe((data: any) => {
      data.result.map((res: any) => {
        if (res.name == this.commiteeId) {
          this.commiteeId = res.committeeId
        }
      })
      this.getAttendeesPermission();
    });
  }

  getEventAttendees() {
    this.meetingsService.getEventAttendees(this.eventId).subscribe(res => {
      if (res.result) {
        // this.eventId = res.correlationId;
        this.eventAttendeesForm.patchValue(res.result)
        this.eventAttendeesForm.get('sendEmail')?.setValue(res.result.isSendEmail);
        this.sendEmail = this.sendEmail.map((element: any) => {
          element["selected"] = res.result.isSendEmail;
          return element
        })
      }
    })
  }

  getAttendeesPermission() {
    this.meetingsService.meetingsAttendeesPickerCommittees(this.commiteeId, this.groupAccess).subscribe(async (data: any) => {
      data.result.filter((res: any) => {
        if (res.users.length == 0) {
          res["isUpDown"] = false;
        } else {
          res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
          res["isUpiconClass"] = "mdi mdi-chevron-up f-30"
          res["isUpDown"] = true;
        };
        res.users.map((innerRes: any) => {
          innerRes.childWriteselected = innerRes.isMandatory;
          innerRes.disable = innerRes.isMandatory;
        })
        res["isSelected"] = false;
        res.parentWriteselected = false;
      })
      this.gridData = data.result;
      this.updateParentSelection();
    })
  }

  updateParentSelection() {
    this.gridData.forEach((element: any) => {
      element.parentReadselected = false;
      element.parentWriteselected = false;
      let writeChildSelected = 0;
      let readChildSelected = 0;
      if (element.users != null && element.users.length > 0) {
        element.users.forEach((child: any) => {
          if (child.childReadselected) {
            readChildSelected += 1
          }
          if (child.childWriteselected)
            writeChildSelected += 1
        });
        if (readChildSelected == element.users.length) {
          element.parentReadselected = true
        }
        if (writeChildSelected == element.users.length) {
          element.parentWriteselected = true
        }
      }
    });
  }

  clickButton(type: any) {
    switch (type) {
      case 'cancel':
        this.router.navigate(['admin/meetings']);
        break;
      case 'save':
        if (this.pageMode == "edit") {
          this.toastr.showToastr('success', `Event updated Successfully!`);
        }
        else {
          this.toastr.showToastr('success', `Event created Successfully!`);
        }
        if (this.eventAttendeesForm.invalid) {
          this.eventAttendeesForm.markAllAsTouched()
          this.setError(['Please fill all fields.'])
          return
        } else {
          this.saveAndUnPublishEvent(type);
        }
        break;
      case 'add':
        this.router.navigate(['admin/meetings/newEvent/attachment']);
        if (this.eventAttendeesForm.invalid) {
          this.eventAttendeesForm.markAllAsTouched()
          this.setError(['Please fill all fields.'])
          return
        } else {
          this.saveAndUnPublishEvent(type);
        }
        break;
    }
  }

  saveAndUnPublishEvent(btnType?: any) {
    let tempArray: any = [];
    this.gridData.forEach((element: any, index: any) => {
      element.users.forEach((inner: any) => {
        let userObj: any = []
        if (inner.childWriteselected) {
          userObj = inner.userId
        }
        if (tempArray.filter((item: any) => item == userObj).length === 0 && userObj.length > 0) {
          tempArray.push(userObj);
        }
      })
    });
    const reqObj = {
      "isGroupAccess": this.groupAccess,
      "attendeeIds": tempArray,
      "isSendEmail": this.eventAttendeesForm.value.sendEmail,
      "emailSubject": this.eventAttendeesForm.value.emailSubject,
      "emailBody": this.eventAttendeesForm.value.emailBody
    };
    this.meetingsService.saveEventAttendees(this.eventId, reqObj).subscribe((data: any) => {
      if (data) {
        this.meetingsService.unPublishEvent(this.eventId).subscribe(response => {
          if (btnType == 'add') {
            this.router.navigate(['../attachment'], { queryParams: { page: "doc", type: "edit", eventId: this.eventId, commiteeId: this.commiteeId, status: 'attendeesSuccess' }, relativeTo: this.activatedRoute })
          } else {
            this.toastr.showToastr('success', `Event Updated Successfully!`)
            this.router.navigate(['admin/meetings'])
          }
          // this.router.navigate(['../attachment'], { queryParams: { page: "doc", eventId: this.eventId, meetingId: this.meetingId, type: "attendeesSuccess" }, relativeTo: this.activatedRoute })
        })
      }
      // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      // })
    }, (err: any) => {
      this.setError(err.error.result.errorMessages)
    })
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
  changeCheckbox(data: any, type?: any) {
    switch (type) {
      case 'allDay':
        data.length > 0 ? this.groupAccess = true : this.groupAccess = false;
        break;
      case 'sendEmail':
        this.eventAttendeesForm.get('sendEmail')?.setValue(data.length > 0 ? true : false);
        if (data.length > 0) {
          this.eventAttendeesForm.get('emailSubject')?.setValidators(Validators.required);
          this.eventAttendeesForm.get('emailBody')?.setValidators(Validators.required);
        } else {
          this.eventAttendeesForm.get('emailSubject')?.setValidators([]);
          this.eventAttendeesForm.get('emailBody')?.setValidators([]);
        }
        break;
    }
  };

  insideAccordion(e: any) { }

  accrodianClick(data: any) {
    if (data.event.isSelected) {
      data.grid.collapseRow(data.rowIndex)
    } else if (data.event.isSelected == false) {
      data.grid.expandRow(data.rowIndex);
    }

    this.gridData.forEach((element: any) => {
      if (data.event.title == element.title) {
        element.isUpDown = !element.isUpDown
        element.isSelected = !element.isSelected;
      }
    });
  }

  writeAccessClick(data: any) {
    if (data.event.target.checked) {
      data.selected.parentWriteselected = true;
    } else {
      data.selected.parentWriteselected = false;
    }
    if (data.selected.parentWriteselected) {
      this.gridData.forEach((element: any) => {
        element.users.forEach((inner: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (inner.userId == selectedData.userId)
              inner.childWriteselected = true;
          })
        });
      });
    } else {
      this.gridData.forEach((element: any) => {
        element.users.forEach((inner: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (inner.userId == selectedData.userId)
              inner.childWriteselected = false;
          })
        });
      });
    }
    this.updateParentSelection();
  };

  writeChildAccessClick(data: any) {
    if (data.event.target.checked) {
      this.gridData.forEach((element: any) => {
        element.users.forEach((inner: any) => {
          if (inner.userId == data.selected.userId)
            inner.childWriteselected = true;
        });

      });
    } else {
      this.gridData.forEach((element: any) => {
        element.users.forEach((inner: any) => {
          if (inner.userId == data.selected.userId)
            inner.childWriteselected = false;
        });
      });
    }
    this.updateParentSelection();
  }

}
