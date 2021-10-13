import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { EvaluationsService } from "lib-bw-svc-apis/src/lib/evaluations/evaluations.service";
import { VotingsServiceService } from "lib-bw-svc-apis/src/lib/votings/votings-service.service";
import { Location } from "@angular/common";

@Component({
  selector: "app-new-voting",
  templateUrl: "./new-voting.component.html",
  styleUrls: ["./new-voting.component.scss"],
})
export class NewVotingComponent implements OnInit {
  defaultItems: any = [];
  votingDataForm: FormGroup;
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
  votingId: any;
  votingType: any;
  votingData: any;
  adminUsersData: any;
  adminSelectedUsrs: any;
  adminUsersActulaData: any;
  minDate = new Date();
  errMessage: any;
  isError: boolean = false;
  documents: any = [];
  doc: any = [];
  showAddDocument: boolean = false;
  buttonName: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private votingService: VotingsServiceService,
    private toastr: ToastrService,
    private location: Location,
  ) {
    this.votingDataForm = this.fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      ClosingDate: [""],
      adminUsers: [""],
    });
    if (
      this.votingService.documentData &&
      this.votingService.documentData.length > 0
    ) {
      this.documents = this.votingService.documentData;
      // this.documents = this.votingService.documentData.filter(
      //   (v: any, i: any, a: any) =>
      //     a.findIndex((t: any) => t.DocumentId === v.DocumentId) === i
      // );
    }
    this.getAttendeesPermision();
  }

  ngOnInit(): void {
    this.votingId = this.activatedRoute.snapshot.queryParams.id;
    this.votingType = this.activatedRoute.snapshot.queryParams.type;
    if (this.votingId) {
      this.getVotingById();
    }
    // this.adminUsers();
    this.votingDataForm.get("adminUsers")?.disable();
    this.votingDataForm.get("ClosingDate")?.setValue(new Date());
    if (!this.votingId) {
      this.defaultItems = [
        {
          text: "Votings",
          title: "Votings",
        },
        {
          text: "New Votings",
          title: "New Votings",
        },
      ];
    } else {
      this.defaultItems = [
        {
          text: "Votings",
          title: "Votings",
        },
        {
          text: "Edit Votings",
          title: "Edit Votings",
        },
      ];
    }

    if(this.votingType === undefined){
      this.buttonName = 'CREATE VOTE'
      }
    else {
       this.buttonName = 'SAVE'
       this.getAttendeesPermision();
      }
  }
  // adminUsers() {
  //   this.evaluationsService.adminUsers().subscribe((data: any) => {
  //     this.adminUsersActulaData = data.result;
  //     this.adminUsersData = [
  //       {
  //         name: "All Admin Users",
  //         userId: 0,
  //         items: data.result,
  //       },
  //     ];
  //   });
  // }

  getVotingById() {
    this.votingService.getVotingsById(this.votingId).subscribe((data: any) => {
      this.votingData = data.result;

      this.votingDataForm.patchValue({
        title:
          this.votingType == "copy"
            ? "copy of" + " " + this.votingData.votingName
            : this.votingType == "use"
            ? ""
            : this.votingData.votingName,
        description: this.votingData.description,
        ClosingDate:
          this.votingType == "use"
            ? new Date(this.votingData.closingDate)
            : new Date(this.votingData.createdDate),
      });
    });
  }
  backNavigation() {
    this.router.navigate(["../"], { relativeTo: this.activatedRoute });
  }
  cancel(e: any) {}
  createVoting(e: any) {
    // if (this.votingDataForm.invalid) {
    //   this.votingDataForm.markAllAsTouched();
    //   return;
    // }
    let tempArray: any = [];
    this.gridData.forEach((element: any, index: any) => {
      element.users.forEach((innrer: any) => {
        let userObj: any = [];
        if (innrer.childWriteselected) {
          userObj = innrer.userId;
        }
        if (
          tempArray.filter((item: any) => item == userObj).length === 0 &&
          userObj.length > 0
        ) {
          tempArray.push(userObj);
        }
      });
    });
    const reqObj = {
      title: this.votingDataForm.get("title")?.value,
      description: this.votingDataForm.get("description")?.value,
      closingDate: this.votingDataForm.get("ClosingDate")?.value,
      recipientIds: tempArray,
      VotingDocuments: this.documents,
      // isAllAdmins: adminUses,
      // restrictedRecipientIds: tempArrayAdmin,
    };
    if (this.votingType == "edit") {
      this.votingService.updateVotings(this.votingId, reqObj).subscribe(
        (data: any) => {
          if (data) {
            this.toastr.showToastr(
              "success",
              "Voting Updated Successfully!"
            );
            this.location.back();
          }
        },
        (err) => {
          this.setError(err.error.result.errorMessages);
        }
      );
    } else if (this.votingType == "copy") {
      this.votingService.copyVotings(this.votingId, reqObj).subscribe(
        (data: any) => {
          if (data) {
            this.toastr.showToastr("success", "Votings Copied Successfully!");
          }
        },
        (err) => {
          this.setError(err.error.result.errorMessages);
        }
      );
    } else {
      this.votingService.createVotings(reqObj).subscribe(
        (data: any) => {
          this.toastr.showToastr("success", "Votings Created Successfully!");
          this.router.navigate(["admin/votings/edit-voting"], {
            queryParams: { id: data.result, type: "" },
          });
        },
        (err) => {
          this.setError(err.error.result.errorMessages);
        }
      );
    }
  }
  async getAttendeesPermision() {
    await this.commonService
      .getentitiesCommitteesOfficerGroups()
      .subscribe(async (data: any) => {
        data.result.filter((res: any) => {
          if (res.users.length == 0) {
            res["isUpDown"] = false;
          } else {
            res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
            res["isUpiconClass"] = "mdi mdi-chevron-up f-30";
            res["isUpDown"] = true;
          }
          res.users.map((innerres: any) => {
            innerres.childWriteselected = innerres.isMandatory;
            innerres.disable = innerres.isMandatory;
          });
          res["isSelected"] = false;
          res.parentWriteselected = false;
        });
        this.gridData = data.result;
        if (this.votingId) {
          this.votingData &&
            this.votingData.recipients.forEach((element: any) => {
              this.gridData.forEach((data: any) => {
                data.users.forEach((user: any) => {
                  if (element.userId == user.userId) {
                    user.childWriteselected = true;
                  }
                });
              });
            });
        }
        this.updateParentSelection();
        if (this.votingService.votingDocumentsRetain) {
          const { data, grid }: any = this.votingService.votingDocumentsRetain;
          this.votingDataForm.patchValue({
            title: data.title,
            description: data.description,
            ClosingDate: data.ClosingDate,
          });
          this.gridData = grid;
        }
      });
  }
  insideAccordion(e: any) {}
  accrodianClick(data: any) {
    if (data.event.isSelected) {
      data.grid.collapseRow(data.rowIndex);
    } else if (data.event.isSelected == false) {
      data.grid.expandRow(data.rowIndex);
    }
    this.gridData.forEach((element: any, index: any) => {
      if (data.event.id == element.id) {
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
        element.users.forEach((innrer: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (innrer.userId == selectedData.userId)
              innrer.childWriteselected = false;
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
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
  navigateInto(params: any) {
    if (params.text === "Votings" || params.title === "Votings") {
      this.backNavigation();
    }
  }
  addDocument(e: any) {
    this.votingService.votingDocumentsRetain = {
      data: this.votingDataForm.value,
      grid: this.gridData,
    };
    this.router.navigate(["../add-document"], {
      relativeTo: this.activatedRoute,
    });
  }
  linksModalAction(e: any) {
    if (e === "cancel") {
      this.showAddDocument = false;
    } else {
      console.log(e, "vaaduuuu");
      this.documents = e;
      this.showAddDocument = false;
    }
  }
  deleteIcon(index: any, item: any) {
    this.documents.splice(index, 1);
    this.commonService
      .deleteDocumentcache(item.DocumentId)
      .subscribe((res: any) => {});
    if (this.votingId && item.DocumentId) {
      this.votingService
        .deleteDocumentById(this.votingId, item.DocumentId)
        .subscribe(
          (res) => {
            if (res) {
              this.toastr.showToastr(
                "success",
                "Alert Document Deleted Successfully!"
              );
            }
          },
          (err: any) => {
            this.setError(err.error.result.errorMessages);
          }
        );
    }
  }
}
