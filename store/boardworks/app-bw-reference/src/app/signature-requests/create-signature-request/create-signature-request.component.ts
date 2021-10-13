import { ToastrService } from "./../../../../../lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { ReferenceService } from "lib-bw-svc-apis/src/lib/reference/reference.service";
import { ActivatedRoute } from "@angular/router";
import { CollaborationService } from "./../../../../../lib-bw-svc-apis/src/lib/collaboration/collaboration.service";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { REFERENCE_TYPES } from "lib-bw-svc-apis/src/lib/constant/commonConstant";

@Component({
  selector: "app-create-signature-request",
  templateUrl: "./create-signature-request.component.html",
  styleUrls: ["./create-signature-request.component.scss"],
})
export class CreateSignatureRequestComponent implements OnInit {
  defaultNavs: any = [
    {
      text: "InfoSite",
      title: "InfoSite",
    },
    {
      text: "Configure Signature Request",
      title: "Configure Signature Request",
    },
  ];
  signatureRequestForm: FormGroup;
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
      filterType: "text",
      // width: '310px',
      isEnableColumnOptions: false,
    },
    {
      field: "",
      title: "User",
      filterType: "text",
      // width: '300px',
      isEnableColumnOptions: false,
    },
    {
      title: "Access",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "writeAccess",
    },
    {
      title: "Order",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "inputText",
    },
    {
      isEnableColumnOptions: false,
      component: "icon",
    },
  ];
  gridData: any = [];
  errMessage: any;
  isError: boolean = false;
  requestType: any;
  infoSiteId: any;
  infoSiteDocumentId: any;
  constructor(
    private _formBuilder: FormBuilder,
    private location: Location,
    private collabService: CollaborationService,
    private activatedRoute: ActivatedRoute,
    private referenceService: ReferenceService,
    private toastr: ToastrService
  ) {
    REFERENCE_TYPES.map((type) => {
      if (type.displayName == this.activatedRoute.snapshot.params.type) {
        this.requestType = type.value;
      }
    });
    this.infoSiteId = this.activatedRoute.snapshot.params.id;
    this.infoSiteDocumentId = this.activatedRoute.snapshot.params.docId;
    this.signatureRequestForm = this._formBuilder.group({
      subject: [""],
      description: [""],
      dueDate: [new Date()],
      recipients: [[]],
      infoSiteDocumentId: [this.infoSiteDocumentId],
      infoSiteId: [this.infoSiteId],
    });
  }

  ngOnInit(): void {
    this.getRecepients();
  }

  getRecepients() {
    this.collabService.getAccessControl().subscribe(
      (data: any) => {
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
            response.controls = new FormControl();
            response["component"] = "inputText";
          });
          res["isSelected"] = false;
          res.parentWriteselected = false;
          res.controls = new FormControl();
          res["component"] = "inputText";
        });
        this.gridData = data.result;
      },
      (err: any) => {
        this.setError(err.error.result.errorMessages);
      }
    );
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
        element.users.forEach((inner: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (inner.userId == selectedData.userId)
              inner.childReadselected = true;
          });
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        element.users.forEach((inner: any) => {
          data.selected.users.forEach((selectedData: any) => {
            if (inner.userId == selectedData.userId)
              inner.childReadselected = false;
          });
        });
      });
    }
    // this.updateParentSelection();
  }

  insideAccordion(e: any) {}

  clickButton(e: any) {
    switch (e) {
      case "Cancel":
        this.location.back();
        break;
      case "Save":
        let tempArr: any = [];
        let tempIdArr: any = [];
        let tempOrderArr: any = [];
        this.gridData.forEach((element: any, i: any) => {
          element.users.forEach((res: any) => {
            if (res.childWriteselected && !tempIdArr.includes(res.userId)) {
              tempOrderArr.push(res.controls.value);
              tempIdArr.push(res.userId);
              tempArr.push({
                order: Number(res.controls.value),
                userId: res.userId,
              });
            }
          });
        });
        this.signatureRequestForm.value.recipients = tempArr;
        const dueDate = new Date(
          this.signatureRequestForm.value.dueDate
        ).toISOString();
        this.signatureRequestForm.value.dueDate = dueDate;
        this.createSignatureRequest(tempArr);
        break;
    }
  }

  createSignatureRequest(data: any) {
    this.referenceService
      .createSignatureRequest(this.requestType, this.signatureRequestForm.value)
      .subscribe(
        (res) => {
          if (res) {
            this.location.back();
            this.toastr.showToastr(
              "success",
              "Signature Request created successfully!"
            );
          }
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
        }
      );
  }

  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  seterror(e: any) {}

  navigateInto(params: any) {
    if (params.text === "InfoSite" || params.title === "InfoSite") {
      this.location.back();
    }
  }
}
