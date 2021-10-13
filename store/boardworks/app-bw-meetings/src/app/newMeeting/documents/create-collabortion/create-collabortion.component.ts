import { MeetingsService } from './../../../../../../lib-bw-svc-apis/src/lib/meetings/meetings.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaborationService } from 'lib-bw-svc-apis/src/lib/collaboration/collaboration.service';


@Component({
  selector: 'app-create-collabortion',
  templateUrl: './create-collabortion.component.html',
  styleUrls: ['./create-collabortion.component.scss']
})
export class CreateCollabortionComponent implements OnInit {
  @Input() btnClick: any;
  @Input() meetingData: any;
  collaborationDataForm: FormGroup;
  emailCheckBox = [
    {
      // name: "Checking this box will send an email to all users who have been granted read and/or write access to this Collaboration Workspace",
      // value: "Checking this box will send an email to all users who have been granted read and/or write access to this Collaboration Workspace",
      name: "Send Email to all selected users",
      selected: false,
    },

  ];
  @Output() successCallBack = new EventEmitter();


  columnsData: any = [
    {
      field: "name",
      title: "Board",
      filterType: "text",
      isEnableColumnOptions: false,
      // width: "200px"
      //component:"collaboration"
    },
    {
      title: "User",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      title: "Read Access",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "readAccess"
    },
    {
      title: "Write Access",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "writeAccess"
    },


    {

      //component: 'useTemplate',
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


  gridData: any = []
  readChildtempArray: any = [];
  emailSelectedValue: any;
  errMessage: any;
  isError: boolean = false;
  collaborationId: any;
  collaborationData: any;
  constructor(private fb: FormBuilder,
    private router: Router,
    private collaborationService: CollaborationService,
    private activatedRoute: ActivatedRoute,
    private meetingService: MeetingsService

  ) {

    this.collaborationDataForm = this.fb.group({
      collaborationName: ['', Validators.required],
      emailalert: [false],

    })


  }

  ngOnChanges(): void {
    console.log(this.btnClick, 'btnclick');
    if (this.btnClick) {
      this.createWorkSpace()
    }

    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

  }

  ngOnInit(): void {
    this.getAccessControl();
    this.collaborationDataForm.get('collaborationName')?.setValue(this.meetingData.title)
    // if (this.collaborationId) {
    //   this.getCollaborationById();
    //   this.createAddDocuText = "Update And Add Documents";
    //   this.CreateBtnText = "Update"
    // }
  }

  getDefaultSelection() {
    console.log(this.meetingData);    
    this.meetingService.getDeflautSelection(this.meetingData.meetingId).subscribe(
      (data: any) => {
        console.log(this.gridData, "griddata");
        this.gridData.forEach((element: any) => {
          element.users.forEach((item: any) => {
            if (data.result.attendeeIds.includes(item.userId)) {
              item.childReadselected = true;
            } else {
              item.childReadselected = false;
            }
          });
        });
        this.updateParentSelection();
      },
      (_1: any) => {
        this.updateParentSelection();
      }
    );
  }


  // getCollaborationById() {
  //   this.collaborationService.getCollaborationById(this.collaborationId).subscribe((data: any) => {
  //     this.collaborationData = data.result;
  //     this.setFromControl(data.result)
  //   })
  // }

  setFromControl(data: any) {
    // this.collaborationDataForm.get('collaborationName')?.setValue(data.workspace);
    this.collaborationDataForm.patchValue({
      collaborationName: data.workspace,
      workspace: data.meetingId ? true : false,
      meeting: data.meetingId ? "mettingYes" : "mettingNo",
      committee: data.meetingCommitteeId,
      meetingId: data.meetingId

    })

    data.users.forEach((element: any) => {
      this.gridData.forEach((data: any) => {
        data.users.forEach((user: any) => {
          if (element.userId == user.userId) {
            if (element.readAccess) {
              user.childReadselected = true;
            }
            if (element.writeAccess) {
              user.childWriteselected = true;
            }
          }
        });

      });
    });

    this.updateParentSelection()
  }



  getAccessControl() {
    this.collaborationService.getAccessControl().subscribe((data: any) => {
      data.result.filter((res: any) => {
        if (res.users.length == 0) {
          res["isUpDown"] = false;
        } else {
          res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
          res["isUpiconClass"] = "mdi mdi-chevron-up f-30"
          res["isUpDown"] = true;
        };
        res.users.map((innerres: any) => {
          innerres.childReadselected = false;
          innerres.childWriteselected = false;
        })
        res["isSelected"] = false;
        res.parentReadselected = false;
        res.parentWriteselected = false;
      })

      this.gridData = data.result;
      this.getDefaultSelection();
    },
      error => {

      }
    )
  }





  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  cancel(e: any) {
    this.router.navigate(['admin/collaborations'])
  }
  createDocuments(e: any) {

  };

  collaborationReqObj() {

  };

  changeCheckbox(e: any) {
    this.emailSelectedValue = e;
  }

  createWorkSpace() {
    // this.router.navigate(['../addDocument/1/krishna'], { relativeTo: this.activatedRoute })
    if (this.collaborationDataForm.invalid) {
      this.collaborationDataForm.markAllAsTouched()
      return
    }
    let tempArray: any = [];
    this.gridData.forEach((element: any, index: any) => {
      element.users.forEach((innrer: any) => {
        let userObj: any = {
          "userId": innrer.userId,
          "readAccess": false,
          "writeAccess": false
        }
        if (innrer.childReadselected) {
          userObj.readAccess = true;
        }
        if (innrer.childWriteselected) {
          userObj.writeAccess = true;
        }
        if (tempArray.filter((item: any) => item.userId === userObj.userId).length === 0 && (userObj.readAccess || userObj.writeAccess)) {
          tempArray.push(userObj);
        }
      })
    });
    const reqObj = {
      "workspace": this.collaborationDataForm.get('collaborationName')?.value,
      // "committeeId": this.collaborationDataForm.get('committee')?.value,
      "userPermissions": tempArray,
      "sendAlert": this.emailSelectedValue,
      "meetingId":this.meetingData.meetingId
    };

    this.collaborationService.createCollabortion(reqObj).subscribe((data: any) => {
      let collaborationData = data.result;
      this.successCallBack.emit(data.result);

    }, (err: any) => {
      this.setError(err.error.result.errorMessages);
    })
    // }
  };

  onChange(e: any) { }

  insideAccordion(e: any) { }

  accrodianClick(data: any) {
    if (data.event.isSelected) {
      data.grid.collapseRow(data.rowIndex)
    } else if (data.event.isSelected == false) {
      data.grid.expandRow(data.rowIndex);
    }

    this.gridData.forEach((element: any, index: any) => {
      if (data.event.id == element.id) {
        element.isUpDown = !element.isUpDown
        element.isSelected = !element.isSelected;
      }
    });
  }

  readAccessClick(data: any) {
    if (data.event.target.checked) {
      data.selected.parentReadselected = true;
    } else {
      data.selected.parentReadselected = false;

    }
    if (data.selected.parentReadselected) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (innrer.userId == selectedData.userId)
              innrer.childReadselected = true;

          })
        });

      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (innrer.userId == selectedData.userId)
              innrer.childReadselected = false;

          })
        });

      });
    }
    this.updateParentSelection();

  };

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
        element.users.forEach((innrer: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (innrer.userId == selectedData.userId)
              innrer.childWriteselected = false;
          })
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

  readChildAccessClick(data: any) {

    if (data.event.target.checked) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          if (innrer.userId == data.selected.userId)
            innrer.childReadselected = true;
        });

      });


    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          if (innrer.userId == data.selected.userId)
            innrer.childReadselected = false;
        });
      });

    }
    this.updateParentSelection();


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
