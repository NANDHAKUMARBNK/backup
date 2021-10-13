import { Component, OnInit } from "@angular/core";
import { CollaborationService } from "lib-bw-svc-apis/src/lib/collaboration/collaboration.service";
import { DatePipe } from "@angular/common";
import { ReferenceService } from "lib-bw-svc-apis/src/lib/reference/reference.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmModalComponent } from "lib-bw-ui-comp-core/src/lib/pattern/templates/confirm-modal/confirm-modal.component";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { DialogRef, DialogService } from "@progress/kendo-angular-dialog";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";
import { environment } from "environments/environment";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
@Component({
  selector: "app-corporate-info",
  templateUrl: "./corporate-info.component.html",
  styleUrls: ["./corporate-info.component.scss"],
  providers: [DatePipe],
})
export class CorporateInfoComponent implements OnInit {
  actions: any = ["Add Sub-Folder", "Archive", "Edit", "Delete"];
  archiveToggle: boolean = false;
  toggleLabel: any = "Hide Archived Folders";
  isToggle: boolean = false;
  activeButton: any =
    "btn-base btn-containe bw-font-prm-medium secondary-btn-contained btn-sm px-4 btn-tab";
  inActiveButton: any =
    "btn-base secondary-btn-text border-secondary bw-font-prm-medium btn-sm px-4 btn-tab";
  tabsData: any = [
    {
      title: "CORPORATE INFORMATION",
      content: "",
      isSelected: true,
      isDisabled: true,
    },
    {
      title: "DIRECTOR'S GUIDE",
      content: "",
      isSelected: false,
      isDisabled: false,
    },
    {
      title: "GENERAL BOARD INFORMATION",
      content: "",
      isSelected: false,
      isDisabled: false,
    },
  ];
  tab: any = "CORPORATE INFORMATION";
  onCellClicked: any = [];
  columnOptions: any = {
    filter: false,
    sort: true,
    lock: false,
    stick: false,
  };
  gridData: any = [];
  columnsData: any = [
    {
      field: "_",
      title: "",
      filterType: "text",
      isEnableColumnOptions: false,
      checkBoxComponent: "writeAccess",
    },
    {
      field: "linkTextName",
      title: "FOLDER NAME",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "link",
      width: "220px",
    },
    {
      field: "useArchive",
      title: "",
      component: "useArchive",
      isEnableColumnOptions: false,
    },
    {
      field: "modifiedDate",
      title: "LAST MODIFIED",
      filterType: "text",
      isEnableColumnOptions: false,
    },
    // {
    //   filterType: "text",
    //   title: "DOCUMENT",
    //   isEnableColumnOptions: false,
    // },
    // {
    //   field: "linkTextName",
    //   title: "",
    //   filterType: "text",
    //   isEnableColumnOptions: false,
    //   component: "link",
    // },
    {
      field: "isShowManage",
      title: "",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "action",
      buttonName: "MANAGE",
    },
    {
      field: "useTemplate",
      title: "",
      component: "useTemplate",
      isEnableColumnOptions: false,
    },
    {
      isEnableColumnOptions: false,
      component: "icon",
    },
  ];
  showSignatureTab: boolean = false;
  documentButton: any;
  signatureButton: any;
  mappedGridData: any = [];
  errMessage: any;
  isError: boolean = false;
  deleteFolder: boolean = false;
  selectedData: any;
  deleteDocument: boolean = false;
  selectedDataDocument: any;
  gridDetails: any;
  expandAll: boolean = false;
  deleteSelectedRequestData: any;
  showDeleteSelectedAlert: boolean = false;
  showDeleteSelected: boolean = true;
  tempResArray: any = [];
  deleteFolders: any = [];
  showLoader: boolean = false;
  constructor(
    private referenceService: ReferenceService,
    private datePipe: DatePipe,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: DialogRef,
    private dialogService: DialogService,
    private toastr: ToastrService,
    private viewFileDocService: ViewFileDocService,
    private meetingService: MeetingsService
  ) { }

  ngOnInit(): void {
    this.getInfo("CorporateInfo", this.archiveToggle);
    this.documentButton = this.activeButton;
    this.signatureButton = this.inActiveButton;
  }

  orderArray(x: any, order: number) {
    x.map((y: any) => {
      y["subfolder1"] = order;
      console.log("o", order);
      if (y.subInfoSites) {
        y.subInfoSites.map((z: any) => {
          this.orderArray(y.subInfoSites, order + 1);
        });
      }
    });
  }

  getInfo(type?: any, archived?: any) {
    this.tempResArray = [];
    let result;
    this.referenceService
      .getReferenceTest(type, archived ? archived : false)
      .subscribe(
        (data: any) => {
          result = data.result.sort(function (a: any, b: any) {
            let B: any = new Date(b.modifiedDate);
            let A: any = new Date(a.modifiedDate);
            return B - A;
          });
          this.orderArray(result, 0);
          result.map((res: any, index: any) => {
            this.mappedData(res);
            this.tempResArray.push(res);
            if (res.subInfoSites.length > 0) {
              // res.subInfoSites[0]['isParentFolder'] = true;
              this.getSortedGridData(res);
            }
          });
          data.result = this.tempResArray;
          console.log("tempResArray", this.tempResArray, data.result);
          this.gridData = data.result;
        },
        (error) => {}
      );
  }
  getSortedGridData(data: any) {
    if (data.subInfoSites.length > 0) {
      data.subInfoSites.map((ele: any, index: any) => {
        this.mappedData(ele, "sub");
        // ele['childLinkClassName'] = `ms-${ele['index'] + 3}`;
        // this.tempResArray.push(ele);
        this.getSortedGridData(ele);
      });
    }
  }
  mappedData(res: any, type?: any) {
    res["isSubFolder"] = type && type == "sub" ? true : false;
    res["linkClassName"] = res.subfolder1
      ? "subfolder mcl-" + res.subfolder1
      : "";
    res["linkTextName"] = res.workspace;
    res["parentWriteselected"] = false;
    if (res.documents.length == 0 && res.subInfoSites.length == 0) {
      res["isUpDown"] = false;
    } else {
      res.documents.filter((ele: any) => {
        ele["infoSiteId"] = res.infoSiteId;
        ele.childWriteselected = false;
        ele.modifiedDate = this.datePipe.transform(
          ele.modifiedDate,
          "MMM dd YYYY"
        );
        if (res.canEdit) {
          ele["editLinkText"] =
            ele.fileName.split(".").pop().toLowerCase() === "pdf"
              ? "Signature Request"
              : "";
        } else {
          ele["editLinkText"] = "";
        }
      });
      res["isDowniconClass"] = "mdi mdi-chevron-down f-30";
      res["isUpiconClass"] = "mdi mdi-chevron-up f-30";
      res["isUpDown"] = true;
    }
    res.modifiedDate = this.datePipe.transform(res.modifiedDate, "MMM dd YYYY");
    if (res.canDeleteFile) {
      res["deleteLinkText"] = "DELETE";
    }
    if (res.canEdit) {
      // res["editLinkText"] = "Signature Request";
      res["isShowManage"] = "MANAGE";
    }
    if (res.canAddFile) {
      res["useTemplate"] = "ADD FILE";
    }
    res["useArchive"] = res.isArchived ? res.isArchived : false;
    res["isSelected"] = false;
    res.parentWriteselected = false;
    res["linkTextName"] = res.folderName;
    if (res.isArchived) {
      res.actions = ["Add Sub-Folder", "UnArchive", "Edit", "Delete"];
    }
  }
  onClickLink(e: any) {
    console.log(e, "bbbbbb");
    const type =
      this.tab === "DIRECTOR GUIDE"
        ? "DirectorsGuide"
        : this.tab === "GENERAL BOARD INFORMATION"
        ? "GeneralBoardInfo"
        : "CorporateInfo";
    if (e.type == "ADD FILE" || e.type == "childIcon") {
      this.route.navigate(
        [
          "./uploadDoc",
          {
            name: e.data.folderName,
            id: e.data.infoSiteId,
            type: type,
            level: e.type == "ADD FILE" ? "root" : "sub",
          },
        ],
        { relativeTo: this.activatedRoute }
      );
    }
    // this.route.navigate(
    //   [
    //     `view-details`,
    //     {
    //       type: "view",
    //       id: e.data.infoSiteId,
    //       level:
    //         this.tab === "DIRECTOR GUIDE"
    //           ? "DirectorsGuide"
    //           : this.tab === "GENERAL BOARD INFORMATION"
    //             ? "GeneralBoardInfo"
    //             : "CorporateInfo",
    //     },
    //   ],
    //   {
    //     relativeTo: this.activatedRoute,
    //   }
    // );
  }
  onClickAction(e: any) {
    const { data, action } = e;
    if (action === "Edit") {
      this.route.navigate(
        [
          `newFolder`,
          {
            type: "edit",
            id: data.infoSiteId,
            level:
              this.tab === "DIRECTOR GUIDE"
                ? "DirectorsGuide"
                : this.tab === "GENERAL BOARD INFORMATION"
                ? "GeneralBoardInfo"
                : "CorporateInfo",
          },
        ],
        {
          relativeTo: this.activatedRoute,
        }
      );
    } else if (action === "Delete") {
      this.deleteFolder = true;
      this.selectedData = data;
      // const dialogRef = this.dialogService.open({
      //   content: ConfirmModalComponent,
      // });
      // const info = dialogRef.content.instance;
      // info.headerTitle = "Delete Confirmation";
      // info.customMessage = "Are you sure you want to delete this reference?";
      // info.bodyMessage =
      //   "Deleting this reference will remove the reference and any activities that has been associated with it from BoardWorks and any linked devices.";
      // info.isEnableHeader = true;
      // info.isCustomBody = true;
      // info.isDeleteBody = true;
      // info.isEnableFooter = true;
      // dialogRef.result.subscribe((result: any) => {
      //   if (result.text == "Yes") {
      //     this.referenceService
      //       .deleteReference(
      //         this.tab === "DIRECTOR GUIDE"
      //           ? "DirectorsGuide"
      //           : this.tab === "GENERAL BOARD INFORMATION"
      //             ? "GeneralBoardInfo"
      //             : "CorporateInfo",
      //         data.infoSiteId
      //       )
      //       .subscribe((res: any) => {
      //         if (res) {
      //           this.toastr.showToastr(
      //             "success",
      //             "Reference Deleted Successfully!"
      //           );
      //           this.getInfo(
      //             this.tab === "DIRECTOR GUIDE"
      //               ? "DirectorsGuide"
      //               : this.tab === "GENERAL BOARD INFORMATION"
      //                 ? "GeneralBoardInfo"
      //                 : "CorporateInfo"
      //           );
      //         }
      //       });
      //   } else {
      //   }
      // });
    } else if (action === "Add Sub-Folder") {
      this.route.navigate(
        [
          `newFolder`,
          {
            type: "create",
            id: data.infoSiteId,
            name: data.folderName,
            level:
              this.tab === "DIRECTOR GUIDE"
                ? "DirectorsGuide"
                : this.tab === "GENERAL BOARD INFORMATION"
                ? "GeneralBoardInfo"
                : "CorporateInfo",
          },
        ],
        {
          relativeTo: this.activatedRoute,
        }
      );
    } else if (action === "Archive" || action === "UnArchive") {
      this.referenceService
        .archiveAndUnarchiveReference(
          this.tab === "DIRECTOR GUIDE"
            ? "DirectorsGuide"
            : this.tab === "GENERAL BOARD INFORMATION"
            ? "GeneralBoardInfo"
            : "CorporateInfo",
          data.infoSiteId,
          action
        )
        .subscribe((res: any) => {
          this.toastr.showToastr(
            "success",
            action === "Archive"
              ? "Folder Archive Successfully!"
              : "Folder UnArchive Successfully!"
          );
          this.getInfo(
            this.tab === "DIRECTOR GUIDE"
              ? "DirectorsGuide"
              : this.tab === "GENERAL BOARD INFORMATION"
              ? "GeneralBoardInfo"
              : "CorporateInfo"
          );
        });
      // this.referenceService
      //   .getReferenceDetails(
      //     this.tab === "DIRECTOR GUIDE"
      //       ? "DirectorsGuide"
      //       : this.tab === "GENERAL BOARD INFORMATION"
      //       ? "GeneralBoardInfo"
      //       : "CorporateInfo",
      //     data.infoSiteId
      //   )
      //   .subscribe((res: any) => {
      //     const request = {
      //       folderName: data.folderName,
      //       recipientUsers: res.recipientUserIds,
      //       isArchived: action === "Archive" ? true : false,
      //       sendAlert: false,
      //     };
      //     this.referenceService
      //       .manipulateReferenceFolder(
      //         this.tab === "DIRECTOR GUIDE"
      //           ? "DirectorsGuide"
      //           : this.tab === "GENERAL BOARD INFORMATION"
      //           ? "GeneralBoardInfo"
      //           : "CorporateInfo",
      //         res.infoSiteId,
      //         request,
      //         "edit"
      //       )
      //       .subscribe((response: any) => {
      //         if (response) {
      //           this.toastr.showToastr(
      //             "success",
      //             "Folder Archive Successfully!"
      //           );
      //           this.getInfo(
      //             this.tab === "DIRECTOR GUIDE"
      //               ? "DirectorsGuide"
      //               : this.tab === "GENERAL BOARD INFORMATION"
      //               ? "GeneralBoardInfo"
      //               : "CorporateInfo"
      //           );
      //         }
      //       });
      //   });
    }
  }
  archiveClick(e: any) {
    console.log(e);
  }
  linksModalActionDocumentSelected(e: any) {
    if (e.toLowerCase() == "yes") {
      this.deleteDocumentSelected();
    } else {
      this.deleteDocument = false;
    }
  }
  linksModalActionDocument(e: any) {
    if (e.toLowerCase() == "yes") {
      this.deleteDocumentApi();
    } else {
      this.deleteDocument = false;
    }
  }
  linksModalAction(e: any) {
    if (e.toLowerCase() == "yes") {
      if (this.deleteFolders && this.deleteFolders.length > 0) {
        this.deleteFolders.forEach((item: any) => {
          this.deleteApi(item);
        });
      } else {
        this.deleteApi(this.selectedData.infoSiteId);
      }
    } else {
      this.deleteFolder = false;
    }
  }
  deleteDocumentApi() {
    let tempArray: any = [];
    tempArray.push(this.selectedDataDocument.documentId);
    const request = {
      documentIds: tempArray,
    };
    this.referenceService
      .deleteReferenceDocuments(
        this.tab === "DIRECTOR GUIDE"
          ? "DirectorsGuide"
          : this.tab === "GENERAL BOARD INFORMATION"
          ? "GeneralBoardInfo"
          : "CorporateInfo",
        request
      )
      .subscribe(
        (res: any) => {
          if (res) {
            this.deleteDocument = false;
            this.toastr.showToastr(
              "success",
              "Documents Deleted Successfully!"
            );
            this.getInfo(
              this.tab === "DIRECTOR GUIDE"
                ? "DirectorsGuide"
                : this.tab === "GENERAL BOARD INFORMATION"
                ? "GeneralBoardInfo"
                : "CorporateInfo"
            );
          }
        },
        (err: any) => {
          if (
            err.error &&
            err.error.result &&
            err.error.result.errorMessages &&
            err.error.result.errorMessages.length > 0
          ) {
            this.setError(err.error.result.errorMessages);
          } else {
            this.setError([`${err.error.title}`]);
          }
        }
      );
  }
  deleteApi(id: any) {
    this.referenceService
      .deleteReference(
        this.tab === "DIRECTOR GUIDE"
          ? "DirectorsGuide"
          : this.tab === "GENERAL BOARD INFORMATION"
          ? "GeneralBoardInfo"
          : "CorporateInfo",
        id
      )
      .subscribe(
        (res: any) => {
          if (res) {
            this.deleteFolder = false;
            this.toastr.showToastr(
              "success",
              "Reference Deleted Successfully!"
            );
            this.getInfo(
              this.tab === "DIRECTOR GUIDE"
                ? "DirectorsGuide"
                : this.tab === "GENERAL BOARD INFORMATION"
                ? "GeneralBoardInfo"
                : "CorporateInfo"
            );
          }
        },
        (err: any) => {
          if (
            err.error &&
            err.error.result &&
            err.error.result.errorMessages &&
            err.error.result.errorMessages.length > 0
          ) {
            this.setError(err.error.result.errorMessages);
          } else {
            this.setError([`${err.error.title}`]);
          }
        }
      );
  }
  deleteDocumentSelected() {
    this.referenceService
      .deleteReferenceDocuments(
        this.tab === "DIRECTOR GUIDE"
          ? "DirectorsGuide"
          : this.tab === "GENERAL BOARD INFORMATION"
          ? "GeneralBoardInfo"
          : "CorporateInfo",
        this.deleteSelectedRequestData
      )
      .subscribe(
        (res: any) => {
          if (res) {
            this.showDeleteSelectedAlert = false;
            this.toastr.showToastr(
              "success",
              "Selected Documents Deleted Successfully!"
            );
            this.getInfo(
              this.tab === "DIRECTOR GUIDE"
                ? "DirectorsGuide"
                : this.tab === "GENERAL BOARD INFORMATION"
                ? "GeneralBoardInfo"
                : "CorporateInfo"
            );
          }
        },
        (err: any) => {
          this.showDeleteSelectedAlert = false;
          if (
            err.error &&
            err.error.result &&
            err.error.result.errorMessages &&
            err.error.result.errorMessages.length > 0
          ) {
            this.setError(err.error.result.errorMessages);
          } else {
            this.setError([`${err.error.title}`]);
          }
        }
      );
  }
  forDelete() {}
  childDeleteClick(e: any) {
    const { type, child, parentData } = e;
    if (type === "DELETE") {
      this.deleteDocument = true;
      this.selectedDataDocument = child;
      // const dialogRef = this.dialogService.open({
      //   content: ConfirmModalComponent,
      // });
      // const info = dialogRef.content.instance;
      // info.headerTitle = "Delete Confirmation";
      // info.customMessage = "Are you sure you want to delete this document?";
      // info.bodyMessage =
      //   "Deleting this reference will remove the reference and any activities that has been associated with it from BoardWorks and any linked devices.";
      // info.isEnableHeader = true;
      // info.isCustomBody = true;
      // info.isDeleteBody = true;
      // info.isEnableFooter = true;
      // dialogRef.result.subscribe((result: any) => {
      //   if (result.text == "Yes") {
      //     let tempArray: any = [];
      //     tempArray.push(child.documentId);
      //     const request = {
      //       documentIds: tempArray,
      //     };
      //     this.referenceService
      //       .deleteReferenceDocuments(
      //         this.tab === "DIRECTOR GUIDE"
      //           ? "DirectorsGuide"
      //           : this.tab === "GENERAL BOARD INFORMATION"
      //           ? "GeneralBoardInfo"
      //           : "CorporateInfo",
      //         request
      //       )
      //       .subscribe((res: any) => {
      //         if (res) {
      //           this.toastr.showToastr(
      //             "success",
      //             "Documents Deleted Successfully!"
      //           );
      //           this.getInfo(
      //             this.tab === "DIRECTOR GUIDE"
      //               ? "DirectorsGuide"
      //               : this.tab === "GENERAL BOARD INFORMATION"
      //               ? "GeneralBoardInfo"
      //               : "CorporateInfo"
      //           );
      //         }
      //       });
      //   } else {
      //   }
      // });
    }
  }
  accrodianClick(data: any) {
    // console.log('here we go',data);
    if (data.event.isSelected) {
      data.grid.collapseRow(data.rowIndex);
    } else if (data.event.isSelected == false) {
      data.grid.expandRow(data.rowIndex);
    }

    this.gridData.forEach((element: any, index: any) => {
      if (data.event.collaborationId == element.collaborationId) {
        element.isUpDown = !element.isUpDown;
        element.isSelected = !element.isSelected;
      }
    });
  }
  writeAccessClick(data: any) {
    console.log(data, "ccccc");
    if (data.event.target.checked) {
      data.selected.parentWriteselected = true;
      this.showDeleteSelected = false;
    } else {
      data.selected.parentWriteselected = false;
    }
    console.log(this.gridData, "ggg");
    if (data.selected.parentWriteselected) {
      this.gridData.forEach((element: any, index: any) => {
        if (element.infoSiteId === data.selected.infoSiteId) {
          element.parentWriteselected = true;
        }
        element.documents.forEach((innrer: any) => {
          data.selected.documents.forEach((selectedData: any) => {
            if (innrer.documentId == selectedData.documentId)
              innrer.childWriteselected = true;
          });
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        if (element.infoSiteId === data.selected.infoSiteId) {
          element.parentWriteselected = false;
        }
        element.documents.forEach((innrer: any) => {
          data.selected.documents.forEach((selectedData: any) => {
            if (innrer.documentId == selectedData.documentId)
              innrer.childWriteselected = false;
          });
        });
      });
    }
  }

  writeChildAccessClick(data: any) {
    console.log(data, "ccccc");
    if (data.event.target.checked) {
      this.gridData.forEach((element: any, index: any) => {
        // if (element.infoSiteId === data.selected.infoSiteId) {
        //   element.parentWriteselected = true;
        // }
        element.documents.forEach((innrer: any) => {
          if (innrer.documentId == data.selected.documentId)
            innrer.childWriteselected = true;
        });
      });
    } else {
      this.gridData.forEach((element: any, index: any) => {
        // if (element.infoSiteId === data.selected.infoSiteId) {
        //   element.parentWriteselected = false;
        // }
        element.documents.forEach((innrer: any) => {
          if (innrer.documentId == data.selected.documentId)
            innrer.childWriteselected = false;
        });
      });
    }
  }

  childLinkClick(e: any) {
    let { parentData, child }: any = e;
    switch (e.type) {
      case "Signature Request":
        this.route.navigate(
          [
            "./signatureRequest",
            {
              type: this.tab,
              id: parentData.infoSiteId,
              docId: e.parentData.documentId,
            },
          ],
          { relativeTo: this.activatedRoute }
        );
        break;
      case "name":
        let url: any = ` ${environment.baseUrl}${apiConstant.references}/${
          this.tab === "DIRECTOR GUIDE"
            ? "DirectorsGuide"
            : this.tab === "GENERAL BOARD INFORMATION"
            ? "GeneralBoardInfo"
            : "CorporateInfo"
        }/Documents/${e.child.documentId}`;
        e.child.fileType = null;
        // this.viewFileDocService.viewfile(e.child, url);
        this.downloadDocuments(url, [], e.child);
        break;
      default:
      // this.route.navigate(
      //   [
      //     {
      //       type: "view",
      //       id: parentData.infoSiteId,
      //     },
      //   ],
      //   {
      //     relativeTo: this.activatedRoute,
      //   }
      // );
    }
  }

  insideAccordion(e: any) {}
  clickButton(type: any) {
    console.log("type", type);
    if (type === "signaturerequest") {
      this.showSignatureTab = true;
      this.signatureButton = this.activeButton;
      this.documentButton = this.inActiveButton;
      this.showDeleteSelected = true;
    } else if (type == "folder") {
      this.showSignatureTab = false;
      this.route.navigate(
        [
          "./newFolder",
          {
            type: "create",
            level:
              this.tab === "DIRECTOR GUIDE"
                ? "DirectorsGuide"
                : this.tab === "GENERAL BOARD INFORMATION"
                ? "GeneralBoardInfo"
                : "CorporateInfo",
          },
        ],
        { relativeTo: this.activatedRoute }
      );
    } else if (type == "deleteselected") {
      let deleteSelectedArray: any = [];
      let deleteSelectedArray2: any = [];
      this.gridData.map((it: any) => {
        if (it.parentWriteselected) {
          deleteSelectedArray2.push(it.infoSiteId);
          if (it.documents && it.documents.length > 0) {
            it.documents.filter((el: any) => {
              if (el.childWriteselected) {
                deleteSelectedArray.push(el.documentId);
              }
            });
          }
        } else {
          if (it.documents && it.documents.length > 0) {
            it.documents.filter((el: any) => {
              if (el.childWriteselected) {
                deleteSelectedArray.push(el.documentId);
              }
            });
          }
        }
      });
      if (deleteSelectedArray && deleteSelectedArray.length > 0) {
        const request = {
          documentIds: deleteSelectedArray,
        };
        this.deleteSelectedRequestData = request;
        this.showDeleteSelectedAlert = true;
        this.deleteFolder = false;
      } else {
        if (deleteSelectedArray2 && deleteSelectedArray2.length == 0) {
          this.toastr.showToastr(
            "success",
            "Selected Documents should atleast 1 or more records"
          );
        }
      }
      if (deleteSelectedArray2 && deleteSelectedArray2.length > 0) {
        this.showDeleteSelectedAlert = false;
        this.deleteFolders = deleteSelectedArray2;
        this.deleteFolder = true;
      } else {
        if (deleteSelectedArray && deleteSelectedArray.length == 0) {
          this.toastr.showToastr(
            "success",
            "Selected Reference should atleast 1 or more records"
          );
        }
      }
    } else if (type === "expand") {
      this.expandAll = !this.expandAll;
      if (this.expandAll) {
        this.gridData.forEach((item: any, idx: any) => {
          if (item.documents && item.documents.length > 0) {
            this.gridDetails.expandRow(idx);
          } else {
            this.gridDetails.collapseRow(idx);
          }
        });
      } else {
        this.gridData.forEach((item: any, idx: any) => {
          this.gridDetails.collapseRow(idx);
        });
      }
    } else {
      this.showSignatureTab = false;
      this.signatureButton = this.inActiveButton;
      this.documentButton = this.activeButton;
      this.showDeleteSelected = false;
    }
  }
  expandAndCollapseGrid(event: any) {
    this.gridDetails = event;
  }
  changeArchived(e: any) {
    this.archiveToggle = !this.archiveToggle;
    this.toggleLabel = this.archiveToggle
      ? "Show Archived Folders"
      : "Hide Archived Folders";
    if (this.tab === "DIRECTOR'S GUIDE" || this.tab === "DIRECTOR GUIDE") {
      this.getInfo("DirectorsGuide", this.archiveToggle);
    } else if (this.tab === "GENERAL BOARD INFORMATION") {
      this.getInfo("GeneralBoardInfo", this.archiveToggle);
    } else {
      this.getInfo("CorporateInfo", this.archiveToggle);
    }
  }
  tabChange(e: any) {
    this.tab = e.title;
    this.showSignatureTab = false;
    this.signatureButton = this.inActiveButton;
    this.documentButton = this.activeButton;
    this.archiveToggle = false;
    this.toggleLabel = "Hide Archived Folders";
    this.showDeleteSelected = false;
    if (this.tab === "DIRECTOR'S GUIDE") {
      this.tab = "DIRECTOR GUIDE";
      this.getInfo("DirectorsGuide", this.archiveToggle);
    } else if (this.tab === "GENERAL BOARD INFORMATION") {
      this.getInfo("GeneralBoardInfo", this.archiveToggle);
    } else {
      this.getInfo("CorporateInfo", this.archiveToggle);
    }
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  downloadDocuments(url: any, arr?: any, params?: any) {
    this.showLoader = true;
    this.meetingService.getStatusCodeFromUrl(url).subscribe(
      (response: any) => {
        this.showLoader = false;
        if (arr && arr.length) {
          arr.map((int: any) => {
            this.viewFileDocService.viewfile(int, url);
          });
        } else {
          this.viewFileDocService.viewfile(params, url);
        }
      },
      (err: any) => {
        this.showLoader = false;
        if (err.status === 200) {
          this.viewFileDocService.viewfile(params, url);
        } else {
          if (
            err.error &&
            err.error.result &&
            err.error.result.errorMessages &&
            err.error.result.errorMessages.length > 0
          ) {
            this.setError(err.error.result.errorMessages);
          } else {
            this.setError([`${err.error.error}`]);
          }
        }
      }
    );
  }
}
