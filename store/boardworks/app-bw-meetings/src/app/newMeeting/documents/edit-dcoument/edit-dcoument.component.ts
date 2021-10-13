import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MeetingsService } from 'lib-bw-svc-apis/src/lib/meetings/meetings.service';

@Component({
  selector: 'app-edit-dcoument',
  templateUrl: './edit-dcoument.component.html',
  styleUrls: ['./edit-dcoument.component.scss']
})
export class EditDcoumentComponent implements OnInit {
  agendTitle = new FormControl('');
  groupAceess = new FormControl('');
  security = [

    {
      name: "Enable Group Access (allow new committee members to access the meeting)",
      value: "Enable",
      selected: true,
    },

  ];


  gridData: any;
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

  securityControl = new FormControl(true)
  meetingid: any;
  groupAccess: boolean = true;
  commiteeId: any;
  attendeeIds: any;
  errMessage: any;
  isError: boolean = false;
  @Input() saveClick: any;
  @Output() onSaveSucess = new EventEmitter();
  @Input() displaydata: any;
  tempArray: any = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private meetingsService: MeetingsService
  ) {
    this.meetingid = this.activatedRoute.snapshot.queryParams.meetingId;
    this.commiteeId = this.activatedRoute.snapshot.queryParams.commiteeId;


  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.displaydata);
    this.tempArray = [];

    if (this.saveClick) {
      if (this.gridData) {
        this.gridData.forEach((element: any, index: any) => {
          element.users.forEach((innrer: any) => {
            let userObj: any = []
            if (innrer.childWriteselected) {
              userObj = innrer.userId
            }
            if (this.tempArray.filter((item: any) => item == userObj).length === 0 && userObj.length > 0) {
              this.tempArray.push(userObj);
            }
          })
        });
      }
      const reqObj = {
        "title": this.agendTitle.value,
        "isGroupAccess": this.groupAccess,
        "attendeeIds": this.tempArray
      };

      console.log(reqObj, 'reqObj');
      if (this.displaydata.data.agendaItemId) {
        this.meetingsService.editDocumetAgenda(this.meetingid, this.displaydata.data.agendaItemId, reqObj).subscribe((data: any) => {
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {

          //   this.router.navigate(['admin/meetings/newMetting/document'], { queryParams: { page: "doc", meetingId: this.meetingid, type: "attendesSucess", commiteeId: this.commiteeId } })
          // })
          this.onSaveSucess.emit(true)

        }, (err: any) => {
          this.setError(err.error.result.errorMessages)
        }
        )
      } else {
        this.meetingsService.saveDocumetAgenda(this.meetingid, reqObj).subscribe((data: any) => {
          // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {

          //   this.router.navigate(['admin/meetings/newMetting/document'], { queryParams: { page: "doc", meetingId: this.meetingid, type: "attendesSucess", commiteeId: this.commiteeId } })
          // })
          this.onSaveSucess.emit(true)

        }, (err: any) => {
          this.setError(err.error.result.errorMessages)
        }
        )
      }
    }

  }



  ngOnInit(): void {
    this.getAttendeesPermision();
    console.log(this.displaydata, 'display');

    this.agendTitle.setValue(this.displaydata.data.title)
  }


  getAttendeesPermision() {
    this.meetingsService.meetingsAttendeesPickerCommittees(this.commiteeId, this.groupAccess).subscribe((data: any) => {
      data.result.map((res: any) => {
        if (res.users.length == 0) {
          res["isUpDown"] = false;
        } else {
          res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
          res["isUpiconClass"] = "mdi mdi-chevron-up f-30"
          res["isUpDown"] = true;
        };
        res.users.map((innerres: any) => {
          // innerres.childReadselected = false;
          innerres.childWriteselected = innerres.isMandatory;
          innerres.disable = innerres.isMandatory;
        })
        res["isSelected"] = false;
        // res.parentReadselected = false;
        res.parentWriteselected = false;
      })
      if (this.displaydata) {
        this.getDaflutSelection();
      }
      console.log("weferf");

      this.gridData = data.result;
      this.updateParentSelection();
    })
  }

  getDaflutSelection() {
    console.log("wefwfrfqrfewfewfer");
    this.meetingsService.getEditDocumentPicker(this.meetingid, this.displaydata.data.agendaItemId).subscribe((data: any) => {
      this.attendeeIds = data.result.attendeeIds;
      this.groupAccess = data.result?.isGroupAccess;
      this.gridData.forEach((element: any) => {
        let childIsMandatoryCount = 0;
        element.parentWriteDisable = this.groupAccess;
        element.parentWriteselected = this.security[0].selected;
        element.users.forEach((item: any) => {
          item.disable = item.isMandatory;
          if (item.isMandatory) {
            childIsMandatoryCount++;
          }
          if(element.users.length == childIsMandatoryCount) {
            element.parentWriteDisable = true;
          }
          if (data.result.attendeeIds.includes(item.userId)) {
            item.childWriteselected = true;
          } else {
            item.childWriteselected = false;
          }
        });
      });
      this.security[0].selected = true;
      this.updateParentSelection();
    })
  }



  clickButton(type: any) {
    if (type == "cancel") {

    } else {
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
  changeAllDayCheckbox(data: any) {
    data.length > 0 ? (this.groupAccess = true) : (this.groupAccess = false);
    this.getAttendeesPermision();

  };



  insideAccordion(e: any) { }

  accrodianClick(data: any) {
    if (data.event.isSelected) {
      data.grid.collapseRow(data.rowIndex)
    } else if (data.event.isSelected == false) {
      data.grid.expandRow(data.rowIndex);
    }

    this.gridData.forEach((element: any, index: any) => {
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
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (innrer.userId == selectedData.userId)
              innrer.childWriteselected = true;
          })
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        if (element.title.toLowerCase() == "administrator") {
          element.parentWriteselected = true;
          element.parentWriteDisable = true;
        }
        element.users.forEach((innrer: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (innrer.userId == selectedData.userId)
              innrer.childWriteselected = element.title.toLowerCase() == "administrator" ? true : innrer.isMandatory;
          });
        });
      });
    }
    this.updateParentSelection();
  };


  updateParentSelection() {

    this.gridData.forEach((element: any) => {
      element.parentReadselected = false;
      element.parentWriteselected = false;

      let writechildSelected = 0;
      let readChildSelected = 0;

      if (element.users != null && element.users.length > 0) {
        element.users.forEach((child: any) => {
          if (child.childReadselected) {
            readChildSelected += 1

          }
          if (child.childWriteselected)
            writechildSelected += 1
        });

        if (readChildSelected == element.users.length) {
          element.parentReadselected = true
        }
        if (writechildSelected == element.users.length) {
          element.parentWriteselected = true
        }

      }


    });
  }


  writeChildAccessClick(data: any) {
    if (data.event.target.checked) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          if (innrer.userId == data.selected.userId)
            innrer.childWriteselected = true;
        });

      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          if (innrer.userId == data.selected.userId)
            innrer.childWriteselected = false;

        });

      });

    }
    this.updateParentSelection();

  }

}
