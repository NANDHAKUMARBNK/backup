import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DialogRef, DialogContentBase } from "@progress/kendo-angular-dialog";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CommonService } from "lib-bw-svc-apis/src/lib/common/common.service";
import { AlertsService } from "lib-bw-svc-apis/src/lib/alerts/alerts.service";

@Component({
  selector: "bw-new-questions-votings",
  templateUrl: "./new-questions-votings.component.html",
  styleUrls: ["./new-questions-votings.component.scss"],
})
export class NewQuestionsVotingsComponent
  extends DialogContentBase
  implements OnInit
{
  @Output() closeDialog: any = new EventEmitter<any>();
  @Input() headerTitle: any;
  @Input() bodyMessage: any;
  @Input() isEnableHeader: any;
  @Input() isEnableBody: any;
  @Input() isEnableFooter: any;
  @Input() isDeleteBody: any;
  labelClass: any;
  public actionsLayout = "normal";
  cardData: any;
  newDocumentForm: FormGroup;
  file: File | undefined;
  fileListData: any = [];
  uploadRequired: boolean = false;
  showLoader: boolean = false;
  errMessage: any;
  isError: boolean = false;
  @Output() onConfirmClick: EventEmitter<any> = new EventEmitter();
  @Output() onCancelClick: EventEmitter<any> = new EventEmitter();
  constructor(
    public dialog: DialogRef,
    private fb: FormBuilder,
    private commonService: CommonService,
    private alertsService: AlertsService
  ) {
    super(dialog);
    this.newDocumentForm = this.fb.group({
      fileTitle: [""],
      file: ["", Validators.required],
    });
  }
  ngOnInit(): void {
    if (this.bodyMessage && this.bodyMessage.length) {
      this.fileListData = this.bodyMessage;
    }
  }
  public onCancelAction(): void {
    this.onCancelClick.emit("cancel");
    // this.dialog.close({ text: "cancel" });
  }
  seterror(e?: any) {}
  isInArray(array: any, word: any) {
    return array.indexOf(word.toLowerCase()) > -1;
  }
  extensionFiles(file: any, e: any) {
    const allowedExtensions: any = [
      "pdf",
      "xls",
      "xlsx",
      "ppt",
      "pptx",
      "csv",
      "TIF",
      "RTF",
      "GIF",
      "txt",
      "png",
      "jpg",
      "vsd",
      "vsdx",
      "doc",
      "docx",
    ];
    const fileExtension: any = file.name.split(".").pop();
    if (this.isInArray(allowedExtensions, fileExtension)) {
      return file;
    } else {
      return;
    }
  }
  uploadFile(e: any) {
    const target = e.target as HTMLInputElement;
    this.file = (target.files as FileList)[0];
    let originalFile: any = this.extensionFiles(this.file, e);
    if (originalFile) {
      this.newDocumentForm.get("file")?.setValue(originalFile.name);
      const formData: FormData = new FormData();
      formData.append("file", originalFile, originalFile.name);
      this.showLoader = true;
      this.commonService.documentcache(formData).subscribe(
        (data: any) => {
          if (data.result) {
            let optionalFileName = this.file?.name.split(".")[0];
            this.showLoader = false;
            let documentId = data.result;
            let obj = {
              documentId: documentId,
              fileTitle:
                this.newDocumentForm.get("fileTitle")?.value &&
                this.newDocumentForm.get("fileTitle")?.value !== ""
                  ? this.newDocumentForm.get("fileTitle")?.value
                  : optionalFileName,
              fileName: this.file?.name,
            };
            this.newDocumentForm.clearValidators();
            this.fileListData.push(obj);
            this.fileListData.length >= 1
              ? (this.uploadRequired = false)
              : (this.uploadRequired = true);
          }
        },
        (err: any) => {
          this.setError(err.error.result.errorMessages);
        }
      );
    } else {
      alert("Given File extension is not matched");
    }
  }
  uplaodFileClick(e: any) {
    if (this.fileListData.length === 0 || this.newDocumentForm.invalid) {
      // this.uploadRequired = true;
      this.newDocumentForm.markAllAsTouched();
      return;
    } else {
      // this.uploadRequired = false;
      this.newDocumentForm.reset();
      this.alertsService.alertDocumentsRetain.emit(this.fileListData);
      // this.dialog.close({ documents: this.fileListData });
      this.onConfirmClick.emit(this.fileListData);
    }
  }
  deleteIcon(index: any) {
    this.fileListData.splice(index, 1);
    let deletedFileIndex: any =
      this.fileListData && this.fileListData.length - 1;
    let recentFile: any = this.fileListData[deletedFileIndex];
    this.newDocumentForm.get("file")?.setValue(recentFile?.fileName);
    this.newDocumentForm.get("fileTitle")?.setValue(recentFile?.fileTitle);
    this.alertsService.alertDocumentsRetain.emit(this.fileListData);
  }
  setError(err: any) {
    this.errMessage = err;
    this.isError = true;
  }
}
