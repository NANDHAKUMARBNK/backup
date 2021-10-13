import { CollaborationService } from "./../../../../lib-bw-svc-apis/src/lib/collaboration/collaboration.service";
import { Validators } from "@angular/forms";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "app-sub-folder",
  templateUrl: "./sub-folder.component.html",
  styleUrls: ["./sub-folder.component.scss"],
})
export class SubFolderComponent implements OnInit {
  newFolderForm: FormGroup;
  defaultItems: any = [];
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
      width: '300px',      
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      field: "",
      title: "Users",
      width: '300px',
      filterType: "text",
      isEnableColumnOptions: false,
    },
    {
      title: "Group Access",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "readAccess",
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
  gridData: any;
  errMessage: any;
  isError: boolean = false;
  selectAll: any = [{ name: "", id: "all" }];
  type: any;
  infoSited: any;
  level: any;
  parentFolderName: any;
  constructor(
    private _formBuilder: FormBuilder,
    private collabService: CollaborationService,
    private location: Location,
    private activateRoute: ActivatedRoute
  ) {
    this.type = this.activateRoute.snapshot.params.type;
    this.infoSited = this.activateRoute.snapshot.params.id;
    this.level = this.activateRoute.snapshot.params.level;
    this.parentFolderName = this.activateRoute.snapshot.params.name;
    this.newFolderForm = this._formBuilder.group({
      name: ["", [Validators.required]],
      selectAll: [""],
    });
  }

  ngOnInit(): void {
    this.getCommitteesGroups();
    if (this.type && this.type == "create") {
      this.defaultItems = [
        {
          text: this.parentFolderName,
          title: this.parentFolderName,
        },
        {
          text: "New Sub Folder",
          title: "New Sub Folder",
        },
      ];
    }
  }

  clickButton(e: any) {
    if (e == "Save") {
    } else if (e == "Cancel") {
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

  insideAccordion(e: any) {}
  seterror(e: any) {}
  changeCheckbox(e: any) {}
  navigateInto(params: any) {
    if (
      params.text === this.parentFolderName ||
      params.title === this.parentFolderName
    ) {
      this.location.back();
    }
  }
}
