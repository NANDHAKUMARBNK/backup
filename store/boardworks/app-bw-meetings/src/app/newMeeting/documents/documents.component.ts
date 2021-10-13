import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import {
  FileInfo,
  RemoveEvent,
  CancelEvent,
  FileRestrictions,
  SuccessEvent,
} from "@progress/kendo-angular-upload";
import { MeetingsService } from "lib-bw-svc-apis/src/lib/meetings/meetings.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CollaborationService } from "lib-bw-svc-apis/src/lib/collaboration/collaboration.service";
import { ToastrService } from "lib-bw-svc-apis/src/lib/bw-toastr/toastr.service";
import { environment } from "environments/environment";
import { apiConstant } from "lib-bw-svc-apis/src/lib/constant/apiConstant";
import { ViewFileDocService } from "lib-bw-svc-apis/src/lib/viewFileDoc/view-file-doc.service";

@Component({
  selector: "app-documents",
  templateUrl: "./documents.component.html",
  styleUrls: ["./documents.component.scss"],
})
export class DocumentsComponent implements OnInit {
  message =
    "A Collaboration workspace allows you and other members of the meeting (dependent on role) to view and add documents in a collaborative way. You can then associate the workspace with your meeting and use shared documents within there to make up your boardbook.";
  openCollabortioneModal: boolean = false;
  btnClick: boolean = false;
  agendaRadioDataForm: FormGroup;
  fileListAgendaData: any;
  selectFileBtn: boolean = true;
  selectionBtn: any = "Drag";
  openAgendaworkspaceModal: boolean = false;
  uploadSaveUrl = "saveUrl"; // should represent an actual API endpoint
  uploadRemoveUrl = "removeUrl"; // should represent an actual API endpoint
  agendaRadio = [
    {
      name: "Computer",
      value: true,
      selected: false,
    },
    {
      name: "Collaboration Workspace",
      value: false,
      selected: false,
    },
  ];
  showLoader: boolean = false;
  errMessage: any;
  isError: boolean = false;
  @ViewChild("fileupload") element!: ElementRef;
  @ViewChild("fileDocupload") fileDocupload!: ElementRef;
  @ViewChild("fileDocEditupload") fileDocEditupload!: ElementRef;

  actions: any = [
    "Attendees Access",
    "Change Name",
    "Replace with file from Computer",
    "Replace with file from Collaboration Workspace",
  ];

  public buttons = [
    { text: "Multi-Select(Drag and Drop)", key: "Drag", selected: false },
    {
      text: "Select From Computer",
      multiChange: true,
      selected: true,
      key: "Computer",
    },
    {
      text: "Select For Collaboration Workspace",
      key: "Collaboration",
      multiChange: true,
      selected: true,
    },
  ];

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
      field: "TwolinkTextName",
      title: "agenda Item",
      filterType: "text",
      isEnableColumnOptions: false,
      width: "220px",
      component: "TwolinkTextName",

      //component:"collaboration"
    },
    {
      field: "document.fileSize",
      title: "",
      filterType: "text",
      isEnableColumnOptions: false,
      width: "130px",
      component: "TotalFileSize",
    },
    {
      field: "action",
      title: "Actions",
      isEnableColumnOptions: false,
      component: "action",
      buttonName: "EDIT",
    },
    {
      field: "linkTextName",
      title: "",
      filterType: "text",
      isEnableColumnOptions: false,
      component: "linkMeetingDoc",
    },
  ];
  myFiles: FileInfo[] | undefined;
  documentFileList: any = [];
  selectedDocFiles: any = [];
  showDragLoader: boolean = false;
  showComputerLoader: boolean = false;
  isDocError: boolean = false;
  documentCollaboration: boolean = false;
  meetingId: any;
  agendaDocumentList: any;
  openEditDocworkspaceModal: boolean = false;
  showdeleteAgenda: boolean = false;
  showdeleteDocument: boolean = false;
  selectedAgendaData: any;
  selectedDocumentData: any;
  editDoceModal: boolean = false;
  commiteeId: any;
  editDocsaveClick: boolean = false;
  collaborationId: any;
  openViewCollaboration: boolean = false;
  addDocumentCollboartion: boolean = false;
  meetingData: any;
  addDocsaveClick: boolean = false;
  showCollaborationBtns: boolean = false;
  gridSelectedData: any = [];
  totalSize: any;
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private meetingService: MeetingsService,
    private activatedRoute: ActivatedRoute,
    private collaborationService: CollaborationService,
    private router: Router,
    private toastrService: ToastrService,
    private viewFileDocService: ViewFileDocService
  ) {
    this.agendaRadioDataForm = this.fb.group({
      addFileForm: ["", Validators.required],
      file: [""],
    });
    this.meetingId = this.activatedRoute.snapshot.queryParams.meetingId;
    this.commiteeId = this.activatedRoute.snapshot.queryParams.commiteeId;
  }

  ngOnInit(): void {
    this.getDocument();
    this.getAgendaDocument();
    this.getMeetingDetailsForEditById(this.meetingId);
  }

  getMeetingDetailsForEditById(id: any) {
    this.meetingService.getMeetingDetails(id).subscribe((response: any) => {
      this.meetingData = response.result.meetingEventItem;
      this.getCollabortionById(
        response.result.meetingEventItem.collaborationId
      );
    });
  }

  getCollabortionById(id: any) {
    this.collaborationService
      .getCollaborationById(id)
      .subscribe((data: any) => {
        this.collaborationId = data.result;
        this.showCollaborationBtns = true;
        //console.log(this.collaborationId);
      });
  }
  sum(value: any) {
    let total = 0;
    value = value.substring(0, value.length - 2).trim();
    value = Number(value);
    total += value;
    return total;
  }
  getDocument() {
    this.meetingService.getDocument(this.meetingId).subscribe((data: any) => {
      data.result.map((item: any) => {
        item.TwolinkTextName = item.title;
        item.linkText = item.title && true;
        if (item.document == null) {
          item.document = {
            linkTextName: "DELETE",
          };
        } else {
          item.document.linkTextName = "DELETE";
        }
        return item.document;
      });
      this.gridData = data.result;
      if (this.gridData && this.gridData.length > 0) {
        let tFSize: any = [];
        this.gridData.map((el: any) => {
          let fileSize = el.document.fileSize
            .substring(0, el.document.fileSize.length - 2)
            .trim();
          tFSize.push(Number(fileSize));
        });
        const sum = tFSize.reduce(
          (partial_sum: any, a: any) => partial_sum + a,
          0
        );
        this.totalSize = `${sum} MB`;
      }
    });
  }

  getAgendaDocument() {
    this.meetingService.getAgendaDocument(this.meetingId).subscribe(
      (data: any) => {
        this.fileListAgendaData = data.result;
        if (data.result) {
          this.selectFileBtn = false;
        }
        if (data.result.documentId) {
          this.agendaRadioDataForm.get("addFileForm")?.setValue(true);
        }
      },
      (error) => {
        if (error.error.result?.statusCode === 404) {
          this.fileListAgendaData = null;
        }
      }
    );
  }

  PutDocumentUpload(data: any) {
    let reqObj;
    if (this.selectionBtn == "Drag" || this.selectionBtn == "Computer") {
      reqObj = {
        isCollaborationDoc: false,
        referenceIds: [data],
        collaborationDocumentIds: null,
      };
    } else {
      let tempArry: any = [];
      data.forEach((element: any) => {
        tempArry.push(element.documentId);
      });
      reqObj = {
        isCollaborationDoc: true,
        referenceIds: null,
        collaborationDocumentIds: tempArry,
      };
    }
    this.meetingService.PutDocumentUpload(this.meetingId, reqObj).subscribe(
      (data: any) => {
        this.agendaDocumentList = data;
        this.toastrService.showToastr(
          "success",
          "Document Updated Successfully!"
        );
        this.getDocument();
      },
      (err: any) => {
        this.toastrService.showToastr(
          "error",
          "Document Updated Successfully!"
        );
        this.setDocError(err.error.result.errorMessages);
      }
    );
  }

  PutAgendaDocumentUpload(data: any) {
    let reqObj;
    if (this.agendaRadioDataForm.get("addFileForm")?.value === true) {
      reqObj = {
        documentId: data,
        isCollaborationDocument: false,
      };
    } else {
      reqObj = {
        isCollaborationDocument: true,
        collaborationDocumentId: data,
      };
    }

    this.agendaRadioDataForm.get("addFileForm")?.value === true;
    this.meetingService
      .PutAgendaDocumentUpload(this.meetingId, reqObj)
      .subscribe(
        (data: any) => {
          this.fileListAgendaData = data;
          this.getAgendaDocument();
        },
        (err: any) => {
          this.setDocError(err.error.result.errorMessages);
          console.log(
            err.error.result.errorMessages,
            "err.error.result.errorMessages"
          );
        }
      );
  }

  clickButton(type: any) {
    switch (type) {
      case "collaboration":
        this.openCollabortioneModal = true;
        break;
      case "file":
        this.selectFile();
        break;
      case "opencollaboration":
        this.openViewCollaboration = true;
        break;
      case "doccollaboration":
        this.addDocumentCollboartion = true;
        break;
      case "save":
        this.router.navigate(["../../"], { relativeTo: this.activatedRoute });
        break;
      case "publish":
        if (this.agendaRadioDataForm.status == "VALID") {
          this.publishMeeting();
        } else {
          this.toastrService.showToastr(
            "info",
            'An Agenda file must be selected before the meeting can be published. Please select an agenda file in the "Agenda Display" section.'
          );
        }
        break;
      case "cancel":
        this.router.navigate(["../../"], { relativeTo: this.activatedRoute });
        break;
      case "unPublish":
        this.unPublishMeeting();
        break;
      case "deleteAll":
        this.deleteAllClick();
    }
  }

  publishMeeting() {
    this.meetingService
      .publishMeeting(this.meetingId)
      .subscribe((data: any) => {
        this.router.navigate(["../../"], { relativeTo: this.activatedRoute });
      });
  }

  unPublishMeeting() {
    this.meetingService
      .unPublishMeeting(this.meetingId)
      .subscribe((data: any) => {
        this.router.navigate(["../../"], { relativeTo: this.activatedRoute });
      });
  }
  collaborationAction(type: any) {
    switch (type) {
      case "collaboration":
        this.btnClick = true;
        break;
      case "cancel":
        this.openCollabortioneModal = false;
    }
  }

  successCallBack(e: any) {
    if (e.collaborationId) {
      this.getCollabortionById(e.collaborationId);
      this.collaborationId = e.collaborationId;
      console.log(this.collaborationId);
      this.openCollabortioneModal = false;
      this.showCollaborationBtns = true;
    }
  }

  selectFile() {
    let vallue = this.agendaRadioDataForm.value;
    if (this.agendaRadioDataForm.invalid) {
      this.agendaRadioDataForm.markAllAsTouched();
      return;
    }
    if (this.agendaRadioDataForm.get("addFileForm")?.value === true) {
      this.element.nativeElement.click();
    } else {
      this.openAgendaworkspaceModal = true;
    }
  }

  deleteAgendaIcon(data: any) {
    if (this.meetingData.isPublished || this.meetingData.isArchived) {
      return;
    }
    this.showdeleteAgenda = true;
    this.selectedAgendaData = data;
  }

  uploadFile(e: any, type: any) {
    this.fileListAgendaData = [];
    const target = e.target as HTMLInputElement;
    let file = (target.files as FileList)[0];

    const formData: FormData = new FormData();
    formData.append("file", file, file.name);
    this.showLoader = true;
    this.commonService.documentcache(formData).subscribe(
      (data: any) => {
        this.selectFileBtn = false;
        let documentId = data.result;
        if (type == "agenda") {
          this.PutAgendaDocumentUpload(documentId);
          this.agendaRadioDataForm.reset();
        } else if (type == "doc") {
          this.selectionBtn = "Computer";
          this.PutEditDocumentUpload(documentId, "computer");
        } else {
          this.selectionBtn = "Computer";
          console.log("pc");
          this.PutDocumentUpload(documentId);
        }

        this.showLoader = false;
      },
      (err) => {
        this.setDocError(err.error.result.errorMessages);
        this.showLoader = false;
      }
    );
  }

  PutEditDocumentUpload(id: any, type: any) {
    let reqObj;
    if (type == "computer") {
      reqObj = {
        documentId: id,
        isCollaborationDocument: false,
        collaborationDocumentId: null,
      };
    } else {
      reqObj = {
        documentId: null,
        isCollaborationDocument: true,
        collaborationDocumentId: id,
      };
    }
    this.meetingService
      .editDocumetAgendaDocumet(
        this.meetingId,
        this.selectedDocumentData.data.agendaItemId,
        reqObj
      )
      .subscribe(
        (data: any) => {
          this.toastrService.showToastr(
            "success",
            "Document Updated Successfully!"
          );
          this.getDocument();
        },
        (error) => {
          this.toastrService.showToastr(
            "error",
            "Document Updated Successfully!"
          );
        }
      );
  }

  setDocError(err: any) {
    this.errMessage = err;
    this.isDocError = true;
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }

  agendaworkspaceModalModalAction(e: any) {
    this.openAgendaworkspaceModal = false;
    this.openEditDocworkspaceModal = false;
  }

  onSelectClick(e: any, type: any) {
    console.log(e, "type");
    if (e.type === "Select") {
      if (type == "agenda") {
        this.openAgendaworkspaceModal = false;
        this.PutAgendaDocumentUpload(e.child.documentId);
        this.selectFileBtn = false;
        this.agendaRadioDataForm.reset();

        this.agendaRadio = [
          {
            name: "Computer",
            value: false,
            selected: false,
          },
          {
            name: "Collaboration Workspace",
            value: true,
            selected: false,
          },
        ];
      } else if (type == "editdoc") {
        this.openEditDocworkspaceModal = false;
        this.PutEditDocumentUpload(e.child.documentId, "editdoc");
      } else {
        this.openEditDocworkspaceModal = false;
        this.selectionBtn = "Collaboration";
        this.PutDocumentUpload(e.child.documentId);
      }
    } else if (e.type === "checkbox") {
      let obj = {
        documentId: e.child.documentId,
        fileName: e.child.fileName,
        size: (e.child.fileSize / (1024 * 1024)).toFixed(2),
      };
      this.documentFileList.push(obj);
    }
  }

  public selectedChange(type: any) {
    if (this.meetingData.isPublished || this.meetingData.isArchived) {
      return;
    }
    console.log(type, "ee");
    if (type.event == true) {
      this.selectionBtn = type.data.key;
      console.log(this.selectionBtn);
      if (type.data.key == "Computer") {
        this.fileDocupload.nativeElement.click();
      } else if (type.data.key == "Collaboration") {
        this.documentCollaboration = true;
      }
    }
  }

  uploadEventHandler(eve: any) {
    eve.files.forEach((file: any) => {
      const formData: FormData = new FormData();
      formData.append("file", file.rawFile, file.name);
      this.showDragLoader = true;
      this.commonService.documentcache(formData).subscribe(
        (data: any) => {
          this.showDragLoader = false;
          let documentId = data.result;
          this.PutDocumentUpload(documentId);
        },

        (err: any) => {
          this.setError(err.error.result.errorMessages);
          this.showDragLoader = false;
        }
      );
    });
  }

  public myRestrictions: FileRestrictions = {
    allowedExtensions: [
      ".jpg",
      ".png",
      ".pdf",
      ".xls",
      ".xlsx",
      ".doc",
      ".docx",
      ".ppt",
      ".pptx",
    ],
  };

  uploadDocFile(event: any) {
    if (event.target.files.length) {
      for (let i = 0; i < event.target.files.length; i++) {
        console.log(event.target.files[i]);
        let file = event.target.files[i];
        const formData: FormData = new FormData();
        formData.append("file", file, file.name);
        this.showComputerLoader = true;
        this.commonService.documentcache(formData).subscribe(
          (data: any) => {
            this.showComputerLoader = false;
            let documentId = data.result;
            this.PutDocumentUpload(documentId);
          },

          (err: any) => {
            this.setError(err.error.result.errorMessages);
            this.showComputerLoader = false;
          }
        );
      }
    }
  }

  docModalAction(e: any) {
    if (e == "save") {
      this.documentCollaboration = false;
      this.PutDocumentUpload(this.documentFileList);
    } else {
      this.documentCollaboration = false;
    }
  }

  onClickLink(e: any) {
    console.log(e, "ee");
    if (e.type == "TwolinkTextName") {
      let url = ` ${environment.baseUrl}${apiConstant.meetings}/${this.meetingId}/Documents/${e.data.document.documentId}`;
      // this.viewFileDocService.viewfile(e.data.document, url);
      this.downloadDocuments(url, [], e.data.document);
    } else {
      if (this.meetingData.isPublished || this.meetingData.isArchived) {
        return;
      }
      this.showdeleteDocument = true;

      this.selectedDocumentData = e;
    }
    // this.meetingService.deleteAgendaItemsDcoument(this.meetingId, e.data.agendaItemId).subscribe((data: any) => {

    //   // this.getDocument();
    // })
  }
  clickDocs(e: any) {
    const req: any = {
      documentId: e.documentId,
      fileName: e.documentName,
      fileSize: e.documentSize,
      meetingId: e.meetingAgendaId,
    };
    let url = ` ${environment.baseUrl}${apiConstant.meetings}/${this.meetingId}/Documents/Unified?documentIds=${req.documentId}`;
    // this.viewFileDocService.viewfile(req, url);
    this.downloadDocuments(url, [], req);
  }
  onClickAction(type: any) {
    this.selectedDocumentData = type;
    if (this.meetingData.isPublished || this.meetingData.isArchived) {
      return;
    }
    console.log(type, "type");
    if (type.action == "Replace with file from Computer") {
      this.fileDocEditupload.nativeElement.click();
    } else if (
      type.action == "Replace with file from Collaboration Workspace"
    ) {
      this.openEditDocworkspaceModal = true;
    } else {
      this.selectedDocumentData = type;
      this.editDoceModal = true;
    }
  }

  deletemodalAction(e: any, type: any) {
    if (type == "agenda" && e == "save") {
      this.meetingService
        .deleteAgendaDcoument(
          this.meetingId,
          this.selectedAgendaData.meetingAgendaId
        )
        .subscribe((data: any) => {
          this.showdeleteAgenda = false;
          this.getAgendaDocument();
        });
    } else if (type == "doc" && e == "save") {
      this.meetingService
        .deleteAgendaItemsDcoument(
          this.meetingId,
          this.selectedDocumentData.data.agendaItemId
        )
        .subscribe(
          (data: any) => {
            this.showdeleteDocument = false;
            this.toastrService.showToastr("success", "Deleted Successfully!");
            this.getDocument();
          },
          (err) => {
            this.setDocError(err.error.result.errorMessages);
            this.showLoader = false;
          }
        );
    } else {
      this.showdeleteAgenda = false;
      this.showdeleteDocument = false;
    }
  }

  editdocModalAction(e: any) {
    if (e == "save") {
      this.editDocsaveClick = true;
      setTimeout(() => {
        this.editDocsaveClick = false;
      }, 0);
    } else {
      this.editDoceModal = false;
      this.openViewCollaboration = false;
    }
  }

  addFileModalAction(e: any) {
    if (e == "save") {
      this.addDocsaveClick = true;
    } else {
      this.addDocumentCollboartion = false;
    }
  }

  onSaveSucess(e: any) {
    this.editDoceModal = false;
    this.toastrService.showToastr("success", "Updated Successfully!");

    this.getDocument();
  }

  onAddFileSaveSucess(e: any) {
    this.addDocumentCollboartion = false;
  }

  selectedRowChange(data: any) {
    console.log(data, "com");
    data.map((item: any) => {
      this.gridSelectedData.push(item.dataItem);
    });
    // this.gridSelectedData.push(data[0].dataItem);
  }

  deleteAllClick() {
    console.log(this.gridSelectedData, "this.gridSelectedData");

    let newArray: any = [];
    this.gridSelectedData.forEach((element: any) => {
      newArray.push(element.agendaItemId);
    });

    const reqObj = {
      agendaItemIds: newArray,
    };
    this.meetingService.deleteAllDcoument(this.meetingId, reqObj).subscribe(
      (data: any) => {
        this.getDocument();
        this.toastrService.showToastr("success", "Deleted Successfully!");
      },
      (err) => {
        this.setDocError(err.error.result.errorMessages);
        this.showLoader = false;
      }
    );
  }

  addAgenda() {
    if (this.meetingData.isPublished || this.meetingData.isArchived) {
      return;
    }
    this.editDoceModal = true;
    this.selectedDocumentData = {
      data: {
        title: "No Agenda Item",
      },
    };
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
