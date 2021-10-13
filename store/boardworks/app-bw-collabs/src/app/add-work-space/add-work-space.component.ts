import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaborationService } from 'lib-bw-svc-apis/src/lib/collaboration/collaboration.service';

@Component({
  selector: 'app-add-work-space',
  templateUrl: './add-work-space.component.html',
  styleUrls: ['./add-work-space.component.scss']
})
export class AddWorkSpaceComponent implements OnInit {
  breadCrumb = "New Collaboration Folder";
  collaborationDataForm: FormGroup;
  enableCommitteFlag: boolean = false;
  emailCheckBox = [

    {
      name: "Checking this box will send an email to all users who have been granted read and/or write access to this Collaboration Workspace",
      value: "Checking this box will send an email to all users who have been granted read and/or write access to this Collaboration Workspace",
      selected: false,
    },

  ]

  workspaceRadio = [
    {
      name: "Yes",
      value: true,
      selected: false,
    },
    {
      name: "No",
      value: false,
      selected: false,
    },
  ];
  MettingRadio = [
    {
      name: "Yes",
      value: "mettingYes",
      selected: false,
    },
    {
      name: "No",
      value: "mettingNo",
      selected: false,
    },
  ]
  committeeData: any;

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
  createAddDocuText = "Create And Add Documents";
  CreateBtnText = "Create"
  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: true,
    lock: false,
    stick: false,
  };


  gridData: any = []
  meetingData: any;
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

  ) {

    this.collaborationDataForm = this.fb.group({
      collaborationName: ['', Validators.required],
      emailalert: [false],
      workspace: [false, Validators.required],
      meeting: [],
      committee: [''],
      meetingId: [null]
    })

    this.collaborationId = this.activatedRoute.snapshot.params.id;

  }

   ngOnInit(): void {
    if (this.collaborationId) {
      this.getCollaborationById();
      this.createAddDocuText = "Update And Add Documents";
      this.CreateBtnText = "Update"
    }
    this.getCommittee();
    this.getAccessControl();
    
  }

  backNavigation() {
    this.router.navigate(['admin/collaborations'])
  }
  getCollaborationById() {
    this.collaborationService.getCollaborationById(this.collaborationId).subscribe((data: any) => {
      this.collaborationData = data.result;
      this.setFromControl(data.result)
    })
  }

  setFromControl(data: any) {
    // this.collaborationDataForm.get('collaborationName')?.setValue(data.workspace);
    this.collaborationDataForm.patchValue({
      collaborationName: data.workspace,
      workspace: data.meetingId ? true : false,
      meeting: data.meetingId ? "mettingYes" : "mettingNo",
      committee: data.meetingCommitteeId,
      meetingId: data.meetingId

    })

  
  }

  getCommittee() {
    this.collaborationService.getCommittee().subscribe((data: any) => {
     // this.gridData = data.result;
      this.committeeData = data.result;
    },
      error => {

      }
    )
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
      console.log(this.gridData,'getAccessControl');

      if(this.collaborationData){
        this.collaborationData.users.forEach((element: any) => {
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
    
        console.log(this.gridData,'this.gridData');
        
    
        this.updateParentSelection()
      }
      
    },
      error => {

      }
    )
  }

  ngAfterViewInit(): void {
    this.collaborationDataForm.get('workspace')?.valueChanges.subscribe((data: any) => {
      if (data) {
        this.enableCommitteFlag = true;
        this.collaborationDataForm.get('meeting')?.setValue("mettingYes");
        this.collaborationDataForm.get('committee')?.setValidators(Validators.required);
        this.collaborationDataForm.get('meetingId')?.setValidators(Validators.required)

      } else {
        this.enableCommitteFlag = false;
      }
    });


    this.collaborationDataForm.get('meeting')?.valueChanges.subscribe((data: any) => {

      if (data == "mettingYes") {
        this.collaborationDataForm.get('committee')?.setValidators(Validators.required);
        this.collaborationDataForm.get('meetingId')?.setValidators(Validators.required)
        this.collaborationDataForm.get('committee')?.enable()
        this.collaborationDataForm.get('meetingId')?.enable()
        // this.getmeetingBasedOnCommittee(data)
      } else {
        this.collaborationDataForm.get('committee')?.setValidators(null);
        this.collaborationDataForm.get('meetingId')?.setValidators(null)
        this.collaborationDataForm.get('committee')?.disable()
        this.collaborationDataForm.get('meetingId')?.disable()
      }

    })

    this.collaborationDataForm.get('committee')?.valueChanges.subscribe((data: any) => {
      if (data) {
        this.getmeetingBasedOnCommittee(data);
        this.collaborationDataForm.get('meetingId')?.reset();
      } else {

      }

    })

  }


  getmeetingBasedOnCommittee(id: any) {
    this.collaborationService.getMeetingsBasedOnComittee(id).subscribe((data: any) => {
      // this.gridData = data.result;
      this.meetingData = data.result;
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

  createWorkSpace(e: any, type: any) {
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
    if(this.collaborationDataForm.get('workspace')?.value == false){
      this.collaborationDataForm.get('meetingId')?.setValue(null);
    }
    const reqObj = {
      "workspace": this.collaborationDataForm.get('collaborationName')?.value,
      "meetingId": this.collaborationDataForm.get('meetingId')?.value,
      // "committeeId": this.collaborationDataForm.get('committee')?.value,
      "userPermissions": tempArray,
      "sendAlert": this.emailSelectedValue,
    };
    if (this.collaborationId) {
      this.collaborationService.updateCollabortion(this.collaborationId, reqObj).subscribe((data: any) => {
        let collaborationData = data.result;
        if (type === "create") {
          this.router.navigate(['admin/collaborations'])

        } else {
          this.router.navigate([`admin/collaborations/addDocument/${data.result.collaborationId}`])
        }

      }, (err: any) => {
        this.setError(err.error.result.errorMessages);
      })

    } else {
      this.collaborationService.createCollabortion(reqObj).subscribe((data: any) => {
        let collaborationData = data.result;
        if (type === "create") {
          this.router.navigate(['admin/collaborations'])

        } else {
          this.router.navigate([`admin/collaborations/addDocument/${data.result.collaborationId}`])
        }

      }, (err: any) => {
        this.setError(err.error.result.errorMessages);
      })
    }
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
      data.selected.parentReadselected=true
    } else {
      data.selected.parentWriteselected = false;
      data.selected.parentReadselected=false

    }
    if (data.selected.parentWriteselected) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (innrer.userId == selectedData.userId){
              innrer.childWriteselected = true;
              innrer.childReadselected=true
            }
          })
        });

      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (innrer.userId == selectedData.userId){
              innrer.childWriteselected = false;
              innrer.childReadselected=false
            }
          

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

      if (element.users != null && element.users.length>0) {
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
          if (innrer.userId == data.selected.userId){
            innrer.childWriteselected = true;
            innrer.childReadselected=true
          }

        });

      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          if (innrer.userId == data.selected.userId){
            innrer.childWriteselected = false;
            innrer.childReadselected=false;
          }

        });

      });

    }
    console.log(this.gridData,'EDFWQREFERFGEQR');
    
    this.updateParentSelection();

  }


}
