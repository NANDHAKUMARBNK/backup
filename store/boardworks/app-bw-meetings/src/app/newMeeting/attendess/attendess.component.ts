import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";

@Component({
  selector: "app-attendess",
  templateUrl: "./attendess.component.html",
  styleUrls: ["./attendess.component.scss"],
})
export class AttendessComponent implements OnInit {
  gridData: any;
  readChildtempArray: any;
  changeTextColor: boolean = true;
  columnsData: any = [
    {
      field: "title",
      title: "Board",
      filterType: "text",
      isEnableColumnOptions: false,
      component: 'highlightedText'
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
      name: "Enabling Group Access will allow new Committee members to access the meeting. If you want to limit this meeting to only current Committee members, do not click this checkbox.",
      value: "Enable",
      selected: true,
    },
  ];
  securityControl = new FormControl(true);
  meetingid: any;
  groupAccess: boolean = true;
  commiteeId: any;
  attendeeIds: any;
  attendeeType: any;
  isPermisionLoaded = false;
  errMessage: any;
  isError: boolean = false;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private meetingsService: MeetingsService
  ) {
    this.meetingid = this.activatedRoute.snapshot.queryParams.meetingId;
    this.attendeeType = this.activatedRoute.snapshot.queryParams.type;
    this.commiteeId = this.activatedRoute.snapshot.queryParams.commiteeId;
  }

  ngOnInit(): void {
    this.getAttendeesPermision();
  }

  getAttendeesPermision() {
    this.meetingsService
      .meetingsAttendeesPickerCommittees(this.commiteeId, this.groupAccess)
      .subscribe(async (data: any) => {
        data.result.filter((res: any) => {
          if (res.users.length == 0) {
            res["isUpDown"] = false;
          } else {
            res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
            res["isUpiconClass"] = "mdi mdi-chevron-up f-30";
            res["isUpDown"] = true;
          }
          if (res.title.toLowerCase() === "administrator") {
            res.parentWriteDisable = true;
            res.parentWriteselected = true;
          }
          if (
            !(
              this.attendeeType == "edit" ||
              ("attendesSucess" && !this.isPermisionLoaded)
            )
          ) {
            res.parentWriteDisable = this.groupAccess;
          }
          res.users.map((innerres: any) => {
            // innerres.childReadselected = false;
            innerres.childWriteselected = innerres.isMandatory;
            innerres.disable = innerres.isMandatory;    // this.groupAccess ? true : innerres.isMandatory
          });
          res["isSelected"] = false;
          // res.parentReadselected = false;
          res.parentWriteselected = false;
        });

        this.gridData = data.result;
        if ((
          this.attendeeType == "edit" ||
          "attendesSucess") && !this.isPermisionLoaded
        ) {
          this.getDefaultSelection();
        } else {
          this.getDefaultSelection();
          this.updateParentSelection();
        }
      });
  }

  getDefaultSelection() {
    this.meetingsService.getDeflautSelection(this.meetingid).subscribe(
      (data: any) => {
        this.attendeeIds = data.result.attendeeIds;
        this.groupAccess = data?.result?.isGroupAccess;
        console.log(this.gridData, "griddata");
        this.gridData.forEach((element: any) => {
          let childIsMandatoryCount = 0;
          element.parentWriteDisable = this.groupAccess;
          element.parentWriteselected = this.security[0].selected;
          element.users.forEach((item: any) => {
            item.disable = item.isMandatory;
            if (item.isMandatory) {
              childIsMandatoryCount++;
            }
            // this.groupAccess ? true : item.isMandatory;
            // item.childWriteselected = true;
            if (data.result.attendeeIds.includes(item.userId)) {
              item.childWriteselected = true;
            } else {
              item.childWriteselected = false;
            }
          });
          if(element.users.length == childIsMandatoryCount) {
            element.parentWriteDisable = true;
          }
        });
        this.security[0].selected = true;   // data?.result?.isGroupAccess;
        if (!this.isPermisionLoaded) {
          this.isPermisionLoaded = true;
        }
        this.updateParentSelection();
      },
      (_1: any) => {
        this.updateParentSelection();
      }
    );
  }

  clickButton(type: any) {
    if (type == "cancel") {
    } else {
      let tempArray: any = [];
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          let userObj: any = [];
          console.log(innrer, "innrer");

          if (innrer.childWriteselected) {
            userObj = innrer.userId;
          }
          console.log(userObj, "userObj");

          if (
            tempArray.filter((item: any) => item == userObj).length === 0 &&
            userObj.length > 0
          ) {
            tempArray.push(userObj);
          }
        });
      });
      const reqObj = {
        isGroupAccess: this.groupAccess,
        attendeeIds: tempArray,
      };
      console.log(reqObj, "reqObj");

      this.meetingsService.saveAttendees(this.meetingid, reqObj).subscribe(
        (data: any) => {
          this.router
            .navigateByUrl("/", { skipLocationChange: true })
            .then(() => {
              this.router.navigate(["admin/meetings/newMetting/document"], {
                queryParams: {
                  page: "doc",
                  meetingId: this.meetingid,
                  type: "attendesSucess",
                  commiteeId: this.commiteeId,
                },
              });
            });
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
        }
      );
    }
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
  changeAllDayCheckbox(data: any) {
    console.log("here", data);
    data.length > 0 ? (this.groupAccess = true) : (this.groupAccess = false);
    this.getAttendeesPermision();
    console.log(this.groupAccess, "check");
  }

  insideAccordion(e: any) {}

  accrodianClick(data: any) {
    if (data.event.isSelected) {
      data.grid.collapseRow(data.rowIndex);
    } else if (data.event.isSelected == false) {
      data.grid.expandRow(data.rowIndex);
    }

    this.gridData.forEach((element: any, index: any) => {
      if (data.event.title == element.title) {
        element.isUpDown = !element.isUpDown;
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
          });
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
  }

  updateParentSelection() {
    this.gridData.forEach((element: any) => {
      element.parentReadselected = false;
      element.parentWriteselected = false;

      let writechildSelected = 0;
      let readChildSelected = 0;

      if (element.users != null && element.users.length > 0) {
        element.users.forEach((child: any) => {
          if (child.childReadselected) {
            readChildSelected += 1;
          }
          if (child.childWriteselected) writechildSelected += 1;
        });

        if (readChildSelected == element.users.length) {
          element.parentReadselected = true;
        }
        if (writechildSelected == element.users.length) {
          element.parentWriteselected = true;
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
