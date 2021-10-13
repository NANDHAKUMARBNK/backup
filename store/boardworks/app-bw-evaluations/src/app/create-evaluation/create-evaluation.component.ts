import { ToastrService } from 'lib-bw-svc-apis/src/lib/bw-toastr/toastr.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'lib-bw-svc-apis/src/lib/common/common.service';
import { EvaluationsService } from 'lib-bw-svc-apis/src/lib/evaluations/evaluations.service';

@Component({
  selector: 'app-create-evaluation',
  templateUrl: './create-evaluation.component.html',
  styleUrls: ['./create-evaluation.component.scss']
})
export class CreateEvaluationComponent implements OnInit {
  breadCrumb = "New Evaluation";
  evaluationDataForm: FormGroup;
  resultsAnonymous = [
    {
      name: "",
      value: "anonymous",
      selected: false,
    },
  ];
  restrictResults = [
    {
      name: "",
      value: "restrict",
      selected: false,
    },
  ];

  gridData: any;
  readChildtempArray: any;
  columnsData: any = [
    {
      field: "name",
      title: "Boards",
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
  selectedAnonymous: boolean = false;
  selectedRestrict: boolean = false
  evaluationId: any;
  evaluationType: any;
  evaluationData: any;
  adminUsersData: any;
  adminSelectedUsrs: any;
  adminUsersActulaData: any = [];
  minDate = new Date()
  errMessage: any;
  isError: boolean=false;
  documents: any = [];
  usersDataItems: any = [];
  userDataValues: any = [];
  constructor(private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private evaluationsService: EvaluationsService,
    private toastr: ToastrService
  ) {
    this.evaluationDataForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      ClosingDate: [''],
      anonymous: [''],
      restrict: [''],
      adminUsers: ['']
    })
    if (this.evaluationsService.documentData && this.evaluationsService.documentData.length > 0) {
      this.documents = this.evaluationsService.documentData;
    }
    this.adminUsers();
  }

  ngOnInit(): void {
    this.evaluationId = this.activatedRoute.snapshot.queryParams.id;
    this.evaluationType = this.activatedRoute.snapshot.queryParams.type;

    if (this.evaluationId) {
      this.getEvalutionById();
      this.getDocuments();
    }
    this.getAttendeesPermision();
    this.evaluationDataForm.get('adminUsers')?.disable()
    if (this.evaluationType == 'template') {
      this.breadCrumb = "New Evaluation Template"
    }

    this.evaluationDataForm.get('ClosingDate')?.setValue(new Date())
  }

  adminUsers() {
    this.evaluationsService.adminUsers().subscribe((data: any) => {
      this.adminUsersActulaData = data.result;
      this.adminUsersData = [
        {
          name: "All Admin Users",
          userId: 0,
          items: data.result

        }
      ]

    })
  }

  getDocuments() {
    this.evaluationsService.getEvalDocuments(this.evaluationId).subscribe((data: any) => {
      /// Bind Document data
      if (data.result) {
        this.documents.push(data.result);
      }
    })
  }

  getEvalutionById() {
    let tempUserArr: any = [];
    this.evaluationsService.getEvalutionsById(this.evaluationId).subscribe((data: any) => {
      //let resultdata=data;
      this.evaluationData = data;
      let adminUsersBind = data.resultsRestrictedTo && data.resultsRestrictedTo.resultsRestrictedTo;
      this.selectedRestrict = adminUsersBind == null ? false : true;
      console.log(adminUsersBind, 'adminUsersBind');
      this.adminUsersActulaData.map((user: any) => {
        if (adminUsersBind) {
          adminUsersBind.map((adminUser: any) => {
            if (adminUser == user.userId) {
              tempUserArr.push({ userId: adminUser, name: user.name });
            }
          })
        }
      })
      if (adminUsersBind) { this.usersDataItems = tempUserArr; }
      if (data.isAnonymous) {
        this.resultsAnonymous = this.resultsAnonymous.map((element: any) => {
          element["selected"] = this.evaluationType == 'use' ? false : true;
          return element
        })
      }
      if (adminUsersBind && adminUsersBind.length > 0) {
        this.evaluationDataForm.get('adminUsers')?.enable()

        this.restrictResults = this.restrictResults.map((element: any) => {
          element["selected"] = true;
          return element
        })
      }
      this.evaluationDataForm.patchValue({
        title: this.evaluationType == 'copy' ? 'copy of' + ' ' + data.title : this.evaluationType == 'use' ? '' : data.title,
        description: data.description,
        ClosingDate: this.evaluationType == 'use' ? new Date(data.closingDate) : new Date(data.createdDate),
        // adminUsers:adminUsersBind,
        anonymous: this.resultsAnonymous,
        restrict: this.restrictResults
      })
      this.minDate = this.evaluationType == 'use' ? new Date(data.closingDate) : new Date(data.createdDate)
    })
  }
  backNavigation() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
    this.evaluationsService.documentData = {};
    this.evaluationsService.documentsRetain = {};
  }

  cancel(e: any) {

  }

  createEvaluation(e: any) {  
   if(this.evaluationDataForm.invalid){
     this.evaluationDataForm.markAllAsTouched()
     return
   }
    let tempArray: any = [];
    this.gridData.forEach((element: any, index: any) => {
      element.users.forEach((innrer: any) => {
        let userObj: any = []
        if (innrer.childWriteselected) {
          userObj = innrer.userId
        }
        if (tempArray.filter((item: any) => item == userObj).length === 0 && userObj.length > 0) {
          tempArray.push(userObj);
        }
      })
    });

    let tempArrayAdmin: any = [];
    this.adminSelectedUsrs && this.adminSelectedUsrs.forEach((element: any) => {
      if (element != 0) {
        tempArrayAdmin.push(element)
      }
    });

    let adminUses;
    if (this.adminUsersActulaData && this.adminUsersActulaData.length == tempArrayAdmin && tempArrayAdmin.length) {
      adminUses = true
    } else {
      adminUses = false
    };
    const reqObj = {
      "title": this.evaluationDataForm.get('title')?.value,
      "description": this.evaluationDataForm.get('description')?.value,
      "closingDate": this.evaluationDataForm.get('ClosingDate')?.value,
      "recipientIds": tempArray,
      "isAnonymous": this.selectedAnonymous,
      "isRestrictedTo": this.selectedRestrict,
      "isAllAdmins": adminUses,
      "restrictedRecipientIds": tempArrayAdmin,
      "documents": [...this.documents.map((item: any) => item.DocumentId)]
    }
    if (this.evaluationType == 'edit') {
      this.evaluationsService.updateEvalutions(this.evaluationId, reqObj).subscribe((data: any) => {
        if (data) {
          this.toastr.showToastr('success', 'Evaluation Updated Successfully!');
          this.router.navigate(["admin/evaluations/editEvaluation"], {
            queryParams: { id: data.result, type: '' },
          });
          this.evaluationsService.documentData = {};
          this.evaluationsService.documentsRetain = {};
        }
      },
        err => {
          this.setError(err.error.result.errorMessages)
        }
      )
    } else if (this.evaluationType == 'copy') {
      this.evaluationsService.copyEvalutions(this.evaluationId, reqObj).subscribe((data: any) => {
        if (data) {
          this.toastr.showToastr('success', 'Evaluation Copied Successfully!')
        }
      },
        err => {
          this.setError(err.error.result.errorMessages)

        }
      )
    } else if (this.evaluationType == 'template') {
      this.evaluationsService.createEvalutionsTemplate(reqObj).subscribe((data: any) => {
        //this.router.navigate(['../'],{relativeTo:this.activatedRoute})
        this.toastr.showToastr('success', 'Evaluation Template Created Successfully!')
        this.router.navigate(["admin/evaluations/editEvaluation"], {
          queryParams: { id: data.result, type: '' },
        });
        this.evaluationsService.documentData = {};
        this.evaluationsService.documentsRetain = {};
      },
        err => {
          this.setError(err.error.result.errorMessages)

        }
      )
    }
    else {
      this.evaluationsService.createEvalutions(reqObj).subscribe((data: any) => {
        //this.router.navigate(['../'],{relativeTo:this.activatedRoute})
        this.toastr.showToastr('success', 'Evaluation Created Successfully!');
        this.router.navigate(["admin/evaluations/editEvaluation"], {
          queryParams: { id: data.result, type: '' },
        });
        this.evaluationsService.documentData = {};
        this.evaluationsService.documentsRetain = {};
      },
        err => {
          this.setError(err.error.result.errorMessages)

        }
      )
    }

  }

  changeAllDayCheckbox(e: any, type: any) {
    console.log(e, 'eeee');
    if (type == 'resultsAnonymous') {
      if (e.length > 0) {
        this.selectedAnonymous = true;
      } else {
        this.selectedAnonymous = false;

      }
    }

    if (type == 'restrict') {
      if (e.length > 0) {
        this.selectedRestrict = true;
        this.evaluationDataForm.get('adminUsers')?.enable()
      } else {
        this.selectedRestrict = false;
        this.evaluationDataForm.get('adminUsers')?.disable()

      }
    }

  }

  getAttendeesPermision() {
    this.commonService.getentitiesCommitteesOfficerGroups().subscribe(async (data: any) => {
      data.result.filter((res: any) => {
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

      this.gridData = data.result;

      if (this.evaluationId) {
        this.evaluationData && this.evaluationData.receipients.forEach((element: any) => {
          this.gridData.forEach((data: any) => {
            data.users.forEach((user: any) => {
              if (element.userId == user.userId) {

                user.childWriteselected = true;

              }
            });

          });
        });
      }

      // await this.getDaflutSelection()
      this.updateParentSelection();
      if (this.evaluationsService.documentsRetain) {
        const { data, grid }: any = this.evaluationsService.documentsRetain;
        this.evaluationDataForm.patchValue({
          title: data.title,
          description: data.description,
          ClosingDate: data.ClosingDate,
          anonymous: data.anonymous,
          restrict: data.restrict,
          adminUsers: data.adminUsers
        });
        this.gridData = grid;
      }
    })
  }

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

  onSelect(event: any) {
    console.log(event, 'aaaa');

    this.adminSelectedUsrs = event;

  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  addDocument(e: any) {
    this.evaluationsService.documentsRetain = {
      data: this.evaluationDataForm.value,
      grid: this.gridData,
    };
    this.router.navigate(["../add-document"], {
      relativeTo: this.activatedRoute,
    });
  }

  deleteIcon(index: any, item: any) {
    this.documents.splice(index, 1);
    this.commonService
      .deleteDocumentcache(item.DocumentId)
      .subscribe((res: any) => {});
    if (this.evaluationId && item.DocumentId) {
      this.evaluationsService
        .deleteDocumentById(this.evaluationId, item.DocumentId)
        .subscribe(
          (res) => {
            if (res) {
              this.toastr.showToastr(
                "success",
                "Document Deleted Successfully!"
              );
            }
          },
          (err: any) => {
            this.setError(err.error.result.errorMessages);
          });
    }
  }

}
