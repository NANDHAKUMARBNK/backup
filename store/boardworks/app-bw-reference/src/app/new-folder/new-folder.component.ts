import { ToastrService } from "./../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { ReferenceService } from "lib-bw-svc-apis/src/lib/reference/reference.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CollaborationService } from "./../../../../lib-bw-svc-apis/src/lib/collaboration/collaboration.service";
import { Validators } from "@angular/forms";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { REFERENCE_TYPES } from "lib-bw-svc-apis/src/lib/constant/commonConstant";
@Component({
  selector: "app-new-folder",
  templateUrl: "./new-folder.component.html",
  styleUrls: ["./new-folder.component.scss"],
})
export class NewFolderComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "Documents",
      title: "Documents",
    },
    {
      text: "New Folder",
      title: "New Folder",
    },
  ];
  referenceType: any;
  newFolderForm: FormGroup;
  onCellClicked: any = [];
  columnOptions: any = {
    filter: true,
    sort: true,
    lock: false,
    stick: false,
  };
  columnsData: any = [
    {
      field: "name",
      title: "Boards",
      width: "300px",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "",
      title: "Users",
      width: "300px",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      title: "Access",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "readAccess",
    },
    {
      title: "Group Access",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "writeAccess",
    },
    {
      isEnableColumnOptions: false,
      component: "icon",
    },
  ];
  gridData: any;
  errMessage: any;
  isError: boolean = false;
  selectAll: any = [{ name: "Send alert to all recipients", id: "all" }];
  type: any;
  infoSited: any;
  level: any;
  isArchiveClicked: boolean = false;
  archiveClass: any =
    "btn-base secondary-btn-text border-secondary bw-font-prm-medium btn-sm me-md-4 px-4";
  constructor(
    private _formBuilder: FormBuilder,
    private collabService: CollaborationService,
    private activateRoute: ActivatedRoute,
    private referenceService: ReferenceService,
    private toastr: ToastrService,
    private router: Router,
    private location: Location
  ) {
    this.type = this.activateRoute.snapshot.params.type;
    this.infoSited = this.activateRoute.snapshot.params.id;
    this.level = this.activateRoute.snapshot.params.level;
    this.newFolderForm = this._formBuilder.group({
      folderName: ["", [Validators.required]],
      recipientUsers: [[]],
      sendAlert: [false],
    });
    REFERENCE_TYPES.map((type) => {
      if (type.displayName == this.activateRoute.snapshot.params.type) {
        this.type = type.value;
      }
    });
    this.getCommitteesGroups();
  }

  ngOnInit(): void {
    if (this.type === "edit") {
      this.getDetails(this.level, this.infoSited);
    }
  }
  async getDetails(type: any, id: any) {
    await this.referenceService
      .getReferenceDetails(type, id)
      .subscribe((response: any) => {
        this.newFolderForm.patchValue(response);
        this.gridData.map((data: any) => {
          data["usersChecked"] = [];
          data.users.map((user: any) => {
            const id: any = response.recipientUserIds.findIndex(
              (ids: any) => ids === user.userId
            );
            if (id !== -1) {
              user["childWriteselected"] = true;
            }
            data["usersChecked"].push(user["childWriteselected"]);
            data["parentWriteselected"] = data["usersChecked"].every(
              (e: any) => e == true
            );
          });
        });
        console.log("gridData", this.gridData);
      });
  }
  shuffleGridData(type: any) {
    let tempArr: any = [];
    this.gridData.forEach((element: any, i: any) => {
      element.users.forEach((res: any) => {
        if (res.childWriteselected && !tempArr.includes(res.userId)) {
          tempArr.push(res.userId);
        }
        if (res.childReadselected && !tempArr.includes(res.userId)) {
          tempArr.push(res.userId);
        }
      });
    });
    this.newFolderForm.value.recipientUsers = tempArr;
    if (type === "save") {
      this.infoSited
        ? (this.newFolderForm.value.parentId = this.infoSited)
        : (this.newFolderForm.value.parentId = null);
      // this.newFolderForm.value.sendAlert = false;
    } else {
      this.newFolderForm.value.isArchived = this.isArchiveClicked;
      // this.newFolderForm.value.sendAlert = false;
    }
  }
  editAndArchive(mode: any) {
    this.shuffleGridData(mode);

    if (this.infoSited && mode == "save") {
      this.newFolderForm.get("parentId")?.setValue(this.infoSited);
    }
    if (this.newFolderForm.invalid) {
      this.newFolderForm.markAllAsTouched();
      return;
    }
    this.referenceService
      .manipulateReferenceFolder(
        this.level,
        this.infoSited ? this.infoSited : "",
        this.newFolderForm.value,
        mode
      )
      .subscribe((response: any) => {
        if (response.result) {
          this.toastr.showToastr(
            "success",
            mode === "save"
              ? "Folder Craeted Successfully!"
              : "Folder Updated Successfully!"
          );
          this.router.navigate(["admin/documents"]);
        }
      });
  }
  clickButton(e: any) {
    if (e == "Save") {
      if (this.type === "edit") {
        //Edit API
        this.editAndArchive(this.type);
      } else {
        //Save API
        this.editAndArchive(this.type === "create" && "save");
      }
    } else if (e == "Cancel") {
      this.router.navigate(["admin/documents"]);
    } else if (e === "archive") {
      this.isArchiveClicked = !this.isArchiveClicked;
      if (this.isArchiveClicked === true) {
        this.archiveClass =
          "btn-base btn-containe bw-font-prm-medium secondary-btn-contained btn-sm me-md-4 px-4";
      } else {
        this.archiveClass =
          "btn-base secondary-btn-text border-secondary bw-font-prm-medium btn-sm me-md-4 px-4";
      }
      this.editAndArchive("edit");
    }
  }

  async getCommitteesGroups() {
    await this.collabService.getAccessControl().subscribe((data: any) => {
      data.result.filter((res: any) => {
        if (res.users.length == 0) {
          res["isUpDown"] = false;
        } else {
          res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
          res["isUpiconClass"] = "mdi mdi-chevron-up f-30";
          res["isUpDown"] = true;
        }
        res.users.map((response: any) => {
          response.childWriteselected = false;
        });
        res["isSelected"] = false;
        res.parentWriteselected = false;
      });
      this.gridData = data.result;
    });
  }

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
  // clickButton(e: any) {
  // 	if (e == 'Save') {
  // 		let tempArr: any = [];
  // 		this.gridData.forEach((element: any, i: any) => {
  // 			element.users.forEach((res: any) => {
  // 				if (res.childWriteselected && !tempArr.includes(res.userId)) {
  // 					tempArr.push(res.userId);
  // 				}
  // 				if (res.childReadselected && !tempArr.includes(res.userId)) {
  // 					tempArr.push(res.userId);
  // 				}
  // 			});
  // 		});
  // 		this.newFolderForm.value.recipientUsers = tempArr;
  // 		this.addNewFolder()
  // 	} else if (e == 'Cancel') {
  // 		this.location.back();
  // 	}
  // }

  writeAccessClick(data: any) {
    if (data.event.target.checked) {
      data.selected.parentWriteselected = true;
    } else {
      data.selected.parentWriteselected = false;
    }
    if (data.selected.parentWriteselected) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (inner.userId == selectedData.userId)
              inner.childWriteselected = true;
          });
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (inner.userId == selectedData.userId)
              inner.childWriteselected = false;
          });
        });
      });
    }
  }

  writeChildAccessClick(data: any) {
    if (data.event.target.checked) {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          if (inner.userId == data.selected.userId)
            inner.childWriteselected = true;
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          if (inner.userId == data.selected.userId)
            inner.childWriteselected = false;
        });
      });
    }
  }

  // readChildAccessClick(data: any) {
  // 	if (data.event.target.checked) {
  // 		this.gridData.forEach((element: any, index: any) => {
  // 			element.users.forEach((innrer: any) => {
  // 				if (innrer.userId == data.selected.userId)
  // 					innrer.childReadselected = true;
  // 			});
  // 		});
  // 	} else {
  // 		this.gridData.forEach((element: any, index: any) => {
  // 			element.users.forEach((innrer: any) => {
  // 				if (innrer.userId == data.selected.userId)
  // 					innrer.childReadselected = false;
  // 			});
  // 		});
  // 	}
  // 	// this.updateParentSelection();
  // }
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
          });
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((innrer: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (innrer.userId == selectedData.userId)
              innrer.childReadselected = false;
          });
        });
      });
    }
    // this.updateParentSelection();
  }

  insideAccordion(e: any) {}

  addNewFolder() {
    // console.log(this.newFolderForm.value, this.type);
    this.referenceService
      .addNewFolder(this.type, this.newFolderForm.value)
      .subscribe((res) => {
        if (res) {
          this.toastr.showToastr("success", "New Folder Added successfully.");
          this.location.back();
        }
      });
  }

  seterror(e: any) {}

  changeCheckbox(e: any) {
    const value = e.length > 0 ? true : false;
    this.newFolderForm.get("sendAlert")?.setValue(value);
  }
  navigateInto(params: any) {
    if (params.text === "Documents" || params.title === "Documents") {
      this.location.back();
    }
  }
}
